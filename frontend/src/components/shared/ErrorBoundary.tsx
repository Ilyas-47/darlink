import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          margin: '20px',
          backgroundColor: '#FFF5F5',
          border: '2px solid #FEB2B2',
          borderRadius: '12px',
          fontFamily: 'monospace',
          color: '#C53030'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>🚨 Une erreur est survenue (UI Crash)</h2>
          <p style={{ fontWeight: 'bold' }}>{this.state.error?.toString()}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '15px' }}>
            <summary style={{ cursor: 'pointer', color: '#2B6CB0', fontWeight: 'bold' }}>
              Afficher la pile d'exécution (Stacktrace)
            </summary>
            <div style={{ marginTop: '10px', fontSize: '0.85rem', lineHeight: '1.4', backgroundColor: '#FFF', padding: '15px', borderRadius: '6px', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
              {this.state.errorInfo?.componentStack}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#C53030',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
