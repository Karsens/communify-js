import React from "react";
import { Text } from "react-native";
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.table(error, info.componentStack);
  }

  render() {
    return this.state.hasError ? <Text>Error!</Text> : this.props.children;
  }
}

export default ErrorBoundary;
