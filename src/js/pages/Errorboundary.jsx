import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Customize the fallback UI based on the error type or status
      if (this.state.error?.response?.status === 404) {
        return <h2>Not Found - This resource is not yet available.</h2>;
      }
      
      // Generic fallback UI for other errors
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
