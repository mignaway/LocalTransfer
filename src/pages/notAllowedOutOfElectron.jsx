const NotAllowedOutOfElectron = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-[#0F0F0F]">
        <p className="main-text text-red-400 text-1xl font-medium">
          Not allowed to open the page outside Electron
        </p>
    </div>
  );
};

export default NotAllowedOutOfElectron;