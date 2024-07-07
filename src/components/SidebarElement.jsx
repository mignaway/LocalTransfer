function SidebarElement({icon, name, color, active, action, disabled}) {
	const handleClick = () => {
		if (action) {
			action();
		}
	};
	return(
		<div className={`${disabled && 'opacity-10'} flex flex-col items-center py-2.5 px-5 rounded-[15px] gap-2 hover:bg-${color}/5 ${active ? `bg-${color}/5` : ``} transition duration-150 cursor-pointer`} onClick={handleClick}>
			<img className={`w-[24px] h-[24px] fill-${color}`} src={icon} />
			<span className={`main-text text-sm font-medium text-${color}`}>{name}</span>
		</div>
	)
}
export default SidebarElement
