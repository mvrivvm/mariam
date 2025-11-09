import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserIcon, CodeBracketIcon, XMarkIcon } from './icons';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegisterClient: (details: Omit<User, 'id' | 'role'>) => void;
}

const DEV_MASTER_PASSWORD = '123';

const ClientAuth: React.FC<Omit<LoginViewProps, 'onRegisterClient'> & { onRegister: LoginViewProps['onRegisterClient']}> = ({ users, onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.role === UserRole.Client && u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      onLogin(user);
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('A user with this email already exists.');
        return;
    }
    onRegister({ name, email, password, companyName });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-neutral-medium rounded-lg shadow-lg">
      <div className="flex border-b border-gray-300">
        <button onClick={() => setIsLoginView(true)} className={`flex-1 py-2 text-sm font-semibold ${isLoginView ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>Sign In</button>
        <button onClick={() => setIsLoginView(false)} className={`flex-1 py-2 text-sm font-semibold ${!isLoginView ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>Sign Up</button>
      </div>

      {isLoginView ? (
        <form className="space-y-6" onSubmit={handleLogin}>
          <h2 className="text-xl font-bold text-center text-gray-800">Client Sign In</h2>
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
          <button type="submit" className="w-full py-2 px-4 font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary transition">Sign In</button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleRegister}>
          <h2 className="text-xl font-bold text-center text-gray-800">Create Client Account</h2>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
          <input type="text" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
          <button type="submit" className="w-full py-2 px-4 font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary transition">Create Account</button>
        </form>
      )}
      {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}
    </div>
  );
};

const DevAdminModal: React.FC<{ users: User[]; onLogin: (user: User) => void; onClose: () => void; }> = ({ users, onLogin, onClose }) => {
    const [authStep, setAuthStep] = useState<'password' | 'userSelection'>('password');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password === DEV_MASTER_PASSWORD) {
            setAuthStep('userSelection');
        } else {
            setError('Incorrect password.');
        }
    };
    
    const internalUsers = users.filter(u => u.role === UserRole.Admin || u.role === UserRole.Developer);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-neutral-medium rounded-lg shadow-xl w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {authStep === 'password' ? 'Developer & Admin Access' : 'Select Your Profile'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                {authStep === 'password' ? (
                    <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                        <p className="text-sm text-gray-600">Enter the master password to access the developer and admin dashboard.</p>
                         <div>
                            <label htmlFor="master-password" className="sr-only">Master Password</label>
                            <input id="master-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Master Password" required autoFocus className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                        </div>
                         {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button type="submit" className="w-full py-2 px-4 font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary transition">Login</button>
                    </form>
                ) : (
                    <div className="p-6 space-y-3">
                        {internalUsers.map(user => (
                            <button 
                                key={user.id} 
                                onClick={() => onLogin(user)}
                                className="w-full flex items-center gap-3 text-left p-3 bg-neutral-light hover:bg-neutral-extralight rounded-md transition"
                            >
                                <CodeBracketIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onRegisterClient }) => {
  const [view, setView] = useState<'selection' | 'client'>('selection');
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  const PortalButton: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full md:w-64 h-64 p-6 bg-neutral-medium rounded-lg shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all transform">
      {icon}
      <h2 className="text-2xl font-bold text-gray-800 mt-4">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </button>
  );

  const renderSelection = () => (
    <div className="w-full max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        Metallic<span className="text-brand-accent">ERP</span> Support Hub
      </h1>
      <p className="mt-2 mb-12 text-lg text-gray-600">
        Please select your portal to continue.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        <PortalButton
          icon={<UserIcon className="w-16 h-16 text-brand-primary" />}
          title="Client Portal"
          description="Submit new support tickets, view your ticket history, and communicate with our team."
          onClick={() => setView('client')}
        />
        <PortalButton
          icon={<CodeBracketIcon className="w-16 h-16 text-brand-primary" />}
          title="Developer & Admin"
          description="Access the ticket management dashboard and administrative settings."
          onClick={() => setIsDevModalOpen(true)}
        />
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-extralight">
      {view === 'selection' && renderSelection()}
      {view === 'client' && <ClientAuth users={users} onLogin={onLogin} onRegister={onRegisterClient} />}
      {isDevModalOpen && <DevAdminModal users={users} onLogin={onLogin} onClose={() => setIsDevModalOpen(false)} />}
    </div>
  );
};

export default LoginView;