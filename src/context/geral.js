import * as React from "react";
import PropTypes from "prop-types";

const GeralContext = React.createContext();

export function GeralProvider({ children }) {
  const [contextGeral, setContextGeral] = React.useState({ nodes: [] });

  return (
    <GeralContext.Provider value={{ contextGeral, setContextGeral }}>
      {children}
    </GeralContext.Provider>
  );
}

GeralProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useContextGeral() {
  return React.useContext(GeralContext);
}