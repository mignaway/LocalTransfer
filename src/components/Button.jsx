
function Button({text,action}) {
	return(
		<div className="max-w-[220px] w-full p-[1px] bg-gradient-to-b from-[#fff] to-[#fff]/10 rounded-[10px]">
			<div className={`w-full flex flex-row justify-center transition duration-150 bg-gradient-to-b from-[#97e89a] to-[#41d147] hover:drop-shadow-[0_0_12px_rgba(65,208,71,.5)] rounded-[10px] py-2.5 px-5 cursor-pointer hover:bg-opacity-80 transition duration-150`} onClick={() => action()}>
				<span className="main-text font-semibold text-black">{text}</span>
			</div>
		</div>
	)
}
export default Button 
