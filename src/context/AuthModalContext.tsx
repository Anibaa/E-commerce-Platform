'use client'
import { createContext, useContext, useState, ReactNode } from 'react';
import LoginModal from '@/components/LoginModal';

interface AuthModalContextType {
  showLoginModal: (message?: string) => void;
  hideLoginModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>('');

  const showLoginModal = (customMessage?: string) => {
    setMessage(customMessage || 'Please log in to continue');
    setIsOpen(true);
  };

  const hideLoginModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ showLoginModal, hideLoginModal }}>
      {children}
      <LoginModal
        isOpen={isOpen}
        onClose={hideLoginModal}
        message={message}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
} 