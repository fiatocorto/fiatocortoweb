import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';

interface AvatarMenuProps {
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}

export default function AvatarMenu({ user, onLogout }: AvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-primary font-bold hover:bg-accent/90 transition-colors"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-primary">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
          <Link
            to="/account"
            className="flex items-center px-4 py-2 text-sm text-primary hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Account
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-sm text-primary hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              Dashboard Admin
            </Link>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

