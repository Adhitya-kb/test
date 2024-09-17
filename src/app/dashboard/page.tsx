"use client";
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AddLeadForm from '@/components/AddLeadForm';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchLeads(currentUser.uid); // Fetch leads for the current user
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchLeads = async (userId) => {
    const q = query(collection(db, 'leads'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const userLeads = querySnapshot.docs.map((doc) => doc.data());
    setLeads(userLeads);
  };

  const handleLeadAdded = () => {
    if (user) {
      fetchLeads(user.uid); // Refresh the lead list when a new lead is added
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Triangle</h1>
        </div>
        <nav className="mt-10">
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Business</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Products</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Clients</a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Analytics</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <header className="bg-white shadow p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Hi {user?.displayName || user?.email}, Welcome!</h2>
          <button onClick={handleLogout} className="text-red-500">Logout</button>
        </header>

        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold text-black">Generated leads</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Lead
            </button>
          </div>

          {/* Lead Table */}
          <table className="min-w-full text-sm text-black">
            <thead>
              <tr>
                <th className="text-left text-black">Opportunity</th>
                <th className="text-left text-black">Company</th>
                <th className="text-left text-black">Value</th>
                <th className="text-left text-black">Starting Date</th>
                <th className="text-left text-black">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index}>
                  <td className="py-2">{lead.opportunity}</td>
                  <td>{lead.company}</td>
                  <td>{lead.value}</td>
                  <td>{lead.startingDate}</td>
                  <td>{lead.completionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pop-up Form */}
        {showForm && (
          <AddLeadForm
            onClose={() => setShowForm(false)}
            onLeadAdded={handleLeadAdded}
          />
        )}
      </main>
    </div>
  );
}
