import React from "react";

export const GlobalContext = React.createContext({});

export class GlobalContextProvider extends React.Component {
  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.props.props,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

// create the consumer as higher order component
export const withGlobalContext = (ChildComponent) => (props) => (
  <GlobalContext.Consumer>
    {(context) => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
