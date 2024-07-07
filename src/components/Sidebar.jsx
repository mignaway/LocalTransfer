import { NavLink } from 'react-router-dom'
import SidebarElement from "./SidebarElement"
import SendLogo from '../assets/images/icons/send.svg'
import HistoryLogo from '../assets/images/icons/history.svg'
import SettingsLogo from '../assets/images/icons/settings.svg'
import ExitLogo from '../assets/images/icons/exit.svg'
import { useBackend } from '../hooks/useBackend'


function Sidebar() {
	const {handleShutdown} = useBackend()
	return(
		<div className="hidden lg:block bg-[#151515] basis-[120px] shrink-0 h-full rounded-[20px] overflow-hidden">
			<div className="flex flex-col w-full h-full p-4 rounded-[20px]">
				<div className="flex flex-col gap-4">
					<NavLink to="Send">
						{({isActive}) => (
							<SidebarElement icon={SendLogo} name="Send" color="white" active={isActive}/>
						)}
					</NavLink>
					{ /* FUTURE HISTORY FEATURE */ }
					<NavLink to="History" style={{pointerEvents: 'none'}}>
						{({isActive}) => (
							<SidebarElement icon={HistoryLogo} name="History" color="white" active={isActive} disabled/>
						)}
					</NavLink>
				</div>
				<div className="flex flex-col justify-end gap-4 flex-1">
					{ /* FUTURE HISTORY FEATURE */ }
					<NavLink to="Settings" style={{pointerEvents: 'none'}}>
						{({isActive}) => (
							<SidebarElement icon={SettingsLogo} name="Settings" color="white" active={isActive} disabled/>
						)}
					</NavLink>
					<SidebarElement icon={ExitLogo} name="Exit" color="red-500" action={handleShutdown} />
				</div>

			</div>
		</div>
	)
}
export default Sidebar
