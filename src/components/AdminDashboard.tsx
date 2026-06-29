import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config';
import { LayoutDashboard, Briefcase, Lightbulb, FileText, Plus, Edit2, Trash2, X, LogOut, Loader2, Link as LinkIcon, Github, GraduationCap, School, Award, Sliders, GripVertical, Home, User, Cpu, ChevronUp, ChevronDown, Mail, Trophy } from 'lucide-react';

const api = axios.create({
  baseURL: `${API_BASE}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('adminToken');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up relative">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#FFD54F]/50 to-transparent opacity-50" />
        
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h3 className="text-xl font-syne font-bold text-white tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

const ArrayInput = ({ label, value = [], onChange, placeholder }: any) => {
  const handleItemChange = (index: number, val: string) => {
    if (val.includes(',')) {
      const parts = val.split(',').map(p => p.trim());
      const newArr = [...value];
      newArr[index] = parts[0];
      newArr.splice(index + 1, 0, ...parts.slice(1));
      onChange(newArr.filter(item => item !== null && item !== undefined));
    } else {
      const newArr = [...value];
      newArr[index] = val;
      onChange(newArr);
    }
  };

  const handleAddItem = () => {
    onChange([...value, '']);
  };

  const handleRemoveItem = (index: number) => {
    const newArr = value.filter((_: any, i: number) => i !== index);
    onChange(newArr);
  };

  return (
    <div className="flex flex-col space-y-2.5 bg-black/20 p-4 border border-white/5 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider pl-1">{label}</label>
          <span className="text-[9px] text-neutral-500 font-mono pl-1 mt-0.5">Use separate boxes per item. Typing commas automatically splits them.</span>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="text-[10px] font-mono uppercase tracking-widest text-[#FFD54F] hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10"
        >
          <Plus size={12} /> Add Item
        </button>
      </div>
      
      {value.length === 0 ? (
        <div className="text-xs text-neutral-500 font-mono italic pl-1 py-1">No items added yet. Click 'Add Item' to start.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {value.map((item: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl p-1.5 focus-within:border-[#FFD54F]/30 transition-colors">
              <input
                className="bg-transparent border-none text-white text-xs px-2 py-1 flex-1 focus:outline-none"
                placeholder={placeholder}
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="text-neutral-500 hover:text-red-400 p-1.5 hover:bg-white/5 rounded-lg transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MultiSelectInput = ({ label, options, selected = [], onChange }: any) => {
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [customVal, setCustomVal] = useState('');

  const allOptions = Array.from(new Set([...options, ...customOptions, ...selected]));

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item: string) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customVal.trim();
    if (trimmed && !allOptions.includes(trimmed)) {
      setCustomOptions(prev => [...prev, trimmed]);
      onChange([...selected, trimmed]);
      setCustomVal('');
    }
  };

  return (
    <div className="flex flex-col space-y-2.5 bg-black/20 p-4 border border-white/5 rounded-2xl">
      <label className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider pl-1">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {allOptions.map((option: string) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(option)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'bg-[#FFD54F]/10 border-[#FFD54F]/30 text-white shadow-[0_0_15px_rgba(255,213,79,0.15)]'
                  : 'bg-black/40 border-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-[#FFD54F] border-[#FFD54F]' : 'bg-black/50 border-white/20'}`}>
                {isSelected && <div className="w-2 h-2 bg-black rounded-sm" />}
              </div>
              <span className="truncate">{option}</span>
            </button>
          );
        })}
      </div>
      <form onSubmit={handleAddCustom} className="flex gap-2 mt-2 pt-2 border-t border-white/5">
        <input
          type="text"
          value={customVal}
          onChange={(e) => setCustomVal(e.target.value)}
          placeholder="Add custom option..."
          className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none grow"
        />
        <button
          type="submit"
          className="text-xs font-mono uppercase tracking-wider bg-[#FFD54F] hover:bg-[#e5bf45] text-black px-3 py-1.5 rounded-xl font-bold transition-all shrink-0"
        >
          Add Custom
        </button>
      </form>
    </div>
  );
};

const TextInput = ({ label, value, onChange, placeholder, required = false, type = 'text' }: any) => (
  <div className="flex flex-col">
    <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">{label}</label>
    <input 
      type={type}
      className="bg-black/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all" 
      placeholder={placeholder} 
      value={value} 
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} 
      required={required}
    />
  </div>
);

