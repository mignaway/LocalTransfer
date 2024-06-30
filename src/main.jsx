import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './assets/css/index.css';
import './assets/css/output.css';
import DownloadFilesPage from './pages/DownloadFilesPage.jsx';
import { TransferStatusProvider } from './hooks/TransferStatusContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TransferStatusProvider>
      <Router>
        <Routes>
          <Route exact path='/d/:uid/' element={<DownloadFilesPage />} />
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </TransferStatusProvider>
  </React.StrictMode>
);

/*
{globalThis.IN_DESKTOP_ENV ?
	<BrowserRouter>
		<Routes>
			<Route path='/d/:uid' element={<DownloadFilesPage />} />
			<Route path='/*' element={<App />} />
		</Routes>
	</BrowserRouter>
: <NotAllowedOutOfElectron />
}
*/