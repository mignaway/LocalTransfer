import { useState, useRef, useEffect } from 'react'
import DropLogo from '../assets/images/icons/drop.svg'
import Button from '../components/Button.jsx'
import FileContainer from './FileContainer'
import { bytesToSize } from '../utility/fileUtility'
import ShareLinkPopup from '../components/ShareLinkPopup'
import { useBackend } from '../hooks/useBackend.js'
import { useTransferState } from '../hooks/TransferStatusContext'

function FilesContainer() {
	const {shareFiles, removeShare, checkShare, uploadProgress, abortUpload } = useBackend()
	const MAX_FILES_BYTES_SIZE = 4294967296

	const [selectedFiles, setSelectedFiles] = useState([])
	const fileInput = useRef();
	const [totalFileSize, setTotalFileSize] = useState(0);
	const [isDragOver, setIsDragOver] = useState(false)

	// AlLOW FILES REUPLOAD AND FIX:  important reset file input each upload
	useEffect(()=>{
		if (fileInput.current) {
			fileInput.current.value = '';
		}
	},[selectedFiles])

	const handleFileChange = (e) => {
		if (e.target.files.length > 0) {
			// Update New Total Size & Files
			updateFileSize(e.target.files)
			setSelectedFiles((oldFiles) => [...oldFiles, ...e.target.files]);	
		}
	}

	const updateFileSize = (files) => {
		const newTotalSize = Array.from(files).reduce(
				(acc, file) => acc + file.size,
				0
			);
		setTotalFileSize((oldSize) => oldSize + newTotalSize);
	}

	const handleDrop = (e) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		// Reset Drag Over State
		setIsDragOver(false)
		// Update New Total Size
		updateFileSize(files)
		// Upadte Files
		setSelectedFiles(oldFiles => [...oldFiles, ...files])
	};

	const handleDragOver = (e) => {
		setIsDragOver(true)
		e.preventDefault();
	};

	const handleClearFiles = (e) => {
		setTotalFileSize(0)	
		setSelectedFiles([])
		e.preventDefault();
	}

	// Function to handle file removal
	const handleRemoveFile = (index) => {
		setSelectedFiles((prevFiles) => {
			const updatedFiles = prevFiles.filter((_, i) => i !== index);
			// Update the total file size
			const removedFile = prevFiles[index];
			if (removedFile) {
				console.log(`Removing file: ${removedFile.name}, size: ${removedFile.size}`);
				setTotalFileSize((prevTotalSize) => prevTotalSize - removedFile.size / 2);
			}

			return updatedFiles;
		});	
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
		// Check uplaod size limit before sharing
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
		// Call backend to remove the transfer
		const deleted = await removeShare(shareLinkUid)
		if(deleted){
			// Reset states
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
				<div className={`relative flex-1 border-[2px] flex flex-col rounded-[15px] p-6 gap-y-5 bg-gradient-to-b from-[#97E89A]/[1%] to-[#97E89A]/[1%] border-dashed border-[#97E89A] overflow-hidden items-center`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragEnter={() => setIsDragOver(true)} onDragLeave={() => setIsDragOver(false)}>
					<div className="flex flex-row justify-between gap-x-2 w-full">
						<div className="main-text max-lg:text-sm flex flex-row gap-x-1 sticky top-0 flex-wrap">
							<span className="opacity-50">Sending</span>
							<span className="font-medium">{selectedFiles.length} Files</span>
							<span className="opacity-50">with a total size of</span>
							<span className="font-medium">{bytesToSize(totalFileSize)}</span>
						</div>
						<span className="main-text text-sm text-white hover:text-red-500 transition duration-150 cursor-pointer whitespace-nowrap" onClick={handleClearFiles}>Clear All</span>
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
								if (file) return <FileContainer file={file} key={i} handleRemoveFile={()=> handleRemoveFile(i)} />
							})
						}
						{
							isDragOver && 
								<div className="pointer-events-none w-full h-full p-3 lg:p-5 cursor-pointer hover:bg-white/5 border-[2px] border-dashed border-white/10 line-clamp-2 transition rounded-[10px] justify-start items-center gap-x-4 flex" onClick={() => fileInput.current.click()}>
										<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g opacity="0.50">
												<path d="M25.0356 20.9565L34.5044 26.4796L30.4621 27.6353L33.3514 32.6403L30.9965 34L28.1071 28.9964L25.0845 31.9197L25.0356 20.9565ZM22.3162 11.4387H25.0356V14.1581H31.834C32.1946 14.1581 32.5405 14.3014 32.7955 14.5564C33.0505 14.8113 33.1937 15.1572 33.1937 15.5178V20.9565H30.4743V16.8775H16.8775V30.4743H22.3162V33.1937H15.5178C15.1572 33.1937 14.8113 33.0505 14.5564 32.7955C14.3014 32.5405 14.1581 32.1946 14.1581 31.834V25.0356H11.4387V22.3162H14.1581V15.5178C14.1581 15.1572 14.3014 14.8113 14.5564 14.5564C14.8113 14.3014 15.1572 14.1581 15.5178 14.1581H22.3162V11.4387ZM8.71937 22.3162V25.0356H6V22.3162H8.71937ZM8.71937 16.8775V19.5969H6V16.8775H8.71937ZM8.71937 11.4387V14.1581H6V11.4387H8.71937ZM8.71937 6V8.71937H6V6H8.71937ZM14.1581 6V8.71937H11.4387V6H14.1581ZM19.5969 6V8.71937H16.8775V6H19.5969ZM25.0356 6V8.71937H22.3162V6H25.0356Z" fill="white" />
											</g>
										</svg>

									<span className="main-text text-medium opacity-50">Drop File</span>

								</div>
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
