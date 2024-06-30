import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bytesToSize } from '../utility/fileUtility'
import { useBackend } from "../hooks/useBackend";

function DownloadFilesPage() {
    const { serverIp } = useBackend();
    const { uid } = useParams();
    const [filesMetadata, setFilesMetadata] = useState(null);
    const [brokenLinkText, setBrokenLinkText] = useState(null);

    useEffect(()=> {
        console.log(filesMetadata)
    },[filesMetadata])

    const fetchMetadata = async () => {
        try {
            if (!serverIp) {
                console.error('Server IP is null. Cannot fetch metadata.');
                return false;
            }
            const response = await fetch(`${serverIp}:3001/api/getMetadata/${uid}`);
            if (response.ok) {
                const data = await response.json();
                setFilesMetadata(data);
                return true; // Signal successful fetch
            } else {
                console.error('Error fetching metadata:', response.statusText);
                // Here you can handle specific HTTP errors, e.g.:
                if (response.status === 404) {
                    setBrokenLinkText("This link may have expired. Remember it deletes once downloaded! Our new update will include past transfers, sorry for the inconvinent. Checking again, just to be sure...")
                    console.error('Metadata not found for UID:', uid);
                }
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
        return false; // Signal unsuccessful fetch
    };

    const fetchDataWithRetries = async (maxRetries, delay) => {
        let retries = 0;
        while (retries < maxRetries) {
            const success = await fetchMetadata();
            if (success) {
                setBrokenLinkText(null)
                return; // Exit the loop if successful
            }
            retries++;
            await new Promise(resolve => setTimeout(resolve, delay)); // Delay before the next attempt
        }
        setBrokenLinkText("This link may have expired. Remember it deletes once downloaded! Our new update will include past transfers, sorry for the inconvinent.")
        console.error(`Failed to fetch metadata after ${maxRetries} retries.`);
    };

    useEffect(() => {
        if (serverIp) {
            const maxRetries = 5; // Set your desired maximum number of retries
            const retryDelay = 2000; // Set the delay between retries in milliseconds

            fetchDataWithRetries(maxRetries, retryDelay);
        } else {
            console.error('Server IP is null. Cannot fetch metadata.');
        }
    }, [uid, serverIp]);


    async function handleDownload() {
        fetch(`${serverIp}:3001/api/download/${uid}`)
            .then(response => {
                if (response.status === 200) {
                    return response.blob(); // Get the file data as a blob
                } else {
                    throw new Error('API request failed');
                }
            })
            .then(blobData => {
                // Create a URL for the blob and trigger a download
                const url = window.URL.createObjectURL(blobData);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${uid}.zip`; // Specify the filename
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url); 
            })
            .catch(error => {
                console.error(error);
            });
    }
    async function handleSingleDownload(filename) {
        fetch(`${serverIp}:3001/api/downloadSingle/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename }),
        })
            .then(response => {
                if (response.ok) {
                    // Handle the file download in the response
                    return response.blob();
                } else {
                    // Handle the error response
                    return response.json().then(error => {
                        console.error('Error:', error);
                        // Handle the error response
                    });
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename; // Specify the filename for the downloaded file
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                // Handle the fetch error
            });
    }

    return (
        <div className="w-full h-full bg-stone-950 flex justify-center">
            <div className="max-w-[1000px] w-full h-full bg-stone-950 flex-col justify-start items-start gap-5 flex">
                <div className="self-stretch p-[30px] bg-neutral-900 rounded-b-[20px] -justify-start items-start gap-5 flex">
                    <div className="w-[50px] h-[50px] relative">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.7968 14.0625C11.4452 14.0625 9.30617 15.4531 8.35148 17.6L3.26086 29.0531C3.16355 29.25 3.11683 29.468 3.12492 29.6875V42.1875C3.12492 44.7578 5.24211 46.875 7.81242 46.875H42.1874C44.7577 46.875 46.8749 44.7578 46.8749 42.1875V29.6875C46.8683 29.4697 46.8228 29.2549 46.7405 29.0531C45.0421 25.2359 43.3468 21.4172 41.6499 17.6C41.1814 16.5477 40.4182 15.6536 39.4524 15.0258C38.4866 14.398 37.3596 14.0634 36.2077 14.0625H32.8124C32.398 14.0625 32.0006 14.2271 31.7076 14.5201C31.4145 14.8132 31.2499 15.2106 31.2499 15.625C31.2499 16.0394 31.4145 16.4368 31.7076 16.7299C32.0006 17.0229 32.398 17.1875 32.8124 17.1875H36.2062C37.3296 17.1875 38.3374 17.8438 38.7937 18.8688L42.9093 28.125H35.628C34.0655 28.125 32.6405 29.0469 31.9999 30.4719L30.4671 33.8719C30.4006 34.0225 30.2916 34.1504 30.1533 34.2398C30.015 34.3292 29.8536 34.3762 29.689 34.375H20.314C20.1493 34.3762 19.9879 34.3292 19.8497 34.2398C19.7114 34.1504 19.6023 34.0225 19.5359 33.8719L18.0046 30.4719C17.689 29.7733 17.1789 29.1804 16.5352 28.7642C15.8915 28.348 15.1415 28.1261 14.3749 28.125H7.09367L11.2077 18.8688C11.4294 18.3677 11.792 17.9419 12.2515 17.6434C12.7109 17.3448 13.2473 17.1865 13.7952 17.1875H17.189C17.6034 17.1875 18.0008 17.0229 18.2938 16.7299C18.5869 16.4368 18.7515 16.0394 18.7515 15.625C18.7515 15.2106 18.5869 14.8132 18.2938 14.5201C18.0008 14.2271 17.6034 14.0625 17.189 14.0625H13.7968Z" fill="white" />
                            <path d="M25.0014 3.125C24.587 3.125 24.1895 3.28962 23.8965 3.58265C23.6035 3.87567 23.4389 4.2731 23.4389 4.6875V24.3531L21.4186 22.3328C20.6842 21.6219 19.8045 21.7375 19.2092 22.3328C18.9163 22.6258 18.7517 23.0232 18.7517 23.4375C18.7517 23.8518 18.9163 24.2492 19.2092 24.5422L23.8967 29.2297C24.1897 29.5226 24.5871 29.6872 25.0014 29.6872C25.4157 29.6872 25.8131 29.5226 26.1061 29.2297L30.7936 24.5422C31.0782 24.2475 31.2357 23.8528 31.2321 23.4431C31.2286 23.0334 31.0642 22.6415 30.7745 22.3518C30.4848 22.0621 30.0929 21.8978 29.6833 21.8943C29.2736 21.8907 28.8789 22.0482 28.5842 22.3328L26.5639 24.3531V4.6875C26.5639 4.2731 26.3993 3.87567 26.1062 3.58265C25.8132 3.28962 25.4158 3.125 25.0014 3.125Z" fill="white" />
                        </svg>
                    </div>
                    <div className="w-[1px] h-full bg-white/30"></div>
                    <div className="h-full flex-col justify-center items-start gap-2.5 flex">
                        {brokenLinkText == null ?
                            <>
                                <h1 className="text-white text-base font-medium">
                                    <span classname="opacity-50">Files count: </span>
                                    <span className="font-bold">{filesMetadata ? filesMetadata.length : '0'}</span>
                                </h1>
                                <h1 className="text-white text-base font-medium">
                                    <span className="opacity-50">Total size: </span>
                                    <span className="font-bold">{filesMetadata ? bytesToSize(filesMetadata.reduce((acc, file) => acc + file.size, 0)) : '0KB'}</span>
                                </h1>
                            </>
                            :
                            <div className="h-full flex flex-col justify-center"><h1 className="main-text opacity-75 text-base text-medium">{brokenLinkText}</h1></div>
                        }
                        </div>
                </div>
                <div className="self-stretch grow shrink basis-0 px-[15px] flex-col justify-start items-start gap-2.5 flex">
                    <div className="w-full p-[15px] bg-white bg-opacity-5 rounded-[20px] flex-col justify-start items-start gap-[15px] flex">
                        {filesMetadata && filesMetadata.map((file, i) => (
                            <div className="self-stretch px-[15px] py-4 bg-white bg-opacity-5 rounded-[10px] justify-start items-center gap-2.5 flex" key={i}>
                                <div className="w-10 h-10 relative">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M25 11.25H30.6463C30.6957 11.25 30.744 11.2354 30.7851 11.208C30.8262 11.1807 30.8583 11.1417 30.8773 11.0961C30.8963 11.0505 30.9013 11.0003 30.8918 10.9518C30.8823 10.9033 30.8586 10.8588 30.8238 10.8237L24.175 4.17499C24.14 4.14017 24.0954 4.1165 24.047 4.10698C23.9985 4.09746 23.9483 4.10252 23.9027 4.12151C23.8571 4.1405 23.8181 4.17257 23.7907 4.21368C23.7633 4.25479 23.7487 4.30309 23.7488 4.35249V9.99999C23.7488 10.3315 23.8805 10.6495 24.1149 10.8839C24.3493 11.1183 24.6685 11.25 25 11.25Z" fill="white" />
                                        <path d="M31.25 13.75H25C24.0054 13.75 23.0516 13.3549 22.3483 12.6517C21.6451 11.9484 21.25 10.9946 21.25 10V3.75375C21.2505 3.58988 21.2187 3.42752 21.1563 3.27597C21.094 3.12441 21.0024 2.98664 20.8868 2.87054C20.7711 2.75443 20.6337 2.66227 20.4824 2.59933C20.3311 2.53639 20.1689 2.50391 20.005 2.50375C17.0775 2.5 10 2.5 10 2.5C9.33696 2.5 8.70107 2.76339 8.23223 3.23223C7.76339 3.70107 7.5 4.33696 7.5 5V35C7.5 35.663 7.76339 36.2989 8.23223 36.7678C8.70107 37.2366 9.33696 37.5 10 37.5H30C30.663 37.5 31.2989 37.2366 31.7678 36.7678C32.2366 36.2989 32.5 35.663 32.5 35V15C32.5 14.6685 32.3683 14.3505 32.1339 14.1161C31.8995 13.8817 31.5815 13.75 31.25 13.75Z" fill="white" />
                                    </svg>
                                </div>
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-[5px] flex">
                                    <div className="text-white text-sm font-medium font-['Inter']">{file.name}</div>
                                    <div className="text-white text-opacity-75 text-sm font-medium font-['Inter']">{bytesToSize(file.size)}</div>
                                </div>
                                <div className="p-2.5 bg-green-500 bg-opacity-10 rounded-[10px] justify-start items-center gap-2.5 flex cursor-pointer" onClick={() => handleSingleDownload(file.name)}>
                                    <div className="w-[15px] h-[15px] relative">
                                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.875 8.25C13.7092 8.25 13.5503 8.31585 13.4331 8.43306C13.3158 8.55027 13.25 8.70924 13.25 8.875V13.25H2V8.875C2 8.70924 1.93415 8.55027 1.81694 8.43306C1.69973 8.31585 1.54076 8.25 1.375 8.25C1.20924 8.25 1.05027 8.31585 0.933058 8.43306C0.815848 8.55027 0.75 8.70924 0.75 8.875V13.875C0.75 14.0408 0.815848 14.1997 0.933058 14.3169C1.05027 14.4342 1.20924 14.5 1.375 14.5H13.875C14.0408 14.5 14.1997 14.4342 14.3169 14.3169C14.4342 14.1997 14.5 14.0408 14.5 13.875V8.875C14.5 8.70924 14.4342 8.55027 14.3169 8.43306C14.1997 8.31585 14.0408 8.25 13.875 8.25Z" fill="#41D147" />
                                            <path d="M7.62511 2C7.45935 2 7.30038 2.06585 7.18317 2.18306C7.06596 2.30027 7.00011 2.45924 7.00011 2.625V9.86625L5.56699 8.43313C5.50933 8.37343 5.44037 8.32582 5.36411 8.29306C5.28786 8.26031 5.20585 8.24306 5.12286 8.24234C5.03988 8.24162 4.95758 8.25744 4.88077 8.28886C4.80396 8.32029 4.73417 8.3667 4.67549 8.42538C4.61681 8.48406 4.5704 8.55384 4.53897 8.63065C4.50755 8.70746 4.49173 8.78976 4.49246 8.87275C4.49318 8.95574 4.51042 9.03775 4.54317 9.114C4.57593 9.19026 4.62354 9.25922 4.68324 9.31687L7.18324 11.8169C7.24142 11.8748 7.31045 11.9207 7.38636 11.9519C7.46195 11.9836 7.54312 12 7.62511 12C7.7071 12 7.78827 11.9836 7.86386 11.9519C7.93978 11.9207 8.0088 11.8748 8.06699 11.8169L10.567 9.31687C10.6808 9.199 10.7438 9.04112 10.7424 8.87725C10.741 8.71338 10.6753 8.55662 10.5594 8.44074C10.4435 8.32486 10.2867 8.25913 10.1229 8.2577C9.95899 8.25628 9.80111 8.31928 9.68324 8.43313L8.25011 9.86625V2.625C8.25011 2.45924 8.18426 2.30027 8.06705 2.18306C7.94984 2.06585 7.79087 2 7.62511 2Z" fill="#41D147" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
               {brokenLinkText == null &&
                <div className="absolute max-w-[300px] w-full bottom-10 left-10 right-10 mx-auto px-6 py-3 bg-white rounded-xl shadow flex-col justify-center items-center gap-6 flex cursor-pointer" onClick={() => handleDownload()}>
                    <div><span className="text-black text-opacity-50 text-lg font-medium font-['Inter']">(ZIP) </span><span className="text-black text-lg font-medium font-['Inter']">Download All</span></div>
                </div>}
            </div>

        </div>
    );
}

export default DownloadFilesPage;