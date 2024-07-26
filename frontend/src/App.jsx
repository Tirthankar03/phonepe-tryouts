import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [form, setForm] = useState({ name: '', number: '', amount: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/phonepe/payment', {
        ...form,
        amount: parseInt(form.amount, 10),
      });
      window.location.href = response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="App">
      <h1>PhonePe Payment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="number">Phone Number:</label>
          <input
            type="text"
            id="number"
            name="number"
            value={form.number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default App;
