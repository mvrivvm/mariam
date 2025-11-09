import React, { useState, useCallback } from 'react';
import { User, UserRole } from '../types';
import { UserIcon, CodeBracketIcon, CheckCircleIcon, XMarkIcon } from './icons';

interface SettingsViewProps {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'password' | 'role'>) => void;
  updateUser: (user: User) => void;
  showNotification: (message: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ users, addUser, updateUser, showNotification }) => {
  const [newDeveloper, setNewDeveloper] = useState({ name: '', email: ''});
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, userStateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value } = e.target;
    userStateSetter((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddDeveloper = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeveloper.name || !newDeveloper.email) {
      showNotification('Please fill in all fields for the new developer.');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === newDeveloper.email.toLowerCase())) {
        showNotification('A user with this email already exists.');
        return;
    }
    addUser(newDeveloper);
    setNewDeveloper({ name: '', email: '' });
    showNotification(`Developer "${newDeveloper.name}" created successfully.`);
  }, [newDeveloper, addUser, showNotification, users]);

  const handleUpdateUser = useCallback(() => {
    if (editingUser) {
      updateUser(editingUser);
      showNotification(`User "${editingUser.name}" updated successfully.`);
      setEditingUser(null);
    }
  }, [editingUser, updateUser, showNotification]);

  const UserRow: React.FC<{ user: User }> = ({ user }) => (
    <div className="grid grid-cols-5 gap-4 items-center p-3 hover:bg-neutral-extralight rounded-md">
      <div className="flex items-center gap-3 col-span-2">
        {user.role === UserRole.Client ? <UserIcon className="w-6 h-6 text-brand-primary" /> : <CodeBracketIcon className="w-6 h-6 text-brand-primary" />}
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div>
        {editingUser?.id === user.id ? (
          <select name="role" value={editingUser.role} onChange={(e) => handleInputChange(e, setEditingUser)} className="w-full bg-neutral-light border border-gray-300 rounded-md p-1 text-sm">
            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        ) : (
          <span className="text-sm text-gray-600">{user.role}</span>
        )}
      </div>
      <div>
        {editingUser?.id === user.id ? (
          <input type="text" name="companyName" value={editingUser.companyName || ''} onChange={(e) => handleInputChange(e, setEditingUser)} className="w-full bg-neutral-light border border-gray-300 rounded-md p-1 text-sm" placeholder="Company Name" disabled={editingUser.role !== UserRole.Client} />
        ) : (
          <span className="text-sm text-gray-600">{user.companyName || 'N/A'}</span>
        )}
      </div>
      <div className="flex justify-end gap-2">
        {editingUser?.id === user.id ? (
          <>
            <button onClick={handleUpdateUser} className="text-green-600 hover:text-green-800"><CheckCircleIcon className="w-6 h-6" /></button>
            <button onClick={() => setEditingUser(null)} className="text-red-600 hover:text-red-800"><XMarkIcon className="w-6 h-6" /></button>
          </>
        ) : (
          <button onClick={() => setEditingUser({ ...user })} className="text-sm text-brand-primary hover:underline">Edit</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="bg-neutral-medium p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Developer</h2>
        <form onSubmit={handleAddDeveloper} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input name="name" value={newDeveloper.name} onChange={(e) => handleInputChange(e, setNewDeveloper)} placeholder="Full Name" className="w-full bg-neutral-light border border-neutral-extralight rounded-md p-2 md:col-span-1" required />
          <input name="email" type="email" value={newDeveloper.email} onChange={(e) => handleInputChange(e, setNewDeveloper)} placeholder="Email Address" className="w-full bg-neutral-light border border-neutral-extralight rounded-md p-2 md:col-span-1" required />
          <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition h-10 md:col-span-1">Add Developer</button>
        </form>
      </div>

      <div className="bg-neutral-medium p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Users</h2>
        <div className="grid grid-cols-5 gap-4 font-semibold text-gray-600 text-sm border-b pb-2 mb-2">
          <div className="col-span-2">User</div>
          <div>Role</div>
          <div>Company</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="space-y-1">
          {users.sort((a,b) => a.name.localeCompare(b.name)).map(user => <UserRow key={user.id} user={user} />)}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
