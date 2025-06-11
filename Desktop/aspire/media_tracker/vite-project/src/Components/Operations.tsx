import { useState,  } from 'react';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lastRestocked: string;
  supplier: string;
}

export default function Operations() {
  // Sample inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Wireless Mouse', category: 'Electronics', quantity: 42, price: 24.99, lastRestocked: '2023-05-15', supplier: 'TechGear Inc.' },
    { id: '2', name: 'Mechanical Keyboard', category: 'Electronics', quantity: 18, price: 89.99, lastRestocked: '2023-06-02', supplier: 'KeyMaster Ltd.' },
    { id: '3', name: 'HDMI Cable', category: 'Accessories', quantity: 127, price: 12.49, lastRestocked: '2023-06-10', supplier: 'ConnectPro' },
    { id: '4', name: 'USB-C Adapter', category: 'Accessories', quantity: 35, price: 15.99, lastRestocked: '2023-05-28', supplier: 'PortTech' },
    { id: '5', name: 'Laptop Stand', category: 'Furniture', quantity: 23, price: 34.95, lastRestocked: '2023-06-05', supplier: 'ErgoWorks' },
  ]);

  // Form state
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({ 
    name: '', 
    category: '', 
    quantity: 0, 
    price: 0, 
    lastRestocked: new Date().toISOString().split('T')[0], 
    supplier: '' 
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);

  // Get unique categories for filter
  const categories = ['All', ...new Set(inventory.map(item => item.category))];

  // Filtered and sorted inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // CRUD operations
  const handleCreate = () => {
    const newItem = {
      ...formData,
      id: Date.now().toString(),
    };
    setInventory([...inventory, newItem]);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId) return;
    setInventory(inventory.map(item => 
      item.id === editingId ? { ...formData, id: editingId } : item
    ));
    resetForm();
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      lastRestocked: item.lastRestocked,
      supplier: item.supplier
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      category: '', 
      quantity: 0, 
      price: 0, 
      lastRestocked: new Date().toISOString().split('T')[0], 
      supplier: '' 
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <div className='bg-[#f0f0f0] dark:bg-[#121212]  text-[#121212] dark:text-white '>
        <div className="container mx-auto p-4 max-w-6xl ">
      <div className="bg-white mb-44  dark:bg-[#121212] p-2 rounded-2xl pb-4 shadow-lg overflow-hidden border border-[#29b093] dark:border-[#e0f11f]">
        {/* Header */}
        <div className="dark:from-[#e0f11f] rounded-2xl dark:to-[#e0f11f] bg-gradient-to-r from-[#29b093] to-[#1f67f1]  text-white dark:text-[#121212] p-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-opacity-90">Manage your inventory items efficiently</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-[#29b093]/20 dark:border-[#e0f11f]/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-[#29b093] dark:text-[#e0f11f]" />
              </div>
              <input
                type="text"
                placeholder="Search items or suppliers..."
                className="pl-10 w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              <FiFilter />
              Filters
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              <FiPlus />
              Add Item
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-[#29b093]/10 dark:bg-[#e0f11f]/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Category</label>
                  <select
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Quantity Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Price Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item Form */}
        {showForm && (
          <div className="p-6 border-b border-[#29b093]/20 dark:border-[#e0f11f]/20">
            <form onSubmit={handleSubmit} className="bg-[#29b093]/10 dark:bg-[#e0f11f]/10 p-6 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#121212] dark:text-white">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[#29b093] dark:text-[#e0f11f] hover:text-[#1e8c7a] dark:hover:text-[#c9d90a]"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Category</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Last Restocked</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={formData.lastRestocked}
                    onChange={(e) => setFormData({...formData, lastRestocked: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#121212] dark:text-white mb-2">Supplier</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#29b093]/30 dark:border-[#e0f11f]/30 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-[#121212] dark:text-white"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-[#29b093] dark:border-[#e0f11f] rounded-lg text-[#29b093] dark:text-[#e0f11f] hover:bg-[#29b093]/10 dark:hover:bg-[#e0f11f]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212] rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#29b093]/20 dark:divide-[#e0f11f]/20">
            <thead className="bg-[#29b093]/10 dark:bg-[#e0f11f]/10">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortConfig?.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig?.key === 'category' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortConfig?.key === 'quantity' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortConfig?.key === 'price' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider"
                >
                  Last Restocked
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider"
                >
                  Supplier
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[#121212] dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#121212] divide-y divide-[#29b093]/20 dark:divide-[#e0f11f]/20">
              {sortedInventory.length > 0 ? (
                sortedInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#29b093]/5 dark:hover:bg-[#e0f11f]/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#121212] dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#121212] dark:text-white">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#121212] dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#121212] dark:text-white">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#121212] dark:text-white">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#121212] dark:text-white">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#29b093] dark:text-[#e0f11f] hover:text-[#1e8c7a] dark:hover:text-[#c9d90a] transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-[#ff4444] hover:text-[#cc0000] transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-[#121212] dark:text-white">
                    No items found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="p-6 bg-[#29b093]/10 dark:bg-[#e0f11f]/10 border-t border-[#29b093]/20 dark:border-[#e0f11f]/20">
          <div className="flex justify-between items-center">
            <div className="text-sm text-[#121212] dark:text-white">
              Showing <span className="font-bold">{sortedInventory.length}</span> of <span className="font-bold">{inventory.length}</span> items
            </div>
            <div className="text-sm text-[#121212] dark:text-white">
              Total value: <span className="font-bold">
                ${sortedInventory.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}