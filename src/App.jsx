import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import Sidebar from './components/Sidebar'
import SendContent from './pages/SendContent'
	
function App() {
  return (
    <div id="App" className="h-full w-full flex flex-row gap-8 p-8">
      <Sidebar />
      <Routes>
        <Route path="/send" element={<SendContent />} />
        <Route path='/' element={<Navigate to="/send" /> } />
      </Routes>
    </div>
  )
}

export default App
