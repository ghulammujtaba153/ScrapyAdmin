import React, { useState, useEffect } from 'react';
import api from '../config/url';
import { 
    FaPlus, 
    FaPaperPlane, 
    FaTrash, 
    FaEdit, 
    FaEnvelope, 
    FaInfoCircle, 
    FaCheckCircle, 
    FaExclamationCircle,
    FaClock,
    FaUsers,
    FaSync,
    FaBug,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import CampaignModal from '../components/CampaignModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AlertModal from '../components/AlertModal';

const MailNotifications = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [sendingId, setSendingId] = useState(null);
    const [debugData, setDebugData] = useState({}); // { [campaignId]: { open, data, loading } }
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger'
    });
    const [alertModalState, setAlertModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showAlert = (title, message, type = 'info') => {
        setAlertModalState({ isOpen: true, title, message, type });
    };

    const closeAlert = () => {
        setAlertModalState(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        const shouldPoll = campaigns.some(
            (campaign) => campaign.status === 'Sending' || campaign.status === 'Scheduled'
        );

        if (!shouldPoll) return;

        const intervalId = setInterval(() => {
            fetchCampaigns();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [campaigns]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const res = await api.get('/campaigns');
            if (res.data.success) {
                setCampaigns(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (payload) => {
        try {
            const { sendImmediately, ...data } = payload;
            let campaignId;

            if (selectedCampaign) {
                await api.put(`/campaigns/${selectedCampaign._id}`, data);
                campaignId = selectedCampaign._id;
            } else {
                const res = await api.post('/campaigns', data);
                campaignId = res.data.data._id;
            }

            if (sendImmediately) {
                await api.post(`/campaigns/${campaignId}/send`);
                showAlert("Success", "Campaign saved and is now sending", "success");
            } else {
                showAlert("Success", "Campaign saved successfully", "success");
            }

            setIsModalOpen(false);
            setSelectedCampaign(null);
            fetchCampaigns();
        } catch (error) {
            showAlert("Error", error.response?.data?.message || "Something went wrong", "error");
        }
    };

    const handleEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Campaign",
            message: "Are you sure you want to delete this campaign? This action cannot be undone.",
            confirmText: "Delete",
            type: "danger",
            onConfirm: async () => {
                try {
                    await api.delete(`/campaigns/${id}`);
                    fetchCampaigns();
                    showAlert("Success", "Campaign deleted successfully", "success");
                } catch (error) {
                    showAlert("Error", error.response?.data?.message || "Failed to delete campaign", "error");
                }
            }
        });
    };

    const handleSend = async (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Send Campaign",
            message: "Do you want to start sending this campaign now? Emails will be sent in batches.",
            confirmText: "Send Now",
            type: "primary",
            onConfirm: async () => {
                try {
                    setSendingId(id);
                    setCampaigns(prev =>
                        prev.map(c => (c._id === id ? { ...c, status: 'Sending' } : c))
                    );
                    const res = await api.post(`/campaigns/${id}/send`);
                    if (res.data.success) {
                        fetchCampaigns();
                        showAlert("Success", "Campaign is now sending", "success");
                    }
                } catch (error) {
                    showAlert("Error", error.response?.data?.message || "Failed to send campaign", "error");
                } finally {
                    setSendingId(null);
                }
            }
        });
    };

    const handleDebug = async (id) => {
        const isOpen = debugData[id]?.open;
        if (isOpen) {
            // Toggle off
            setDebugData(prev => ({ ...prev, [id]: { ...prev[id], open: false } }));
            return;
        }

        setDebugData(prev => ({ ...prev, [id]: { open: true, loading: true, data: null } }));
        try {
            const res = await api.get(`/campaigns/${id}/debug`);
            if (res.data.success) {
                setDebugData(prev => ({ ...prev, [id]: { open: true, loading: false, data: res.data.data } }));
            }
        } catch (error) {
            setDebugData(prev => ({
                ...prev,
                [id]: { open: true, loading: false, data: null, error: error.response?.data?.message || 'Failed to load debug info' }
            }));
        }
    };

    const handleReset = async (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Reset Campaign",
            message: "This will reset the campaign back to Draft and set all recipients back to Pending so you can re-send. Continue?",
            confirmText: "Reset",
            type: "warning",
            onConfirm: async () => {
                try {
                    const res = await api.post(`/campaigns/${id}/reset`);
                    if (res.data.success) {
                        showAlert("Success", res.data.message, "success");
                        fetchCampaigns();
                        // Clear debug panel for this campaign
                        setDebugData(prev => ({ ...prev, [id]: undefined }));
                    }
                } catch (error) {
                    showAlert("Error", error.response?.data?.message || "Failed to reset campaign", "error");
                }
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Sent': return 'bg-green-100 text-green-700 border-green-200';
            case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
            case 'Sending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Sent': return <FaCheckCircle className="mr-1" />;
            case 'Draft': return <FaEdit className="mr-1" />;
            case 'Failed': return <FaExclamationCircle className="mr-1" />;
            case 'Sending': return <FaSync className="mr-1 animate-spin" />;
            case 'Scheduled': return <FaClock className="mr-1" />;
            default: return <FaInfoCircle className="mr-1" />;
        }
    };

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <FaEnvelope className="mr-3 text-primary" />
                            Mail Campaigns
                        </h1>
                        <p className="text-gray-500 mt-1">Manage and send email notifications to your leads.</p>
                    </div>
                    <button 
                        onClick={() => {
                            setSelectedCampaign(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all shadow-lg shadow-primary/20"
                    >
                        <FaPlus className="mr-2" /> Create Campaign
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaEnvelope className="text-gray-300 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700">No campaigns found</h3>
                        <p className="text-gray-500 mt-2">Start by creating your first email campaign.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Campaign
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Stats
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Dates
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map((campaign) => {
                                        const debug = debugData[campaign._id];
                                        const canReset = campaign.status === 'Failed' || campaign.status === 'Sending';

                                        return (
                                            <React.Fragment key={campaign._id}>
                                                <tr className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                                        <div className="font-bold text-gray-800">{campaign.title}</div>
                                                        <div className="text-gray-500 text-xs mt-1 truncate max-w-xs">{campaign.subject}</div>
                                                    </td>
                                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center ${getStatusStyle(campaign.status)}`}>
                                                            {getStatusIcon(campaign.status)}
                                                            {campaign.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                                        <div className="flex flex-col text-xs text-gray-600 gap-1">
                                                            <div><FaUsers className="inline mr-1 text-gray-400" /> {campaign.stats.total} Recipients</div>
                                                            <div><FaCheckCircle className="inline mr-1 text-green-500" /> {campaign.stats.sent} Sent</div>
                                                            {campaign.stats.failed > 0 && (
                                                                <div><FaExclamationCircle className="inline mr-1 text-red-500" /> {campaign.stats.failed} Failed</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                                        {campaign.scheduledAt && campaign.status === 'Scheduled' && (
                                                            <div className="text-xs text-yellow-600 whitespace-nowrap"><FaClock className="inline mr-1" />{new Date(campaign.scheduledAt).toLocaleString()}</div>
                                                        )}
                                                        {campaign.sentAt && (
                                                            <div className="text-xs text-gray-500 whitespace-nowrap">Sent: {new Date(campaign.sentAt).toLocaleString()}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <button 
                                                                disabled={campaign.status === 'Sent' || campaign.status === 'Sending' || sendingId === campaign._id}
                                                                onClick={() => handleSend(campaign._id)}
                                                                title="Send Now"
                                                                className={`p-2 rounded-lg transition-all ${
                                                                    (campaign.status === 'Sent' || campaign.status === 'Sending')
                                                                    ? 'text-gray-400 cursor-not-allowed' 
                                                                    : 'text-primary hover:bg-primary/10'
                                                                }`}
                                                            >
                                                                {sendingId === campaign._id || campaign.status === 'Sending' ? (
                                                                    <FaSync className="animate-spin" />
                                                                ) : (
                                                                    <FaPaperPlane />
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={() => handleDebug(campaign._id)}
                                                                title="Inspect recipients & errors"
                                                                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            >
                                                                {debug?.open ? <FaChevronUp /> : <FaBug />}
                                                            </button>

                                                            {canReset && (
                                                                <button
                                                                    onClick={() => handleReset(campaign._id)}
                                                                    title="Reset campaign back to Draft"
                                                                    className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                                >
                                                                    <FaSync />
                                                                </button>
                                                            )}

                                                            {campaign.status === 'Draft' && (
                                                                <button onClick={() => handleEdit(campaign)} title="Edit" className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                                    <FaEdit />
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDelete(campaign._id)} title="Delete" className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {debug?.open && (
                                                    <tr>
                                                        <td colSpan="5" className="px-5 py-4 border-b border-gray-200 bg-indigo-50/50">
                                                            <div className="text-xs">
                                                                <p className="font-semibold text-indigo-600 mb-2 flex items-center gap-1">
                                                                    <FaBug /> Recipient Debug
                                                                </p>
                                                                {debug.loading && <p className="text-indigo-400 animate-pulse">Loading...</p>}
                                                                {debug.error && <p className="text-red-500">{debug.error}</p>}
                                                                {debug.data && (
                                                                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                                                                        <p className="text-indigo-500 mb-2">
                                                                            FROM: <code className="bg-indigo-100 px-1 rounded">{debug.data.resendFrom}</code>
                                                                        </p>
                                                                        {debug.data.recipients.map((r, i) => (
                                                                            <div key={i} className={`rounded p-2 flex flex-col sm:flex-row sm:items-center gap-2 ${
                                                                                r.status === 'Sent' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                                                r.status === 'Failed' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                                                'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                                            }`}>
                                                                                <span className="font-mono flex-1 truncate">{r.email}</span>
                                                                                <strong>{r.status}</strong>
                                                                                {r.error && (
                                                                                    <span className="text-red-600 font-mono text-[10px] break-all sm:max-w-md">
                                                                                        ⚠ {r.error}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <CampaignModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCampaign(null);
                }}
                campaign={selectedCampaign}
                onSave={handleSave}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
            />

            <AlertModal
                isOpen={alertModalState.isOpen}
                onClose={closeAlert}
                title={alertModalState.title}
                message={alertModalState.message}
                type={alertModalState.type}
            />
        </div>
    );
};

export default MailNotifications;