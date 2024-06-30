import { QRCodeSVG } from "qrcode.react";
import { useBackend } from "../hooks/useBackend";
import CopyTextElementEmbed from "./copyTextElementEmbed";

function InfoBox() {
    const { serverIp } = useBackend()
    return (
        <div className="w-[350px] p-5 bg-gradient-to-b from-white/5 to-white/[3%] rounded-[20px] justify-start items-center gap-5 inline-flex">
            {
                serverIp == null ? (
                    <div className="flex flex-row gap-x-2 items-center">
                        <svg aria-hidden="true" className="inline w-7 h-7 mr-2 text-white/10 animate-[spin_2s_linear_infinite] fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="main-text font-medium text-sm">Couldn&apos;t connect to server...</span>
                    </div>
                ) : (
                    <>
                        <QRCodeSVG value={`${serverIp}:3000/#/send`} width="75" height="75" fgColor="white" bgColor="rgba(0,0,0,0)" />
                        <div className="h-full flex flex-col place-content-between">
                            <h2 className="main-text text-sm font-medium leading-3">Receive files from devices</h2>
                            <div className="w-full h-[1.5px] bg-white/5"></div>
                            <div className="flex flex-col gap-y-1">
                                <h3 className="main-text text-[13px] text-white/50 font-medium leading-3">Scan QR or open this link:</h3>
                                <CopyTextElementEmbed textToCopy={`${serverIp}:3000/send`}>
                                    <div>
                                        <span className="main-text text-white/80 text-sm font-medium">{serverIp}:3000/</span>
                                        <span className="main-text text-sm font-medium">send</span>
                                    </div>
                                </CopyTextElementEmbed>
                            </div>
                        </div>

                    </>
                )
            }

        </div>
    );
}

export default InfoBox;