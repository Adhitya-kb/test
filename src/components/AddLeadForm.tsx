"use client";
import { useState } from 'react';
import { db } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { auth } from '@/firebase';

export default function AddLeadForm({ onClose, onLeadAdded }) {
  const [opportunity, setOpportunity] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const [completionRate, setCompletionRate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to add a lead.');
      return;
    }

    try {
      await addDoc(collection(db, 'leads'), {
        opportunity,
        company,
        value,
        startingDate,
        completionRate,
        userId: user.uid,
      });

      onLeadAdded(); // Refresh the lead list
      onClose(); // Close the pop-up form
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Add New Lead</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Opportunity</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg text-black"
              value={opportunity}
              onChange={(e) => setOpportunity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Company</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg text-black"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Value</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg text-black"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Starting Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded-lg text-black"
              value={startingDate}
              onChange={(e) => setStartingDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black">Completion Rate</label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full border px-3 py-2 rounded-lg text-black"
              value={completionRate}
              onChange={(e) => setCompletionRate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="mr-4 text-gray-500" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
