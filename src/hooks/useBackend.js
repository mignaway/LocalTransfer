import { useState, useEffect, useMemo } from "react";
import axios from 'axios';

export const useBackend = () => {
  const uploadController = new AbortController();
  const [serverIp, setServerIp] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const ipAddress = getIpAddressFromUrl(window.location.href);
  const [fetchInterval, setFetchInterval] = useState(5000);
  const fetchIntervalInitial = 10000
  const fetchIntervalAfterSuccess = 60000

  const fetchServerIp = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:3001/api/getServerIp`);
      if (response.ok) {
        const data = await response.json();
        setServerIp(`http://${data.hostAddress}`);
        setFetchInterval(fetchIntervalAfterSuccess);
      } else {
        setServerIp(null);
        setFetchInterval(fetchIntervalInitial);
        console.error('Error fetching server IP:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching server IP:', error);
      setServerIp(null);
      setFetchInterval(fetchIntervalInitial);
    }
  }
  const memoizedFetchServerIp = useMemo(() => fetchServerIp, [fetchInterval]);
  useEffect(() => {
    // Initial fetch
    memoizedFetchServerIp();

    // Periodic fetching using setInterval
    const intervalId = setInterval(fetchServerIp, fetchInterval);

    return () => {
      // Clean up the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, [fetchInterval]);
  
  const shareFiles = async (files) => {
    if (files.length == 0 || serverIp == null) {
      // Handle the case where serverIp is still null
      return null 
    }
    try {
      // if has path it means that is the server who uploaded, otherwise files them to server
      if ('path' in files[0]) {
        const uid = await createShareLink(files,ipAddress)
        return uid 
      } else {
        const uid = await uploadAndCreateShareLink(files,ipAddress)
        return uid 
      }
    } catch (error) {
      console.log("Error when creating share link:", error)
      return null 
    }

  };
  async function removeShare(uid) {
    try {
      const response = await fetch(`${serverIp}:3001/api/removeShareLink/${uid}`);
      return response.status === 200
    } catch (err) {
      console.log(err)
    }
  }
  async function checkShare(uid) {
    try {
      const response = await fetch(`${serverIp}:3001/api/checkShareLink/${uid}`);
      return response.status === 200
    } catch (err) {
      console.log(err)
    }
  }

  async function handleShutdown() {
      fetch(`${serverIp}:3001/api/shutdown`, {method: 'POST'});
  }
  async function abortUpload() {
    uploadController.abort()
    setUploadProgress(null)
  }

  async function uploadAndCreateShareLink(files, ipAddress) {
    let formData = new FormData()
    Object.keys(files).forEach(key => {
      const file = files[key];
      formData.append(file.name, file);
      formData.append("date", formatDate(new Date()))
    });
    const response = await axios.post(`http://${ipAddress}:3001/api/uploadAndCreateShareLink`, formData,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: uploadController.signal,
        onUploadProgress: progressEvent => {
          setUploadProgress(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
        }
      })
      .then((data) => { 
        setUploadProgress(null)
        return data
      })
    return response.data.uid
  } 

  return {serverIp, shareFiles, removeShare, checkShare, handleShutdown, uploadProgress, abortUpload};
};




async function createShareLink(files,ipAddress) {
  const fileData = files.map((file) => {
    return {
      name: file.name,
      path: file.path,
      type: file.type,
      size: file.size,
      data: formatDate(new Date())
    };
  });
  const response = await axios.post(`http://${ipAddress}:3001/api/createShareLink`, { files: fileData })
    .then((data) => { return data })
  return response.data.uid
}



function getIpAddressFromUrl(url) {
  try {
    // Try to parse the URL
    const urlObj = new URL(url);
    const ipAddress = urlObj.hostname
    return ipAddress === null || ipAddress === undefined || ipAddress === '' ? 'localhost' : ipAddress;
  } catch (error) {
    return 'localhost';
  }
}

function formatDate(date) {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  // Format the date using the specified options
  return date.toLocaleString('en-US', options).replace(',', ' · ');
}