'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/components/WithAuth';
import api from '@/utils/api';

function CreateRoomPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/room', { name });
      router.push('/chat');
    } catch (err) {
      console.error('Error creating room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-semibold mb-4">Create Your First Room</h1>
      <form onSubmit={handleCreateRoom} className="space-y-4 flex flex-col items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name"
          className="border rounded-md p-2 w-64"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 text-white px-4 py-2 rounded-md hover:bg-amber-500"
        >
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
}

export default withAuth(CreateRoomPage, true);