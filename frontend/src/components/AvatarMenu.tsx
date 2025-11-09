import { Link } from 'react-router-dom';

interface AvatarMenuProps {
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}

export default function AvatarMenu({ user, onLogout }: AvatarMenuProps) {
  return (
    <Link
      to="/account"
      className="px-4 py-2 rounded-full hover:text-accent transition-colors text-sm"
    >
      Il mio account
    </Link>
  );
}

