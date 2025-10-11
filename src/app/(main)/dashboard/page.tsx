'use client';

import { withAuth } from "@/components/WithAuth";

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-2xl font-bold text-accent">25</div>
          <div className="mt-2 text-gray-600">Active Chats</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-2xl font-bold text-accent">12</div>
          <div className="mt-2 text-gray-600">Agents Online</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-2xl font-bold text-accent">2m 15s</div>
          <div className="mt-2 text-gray-600">Avg. Response Time</div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, true); // true = auth required