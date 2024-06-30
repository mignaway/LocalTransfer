import { useBackend } from "../hooks/useBackend";
import { QRCodeSVG } from 'qrcode.react';
import CopyTextElementEmbed from "./copyTextElementEmbed";
import CopySVG from "../assets/images/icons/copy.svg"

function ShareLinkPopup({ uid, cancelTransfer}) {
    const { serverIp } = useBackend()

    return (
        <div className="absolute inset-0 z-[100] bg-black bg-opacity-70 rounded-[30px] justify-center items-center flex">
            <div className="px-12 py-12 bg-gradient-to-b from-[#1B1B1B] to-[#191919] rounded-[20px] flex-col justify-start items-center gap-10 flex">
                <div className="flex-col justify-center items-center gap-8 flex">
                    <QRCodeSVG value={`${serverIp}:3000/#/d/${uid}`} bgColor="rgba(0,0,0,0)" fgColor="white" width="170px" height="170px" />
                    <CopyTextElementEmbed textToCopy={`${serverIp}:3000/#/d/${uid}`}>
                        <div className="flex gap-2">
                            <div>
                                <span className="text-white/50 text-base font-medium">{serverIp}:3000/#/d/</span>
                                <span className="text-white text-base font-medium">{uid}</span>
                            </div>
                            <img src={CopySVG} alt="copy-logo"/> 
                        </div>
                    </CopyTextElementEmbed>
                </div>
                <div className="w-full h-[0.5px] bg-white/10"></div>
                <div className="self-stretch h-[87px] flex-col justify-start items-center gap-[15px] flex">
                    <div className="self-stretch text-center text-white text-sm font-medium  leading-tight">Scan the QR code or open the link in your device</div>
                    <div className="self-stretch text-center text-white/50 text-sm font-medium leading-tight">or</div>
                    <div className="text-rose-500 text-sm font-medium cursor-pointer" onClick={() => cancelTransfer()}>Cancel Transfer</div>
                </div>
            </div>
        </div>
    );
}

export default ShareLinkPopup;