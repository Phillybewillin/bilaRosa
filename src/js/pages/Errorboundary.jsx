import React, { Component } from 'react';
import './errorboundary.scss';
//import logo from '../../assets/LOGGO3.png';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Optionally send to an error tracking service here
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const isNotFound = error?.response?.status === 404;

      return (
        <div className="error-boundary">
          <div className="error-card">
            <h1 className="error-title">
              {isNotFound ? '404 - Not Found' : 'Something went wrong'}
            </h1>
            <p className="error-message">
              {isNotFound
                ? 'The requested resource could not be found.'
                : 'An unexpected error has occurred.'}
            </p>

            {error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{error.toString()}</pre>
                <pre>"SCREENSHORT THIS ERROR AND REPORT IT TO OUR DISCORD"</pre>
              </details>
            )}

            <button className="refresh-button" onClick={this.handleRefresh}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
