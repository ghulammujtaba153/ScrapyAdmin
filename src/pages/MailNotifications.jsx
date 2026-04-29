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
    FaUsers
} from 'react-icons/fa';
import CampaignModal from '../components/CampaignModal';
import ConfirmationModal from '../components/ConfirmationModal';

const MailNotifications = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [sendingId, setSendingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger'
    });

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
            if (selectedCampaign) {
                await api.put(`/campaigns/${selectedCampaign._id}`, payload);
            } else {
                await api.post('/campaigns', payload);
            }

            setIsModalOpen(false);
            setSelectedCampaign(null);
            fetchCampaigns();
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
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
                } catch (error) {
                    alert(error.response?.data?.message || "Failed to delete campaign");
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
                    }
                } catch (error) {
                    alert(error.response?.data?.message || "Failed to send campaign");
                } finally {
                    setSendingId(null);
                }
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Sent': return 'bg-green-100 text-green-700 border-green-200';
            case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
            case 'Scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Sent': return <FaCheckCircle className="mr-1" />;
            case 'Draft': return <FaEdit className="mr-1" />;
            case 'Failed': return <FaExclamationCircle className="mr-1" />;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div key={campaign._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusStyle(campaign.status)}`}>
                                            {getStatusIcon(campaign.status)}
                                            {campaign.status}
                                        </div>
                                        <div className="flex space-x-2">
                                            {campaign.status === 'Draft' && (
                                                <button onClick={() => handleEdit(campaign)} className="text-gray-400 hover:text-primary transition-colors">
                                                    <FaEdit />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(campaign._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{campaign.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.subject}</p>
                                    
                                    <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                                        <FaUsers className="mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700 mr-1">{campaign.stats.total}</span> Recipients
                                        <div className="mx-3 w-px h-3 bg-gray-200"></div>
                                        <FaCheckCircle className="mr-2 text-green-500" />
                                        <span className="font-medium text-gray-700 mr-1">{campaign.stats.sent}</span> Sent
                                        {campaign.stats.failed > 0 && (
                                            <>
                                                <div className="mx-3 w-px h-3 bg-gray-200"></div>
                                                <FaExclamationCircle className="mr-2 text-red-500" />
                                                <span className="font-medium text-gray-700 mr-1">{campaign.stats.failed}</span> Failed
                                            </>
                                        )}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button 
                                            disabled={campaign.status === 'Sent' || campaign.status === 'Sending' || sendingId === campaign._id}
                                            onClick={() => handleSend(campaign._id)}
                                            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg font-semibold transition-all ${
                                                (campaign.status === 'Sent' || campaign.status === 'Sending')
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-primary text-white hover:bg-primary/90'
                                            }`}
                                        >
                                            {sendingId === campaign._id || campaign.status === 'Sending' ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <><FaPaperPlane className="mr-2 text-sm" /> Send Now</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {campaign.scheduledAt && campaign.status === 'Scheduled' && (
                                    <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-100 text-xs text-yellow-700">
                                        Scheduled for: {new Date(campaign.scheduledAt).toLocaleString()}
                                    </div>
                                )}
                                {campaign.sentAt && (
                                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                                        Sent on: {new Date(campaign.sentAt).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        ))}
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
        </div>
    );
};

export default MailNotifications;