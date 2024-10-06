import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';

const App = () => {
  const [user, setUser] = useState(() => {
    return localStorage.getItem('user') || null;
  });
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 }); // New summary state

  const fetchTransactions = useCallback(async () => {
    if (user) {
      const response = await fetch(`http://localhost:5000/transactions?user=${user}`);
      const data = await response.json();
      setTransactions(data);
    }
  }, [user]);

  const fetchSummary = useCallback(async () => { // Create a new function to fetch summary
    if (user) {
      try {
        const response = await fetch(`http://localhost:5000/summary?user=${user}`);
        if (response.ok) {
          const data = await response.json();
          setSummary(data); // Update summary state with fetched data
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch summary:', errorData.message);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    }
  }, [user]); // Add user as a dependency

  const deleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const response = await fetch(`http://localhost:5000/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTransactions();
      }
    }
  };

  const editTransaction = async (transaction) => {
    // Prompt the user for new amount and description
    const newAmountString = prompt("Enter new amount", transaction.amount);
    const newDescription = prompt("Enter new description", transaction.description);

    // Convert the amount to a number
    const newAmount = parseFloat(newAmountString);

    // Check if the new amount is a valid number
    if (isNaN(newAmount)) {
      alert("Please enter a valid number for the amount.");
      return; // Exit the function if the amount is invalid
    }

    // Create the updated transaction object
    const updatedTransaction = {
      ...transaction,
      amount: newAmount,
      description: newDescription,
    };

    // Send a PUT request to update the transaction
    const response = await fetch(`http://localhost:5000/transactions/${transaction.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTransaction),
    });

    if (response.ok) {
      fetchTransactions(); // Refresh the transaction list
    } else {
      console.error('Failed to update transaction:', await response.json());
    }
  };

  const handleUserLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', username);
    fetchTransactions(); // Fetch transactions after login
    fetchSummary(); // Fetch summary after login
  };

  const handleUserLogout = () => {
    setUser(null);
    setTransactions([]); // Clear transactions on logout
    setSummary({ total_income: 0, total_expenses: 0, balance: 0 }); // Reset summary on logout
    localStorage.removeItem('user');
  };

  const addTransaction = async (transaction) => {
    const response = await fetch('http://localhost:5000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (response.ok) {
      // Fetch updated transactions after adding a new one
      fetchTransactions();
      fetchSummary(); // Fetch updated summary
    }
  };

  useEffect(() => {
    fetchTransactions(); // Fetch transactions when the user changes
    fetchSummary(); // Fetch summary when the user changes
  }, [fetchTransactions, fetchSummary]); // Now include fetchSummary as a dependency

  return (
    <Router>
      <div>
        <h1>Personal Finance Tracker</h1>
        <Routes>
          <Route path="/register" element={
            !user ? (
              <Register onUserRegister={handleUserLogin} />
            ) : (
              <Navigate to="/transactions" />
            )
          } />

          <Route path="/login" element={
            !user ? (
              <Login onUserLogin={handleUserLogin} />
            ) : (
              <Navigate to="/transactions" />
            )
          } />

          <Route path="/transactions" element={
            user ? (
              <>
                <h2>Welcome, {user}!</h2>
                <button onClick={handleUserLogout}>Logout</button>
                <AddTransaction user={user} onAddTransaction={addTransaction} />
                <Summary transactions={transactions} summary={summary} user={user} /> {/* Pass summary and user as props */}

                <TransactionList transactions={transactions}
                  onDeleteTransaction={deleteTransaction}
                  onEditTransaction={editTransaction} /> {/* Pass transactions as prop */}
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
