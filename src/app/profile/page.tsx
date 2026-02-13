'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: string;
  joinedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamCode, setTeamCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      
      if (!data.user) {
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      fetchTeams(data.user.id);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async (userId: string) => {
    try {
      const res = await fetch(`/api/team/join?userId=${userId}`);
      const data = await res.json();
      if (data.teams) {
        setTeams(data.teams);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    setJoinLoading(true);
    setJoinSuccess(false);

    try {
      const res = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: teamCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJoinError(data.error || 'Failed to join team');
        setJoinLoading(false);
        return;
      }

      setJoinSuccess(true);
      setTeamCode('');
      if (user) {
        fetchTeams(user.id);
      }
      
      // Redirect to team shop
      setTimeout(() => {
        router.push(`/shop/team/${data.team.slug}`);
      }, 1000);
    } catch (error) {
      setJoinError('Something went wrong');
    }
    
    setJoinLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="/logos/8twologo.jpg" 
              alt="8TWO" 
              className="w-10 h-10 object-contain"
            />
          </a>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">YOUR PROFILE</h1>
          <p className="text-gray-400">
            Welcome back, {user.name || user.email}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Info */}
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Account</h2>
            <div className="space-y-3">
              <div>
                <label className="text-gray-500 text-sm">Email</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Name</label>
                <p className="text-white">{user.name || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Join Team */}
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Join a Team</h2>
            <p className="text-gray-400 text-sm mb-4">
              Enter your team code to access exclusive team merchandise.
            </p>

            {joinError && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm mb-4">
                {joinError}
              </div>
            )}

            {joinSuccess && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm mb-4">
                Successfully joined! Redirecting to team shop...
              </div>
            )}

            <form onSubmit={handleJoinTeam} className="space-y-4">
              <input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                placeholder="ENTER TEAM CODE"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white uppercase"
              />
              <button
                type="submit"
                disabled={joinLoading || !teamCode}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {joinLoading ? 'Joining...' : 'Join Team'}
              </button>
            </form>
          </div>
        </div>

        {/* My Teams */}
        {teams.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">My Teams</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <a
                  key={team.id}
                  href={`/shop/team/${team.slug}`}
                  className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors flex items-center gap-4"
                >
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <img 
                      src="/logos/8twologo.jpg" 
                      alt={team.name} 
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-bold">{team.name}</h3>
                    <p className="text-gray-400 text-sm capitalize">{team.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Order History (placeholder) */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Order History</h2>
          <div className="bg-zinc-900 rounded-xl p-6 text-center">
            <p className="text-gray-400">No orders yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}
