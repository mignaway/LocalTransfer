import { useState } from "react";
import FilesContainer from "../components/FilesContainer"
import RecentTransfers from "../components/RecentTransfers"
import InfoBox from "../components/InfoBox";

function SendContent() {
	return(
		<div className="flex flex-row gap-8 w-full flex-1">
			<FilesContainer />	
			<div className="hidden lg:flex flex-col ap-y-2.5">
				<RecentTransfers />
				<InfoBox />	
			</div>
		</div>
	)
}
export default SendContent
