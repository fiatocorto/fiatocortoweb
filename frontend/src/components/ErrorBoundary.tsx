import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center">
            <h1 className="font-title text-4xl font-bold mb-4 text-primary">
              Qualcosa è andato storto
            </h1>
            <p className="text-muted mb-4">
              {this.state.error?.message || 'Si è verificato un errore'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Ricarica la pagina
            </button>
            <details className="mt-4 text-left max-w-2xl">
              <summary className="cursor-pointer text-muted">Dettagli errore</summary>
              <pre className="mt-2 p-4 bg-white rounded text-xs overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

