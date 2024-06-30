import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useBackend } from './useBackend';

const useBackendSocket = () => {
  const [socket, setSocket] = useState(null);
  const [shareLinks, setShareLinks] = useState(null);
  const [oldShareLinks, setOldShareLinks] = useState(null);
  const {serverIp} = useBackend()

  useEffect(() => {
    // Initialize the WebSocket connection wSERVER_URLhen the component mounts
    const socket = socketIOClient(`${serverIp}:3001`);
    setSocket(socket);

    socket.on('shareLinks', (newShareLinks) => {
      setShareLinks(newShareLinks);
    });
    socket.on('oldShareLinks', (oldShareLinks) => {
      setOldShareLinks(oldShareLinks);
    });
    socket.on('shutdown', () => {
      alertAndCloseWindow()
    });


    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [serverIp]);

  const emitEvent = (eventName, data) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  };

  return { emitEvent, shareLinks, oldShareLinks };
};

function alertAndCloseWindow() {
  alert("Shutting down");
  window.close()
}

export default useBackendSocket;