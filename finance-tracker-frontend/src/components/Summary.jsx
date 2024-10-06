import React, { useEffect, useState } from 'react';

const Summary = ({ transactions, user }) => {
    const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 });

    const fetchSummary = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:5000/summary?user=${user}`);
                if (response.ok) {
                    const data = await response.json();
                    // Debugging: Log the fetched data
                    console.log('Fetched summary:', data);
                    setSummary(data);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch summary:', errorData.message);
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        }
    };

    useEffect(() => {
        fetchSummary(); // Fetch summary whenever user changes or transactions are updated
    }, [user, transactions]); // Include user and transactions as dependencies

    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
            <h2>Summary</h2>
            <p style={{ color: 'green', fontWeight: 'bold' }}>Total Income: ${summary.total_income.toFixed(2)}</p>
            <p style={{ color: 'red', fontWeight: 'bold' }}>Total Expenses: ${summary.total_expenses.toFixed(2)}</p>
            <p style={{ fontWeight: 'bold' }}>Balance: ${summary.balance.toFixed(2)}</p>
        </div>
    );
};

export default Summary;
