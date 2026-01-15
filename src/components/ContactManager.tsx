'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Star,
  Users,
  Building2,
  Calendar,
  Filter,
  X,
  User,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Briefcase
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string; // Imperial: Designation
  company: string; // Imperial: Affiliation
  email: string;
  phone: string;
  category: 'network' | 'personal' | 'client' | 'team';
  tags: string[];
  lastContact: string;
  notes?: string;
  avatar?: string;
}

const CATEGORIES = [
  { id: 'network', name: 'Strategic Network', color: 'bg-emerald-500' },
  { id: 'personal', name: 'Inner Circle', color: 'bg-indigo-500' },
  { id: 'client', name: 'Contractors', color: 'bg-amber-500' },
  { id: 'team', name: 'Squadron', color: 'bg-blue-500' },
];

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form State
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: '',
    role: '',
    company: '',
    email: '',
    category: 'network',
    tags: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('lifeos-contacts');
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lifeos-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = () => {
    if (!newContact.name) return;
    
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      role: newContact.role || 'Operative',
      company: newContact.company || 'Unaffiliated',
      email: newContact.email || '',
      phone: newContact.phone || '',
      category: newContact.category as any || 'network',
      tags: newContact.tags || [],
      lastContact: new Date().toISOString(),
      notes: newContact.notes || '',
      avatar: newContact.avatar
    };

    setContacts([contact, ...contacts]);
    setShowAddModal(false);
    setNewContact({ name: '', role: '', company: '', category: 'network' });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          contact.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
             ALLIANCE <span className="text-indigo-500">NETWORK</span>
          </h1>
          <p className="text-zinc-500 text-lg mt-1 font-mono uppercase tracking-tight">Diplomatic relations and assets</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input 
                 type="text"
                 placeholder="SCAN DATABASE..."
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 w-64 text-xs font-bold font-mono tracking-wide"
              />
           </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20 uppercase tracking-wider text-sm"
          >
            <Plus size={18} />
            REGISTER ASSET
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === 'all' ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}
         >
            All Assets
         </button>
         {CATEGORIES.map(category => (
            <button
               key={category.id}
               onClick={() => setSelectedCategory(category.id)}
               className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === category.id ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}
            >
               {category.name}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredContacts.map((contact, idx) => (
            <motion.div
               key={contact.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.05 }}
               onClick={() => setSelectedContact(contact)}
               className="group bg-zinc-950 border border-zinc-900 rounded-3xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="text-zinc-500 hover:text-white" size={20} />
               </div>

               <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl font-black text-indigo-500 group-hover:scale-105 transition-transform">
                     {contact.name.charAt(0)}
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                        {contact.name}
                     </h3>
                     <div className="flex items-center gap-2 mt-1">
                        <Briefcase size={12} className="text-zinc-500" />
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{contact.role}</p>
                     </div>
                     <div className="flex items-center gap-2 mt-1">
                         <Building2 size={12} className="text-zinc-500" />
                         <p className="text-xs font-mono text-zinc-600 truncate max-w-[150px]">{contact.company}</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center gap-3">
                     <Mail size={16} className="text-zinc-500" />
                     <span className="text-xs font-mono text-zinc-400 truncate">Signal</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center gap-3">
                     <Phone size={16} className="text-zinc-500" />
                     <span className="text-xs font-mono text-zinc-400 truncate">Voice</span>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                  <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                     contact.category === 'network' ? 'bg-emerald-500/10 text-emerald-500' :
                     contact.category === 'personal' ? 'bg-indigo-500/10 text-indigo-500' :
                     'bg-zinc-800 text-zinc-500'
                  }`}>
                     {CATEGORIES.find(c => c.id === contact.category)?.name || contact.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600">
                     Last Comms: {new Date(contact.lastContact).toLocaleDateString()}
                  </span>
               </div>
            </motion.div>
         ))}
         
         <button
             onClick={() => setShowAddModal(true)}
             className="min-h-[250px] rounded-3xl border-2 border-dashed border-zinc-900 hover:border-indigo-500/50 hover:bg-zinc-900/30 transition-all flex flex-col items-center justify-center gap-4 group"
          >
             <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-indigo-500 group-hover:text-white text-zinc-600 transition-all">
                <Plus size={32} />
             </div>
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm group-hover:text-white">New Operative</p>
          </button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               onClick={e => e.stopPropagation()}
               className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
               <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Register New Asset</h2>
               
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Operative Name</label>
                        <input 
                           value={newContact.name}
                           onChange={e => setNewContact({...newContact, name: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-700"
                           placeholder="FULL DESIGNATION"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Role / Rank</label>
                        <input 
                           value={newContact.role}
                           onChange={e => setNewContact({...newContact, role: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-700"
                           placeholder="TITLE"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Affiliation</label>
                     <input 
                        value={newContact.company}
                        onChange={e => setNewContact({...newContact, company: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-700"
                        placeholder="ORGANIZATION"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Comms (Email)</label>
                        <input 
                           value={newContact.email}
                           onChange={e => setNewContact({...newContact, email: e.target.value})}
                           className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-700 font-mono text-sm"
                           placeholder="secure@channel.net"
                        />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Classification</label>
                         <select 
                            value={newContact.category}
                            onChange={e => setNewContact({...newContact, category: e.target.value as any})}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                         >
                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                         </select>
                     </div>
                  </div>

                  <button 
                     onClick={addContact}
                     className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all mt-4"
                  >
                     Confirm Registration
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
