'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductFormData } from '@/types';

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
  isAdmin?: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamCode, setTeamCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();

  // Product form state
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'jerseys',
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [],
    inStock: true,
  });

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

  const fetchProducts = async () => {
    if (!showAdmin) return;
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (showAdmin) {
      fetchProducts();
    }
  }, [showAdmin]);

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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to add product');
        setAdminLoading(false);
        return;
      }

      setShowAddProduct(false);
      setProductForm({
        name: '',
        description: '',
        price: 0,
        category: 'jerseys',
        image: '',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [],
        inStock: true,
      });
      fetchProducts();
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setAdminLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
      sizes: product.sizes || [],
      colors: product.colors || [],
      inStock: product.inStock,
    });
    setShowAddProduct(true);
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

        {/* Admin Section */}
        {user.isAdmin && (
          <div className="mt-8">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-between px-6"
            >
              <span>Admin Panel - Inventory Management</span>
              <span className="text-gray-400">{showAdmin ? '▼' : '▶'}</span>
            </button>

            {showAdmin && (
              <div className="bg-zinc-900 rounded-b-xl p-6 mt-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-lg">Products</h3>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddProduct(true);
                    }}
                    className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-bold text-sm"
                  >
                    + Add Product
                  </button>
                </div>

                {/* Add/Edit Product Form */}
                {showAddProduct && (
                  <form onSubmit={handleAddProduct} className="bg-zinc-800 rounded-xl p-4 mb-6">
                    <h4 className="text-white font-bold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white mb-4"
                      rows={2}
                      required
                    />
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="jerseys">Jerseys</option>
                        <option value="hoodies">Hoodies</option>
                        <option value="jackets">Jackets</option>
                        <option value="pants">Pants</option>
                        <option value="accessories">Accessories</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Image URL (optional)"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                      />
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                          className="w-4 h-4"
                        />
                        In Stock
                      </label>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Sizes (comma separated, e.g. S,M,L,XL)"
                        value={productForm.sizes.join(',')}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value.split(',').map(s => s.trim()) })}
                        className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={adminLoading}
                        className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg font-bold"
                      >
                        {adminLoading ? 'Saving...' : 'Save Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProduct(false);
                          setEditingProduct(null);
                        }}
                        className="bg-zinc-600 hover:bg-zinc-500 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Products List */}
                {adminLoading && !products.length ? (
                  <div className="text-white">Loading...</div>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <span className="text-white font-bold text-xs">8TWO</span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-white font-bold">{product.name}</h4>
                            <p className="text-gray-400 text-sm">
                              ${product.price.toFixed(2)} • {product.category} • {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="bg-zinc-600 hover:bg-zinc-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <p className="text-gray-400 text-center py-4">No products found. Add your first product!</p>
                    )}
                  </div>
                )}
              </div>
            )}
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