const TextAreaInput = ({ label, value, onChange, placeholder, required = false, rows = 3 }: any) => (
  <div className="flex flex-col">
    <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">{label}</label>
    <textarea 
      rows={rows}
      className="bg-black/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all resize-y" 
      placeholder={placeholder} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      required={required}
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options, required = false }: any) => (
  <div className="flex flex-col">
    <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">{label}</label>
    <select
      className="bg-black/50 border border-white/10 p-3 rounded-xl text-white text-sm focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all cursor-pointer"
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt} className="bg-neutral-950 text-white">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxInput = ({ label, checked, onChange }: any) => (
  <div className="flex items-center space-x-3 mt-4 p-4 bg-black/30 border border-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onChange(!checked)}>
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-[#FFD54F] border-[#FFD54F]' : 'bg-black/50 border-white/20'}`}>
      {checked && <div className="w-2.5 h-2.5 bg-black rounded-sm" />}
    </div>
    <label className="text-sm text-neutral-300 font-medium cursor-pointer select-none">{label}</label>
  </div>
);

const PageHeader = ({ title, onAdd, addText }: any) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h2 className="text-3xl font-syne font-bold text-white tracking-tight">{title}</h2>
      <div className="h-1 w-12 bg-[#FFD54F] mt-3 rounded-full opacity-80" />
    </div>
    {onAdd && (
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 bg-[#FFD54F] text-black px-5 py-2.5 rounded-xl font-bold hover:bg-[#FFD54F]/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,213,79,0.3)] transition-all active:scale-95"
      >
        <Plus size={18} strokeWidth={2.5} />
        {addText}
      </button>
    )}
  </div>
);

// --- Managers ---

function ProjectsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  const defaultForm = { title: '', description: '', image: '', demoUrl: '', githubUrl: '', paperUrl: '', year: '', order: 0, featured: false, tags: [], badges: [], metrics: [] };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { const { data } = await api.get('/projects'); setItems(data.sort((a: any, b: any) => a.order - b.order)); };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const { id, ...dataToSave } = formData as any;
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, dataToSave);
      } else {
        dataToSave.order = items.length;
        await api.post('/projects', dataToSave);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please check console.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project forever?')) { await api.delete(`/projects/${id}`); fetchItems(); }
  };

  const openModal = (item = null) => {
    if (item) { setEditingId(item.id); setFormData(item); }
    else { setEditingId(null); setFormData(defaultForm); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(defaultForm); };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    try {
      await Promise.all(
        items.map((item: any, idx: number) => 
          api.put(`/projects/${item.id}`, { ...item, order: idx })
        )
      );
    } catch (err) {
      console.error("Failed to update projects order:", err);
      alert("Failed to save the new order in the database.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <PageHeader title="Projects" onAdd={() => openModal()} addText="New Project" />
        </div>
      </div>
      <p className="text-xs text-neutral-400 font-mono mb-6 uppercase tracking-wider">
        💡 Drag and drop project cards to reorder how they appear on your homepage.
      </p>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Project' : 'Create Project'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Title" value={formData.title} onChange={(v: any) => setFormData({...formData, title: v})} required />
            <TextInput label="Year" value={formData.year} onChange={(v: any) => setFormData({...formData, year: v})} required />
            <TextInput label="Image URL" value={formData.image} onChange={(v: any) => setFormData({...formData, image: v})} required />
            <TextInput label="Demo URL" value={formData.demoUrl || ''} onChange={(v: any) => setFormData({...formData, demoUrl: v})} />
            <TextInput label="GitHub URL" value={formData.githubUrl || ''} onChange={(v: any) => setFormData({...formData, githubUrl: v})} />
            <TextInput label="Conference Paper URL (optional)" value={formData.paperUrl || ''} onChange={(v: any) => setFormData({...formData, paperUrl: v})} />
            
            <div className="md:col-span-2"><ArrayInput label="Technology Tags" placeholder="React, Node, etc." value={formData.tags} onChange={(v: any) => setFormData({...formData, tags: v})} /></div>
            <div className="md:col-span-2"><ArrayInput label="Badges" placeholder="⭐ Featured, 🎓 Final Year, etc." value={formData.badges} onChange={(v: any) => setFormData({...formData, badges: v})} /></div>
            <div className="md:col-span-2"><ArrayInput label="Metrics" placeholder="96% Accuracy, 4 Models, etc." value={formData.metrics} onChange={(v: any) => setFormData({...formData, metrics: v})} /></div>
            <div className="md:col-span-2"><CheckboxInput label="Feature this Project on Portfolio Homepage" checked={formData.featured} onChange={(v: any) => setFormData({...formData, featured: v})} /></div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">Description</label>
            <textarea className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-32 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" placeholder="Detailed description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="bg-[#FFD54F] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#e5bf45] transition-colors">{editingId ? 'Save Changes' : 'Publish Project'}</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((p: any, index: number) => {
          const isDragging = draggedIdx === index;
          return (
            <div 
              key={p.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-neutral-900/40 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl flex flex-col h-full rounded-2xl ${
                isDragging 
                  ? 'opacity-40 border-dashed border-[#FFD54F]/50 scale-95' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center p-5 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white transition-colors" title="Drag to reorder">
                    <GripVertical size={16} />
                  </div>
                  {p.featured && <span className="bg-[#FFD54F]/10 border border-[#FFD54F]/20 text-[#FFD54F] text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider">Featured</span>}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(p)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="px-5 pb-5 grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{p.title}</h3>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-3 grow">{p.description}</p>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">{p.year}</span>
                  <div className="flex gap-2">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white" title="GitHub Repo"><Github size={16} /></a>}
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white" title="Live Demo"><LinkIcon size={16} /></a>}
                    {p.paperUrl && <a href={p.paperUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white" title="Conference Paper"><FileText size={16} /></a>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InternshipsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const defaultForm = { num: '', company: '', role: '', duration: '', details: [], tags: [], order: 0 };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { const { data } = await api.get('/internships'); setItems(data.sort((a: any, b: any) => a.order - b.order)); };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const { id, ...dataToSave } = formData as any;
    try {
      if (editingId) {
        const idx = items.findIndex(item => item.id === editingId);
        dataToSave.num = String(idx !== -1 ? idx + 1 : items.length + 1).padStart(2, '0');
        await api.put(`/internships/${editingId}`, dataToSave);
      } else {
        dataToSave.order = items.length;
        dataToSave.num = String(items.length + 1).padStart(2, '0');
        await api.post('/internships', dataToSave);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this internship?')) {
      await api.delete(`/internships/${id}`);
      const { data } = await api.get('/internships');
      const sorted = data.sort((a: any, b: any) => a.order - b.order);
      await Promise.all(
        sorted.map((item: any, idx: number) => {
          const numStr = String(idx + 1).padStart(2, '0');
          return api.put(`/internships/${item.id}`, { ...item, order: idx, num: numStr });
        })
      );
      fetchItems();
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditingId(item.id); setFormData(item); }
    else { setEditingId(null); setFormData(defaultForm); }
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(defaultForm); };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    try {
      await Promise.all(
        items.map((item: any, idx: number) => {
          const numStr = String(idx + 1).padStart(2, '0');
          return api.put(`/internships/${item.id}`, { ...item, order: idx, num: numStr });
        })
      );
      fetchItems();
    } catch (err) {
      console.error("Failed to update internships order:", err);
      alert("Failed to save the new order in the database.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <PageHeader title="Experience" onAdd={() => openModal()} addText="New Role" />
        </div>
      </div>
      <p className="text-xs text-neutral-400 font-mono mb-6 uppercase tracking-wider">
        💡 Drag and drop experience cards to reorder how they appear on your homepage.
      </p>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Experience' : 'Add Experience'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Company / Organization" value={formData.company} onChange={(v: any) => setFormData({...formData, company: v})} required />
            <TextInput label="Role / Title" value={formData.role} onChange={(v: any) => setFormData({...formData, role: v})} required />
            <div className="md:col-span-2"><TextInput label="Duration (e.g. Jan 2023 - Present)" value={formData.duration} onChange={(v: any) => setFormData({...formData, duration: v})} required /></div>
            <div className="md:col-span-2"><ArrayInput label="Key Responsibilities" placeholder="Developed X, Managed Y..." value={formData.details} onChange={(v: any) => setFormData({...formData, details: v})} /></div>
            <div className="md:col-span-2"><ArrayInput label="Skills/Tags" placeholder="React, Agile..." value={formData.tags} onChange={(v: any) => setFormData({...formData, tags: v})} /></div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="bg-[#FFD54F] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#e5bf45] transition-colors">{editingId ? 'Save' : 'Add Role'}</button>
          </div>
        </form>
      </Modal>

      <div className="space-y-4">
        {items.map((p: any, index: number) => {
          const isDragging = draggedIdx === index;
          return (
            <div 
              key={p.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group bg-neutral-900/40 backdrop-blur-sm border transition-all duration-300 flex justify-between items-center p-5 rounded-2xl ${
                isDragging 
                  ? 'opacity-40 border-dashed border-[#FFD54F]/50 scale-98' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center p-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white transition-colors" title="Drag to reorder">
                  <GripVertical size={16} />
                </div>
                <div className="hidden sm:flex w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/5">
                  <Briefcase size={20} className="text-[#FFD54F]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{p.company}</h3>
                  <p className="text-sm text-neutral-400 font-medium">{p.role} <span className="text-neutral-600 font-mono text-xs mx-2">•</span> {p.duration}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(p)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EducationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  const defaultForm = { 
    shortTitle: '', 
    degree: '', 
    institution: '', 
    duration: '', 
    degreeStream: '', 
    board: '', 
    description: '', 
    learnings: [], 
    highlights: [], 
    snapshot: [], 
    metrics: [], 
    order: 0 
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { 
    const { data } = await api.get('/education'); 
    setItems(data.sort((a: any, b: any) => a.order - b.order)); 
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const { id, ...dataToSave } = formData as any;
    try {
      if (editingId) {
        await api.put(`/education/${editingId}`, dataToSave);
      } else {
        dataToSave.order = items.length;
        await api.post('/education', dataToSave);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this education entry?')) { 
      await api.delete(`/education/${id}`); 
      const { data } = await api.get('/education');
      const sorted = data.sort((a: any, b: any) => a.order - b.order);
      await Promise.all(
        sorted.map((item: any, idx: number) =>
          api.put(`/education/${item.id}`, { ...item, order: idx })
        )
      );
      fetchItems(); 
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditingId(item.id); setFormData(item); }
    else { setEditingId(null); setFormData(defaultForm); }
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(defaultForm); };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    try {
      await Promise.all(
        items.map((item: any, idx: number) => 
          api.put(`/education/${item.id}`, { ...item, order: idx })
        )
      );
    } catch (err) {
      console.error("Failed to update education order:", err);
      alert("Failed to save the new order in the database.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <PageHeader title="Education" onAdd={() => openModal()} addText="New Education" />
        </div>
      </div>
      <p className="text-xs text-neutral-400 font-mono mb-6 uppercase tracking-wider">
        💡 Drag and drop education cards to reorder how they appear on your homepage.
      </p>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Education' : 'Add Education'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Short Title (e.g. B.Tech)" value={formData.shortTitle} onChange={(v: any) => setFormData({...formData, shortTitle: v})} required />
            <TextInput label="Degree Name" value={formData.degree} onChange={(v: any) => setFormData({...formData, degree: v})} required />
            <TextInput label="Institution" value={formData.institution} onChange={(v: any) => setFormData({...formData, institution: v})} required />
            <TextInput label="Duration (e.g. 2022 - 2026)" value={formData.duration} onChange={(v: any) => setFormData({...formData, duration: v})} required />
            <TextInput label="Stream / Specialization" value={formData.degreeStream} onChange={(v: any) => setFormData({...formData, degreeStream: v})} required />
            <div className="md:col-span-2"><TextInput label="Board / Affiliation (Optional)" value={formData.board || ''} onChange={(v: any) => setFormData({...formData, board: v})} /></div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">Description</label>
              <textarea className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-28 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" placeholder="Description of this education phase..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>

            <div className="md:col-span-2"><ArrayInput label="Key Learnings" placeholder="React, Data Structures..." value={formData.learnings} onChange={(v: any) => setFormData({...formData, learnings: v})} /></div>
            <div className="md:col-span-2"><ArrayInput label="Academic Highlights" placeholder="Subject A, Subject B..." value={formData.highlights} onChange={(v: any) => setFormData({...formData, highlights: v})} /></div>
            <div className="md:col-span-2"><ArrayInput label="Journey Snapshot (Bullet Points)" placeholder="Built 5+ projects, Explored MERN..." value={formData.snapshot} onChange={(v: any) => setFormData({...formData, snapshot: v})} /></div>
            <div className="md:col-span-2"><ArrayInput label="Metrics (formatted as Label|Value)" placeholder="CGPA|8.75, Duration|4 Years, Projects|5+" value={formData.metrics} onChange={(v: any) => setFormData({...formData, metrics: v})} /></div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="bg-[#FFD54F] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#e5bf45] transition-colors">{editingId ? 'Save' : 'Add Education'}</button>
          </div>
        </form>
      </Modal>

      <div className="space-y-4">
        {items.map((p: any, index: number) => {
          const isDragging = draggedIdx === index;
          return (
            <div 
              key={p.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group bg-neutral-900/40 backdrop-blur-sm border transition-all duration-300 flex justify-between items-center p-5 rounded-2xl ${
                isDragging 
                  ? 'opacity-40 border-dashed border-[#FFD54F]/50 scale-98' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center p-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white transition-colors" title="Drag to reorder">
                  <GripVertical size={16} />
                </div>
                <div className="hidden sm:flex w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/5">
                  <School size={20} className="text-[#FFD54F]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    {p.degree}
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-[#FFD54F]">{p.shortTitle}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">{p.institution} • {p.duration}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(p)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const defaultForm = { 
    title: '', 
    image: '', 
    issuer: '', 
    year: '', 
    type: '', 
    status: '', 
    duration: '', 
    description: '', 
    skills: [], 
    badges: [], 
    order: 0 
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { 
    const { data } = await api.get('/insights'); 
    setItems(data.sort((a: any, b: any) => a.order - b.order)); 
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const { id, ...dataToSave } = formData as any;
    try {
      if (editingId) {
        await api.put(`/insights/${editingId}`, dataToSave);
      } else {
        dataToSave.order = items.length;
        await api.post('/insights', dataToSave);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certificate?')) { 
      await api.delete(`/insights/${id}`); 
      const { data } = await api.get('/insights');
      const sorted = data.sort((a: any, b: any) => a.order - b.order);
      await Promise.all(
        sorted.map((item: any, idx: number) =>
          api.put(`/insights/${item.id}`, { ...item, order: idx })
        )
      );
      fetchItems(); 
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditingId(item.id); setFormData(item); }
    else { setEditingId(null); setFormData(defaultForm); }
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(defaultForm); };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    try {
      await Promise.all(
        items.map((item: any, idx: number) => 
          api.put(`/insights/${item.id}`, { ...item, order: idx })
        )
      );
    } catch (err) {
      console.error("Failed to update certifications order:", err);
      alert("Failed to save the new order in the database.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <PageHeader title="Certifications" onAdd={() => openModal()} addText="New Certificate" />
        </div>
      </div>
      <p className="text-xs text-neutral-400 font-mono mb-6 uppercase tracking-wider">
        💡 Drag and drop certificate cards to reorder how they appear on your homepage.
      </p>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Certificate' : 'Add Certificate'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Title" value={formData.title} onChange={(v: any) => setFormData({...formData, title: v})} required />
            <TextInput label="Issuer" value={formData.issuer} onChange={(v: any) => setFormData({...formData, issuer: v})} required />
            <TextInput label="Year" value={formData.year} onChange={(v: any) => setFormData({...formData, year: v})} required />
            <TextInput label="Type (e.g. Technical Certification)" value={formData.type} onChange={(v: any) => setFormData({...formData, type: v})} required />
            <TextInput label="Status (e.g. Active)" value={formData.status} onChange={(v: any) => setFormData({...formData, status: v})} required />
            <TextInput label="Duration" value={formData.duration} onChange={(v: any) => setFormData({...formData, duration: v})} required />
            <TextInput label="Image / Certificate URL" value={formData.image} onChange={(v: any) => setFormData({...formData, image: v})} required />
            
            <div className="md:col-span-2">
              <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">Description</label>
              <textarea className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-28 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" placeholder="Description of what you learned/accomplished..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            
            <div className="md:col-span-2"><ArrayInput label="Skills Acquired" placeholder="React, AWS..." value={formData.skills} onChange={(v: any) => setFormData({...formData, skills: v})} /></div>
            <div className="md:col-span-2">
              <MultiSelectInput 
                label="Badges" 
                options={["✓ Verified", "Industry Credential", "Professional Training", "Technical Certification", "Academic Credential", "Academic Certification", "Completed", "Active", "Self-Paced", "Featured"]} 
                selected={formData.badges || []} 
                onChange={(v: any) => setFormData({...formData, badges: v})} 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="bg-[#FFD54F] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#e5bf45] transition-colors">{editingId ? 'Save' : 'Add Certificate'}</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((p: any, index: number) => {
          const isDragging = draggedIdx === index;
          return (
            <div 
              key={p.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group bg-neutral-900/40 backdrop-blur-sm border transition-all duration-300 flex justify-between items-center p-5 rounded-2xl ${
                isDragging 
                  ? 'opacity-40 border-dashed border-[#FFD54F]/50 scale-98' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center p-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white transition-colors animate-fade-in" title="Drag to reorder">
                  <GripVertical size={16} />
                </div>
                <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden border border-white/5 shrink-0">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">{p.title}</h3>
                  <p className="text-xs text-[#FFD54F] mt-1">{p.issuer} • {p.year}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(p)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function HeroSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    hero_subtitle: '',
    hero_title_part1: '',
    hero_title_part2: '',
    hero_description: '',
    hero_ticker_words: [] as string[],
    hero_resume_url: '',
    hero_linkedin_url: '',
    hero_github_url: '',
    hero_orb_url: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data: dbData } = await api.get('/content');
      const mapped: any = { ...data };
      dbData.forEach((item: any) => {
        if (item.key.startsWith('hero_')) {
          if (item.key === 'hero_ticker_words') {
            mapped[item.key] = item.value ? item.value.split(',').map((w: string) => w.trim()) : [];
          } else if (item.key in data) {
            mapped[item.key] = item.value || '';
          }
        }
      });
      setData(mapped);
    } catch (err) {
      console.error("Error loading hero content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const promises = Object.entries(data).map(([key, val]) => {
        const strVal = Array.isArray(val) ? val.join(', ') : val;
        return api.put(`/content/${key}`, { value: String(strVal) });
      });
      await Promise.all(promises);
      alert('Hero settings saved successfully!');
    } catch (err) {
      console.error("Error saving hero content:", err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
        <Loader2 size={16} className="animate-spin" /> Loading configurations...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Hero Page Settings" />
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl bg-neutral-900/40 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
        
        {/* Headings */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Hero Text Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Subtitle / Focus (e.g. Software Engineer • Full-Stack Developer)" value={data.hero_subtitle} onChange={(v: any) => setData({ ...data, hero_subtitle: v })} required />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextInput label="Heading Line 1 (e.g. Building software for)" value={data.hero_title_part1} onChange={(v: any) => setData({ ...data, hero_title_part1: v })} required />
              <TextInput label="Heading Line 2 - Gold Gradient (e.g. real-world problems.)" value={data.hero_title_part2} onChange={(v: any) => setData({ ...data, hero_title_part2: v })} required />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">Description Paragraph</label>
              <textarea 
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-28 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" 
                placeholder="Description of yourself..." 
                value={data.hero_description} 
                onChange={e => setData({ ...data, hero_description: e.target.value })} 
                required 
              />
            </div>
          </div>
        </div>

        {/* Dynamic Ticker */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Moving Background Tickers</h3>
          <div className="space-y-5">
            <ArrayInput label="Moving Ticker Words (Horizontal moving text)" placeholder="e.g. TYPESCRIPT" value={data.hero_ticker_words} onChange={(v: any) => setData({ ...data, hero_ticker_words: v })} />
          </div>
        </div>

        {/* Action Buttons Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Call to Action Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TextInput label="Resume Download URL (e.g. Google Drive Link)" value={data.hero_resume_url} onChange={(v: any) => setData({ ...data, hero_resume_url: v })} />
            <TextInput label="LinkedIn Profile URL" value={data.hero_linkedin_url} onChange={(v: any) => setData({ ...data, hero_linkedin_url: v })} required />
            <TextInput label="GitHub Profile URL" value={data.hero_github_url} onChange={(v: any) => setData({ ...data, hero_github_url: v })} required />
          </div>
        </div>

        {/* Menu Drawer Decorative Media */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Menu Drawer Decorative Orb Media</h3>
          <div className="bg-black/20 border border-white/5 rounded-2xl p-5 space-y-4">
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Define the image or video URL for the floating circular orb displayed in your main menu sidebar. 
              Supports standard image links (PNG, JPG) and looping video files (MP4, WEBM).
            </p>
            <TextInput 
              label="Orb Media URL (leave empty to use default iridescent wave graphic)" 
              value={data.hero_orb_url} 
              onChange={(v: any) => setData({ ...data, hero_orb_url: v })} 
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#FFD54F] text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-[#e5bf45] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Hero Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function AboutSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    about_title: '',
    about_description: '',
    about_profile_pic_url: '',
    about_profile_pic_hover_url: '',
    about_highlight_projects: '',
    about_highlight_tech: '',
    about_highlight_innovation: '',
    about_highlight_status: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data: dbData } = await api.get('/content');
      const mapped: any = { ...data };
      dbData.forEach((item: any) => {
        if (item.key.startsWith('about_')) {
          if (item.key in data) {
            mapped[item.key] = item.value || '';
          }
        }
      });
      setData(mapped);
    } catch (err) {
      console.error("Error loading about content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const promises = Object.entries(data).map(([key, val]) => {
        return api.put(`/content/${key}`, { value: String(val) });
      });
      await Promise.all(promises);
      alert('About settings saved successfully!');
    } catch (err) {
      console.error("Error saving about content:", err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
        <Loader2 size={16} className="animate-spin" /> Loading configurations...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="About Page Settings" />
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl bg-neutral-900/40 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
        
        {/* Intro */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Intro Settings</h3>
          <div className="grid grid-cols-1 gap-5">
            <TextInput label="Profile Picture URL (leave empty to use default)" value={data.about_profile_pic_url} onChange={(v: any) => setData({ ...data, about_profile_pic_url: v })} />
            <TextInput label="Profile Picture Hover/Reveal URL (leave empty to use same/color transition)" value={data.about_profile_pic_hover_url} onChange={(v: any) => setData({ ...data, about_profile_pic_hover_url: v })} />
            <TextInput label="Heading / Title" value={data.about_title} onChange={(v: any) => setData({ ...data, about_title: v })} required />
            <div>
              <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">About Description</label>
              <textarea 
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-28 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" 
                placeholder="Detailed about description..." 
                value={data.about_description} 
                onChange={e => setData({ ...data, about_description: e.target.value })} 
                required 
              />
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Profile Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Projects Highlight (e.g. 5+ Projects Built)" value={data.about_highlight_projects} onChange={(v: any) => setData({ ...data, about_highlight_projects: v })} required />
            <TextInput label="Core Tech Highlight (e.g. MERN • TypeScript)" value={data.about_highlight_tech} onChange={(v: any) => setData({ ...data, about_highlight_tech: v })} required />
            <TextInput label="Innovation Highlight (e.g. AI & Automation)" value={data.about_highlight_innovation} onChange={(v: any) => setData({ ...data, about_highlight_innovation: v })} required />
            <SelectInput label="Status Highlight" value={data.about_highlight_status} onChange={(v: any) => setData({ ...data, about_highlight_status: v })} options={['Open to Opportunities', 'Not Open to Opportunities Right Now']} required />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#FFD54F] text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-[#e5bf45] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save About Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

const AVAILABLE_SKILL_ICONS = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'express', label: 'Express.js' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'ethereum', label: 'Ethereum / Hardhat / MetaMask' },
  { value: 'openai', label: 'OpenAI / AI' },
  { value: 'git', label: 'Git' },
  { value: 'github', label: 'GitHub' },
  { value: 'vscode', label: 'VS Code' },
  { value: 'postman', label: 'Postman' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'aws', label: 'AWS' },
  { value: 'gcp', label: 'Google Cloud' },
  { value: 'firebase', label: 'Firebase' },
  { value: 'supabase', label: 'Supabase' },
  { value: 'framer', label: 'Framer Motion' },
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'prisma', label: 'Prisma' },
  { value: 'redux', label: 'Redux' },
  { value: 'html', label: 'HTML5' },
  { value: 'css', label: 'CSS3' },
  { value: 'sass', label: 'Sass' },
  { value: 'default', label: 'Default Sparkles (Custom / Other)' }
];

const AVAILABLE_CATEGORY_ICONS = [
  { value: 'code', label: 'Code Icon (Frontend)' },
  { value: 'server', label: 'Server Icon (Backend)' },
  { value: 'database', label: 'Database Icon' },
  { value: 'shield', label: 'Shield Icon (Web3)' },
  { value: 'cpu', label: 'CPU Icon (AI / Hardware)' },
  { value: 'wrench', label: 'Wrench Icon (Tools)' },
  { value: 'sparkles', label: 'Sparkles Icon' },
  { value: 'compass', label: 'Compass Icon' },
  { value: 'globe', label: 'Globe Icon' }
];

function SkillsSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const updated = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCategories(updated);
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data: dbData } = await api.get('/content');
      const skillsItem = dbData.find((item: any) => item.key === 'skills_data');
      if (skillsItem && skillsItem.value) {
        setCategories(JSON.parse(skillsItem.value));
      } else {
        setCategories([
          { id: "frontend", title: "Frontend Development", iconName: "code", skills: [] },
          { id: "backend", title: "Backend Development", iconName: "server", skills: [] },
          { id: "database", title: "Database Management", iconName: "database", skills: [] },
          { id: "blockchain", title: "Blockchain & Web3", iconName: "shield", skills: [] },
          { id: "ai", title: "AI & Automation", iconName: "cpu", skills: [] },
          { id: "tools", title: "Developer Tools", iconName: "wrench", skills: [] },
        ]);
      }
    } catch (err) {
      console.error("Error loading skills content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/content/skills_data', { value: JSON.stringify(categories) });
      alert('Skills settings saved successfully!');
    } catch (err) {
      console.error("Error saving skills:", err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryFieldChange = (catIdx: number, field: string, val: string) => {
    const updated = [...categories];
    updated[catIdx][field] = val;
    setCategories(updated);
  };

  const handleAddCategory = () => {
    const newId = `cat-${Date.now()}`;
    setCategories([...categories, { id: newId, title: 'New Category', iconName: 'sparkles', skills: [] }]);
  };

  const handleRemoveCategory = (catIdx: number) => {
    if (confirm('Are you sure you want to delete this entire category and all of its skill badges?')) {
      const updated = categories.filter((_, idx) => idx !== catIdx);
      setCategories(updated);
    }
  };

  const handleSkillFieldChange = (catIdx: number, skillIdx: number, field: string, val: string) => {
    const updated = [...categories];
    updated[catIdx].skills[skillIdx][field] = val;
    setCategories(updated);
  };

  const handleAddSkill = (catIdx: number) => {
    const updated = [...categories];
    updated[catIdx].skills.push({ name: '', iconName: 'default', color: '#FFFFFF' });
    setCategories(updated);
  };

  const handleRemoveSkill = (catIdx: number, skillIdx: number) => {
    const updated = [...categories];
    updated[catIdx].skills = updated[catIdx].skills.filter((_: any, idx: number) => idx !== skillIdx);
    setCategories(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
        <Loader2 size={16} className="animate-spin" /> Loading configurations...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Skills & Ticker Settings" />
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-[#FFD54F] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e5bf45] transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl bg-neutral-900/40 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
        <p className="text-xs text-neutral-400 font-mono italic">💡 Use the Up and Down arrow buttons next to the categories to change their display order.</p>
        
        {categories.map((cat, catIdx) => {
          return (
            <div 
              key={cat.id} 
              className="space-y-4 bg-black/30 border border-white/5 p-5 rounded-2xl relative"
            >
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4 border-b border-white/5 pb-4">
                <div className="flex gap-1.5 w-full md:w-auto shrink-0 self-center md:self-end pb-1">
                  <button
                    type="button"
                    disabled={catIdx === 0}
                    onClick={() => handleMoveCategory(catIdx, 'up')}
                    className="flex items-center justify-center p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-not-allowed"
                    title="Move Category Up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={catIdx === categories.length - 1}
                    onClick={() => handleMoveCategory(catIdx, 'down')}
                    className="flex items-center justify-center p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-not-allowed"
                    title="Move Category Down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <TextInput 
                    label="Category Name" 
                    value={cat.title} 
                    onChange={(v: string) => handleCategoryFieldChange(catIdx, 'title', v)} 
                    required 
                  />
                <SelectInput
                  label="Category Icon"
                  value={cat.iconName || 'sparkles'}
                  onChange={(v: string) => handleCategoryFieldChange(catIdx, 'iconName', v)}
                  options={AVAILABLE_CATEGORY_ICONS.map(i => i.value)}
                  required
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0">
                <button
                  type="button"
                  onClick={() => handleAddSkill(catIdx)}
                  className="text-[10px] font-mono uppercase tracking-widest text-[#FFD54F] hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10"
                >
                  <Plus size={12} /> Add Skill
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(catIdx)}
                  className="text-[10px] font-mono uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20"
                >
                  <Trash2 size={12} /> Remove Category
                </button>
              </div>
            </div>

            {cat.skills.length === 0 ? (
              <div className="text-xs text-neutral-500 font-mono italic p-2">No skills in this category yet. Click 'Add Skill' to create one.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.skills.map((skill: any, skillIdx: number) => (
                  <div key={skillIdx} className="flex flex-col gap-3 bg-black/40 border border-white/5 p-3.5 rounded-xl relative">
                    <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide">Skill #{skillIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(catIdx, skillIdx)}
                        className="text-neutral-500 hover:text-red-400 p-1 hover:bg-white/5 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <TextInput 
                        label="Skill Name" 
                        value={skill.name} 
                        onChange={(v: string) => handleSkillFieldChange(catIdx, skillIdx, 'name', v)} 
                        required 
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <SelectInput
                          label="Select Logo Icon"
                          value={skill.iconName || 'default'}
                          onChange={(v: string) => handleSkillFieldChange(catIdx, skillIdx, 'iconName', v)}
                          options={AVAILABLE_SKILL_ICONS.map(i => i.value)}
                          required
                        />
                        <TextInput 
                          label="Color (Hex)" 
                          value={skill.color} 
                          onChange={(v: string) => handleSkillFieldChange(catIdx, skillIdx, 'color', v)} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          );
        })}

        {/* Submit */}
        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#FFD54F] text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-[#e5bf45] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Skills & Tickers'}
          </button>
        </div>
      </form>
    </div>
  );
}

function TogglesManager() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    toggle_experience: true,
    toggle_projects: true,
    toggle_certifications: true,
    toggle_education: true,
    toggle_skills: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToggles();
  }, []);

  const fetchToggles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/content');
      const newToggles = { ...toggles };
      data.forEach((item: any) => {
        if (item.key.startsWith('toggle_')) {
          newToggles[item.key] = item.value === 'true';
        }
      });
      setToggles(newToggles);
    } catch (err) {
      console.error("Error loading toggles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async (key: string, currentValue: boolean) => {
    const newValue = !currentValue;
    try {
      setToggles(prev => ({ ...prev, [key]: newValue }));
      await api.put(`/content/${key}`, { value: String(newValue) });
    } catch (err) {
      console.error(`Error saving toggle ${key}:`, err);
      alert('Failed to save toggle state.');
      setToggles(prev => ({ ...prev, [key]: currentValue }));
    }
  };

  const toggleItems = [
    { key: 'toggle_experience', label: 'Experience Section', description: 'Show or hide the work/internship experience timeline.' },
    { key: 'toggle_projects', label: 'Projects Section', description: 'Show or hide the projects showcases.' },
    { key: 'toggle_certifications', label: 'Certifications Section', description: 'Show or hide the professional certificates and badges.' },
    { key: 'toggle_education', label: 'Education Section', description: 'Show or hide academic background/degrees.' },
    { key: 'toggle_skills', label: 'Skills Section', description: 'Show or hide technical and soft skills lists.' },
  ];

  return (
    <div>
      <PageHeader title="Section Visibility Toggles" />
      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
          <Loader2 size={16} className="animate-spin" /> Loading configuration...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toggleItems.map(item => {
            const isEnabled = toggles[item.key] ?? true;
            return (
              <div 
                key={item.key} 
                className="bg-neutral-900/40 backdrop-blur-sm border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all duration-300"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.label}</h3>
                  <p className="text-sm text-neutral-400 mb-6">{item.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className={`text-xs font-mono uppercase tracking-wider ${isEnabled ? 'text-[#FFD54F]' : 'text-neutral-500'}`}>
                    {isEnabled ? 'Active / Visible' : 'Hidden / Disabled'}
                  </span>
                  <button
                    onClick={() => handleToggleChange(item.key, isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                      isEnabled ? 'bg-[#FFD54F]' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform duration-300 ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ContactSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const defaultContactData = {
    contact_availability_status: 'Available for Opportunities',
    contact_availability_color: 'green',
    contact_response_time: '< 24 Hours',
    contact_location: 'Hyderabad, India',
    contact_focus_tags: ['Full Stack Development', 'AI-Powered Applications'],
    contact_preferred_roles: ['Software Engineer', 'Frontend Engineer', 'Full Stack Developer'],
    contact_email: 'gvrnishchalreddy@gmail.com',
    contact_phone: '+91 7013612696',
    contact_address: 'Hyderabad, Telangana, India',
    contact_footer_title: "Let's Build Something Exceptional Together",
    contact_footer_subtitle: 'Available for Opportunities in Software Engineering & Full Stack Development',
    contact_consultations_label: '// CONSULTATIONS',
    contact_consultations_title: "Let's talk\nabout your\nproject.",
    contact_consultations_description: 'Have an idea, brief, or active technical requirement? Drop me a message or write directly to my inbox. I usually reply within 24 hours.',
  };

  const [data, setData] = useState(defaultContactData);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data: dbData } = await api.get('/content');
      const mapped: any = { ...defaultContactData };
      dbData.forEach((item: any) => {
        if (item.key.startsWith('contact_')) {
          if (item.key === 'contact_focus_tags' || item.key === 'contact_preferred_roles') {
            mapped[item.key] = item.value ? item.value.split(',').map((w: string) => w.trim()) : [];
          } else if (item.key in mapped) {
            mapped[item.key] = item.value !== null && item.value !== undefined ? item.value : mapped[item.key];
          }
        }
      });
      setData(mapped);
    } catch (err) {
      console.error("Error loading contact content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const promises = Object.entries(data).map(([key, val]) => {
        const strVal = Array.isArray(val) ? val.join(', ') : val;
        return api.put(`/content/${key}`, { value: String(strVal) });
      });
      await Promise.all(promises);
      alert('Contact settings saved successfully!');
    } catch (err: any) {
      console.error("Error saving contact content:", err);
      alert('Failed to save settings: ' + (err.response?.data?.error || err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
        <Loader2 size={16} className="animate-spin" /> Loading configurations...
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Contact & Opportunities Settings" />
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl bg-neutral-900/40 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
        
        {/* Availability Card settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Availability Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <SelectInput 
                label="Availability Status" 
                value={data.contact_availability_status === 'Available for Opportunities' ? 'Available for Opportunities (Green Dot)' : 'Unavailable for Opportunities (Red Dot)'} 
                onChange={(v: any) => {
                  const statusText = v.startsWith('Available') ? 'Available for Opportunities' : 'Unavailable for Opportunities';
                  const color = v.startsWith('Available') ? 'green' : 'red';
                  setData({ 
                    ...data, 
                    contact_availability_status: statusText,
                    contact_availability_color: color 
                  });
                }} 
                options={['Available for Opportunities (Green Dot)', 'Unavailable for Opportunities (Red Dot)']} 
                required 
              />
            </div>
            <TextInput label="Response Time (e.g. < 24 Hours)" value={data.contact_response_time} onChange={(v: any) => setData({ ...data, contact_response_time: v })} required />
            <TextInput label="Location (e.g. Hyderabad, India)" value={data.contact_location} onChange={(v: any) => setData({ ...data, contact_location: v })} required />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Focus & Roles Tags</h3>
          <div className="space-y-5">
            <ArrayInput label="Current Focus Tags" placeholder="e.g. Full Stack Development" value={data.contact_focus_tags} onChange={(v: any) => setData({ ...data, contact_focus_tags: v })} />
            <ArrayInput label="Preferred Roles Tags" placeholder="e.g. Software Engineer" value={data.contact_preferred_roles} onChange={(v: any) => setData({ ...data, contact_preferred_roles: v })} />
          </div>
        </div>

        {/* Direct Coordinates */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Direct Contact Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Direct Email Address" value={data.contact_email} onChange={(v: any) => setData({ ...data, contact_email: v })} required />
            <TextInput label="Direct Phone Number" value={data.contact_phone} onChange={(v: any) => setData({ ...data, contact_phone: v })} required />
            <div className="md:col-span-2">
              <TextInput label="Detailed Office Address / Physical Location" value={data.contact_address} onChange={(v: any) => setData({ ...data, contact_address: v })} required />
            </div>
          </div>
        </div>

        {/* Consultations Text Block */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Consultations Header Block</h3>
          <div className="grid grid-cols-1 gap-5">
            <TextInput label="Consultations Label (e.g. // CONSULTATIONS)" value={data.contact_consultations_label} onChange={(v: any) => setData({ ...data, contact_consultations_label: v })} required />
            <TextAreaInput label="Consultations Title (supports line breaks)" value={data.contact_consultations_title} onChange={(v: any) => setData({ ...data, contact_consultations_title: v })} required rows={3} />
            <TextAreaInput label="Consultations Description" value={data.contact_consultations_description} onChange={(v: any) => setData({ ...data, contact_consultations_description: v })} required rows={3} />
          </div>
        </div>

        {/* Footer block settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[#FFD54F] border-b border-white/5 pb-2">Recruiter Statement (Footer CTA Block)</h3>
          <div className="grid grid-cols-1 gap-5">
            <TextInput label="Footer CTA Block Title" value={data.contact_footer_title} onChange={(v: any) => setData({ ...data, contact_footer_title: v })} required />
            <TextInput label="Footer CTA Block Subtitle / Description" value={data.contact_footer_subtitle} onChange={(v: any) => setData({ ...data, contact_footer_subtitle: v })} required />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#FFD54F] text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-[#e5bf45] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Contact Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function AchievementsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  const defaultForm = {
    tag: '',
    headline: '',
    subHeadline: '',
    description: '',
    category: '',
    skills: [],
    impact: '',
    iconName: 'Trophy',
    bgPattern: 'track',
    stats: [],
    accentColor: '#FFD54F',
    shadowColor: 'rgba(255, 213, 79, 0.12)',
    order: 0
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { 
    try {
      const { data } = await api.get('/achievements'); 
      setItems(data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))); 
    } catch (err) {
      console.error("Error fetching achievements:", err);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const { id, ...dataToSave } = formData as any;
    try {
      if (editingId) {
        await api.put(`/achievements/${editingId}`, dataToSave);
      } else {
        dataToSave.order = items.length;
        await api.post('/achievements', dataToSave);
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert('Failed to save.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this achievement forever?')) { 
      try {
        await api.delete(`/achievements/${id}`); 
        fetchItems(); 
      } catch (err) {
        console.error(err);
        alert('Failed to delete.');
      }
    }
  };

  const openModal = (item = null) => {
    if (item) { setEditingId(item.id); setFormData(item); }
    else { setEditingId(null); setFormData(defaultForm); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(defaultForm); };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    setDraggedIdx(null);
    try {
      await Promise.all(
        items.map((item: any, idx: number) => 
          api.put(`/achievements/${item.id}`, { ...item, order: idx })
        )
      );
    } catch (err) {
      console.error("Failed to update achievements order:", err);
      alert("Failed to save the new order.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <PageHeader title="Achievements & Leadership" onAdd={() => openModal()} addText="New Achievement" />
        </div>
      </div>
      <p className="text-xs text-neutral-400 font-mono mb-6 uppercase tracking-wider">
        💡 Drag and drop cards to reorder how they appear in the Bento Grid layout.
      </p>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Achievement' : 'Create Achievement'}>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextInput label="Tag (e.g. 🏅 STATE GOLD MEDAL)" value={formData.tag} onChange={(v: any) => setFormData({...formData, tag: v})} required />
            <TextInput label="Headline (e.g. 1.5 KM CHAMPION)" value={formData.headline} onChange={(v: any) => setFormData({...formData, headline: v})} required />
            <TextInput label="Sub Headline (optional)" value={formData.subHeadline || ''} onChange={(v: any) => setFormData({...formData, subHeadline: v})} />
            <TextInput label="Category (e.g. Athletics)" value={formData.category} onChange={(v: any) => setFormData({...formData, category: v})} required />
            
            <SelectInput label="Icon Name" value={formData.iconName} onChange={(v: any) => setFormData({...formData, iconName: v})} options={['Trophy', 'Medal', 'Users', 'UserCheck']} required />
            <SelectInput label="Background Pattern" value={formData.bgPattern} onChange={(v: any) => setFormData({...formData, bgPattern: v})} options={['track', 'pitch', 'network']} required />
            
            <TextInput label="Accent Color (e.g. #FFD54F)" value={formData.accentColor} onChange={(v: any) => setFormData({...formData, accentColor: v})} required />
            <TextInput label="Shadow Glow Color (e.g. rgba(255, 213, 79, 0.12))" value={formData.shadowColor} onChange={(v: any) => setFormData({...formData, shadowColor: v})} required />
            
            <div className="md:col-span-2">
              <ArrayInput label="Achievement Stats (e.g. State Level, 1.5 KM)" placeholder="State Level" value={formData.stats} onChange={(v: any) => setFormData({...formData, stats: v})} />
            </div>
            
            <div className="md:col-span-2">
              <ArrayInput label="Skills Developed" placeholder="Discipline" value={formData.skills} onChange={(v: any) => setFormData({...formData, skills: v})} />
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">Summary Description</label>
            <textarea className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-24 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" placeholder="Short description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] text-neutral-400 mb-1.5 font-mono uppercase tracking-wider pl-1">Experience & Impact</label>
            <textarea className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white text-sm h-24 focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all custom-scrollbar" placeholder="Experience & impact details..." value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} required />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="bg-[#FFD54F] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#e5bf45] transition-colors">{editingId ? 'Save Changes' : 'Publish Achievement'}</button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item: any, index: number) => {
          const isDragging = draggedIdx === index;
          return (
            <div 
              key={item.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-neutral-900/40 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl flex flex-col h-full rounded-2xl ${
                isDragging 
                  ? 'opacity-40 border-dashed border-[#FFD54F]/50 scale-95' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center p-5 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white transition-colors" title="Drag to reorder">
                    <GripVertical size={16} />
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider font-mono border" style={{ color: item.accentColor, borderColor: `${item.accentColor}25`, backgroundColor: `${item.accentColor}05` }}>
                    {item.category}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(item)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="px-5 pb-5 grow flex flex-col">
                <span className="text-xs font-mono text-neutral-400 mt-1">{item.tag}</span>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 mt-1">{item.headline}</h3>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-3 grow">{item.description}</p>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto font-mono text-xs text-neutral-500">
                  <span>Icon: {item.iconName}</span>
                  <span>Pattern: {item.bgPattern}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Layout Layout ---

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('adminToken', data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD54F]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-pink/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-md w-full bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-4xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#FFD54F]/10 border border-[#FFD54F]/20 rounded-xl flex items-center justify-center mb-4">
              <LayoutDashboard className="text-[#FFD54F]" size={24} />
            </div>
            <h2 className="text-2xl font-syne font-bold text-white tracking-wide">CMS Access</h2>
            <p className="text-sm text-neutral-400 mt-2">Sign in to manage your portfolio.</p>
          </div>
          
          {error && <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-[#FFD54F]/50 focus:bg-white/5 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD54F] text-black font-bold py-3.5 rounded-xl hover:bg-[#e5bf45] hover:shadow-[0_0_20px_rgba(255,213,79,0.3)] transition-all mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { path: '/admin/hero', label: 'Hero Settings', icon: <Home size={20} /> },
    { path: '/admin/about', label: 'About Settings', icon: <User size={20} /> },
    { path: '/admin/skills', label: 'Skills Settings', icon: <Cpu size={20} /> },
    { path: '/admin/projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { path: '/admin/internships', label: 'Experience', icon: <GraduationCap size={20} /> },
    { path: '/admin/education', label: 'Education', icon: <School size={20} /> },
    { path: '/admin/insights', label: 'Certifications', icon: <Award size={20} /> },
    { path: '/admin/achievements', label: 'Achievements & Leadership', icon: <Trophy size={20} /> },
    { path: '/admin/contact', label: 'Contact Settings', icon: <Mail size={20} /> },
    { path: '/admin/toggles', label: 'Section Toggles', icon: <Sliders size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-neutral-900/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
        <div className="p-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#FFD54F] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,213,79,0.4)]">
              <span className="text-black font-black font-syne text-lg">N</span>
            </div>
            <h2 className="text-xl font-syne font-bold tracking-wider text-white">Nishchal</h2>
          </div>
          <p className="text-xs font-mono text-neutral-500 tracking-widest uppercase">Content Studio</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-[inset_2px_0_0_0_#FFD54F]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <div className={`${isActive ? 'text-[#FFD54F]' : 'text-neutral-500'}`}>
                  {link.icon}
                </div>
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-medium text-sm transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
 
      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-screen overflow-y-auto custom-scrollbar bg-linear-to-br from-black via-neutral-950 to-black">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD54F]/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto p-8 md:p-12 relative z-10 min-h-full">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto animate-fade-in">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                  <LayoutDashboard className="text-[#FFD54F] w-10 h-10" />
                </div>
                <h1 className="text-4xl font-syne font-bold text-white mb-4">Welcome back!</h1>
                <p className="text-neutral-400 text-lg">Select a section from the sidebar to start managing your premium portfolio content.</p>
              </div>
            } />
            <Route path="/hero" element={<HeroSettingsManager />} />
            <Route path="/about" element={<AboutSettingsManager />} />
            <Route path="/skills" element={<SkillsSettingsManager />} />
            <Route path="/projects" element={<ProjectsManager />} />
            <Route path="/internships" element={<InternshipsManager />} />
            <Route path="/education" element={<EducationManager />} />
            <Route path="/insights" element={<InsightsManager />} />
            <Route path="/achievements" element={<AchievementsManager />} />
            <Route path="/contact" element={<ContactSettingsManager />} />
            <Route path="/toggles" element={<TogglesManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
