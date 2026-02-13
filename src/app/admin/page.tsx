'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'products'>('overview');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (!data.user?.isAdmin) {
        router.push('/');
        return;
      }
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Admin Panel</h1>
            <p className="text-zinc-500 text-sm">Managing 8TWO Streetwear & Organizations</p>
          </div>
          <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-500 block uppercase font-bold">Logged in as</span>
            <span className="text-sm font-medium">{user?.name} (Admin)</span>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-px">
          {(['overview', 'teams', 'products'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid gap-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'teams' && <TeamsTab />}
          {activeTab === 'products' && <ProductsTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h3 className="text-zinc-500 text-xs font-bold uppercase mb-2">Total Sales</h3>
        <p className="text-3xl font-black">$12,450.00</p>
      </div>
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h3 className="text-zinc-500 text-xs font-bold uppercase mb-2">Active Organizations</h3>
        <p className="text-3xl font-black">24</p>
      </div>
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h3 className="text-zinc-500 text-xs font-bold uppercase mb-2">Pending Orders</h3>
        <p className="text-3xl font-black">8</p>
      </div>
    </div>
  );
}

function TeamsTab() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', code: '', description: '' });

  const fetchTeams = () => fetch('/api/admin/teams').then(r => r.json()).then(data => setTeams(data.teams || []));

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `/api/admin/teams/${editingId}` : '/api/admin/teams';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: '', slug: '', code: '', description: '' });
      fetchTeams();
    }
  };

  const handleEdit = (team: any) => {
    setEditingId(team.id);
    setFormData({ name: team.name, slug: team.slug, code: team.code, description: team.description || '' });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/teams/${id}`, { method: 'DELETE' });
    fetchTeams();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-tighter">Organizations</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', slug: '', code: '', description: '' }); }}
          className="bg-white text-black px-4 py-2 rounded font-bold text-xs uppercase"
        >
          Add New
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 grid gap-4">
          <h3 className="font-bold uppercase text-xs text-zinc-400">{editingId ? 'Edit' : 'Create'} Organization</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input 
              placeholder="Name (e.g. Thunder Basketball)" 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              placeholder="Slug (optional)" 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
            />
          </div>
          <input 
            placeholder="Unique Join Code (e.g. THUNDER25)" 
            className="bg-black border border-zinc-800 p-3 text-sm rounded"
            value={formData.code}
            onChange={e => setFormData({...formData, code: e.target.value})}
            required
          />
          <textarea 
            placeholder="Description" 
            className="bg-black border border-zinc-800 p-3 text-sm rounded h-24"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <div className="flex gap-4">
            <button type="submit" className="bg-white text-black px-6 py-2 rounded font-bold uppercase text-xs">{editingId ? 'Update' : 'Save'} Organization</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 uppercase text-xs font-bold">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {teams.map(team => (
          <div key={team.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex justify-between items-center">
            <div>
              <p className="font-bold uppercase">{team.name}</p>
              <p className="text-xs text-zinc-500">Code: {team.code} | members: {team._count.members}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => handleEdit(team)}
                className="text-xs font-bold uppercase hover:text-zinc-300"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(team.id)}
                className="text-xs font-bold uppercase text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'jerseys', teamId: '',
    sizes: 'S,M,L,XL,2XL', colors: 'Black,White'
  });

  const fetchData = async () => {
    const [pRes, tRes] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/admin/teams')
    ]);
    const pData = await pRes.json();
    const tData = await tRes.json();
    setProducts(pData.products || []);
    setTeams(tData.teams || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()) : formData.sizes,
        colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()) : formData.colors,
      }),
    });
    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        name: '', description: '', price: '', category: 'jerseys', teamId: '',
        sizes: 'S,M,L,XL,2XL', colors: 'Black,White'
      });
      fetchData();
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    const teamId = product.teamProducts?.[0]?.teamId || '';
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      teamId: teamId,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-tighter">Apparel Catalog</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', price: '', category: 'jerseys', teamId: '', sizes: 'S,M,L,XL,2XL', colors: 'Black,White' }); }}
          className="bg-white text-black px-4 py-2 rounded font-bold text-xs uppercase"
        >
          Add Product
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 grid gap-4">
          <h3 className="font-bold uppercase text-xs text-zinc-400">{editingId ? 'Edit' : 'Create'} Product</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input 
              placeholder="Product Name" 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              placeholder="Price" 
              type="number" step="0.01"
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <textarea 
            placeholder="Description" 
            className="bg-black border border-zinc-800 p-3 text-sm rounded h-20"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="jerseys">Jerseys</option>
              <option value="hoodies">Hoodies</option>
              <option value="accessories">Accessories</option>
            </select>
            <select 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.teamId}
              onChange={e => setFormData({...formData, teamId: e.target.value})}
            >
              <option value="">Public Collection (Open to All)</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
             <input 
              placeholder="Sizes (comma separated)" 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.sizes}
              onChange={e => setFormData({...formData, sizes: e.target.value})}
            />
            <input 
              placeholder="Colors (comma separated)" 
              className="bg-black border border-zinc-800 p-3 text-sm rounded"
              value={formData.colors}
              onChange={e => setFormData({...formData, colors: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-white text-black px-6 py-2 rounded font-bold uppercase text-xs">{editingId ? 'Update' : 'Create'} Product</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 uppercase text-xs font-bold">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
             <div className="flex justify-between items-start mb-2">
                <p className="font-bold uppercase text-sm">{product.name}</p>
                <p className="font-bold">${product.price}</p>
             </div>
             <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-zinc-400 uppercase font-bold">{product.category}</p>
                {product.teamProducts?.[0]?.team?.name && (
                  <p className="text-[10px] bg-white/10 text-white px-1.5 py-0.5 rounded uppercase font-bold">{product.teamProducts[0].team.name}</p>
                )}
             </div>
             <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{product.description}</p>
             <div className="flex gap-4">
                <button 
                  onClick={() => handleEdit(product)}
                  className="text-[10px] font-bold uppercase tracking-widest hover:text-zinc-300"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
