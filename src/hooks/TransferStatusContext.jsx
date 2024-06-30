import { createContext, useState, useContext } from 'react';

const TransferStatusContext = createContext();

export function TransferStatusProvider({ children }) {
  const [isSharing, setIsSharing] = useState(false);

  return (
    <TransferStatusContext.Provider value={{ isSharing, setIsSharing }}>
      {children}
    </TransferStatusContext.Provider>
  );
}

export function useTransferState() {
  return useContext(TransferStatusContext);
}