#!/bin/bash

# Step 1: Create React Application
npx create-react-app finance-tracker-frontend

# Change to project directory
cd finance-tracker-frontend

# Step 2: Install Axios
npm install axios

# Step 3: Create Components Directory
mkdir src/components

# Step 4: Create and Write Component Files
# Register Component
cat <<EOF > src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                password,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Register;
EOF

# Login Component
cat <<EOF > src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            if (response.status === 200) {
                setMessage('Login successful');
                // Save user info or token as needed
            }
        } catch (error) {
            setMessage('Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Login;
EOF

# Add Transaction Component
cat <<EOF > src/components/AddTransaction.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddTransaction = ({ user }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/transactions', {
                amount,
                category,
                description,
                user, // Pass the current user
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to add transaction.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Add Transaction</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default AddTransaction;
EOF

# Transaction List Component
cat <<EOF > src/components/TransactionList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionList = ({ user }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(\`http://localhost:5000/transactions/\${user}\`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        };
        fetchTransactions();
    }, [user]);

    return (
        <ul>
            {transactions.map((transaction) => (
                <li key={transaction.id}>
                    {transaction.amount} - {transaction.category}: {transaction.description}
                </li>
            ))}
        </ul>
    );
};

export default TransactionList;
EOF

# Summary Component
cat <<EOF > src/components/Summary.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Summary = ({ user }) => {
    const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get(\`http://localhost:5000/summary/\${user}\`);
                setSummary(response.data);
            } catch (error) {
                console.error('Failed to fetch summary:', error);
            }
        };
        fetchSummary();
    }, [user]);

    return (
        <div>
            <h2>Summary</h2>
            <p>Total Income: {summary.total_income}</p>
            <p>Total Expenses: {summary.total_expenses}</p>
            <p>Balance: {summary.balance}</p>
        </div>
    );
};

export default Summary;
EOF

# Update App Component
cat <<EOF > src/App.jsx
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';

const App = () => {
    const [user, setUser] = useState(null); // Store user info here

    return (
        <div>
            <h1>Personal Finance Tracker</h1>
            {!user ? (
                <>
                    <Register />
                    <Login />
                </>
            ) : (
                <>
                    <AddTransaction user={user} />
                    <TransactionList user={user} />
                    <Summary user={user} />
                </>
            )}
        </div>
    );
};

export default App;
EOF

# Step 5: Run the Application
echo "Setup complete! You can now run your application using the following commands:"
echo "cd finance-tracker-frontend"
echo "npm start"
