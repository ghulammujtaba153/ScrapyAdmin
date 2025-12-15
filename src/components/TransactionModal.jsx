import React, { useRef, useState } from 'react';
import { FaDownload, FaTimes, FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InvoiceTemplate from './InvoiceTemplate';

const TransactionModal = ({ isOpen, onClose, transaction }) => {
    const invoiceRef = useRef();
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen || !transaction) return null;

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const element = invoiceRef.current;
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_${transaction.id}_${transaction.user.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Failed to generate PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-700 bg-green-100';
            case 'Pending': return 'text-yellow-700 bg-yellow-100';
            case 'Cancelled': return 'text-red-700 bg-red-100';
            case 'Completed': return 'text-blue-700 bg-blue-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-900 bg-opacity-65 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-lg mx-auto my-6 px-4">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none transform scale-100 transition-transform">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 rounded-t">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Transaction Details
                        </h3>
                        <button
                            className="p-1 ml-auto border-0 text-gray-400 hover:text-gray-600 transition-colors outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-8 flex-auto">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <span className="font-semibold text-gray-600">Status</span>
                                <span className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(transaction.status)}`}>
                                    {transaction.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                                    <p className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded w-fit">#{transaction.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                    <p className="font-medium text-gray-800">{transaction.date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Customer</p>
                                    <p className="font-medium text-gray-800">{transaction.user}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Plan</p>
                                    <p className="font-medium text-gray-800">{transaction.plan}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-bold text-gray-700">Total Amount</span>
                                    <span className="font-extrabold text-2xl text-green-600">{transaction.amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-gray-100 rounded-b bg-gray-50 rounded-b-2xl">
                        <button
                            className="text-gray-500 hover:text-gray-700 font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-2 transition-colors"
                            type="button"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className={`flex items-center bg-blue-600 text-white active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none transition-all transform hover:-translate-y-0.5 ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
                            type="button"
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                        >
                            <FaFilePdf className="mr-2" />
                            {isDownloading ? 'Generating...' : 'Download Invoice'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden Invoice Template for PDF Generation */}
            <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
                <InvoiceTemplate ref={invoiceRef} transaction={transaction} />
            </div>
        </div>
    );
};

export default TransactionModal;
