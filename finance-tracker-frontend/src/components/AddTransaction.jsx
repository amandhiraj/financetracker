import React, { useState } from 'react';

const AddTransaction = ({ user, onAddTransaction }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income'); // Default type set to 'income'
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a new transaction object
        const newTransaction = { 
            amount: parseFloat(amount), 
            category: type, // Use type as category
            description, 
            user 
        };

        // Call the onAddTransaction prop to update the parent state
        onAddTransaction(newTransaction);

        // Clear the input fields after submission
        setAmount('');
        setType('income'); // Reset type to default
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add Transaction</h3>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
                min="0" // Prevent negative amounts
                step="0.01" // Allow decimal values with two decimal precision
            />
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default AddTransaction;
