import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

type AdminLayoutProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminLayout({ title = 'Area Admin', actions, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div className="flex flex-col min-h-screen transition-[margin] duration-200 md:ml-[280px]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-3 md:hidden">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg border border-gray-200 text-primary hover:bg-gray-50 transition-colors"
            aria-label={sidebarOpen ? 'Chiudi menu' : 'Apri menu'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1 font-title text-lg font-bold truncate">{title}</div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : <span className="w-8" />}
        </header>

        <main className="flex-1 px-4 pb-10 pt-20 md:px-8 md:pb-12 md:pt-10">
          {title && (
            <div className="hidden md:flex items-center justify-between gap-4 mb-6">
              <h1 className="font-title text-4xl font-bold">{title}</h1>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}

          {/* Mobile actions slot */}
          {actions && (
            <div className="md:hidden mb-4 flex justify-end">
              <div className="flex items-center gap-2">{actions}</div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

