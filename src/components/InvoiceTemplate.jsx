import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ transaction }, ref) => {
    if (!transaction) return null;

    return (
        <div ref={ref} className="bg-white p-10 max-w-2xl mx-auto text-gray-800" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-10 border-b pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide">INVOICE</h1>
                    <p className="text-gray-500 mt-1">Receipt #{transaction.id}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-700">Admin Dashboard Inc.</h2>
                    <p className="text-sm text-gray-500">123 Tech Street, Silicon Valley</p>
                    <p className="text-sm text-gray-500">California, USA 94000</p>
                    <p className="text-sm text-gray-500">support@dashboard.inc</p>
                </div>
            </div>

            {/* Bill To & Date */}
            <div className="flex justify-between mb-10">
                <div>
                    <h3 className="text-gray-600 font-bold uppercase tracking-wider text-xs mb-2">Bill To:</h3>
                    <p className="font-bold text-lg">{transaction.user}</p>
                    <p className="text-gray-500 text-sm">client@email.com</p> {/* Mock email */}
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <span className="text-gray-600 font-bold uppercase tracking-wider text-xs block">Invoice Date:</span>
                        <span className="font-medium">{transaction.date}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-bold uppercase tracking-wider text-xs block">Status:</span>
                        <span className={`font-bold ${transaction.status === 'Completed' ? 'text-green-600' : 'text-gray-600'}`}>
                            {transaction.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider">Description</th>
                            <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Qty</th>
                            <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Unit Price</th>
                            <th className="py-3 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-4 text-gray-800 font-medium">
                                {transaction.plan} Subscription
                                <p className="text-xs text-gray-400 mt-1">Monthly Billing Cycle</p>
                            </td>
                            <td className="py-4 text-right text-gray-600">1</td>
                            <td className="py-4 text-right text-gray-600">{transaction.amount}</td>
                            <td className="py-4 text-right text-gray-800 font-bold">{transaction.amount}</td>
                        </tr>
                        {/* Example extra line item */}
                        <tr className="border-b border-gray-100">
                            <td className="py-4 text-gray-800 font-medium">
                                Processing Fee
                            </td>
                            <td className="py-4 text-right text-gray-600">1</td>
                            <td className="py-4 text-right text-gray-600">$0.00</td>
                            <td className="py-4 text-right text-gray-800 font-bold">$0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-10">
                <div className="w-64">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Subtotal</span>
                        <span className="text-gray-800 font-bold">{transaction.amount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Tax (0%)</span>
                        <span className="text-gray-800 font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between py-4">
                        <span className="text-xl font-bold text-blue-600">Total</span>
                        <span className="text-xl font-bold text-blue-600">{transaction.amount}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-8 text-center text-gray-500 text-sm">
                <p className="mb-1">Thank you for your business!</p>
                <p>If you have any questions about this invoice, please contact support.</p>
            </div>
        </div>
    );
});

export default InvoiceTemplate;
