import { createContext, useState } from "react";

export const buttonContext = createContext();

export const ButtonProvider = ({ children, initialValue = "" }) => {
  const [label, setLabel] = useState(initialValue);

  return (
    <buttonContext.Provider value={{ label, setLabel }}>
      {children}
    </buttonContext.Provider>
  );
};
