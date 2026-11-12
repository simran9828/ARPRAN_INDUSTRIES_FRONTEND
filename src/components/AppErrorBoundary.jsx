import React from 'react';

export default class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidMount() {
    document.getElementById('root')?.setAttribute('data-app-ready', 'true');
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Website failed to render:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-800">
          <h1 className="text-2xl font-semibold">This page could not be loaded</h1>
          <p className="mt-3 max-w-lg text-sm text-slate-600">
            A temporary loading error interrupted the website. Please try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[#0A4E9B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073b77]"
          >
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
