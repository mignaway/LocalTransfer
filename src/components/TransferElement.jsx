import TransferActionsManage from "./TransferActionsManage";
import {bytesToSize} from "../utility/fileUtility"
import LiveTransferIconSVG from '../assets/images/icons/live_transfer.svg'

function TransferElement({uid, data, active}) {
    const totalSize = Array.from(data).reduce(
        (acc, file) => acc + file.size,
        0
    );
    const transferDate = active ? 'Now' : data[0].data
    const elementColor = active ? 'green-500' : 'white'
    const elementTextColor = active ? 'bg-clip-text text-transparent bg-gradient-to-b from-[#97E89A] to-[#41d147]' : 'text-white'
    const elementBgColor = active ? 'bg-gradient-to-b from-[#1A241A] to-[#111911]' : 'bg-white'
    return ( 
        <div className="relative flex flex-row gap-x-5 items-center">
            <div className="relative flex items-center justify-center w-[7px] h-full">
                <svg className="absolute" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3.5" cy="3.5" r="3.5" className={`fill-${elementColor}`} />
                </svg>
                <div className="h-full bg-white w-[1.5px] opacity-10"></div>
            </div>
            <div className="flex flex-row flex-1">
                <div className="justify-between px-2.5 py-5 items-center gap-[30px] flex w-full">
                    <div className="flex flex-row gap-5 items-center">
                        {active ?
                            <img src={LiveTransferIconSVG} alt="download-files" />
                            :
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.91 6.33754L27.4587 34.6913C27.2941 35.1898 26.9762 35.6236 26.5503 35.9307C26.1245 36.2378 25.6125 36.4025 25.0875 36.4013H25.05C24.5182 36.3949 24.0024 36.2184 23.5782 35.8976C23.1539 35.5769 22.8436 35.1287 22.6925 34.6188L19.1262 22.7275L28.4262 13.4275C28.6608 13.1932 28.7926 12.8752 28.7927 12.5436C28.7929 12.212 28.6612 11.894 28.4269 11.6594C28.1925 11.4249 27.8745 11.293 27.5429 11.2929C27.2113 11.2928 26.8933 11.4244 26.6587 11.6588L17.3587 20.96L5.4675 17.3925C4.95872 17.2399 4.51178 16.9292 4.19146 16.5055C3.87115 16.0818 3.69412 15.5671 3.68604 15.036C3.67796 14.5049 3.83925 13.985 4.14653 13.5517C4.45381 13.1184 4.8911 12.7943 5.395 12.6263L33.7487 3.17503C34.1892 3.02813 34.6619 3.00682 35.1138 3.11347C35.5658 3.22012 35.9791 3.45053 36.3074 3.77886C36.6357 4.1072 36.8661 4.52049 36.9728 4.97242C37.0794 5.42435 37.0569 5.89704 36.91 6.33754ZM10.9262 21.6588C10.6918 21.4245 10.374 21.2928 10.0425 21.2928C9.71104 21.2928 9.39316 21.4245 9.15875 21.6588L2.90875 27.9088C2.68105 28.1445 2.55506 28.4603 2.55791 28.788C2.56076 29.1158 2.69222 29.4293 2.92398 29.6611C3.15574 29.8928 3.46925 30.0243 3.797 30.0271C4.12474 30.03 4.4405 29.904 4.67625 29.6763L10.9262 23.4263C11.1606 23.1919 11.2922 22.874 11.2922 22.5425C11.2922 22.2111 11.1606 21.8932 10.9262 21.6588ZM18.4262 29.1588C18.1918 28.9245 17.8739 28.7928 17.5425 28.7928C17.211 28.7928 16.8932 28.9245 16.6587 29.1588L10.4087 35.4088C10.2894 35.5241 10.1941 35.662 10.1286 35.8145C10.0631 35.967 10.0286 36.1311 10.0272 36.297C10.0257 36.463 10.0574 36.6276 10.1202 36.7812C10.1831 36.9349 10.2759 37.0744 10.3933 37.1918C10.5106 37.3092 10.6502 37.402 10.8038 37.4648C10.9574 37.5277 11.122 37.5593 11.288 37.5579C11.454 37.5564 11.618 37.5219 11.7705 37.4564C11.923 37.3909 12.0609 37.2957 12.1762 37.1763L18.4262 30.9263C18.6606 30.6919 18.7922 30.374 18.7922 30.0425C18.7922 29.7111 18.6606 29.3932 18.4262 29.1588ZM12.1275 27.86C11.8914 27.6274 11.5726 27.498 11.2412 27.5003C10.9097 27.5026 10.5927 27.6365 10.36 27.8725L4.1525 34.165C4.03422 34.2813 3.94024 34.4199 3.87605 34.5727C3.81185 34.7256 3.77871 34.8898 3.77857 35.0556C3.77843 35.2214 3.81128 35.3856 3.87521 35.5386C3.93914 35.6916 4.03288 35.8304 4.15096 35.9468C4.26904 36.0632 4.4091 36.155 4.56299 36.2167C4.71688 36.2785 4.88153 36.309 5.04733 36.3065C5.21313 36.304 5.37678 36.2686 5.52875 36.2022C5.68072 36.1359 5.81797 36.04 5.9325 35.92L12.14 29.6275C12.3727 29.3915 12.5021 29.0727 12.4997 28.7412C12.4974 28.4097 12.3635 28.0928 12.1275 27.86Z" fill="white" />
                            </svg>
                        }
                        <div className="flex-col justify-start items-start gap-2.5 inline-flex">

                                <div className={`px-3 py-[4px] ${elementBgColor} bg-opacity-5 rounded-[10px] justify-center items-center gap-2.5 inline-flex`}>
                                    <span className={`${elementTextColor} text-opacity-90 text-xs font-bold`}>{transferDate}</span>
                                </div>
                            <div className="flex-col items-center gap-[25px] flex">
                                <div className=" flex-col justify-start items-start gap-[15px] flex">
                                    <div className="justify-start items-start gap-2 inline-flex">
                                        <div className="justify-start items-start gap-1 flex">
                                            <span className="text-white/50 text-sm font-medium ">Sent  </span><span className="text-white text-sm font-medium">{data.length} Files  ·  {bytesToSize(totalSize)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <TransferActionsManage uid={uid} active={active} />
                </div>
            </div>
        </div>
    );
}

export default TransferElement;