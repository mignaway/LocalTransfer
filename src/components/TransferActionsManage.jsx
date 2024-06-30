import { useState } from 'react';
import useComponentVisible from '../hooks/useComponentVisible'
import OpenLinkSVG from '../assets/images/icons/openlink.svg'
import CancelRedSVG from '../assets/images/icons/cancel_red.svg'
import { useBackend } from '../hooks/useBackend';
import DownloadIconSVG from '../assets/images/icons/download_green.svg'

function TransferActionsManage({uid,active}) {
    const { serverIp, removeShare } = useBackend()
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
    const handleClick = () => {
        setIsComponentVisible(old => !old)
    }
    const handleCancelTransfer = () => {
        removeShare(uid)
    }
    return (
        <>
            {active ?
                <a href={`${serverIp}:3000/#/d/${uid}`} target="_blank" rel="noreferrer" className="cursor-pointer p-[1px] rounded-xl bg-gradient-to-b from-[#41d147]/50 to-[#41d147]/5 hover:from-[#41d147]/80 hover:to-[#41d147]/20">
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-3 rounded-xl bg-gradient-to-b from-[#1A241A] to-[#111911] transition duration-150 hover:from-[#243324] hover:to-[#1B281B] hover:shadow-[0_0_15px_rgba(33,235,40,0.15)]" >
                        <img src={DownloadIconSVG} alt="download-files" />
                    </div >
                </a>
                :
                <div ref={ref} className="relative group px-2.5 flex-col justify-start items-start gap-[3px] inline-flex cursor-pointer" onClick={() => handleClick()}>
                    <div className="w-[3px] h-[3px] bg-white bg-opacity-40 group-hover:bg-opacity-100 rounded-full transition duration-300"></div>
                    <div className="w-[3px] h-[3px] bg-white bg-opacity-40 group-hover:bg-opacity-100 rounded-full transition duration-300"></div>
                    <div className="w-[3px] h-[3px] bg-white bg-opacity-40 group-hover:bg-opacity-100 rounded-full transition duration-300"></div>
                    {isComponentVisible &&
                        <div className='absolute z-[70] w-[200px] top-6 right-2.5 p-3 bg-neutral-900 rounded-[10px] shadow flex-col justify-start items-start gap-1 inline-flex'>
                            <a href={`${serverIp}:3000/#/d/${uid}`} target="_blank" rel="noreferrer" className="p-3 justify-start items-center gap-2 hover:bg-white/5 rounded-md w-full inline-flex">
                                <img src={OpenLinkSVG} className="w-5 h-5" alt="" />
                                <div className="main-text text-sm font-medium">Open Link</div>
                            </a>
                        </div>
                    }
                </div>
            }
       </> 
    );
}

export default TransferActionsManage;