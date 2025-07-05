import React from "react";

class ErrorBoundary extends React.Component {
	state = { hasError: false }; // Initial state should be false

	static getDerivedStateFromError(error) {
		// Update state to show fallback UI
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		console.error("Error caught by ErrorBoundary:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback // Optional fallback prop
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
