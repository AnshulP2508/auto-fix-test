import Router from 'next/router';
import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      Router.reload();
    }
  }

  render() {
    return this.state.failed ? <p>Recovering...</p> : this.props.children;
  }
}
