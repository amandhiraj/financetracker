import React from 'react';

const TransactionList = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
    // Function to group transactions by category
    const groupTransactionsByCategory = (transactions) => {
        return transactions.reduce((acc, transaction) => {
            const { category } = transaction;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(transaction);
            return acc;
        }, {});
    };

    const groupedTransactions = groupTransactionsByCategory(transactions);

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Transaction List</h2>
            {transactions.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No transactions found.</p>
            ) : (
                Object.keys(groupedTransactions).map((category) => (
                    <div key={category}>
                        <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '5px', color: '#444' }}>{category}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            {groupedTransactions[category].map((transaction) => (
                                <div
                                    key={transaction.id}
                                    style={{
                                        position: 'relative', // Position for the button
                                        padding: '15px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                        width: '200px', // Card width
                                        textAlign: 'center',
                                        backgroundColor: '#f9f9f9',
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 5px' }}>{transaction.description}</h4>
                                    <p style={{ fontWeight: 'bold', margin: '5px 0' }}>${transaction.amount.toFixed(2)}</p>

                                    {/* Buttons positioned at the top right */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        paddingTop:'10px'
                                    }}>
                                        <button onClick={() => onEditTransaction(transaction)} style={{ marginRight: '5px' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => onDeleteTransaction(transaction.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TransactionList;
