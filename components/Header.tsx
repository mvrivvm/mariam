import React from 'react';
import { User, UserRole } from '../types';
import { LogoutIcon, UserIcon, CodeBracketIcon, Cog6ToothIcon } from './icons';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    currentView: 'dashboard' | 'settings';
    onNavigate: (view: 'dashboard' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, onNavigate }) => {
    
    const NavButton: React.FC<{
        onClick: () => void;
        isActive: boolean;
        children: React.ReactNode;
        title: string;
    }> = ({ onClick, isActive, children, title }) => (
        <button
            onClick={onClick}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                isActive ? 'bg-brand-primary/20 text-brand-primary' : 'text-gray-500 hover:bg-neutral-extralight'
            }`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <header className="bg-neutral-medium shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Metallic<span className="text-brand-accent">ERP</span> Support
                        </h1>
                        {user.role === UserRole.Admin && (
                             <div className="text-lg font-semibold text-gray-600">
                                {currentView === 'dashboard' ? 'Developer Dashboard' : 'Admin Settings'}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-neutral-light p-2 rounded-lg">
                            {user.role === 'Client' ? <UserIcon className="w-5 h-5 text-brand-primary" /> : <CodeBracketIcon className="w-5 h-5 text-brand-primary" />}
                            <div>
                                <span className="font-semibold text-gray-800">{user.name}</span>
                                <span className="text-xs text-gray-500 block">
                                  {user.role === UserRole.Client && user.companyName ? `${user.companyName} - ${user.role}` : user.role}
                                </span>
                            </div>
                        </div>

                        {user.role === UserRole.Admin && (
                           <div className="flex items-center space-x-2 bg-neutral-light p-1 rounded-lg">
                               <NavButton onClick={() => onNavigate('dashboard')} isActive={currentView === 'dashboard'} title="Dashboard">
                                   <CodeBracketIcon className="w-5 h-5" />
                               </NavButton>
                                <NavButton onClick={() => onNavigate('settings')} isActive={currentView === 'settings'} title="Settings">
                                   <Cog6ToothIcon className="w-5 h-5" />
                               </NavButton>
                           </div>
                        )}

                        <button
                            onClick={onLogout}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition text-gray-500 hover:bg-neutral-extralight"
                            title="Logout"
                        >
                            <LogoutIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
