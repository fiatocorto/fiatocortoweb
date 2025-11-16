export default function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <img 
          src="/resources/Nero.png" 
          alt="Fiato Corto" 
          className="h-20 w-auto mx-auto mb-6 animate-pulse"
        />
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
        <p className="text-muted">Caricamento...</p>
      </div>
    </div>
  );
}

