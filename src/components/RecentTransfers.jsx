import EllipsesManage from "./TransferActionsManage";
import useBackendSocket from "../hooks/useBackendSocket"
import TransferElement from "./TransferElement";
import { useBackend } from "../hooks/useBackend";

function RecentTransfers() {
    const { shareLinks, oldShareLinks } = useBackendSocket()
    const shareLinksFound = shareLinks && Object.keys(shareLinks).length > 0
    const oldShareLinksFound = oldShareLinks && Object.keys(oldShareLinks).length > 0
    return (
        <div className="flex flex-col w-full h-full gap-y-5 flex-1">
            <div className="flex flex-row justify-between items-center">
                <span className="main-text font-semibold text-lg">Recent Transfers</span>
                <span className="main-text opacity-10 text-sm">See All</span>
            </div>
            <div className="flex flex-col gap-y-2.5 w-full flex-1 overflow-hidden basis-0">
                <span className="main-text text-sm opacity-50 font-medium">Current Session</span>
                <div className="flex flex-col overflow-y-auto flex-1 mb-3">
                    {
                        shareLinks || oldShareLinks ? 
                            shareLinksFound || oldShareLinksFound ?
                            <>
                                {shareLinksFound && Object.entries(shareLinks).map(([uid, data], i) => {

                                    return (
                                            <TransferElement uid={uid} data={data} key={i} active />
                                    )
                                })}
                                {oldShareLinksFound && Object.entries(oldShareLinks).map(([uid, data], i) => {
                                    return (
                                        <TransferElement uid={uid} data={data} key={i} />
                                    )
                                })}
                                <div className="w-[7px] h-full flex justify-center">
                                    <div className="bg-gradient-to-b from-white/10 to-white/0 w-[1.5px] h-full"></div>
                                </div>
                            </> 
                            :
                            <span className="main-text opacity-30 w-full text-sm pt-8 text-center">No recent transfer found</span>
                        : 
                        <span className="main-text opacity-50 w-full text-sm pt-10 text-center">Getting data from server...</span>
                    } 
                </div>
            </div>
        </div >
    );
}

export default RecentTransfers;