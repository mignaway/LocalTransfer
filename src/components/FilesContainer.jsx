import { useState, useRef, useEffect } from 'react'
import DropLogo from '../assets/images/icons/drop.svg'
import Button from '../components/Button.jsx'
import FileContainer from './FileContainer'
import { bytesToSize } from '../utility/fileUtility'
import ShareLinkPopup from '../components/ShareLinkPopup'
import { useBackend } from '../hooks/useBackend.js'
import { useTransferState } from '../hooks/TransferStatusContext'

function FilesContainer() {
	const { serverIp, shareFiles, removeShare, checkShare, uploadProgress, abortUpload } = useBackend()
	const MAX_FILES_BYTES_SIZE = 4294967296

	const [selectedFiles, setSelectedFiles] = useState([])
	const fileInput = useRef();
	const [totalFileSize, setTotalFileSize] = useState(0);
	const [isDragOver, setIsDragOver] = useState(false)

	const handleFileChange = (e) => {
		if (e.target.files.length > 0) {
			const newTotalSize = Array.from(e.target.files).reduce(
				(acc, file) => acc + file.size,
				0
			);

			setTotalFileSize((oldSize) => oldSize + newTotalSize);
			setSelectedFiles((oldFiles) => [...oldFiles, ...e.target.files]);
		}
	}

	const handleDrop = (e) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		setIsDragOver(false)
		setSelectedFiles(oldFiles => [...oldFiles, ...files])
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const [shareLinkUid, setShareLinkUid] = useState(null)
	const { isSharing, setIsSharing } = useTransferState()


	useEffect(() => {
		const checkDownloaded = async () => {
			try {
				if (isSharing) {
					const response = await checkShare(shareLinkUid);
					if (!response) {
						setIsSharing(false);
					}
				}
			} catch (error) {
				console.error('Error checking download:', error);
			}
		};

		if (isSharing) {
			const intervalId = setInterval(checkDownloaded, 3000);
			return () => clearInterval(intervalId);
		}
	}, [isSharing]);

	const handleShareFiles = async () => {
		if(totalFileSize <= MAX_FILES_BYTES_SIZE){
			const uid = await shareFiles(selectedFiles)
			if (uid) {
				setShareLinkUid(uid)
				setIsSharing(true)
			}
		} else {
			alert("Max files size limit reached, upload less than 4.2GB at time")
		}
		
	}

	const handleCancelTransfer = async () => {
		const deleted = await removeShare(shareLinkUid)
		if(deleted){
			setShareLinkUid(null)
			setIsSharing(false)
		}
	}
	const handleAbortUpload = async () => {
		const aborted = await abortUpload()
	}

	return (
		<>
			{ isSharing && <ShareLinkPopup uid={shareLinkUid} cancelTransfer={() => handleCancelTransfer()} />}
			{selectedFiles.length == 0 ? (
				<div className={`h-full flex-1 flex flex-col border-opacity-30 items-center justify-center border-[2px] rounded-[15px] bg-gradient-to-b from-[#97E89A]/[2%] to-[#97E89A]/[1%] border-dashed border-[#97E89A] transition duration-300  gap-y-7 ${isDragOver ? '!border-opacity-100' : ''}`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragEnter={() => setIsDragOver(true)} onDragLeave={() => setIsDragOver(false)}>
					<div className="flex flex-col items-center gap-y-3.5 pointer-events-none">
						<img src={DropLogo} alt="drop-icon" />
						<span className="main-text font-normal">Drag and drop files here</span>
					</div>
					{!isDragOver && <>
						<div className="flex flex-row gap-x-2.5 items-center">
							<div className="w-[45px] h-[1.5px] bg-white/10"></div>
							<span className="main-text text-sm opacity-30 font-medium">or</span>
							<div className="w-[45px] h-[1.5px] bg-white/10"></div>
						</div>
						<Button text="Select Files" action={() => fileInput.current.click()} />
					</>
					}
				</div>
			) : (
				<div className="relative flex-1 border-[2px] flex flex-col rounded-[15px] p-6 gap-y-5 bg-gradient-to-b from-[#97E89A]/[1%] to-[#97E89A]/[1%] border-dashed border-[#97E89A] overflow-hidden items-center ">
					<div className="flex flex-row justify-between gap-x-2 w-full">
						<div className="main-text max-lg:text-sm flex flex-row gap-x-1 sticky top-0 flex-wrap">
							<span className="opacity-50">Sending</span>
							<span className="font-medium">{selectedFiles.length} Files</span>
							<span className="opacity-50">with a total size of</span>
							<span className="font-medium">{bytesToSize(totalFileSize)}</span>
						</div>
						<span className="main-text text-sm text-white hover:text-red-500 transition duration-150 cursor-pointer whitespace-nowrap" onClick={() => setSelectedFiles([])}>Clear All</span>
					</div>
					{uploadProgress !== null && 
							<div className="w-full h-[7px] bg-white bg-opacity-5 rounded-[100px] justify-start items-start inline-flex">
								<div className="h-full bg-white rounded-[40px]" style={{width: uploadProgress + '%'}}></div>
							</div>	
					}
					<div className={`w-full h-full ${uploadProgress !== null && 'opacity-50'}  overflow-y-auto p-0.5 scrollbar-hide rounded-[15px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 auto-rows-min items-start gap-5 pb-24`}>
						<div className="w-full h-full p-3 lg:p-5 cursor-pointer hover:bg-white/5 border-[2px] border-white/10 line-clamp-2 transition rounded-[10px] justify-start items-center gap-x-4 flex" onClick={() => fileInput.current.click()}>
							<svg className="opacity-50" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.33337 19.9999H31.6667M20 8.33325V31.6666" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="main-text text-medium opacity-50">Add more files</span>
						</div>
						{
							selectedFiles.map((file, i) => {
								if (file) return <FileContainer file={file} key={i} />
							})
						}
					</div>
					{ uploadProgress != null ? 
							<div className="bottom-8 absolute" onClick={handleAbortUpload}><span className="main-text text-red-500 cursor-pointer whitespace-nowrap">Cancel Upload</span></div>
							:
							<div className="w-[220px] bottom-8 absolute"><Button text="Share files" action={handleShareFiles} /></div>
					}
				</div>
			)}
			<input type="file" className="hidden" multiple ref={fileInput} onChange={handleFileChange} />
		</>
	)
}
export default FilesContainer 
