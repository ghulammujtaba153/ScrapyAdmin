import React, { useState, useEffect } from 'react';
import api from '../config/url';
import { 
    FaPlus, 
    FaTimes, 
    FaEnvelope, 
    FaUsers, 
    FaUserShield, 
    FaUserFriends, 
    FaEdit,
    FaCalendarAlt,
    FaSearch,
    FaEye
} from 'react-icons/fa';

const CampaignModal = ({ isOpen, onClose, campaign, onSave }) => {
    const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'
    const [sendType, setSendType] = useState('immediate'); // 'immediate' or 'schedule'
    const [previewHtml, setPreviewHtml] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        body: '',
        recipients: [],
        manualEmails: '',
        targetType: 'Manual',
        scheduledAt: '',
    });
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            setActiveTab('editor');
            if (campaign) {
                setFormData({
                    title: campaign.title,
                    subject: campaign.subject,
                    body: campaign.body,
                    targetType: campaign.targetType || 'Manual',
                    recipients: campaign.targetType === 'Manual' ? campaign.recipients.map(r => r.email) : [],
                    manualEmails: campaign.targetType === 'Manual' ? campaign.recipients.map(r => r.email).join(', ') : '',
                    scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '',
                });
                setSendType(campaign.scheduledAt ? 'schedule' : 'immediate');
            } else {
                setFormData({
                    title: '',
                    subject: '',
                    body: '',
                    recipients: [],
                    manualEmails: '',
                    targetType: 'Manual',
                    scheduledAt: '',
                });
                setSendType('immediate');
            }
        }
    }, [isOpen, campaign]);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const res = await api.get('/auth/users', { params: { limit: 1000 } });
            if (res.data.users) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchPreview = async () => {
        try {
            setLoadingPreview(true);
            const res = await api.post('/campaigns/preview', {
                subject: formData.subject,
                body: formData.body
            });
            if (res.data.success) {
                setPreviewHtml(res.data.html);
            }
        } catch (error) {
            console.error("Error fetching preview:", error);
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleTargetTypeChange = (type) => {
        setFormData({ ...formData, targetType: type });
    };

    const toggleRecipient = (email) => {
        const current = [...formData.recipients];
        if (current.includes(email)) {
            setFormData({ ...formData, recipients: current.filter(e => e !== email) });
        } else {
            setFormData({ ...formData, recipients: [...current, email] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let finalRecipients = [];
        if (formData.targetType === 'Manual') {
            if (formData.manualEmails) {
                finalRecipients = formData.manualEmails.split(',').map(e => e.trim()).filter(e => e !== '');
            } else {
                finalRecipients = formData.recipients;
            }
        }

        const payload = {
            ...formData,
            recipients: finalRecipients,
            sendImmediately: sendType === 'immediate'
        };

        if (sendType === 'immediate') {
            payload.scheduledAt = '';
        }
        
        onSave(payload);
    };

    if (!isOpen) return null;

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {campaign ? 'Edit Campaign' : 'Create New Campaign'}
                        </h2>
                        <p className="text-sm text-gray-500">Configure your email notification details</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-8 bg-gray-50/30 border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('editor')}
                        className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                            activeTab === 'editor' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Editor
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab('preview');
                            fetchPreview();
                        }}
                        className={`px-6 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                            activeTab === 'preview' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <FaEye className="text-xs" />
                        Preview
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'editor' ? (
                        <form id="campaign-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Title</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <FaEdit />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Monthly Newsletter"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sending Options</label>
                                <div className="flex gap-4 mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="sendType" 
                                            value="immediate" 
                                            checked={sendType === 'immediate'} 
                                            onChange={() => setSendType('immediate')}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Send Immediately</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="sendType" 
                                            value="schedule" 
                                            checked={sendType === 'schedule'} 
                                            onChange={() => setSendType('schedule')}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Schedule</span>
                                    </label>
                                </div>
                                {sendType === 'schedule' && (
                                    <div className="relative animate-in slide-in-from-top-2 duration-200">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <FaCalendarAlt />
                                        </div>
                                        <input 
                                            type="datetime-local" 
                                            name="scheduledAt"
                                            value={formData.scheduledAt}
                                            onChange={handleInputChange}
                                            required={sendType === 'schedule'}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject Line</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <FaEnvelope className="text-sm" />
                                </div>
                                <input 
                                    type="text" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Enter subject line..."
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Target Audience</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'Manual', label: 'Manual/Select', icon: <FaUsers /> },
                                    { id: 'All', label: 'All Users', icon: <FaUserFriends /> },
                                    { id: 'Users', label: 'Only Users', icon: <FaUserFriends /> },
                                    { id: 'Admins', label: 'Only Admins', icon: <FaUserShield /> },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleTargetTypeChange(type.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                            formData.targetType === type.id 
                                            ? 'border-primary bg-primary/5 text-primary' 
                                            : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                        }`}
                                    >
                                        <span className="text-xl mb-1">{type.icon}</span>
                                        <span className="text-xs font-bold">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.targetType === 'Manual' && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Recipients or Enter Emails</label>
                                <div className="space-y-4">
                                    <textarea 
                                        name="manualEmails"
                                        value={formData.manualEmails}
                                        onChange={handleInputChange}
                                        placeholder="Enter emails separated by commas..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all h-20 resize-none"
                                    />
                                    
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                            <FaSearch className="text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Search users to select..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto p-2 grid grid-cols-1 md:grid-cols-2 gap-2 bg-white">
                                            {loadingUsers ? (
                                                <div className="col-span-2 py-4 text-center text-sm text-gray-400">Loading users...</div>
                                            ) : filteredUsers.length === 0 ? (
                                                <div className="col-span-2 py-4 text-center text-sm text-gray-400">No users found</div>
                                            ) : filteredUsers.map(user => (
                                                <div 
                                                    key={user._id}
                                                    onClick={() => toggleRecipient(user.email)}
                                                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                                                        formData.recipients.includes(user.email)
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-transparent hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                                        formData.recipients.includes(user.email)
                                                        ? 'bg-primary border-primary'
                                                        : 'border-gray-300'
                                                    }`}>
                                                        {formData.recipients.includes(user.email) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                                                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs text-gray-400">{formData.recipients.length} users selected from list</span>
                                        {formData.recipients.length > 0 && (
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({...formData, recipients: []})}
                                                className="text-xs text-primary hover:underline font-bold"
                                            >
                                                Clear Selected
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Content (HTML Supported)</label>
                            <textarea 
                                name="body"
                                value={formData.body}
                                onChange={handleInputChange}
                                placeholder="<html><body>Hello World</body></html>"
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all h-64 font-mono text-sm"
                                required
                            />
                        </div>
                    </form>
                    ) : (
                        <div className="h-full flex flex-col">
                            {loadingPreview ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                                    <p className="text-gray-500 font-medium animate-pulse">Generating your branded preview...</p>
                                </div>
                            ) : (
                                <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                            <FaEnvelope className="text-primary" />
                                            Email Branding Preview
                                        </p>
                                        <button 
                                            onClick={fetchPreview}
                                            className="text-xs font-bold text-primary hover:underline"
                                        >
                                            Refresh Preview
                                        </button>
                                    </div>
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-gray-50 p-4 md:p-8">
                                        <div 
                                            className="bg-white shadow-xl mx-auto rounded-lg overflow-hidden max-w-[600px]"
                                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                                        />
                                    </div>
                                    <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <FaEnvelope />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Branded Layout Applied</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Your content is automatically wrapped in the Map Harvest official template, 
                                                including your subject as the heading, the official logo, and standard footer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        form="campaign-form"
                        type="submit"
                        className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                        {campaign 
                            ? (sendType === 'immediate' ? 'Update & Send Now' : 'Update Campaign') 
                            : (sendType === 'immediate' ? 'Create & Send Now' : 'Save & Prepare Campaign')
                        }
                        <FaEnvelope className="text-sm opacity-50" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignModal;
