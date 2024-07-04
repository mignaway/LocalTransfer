import {bytesToSize} from '../utility/fileUtility'
import FileIconSVG from '../assets/images/icons/file_green.svg'

function FileContainer({file,handleRemoveFile}) {
    const lastDotIndex = file.name.lastIndexOf('.');
    const extension = lastDotIndex ? file.name.substring(lastDotIndex + 1) : '?';
    const fileNameWithoutExtension = lastDotIndex ? file.name.substring(0, lastDotIndex) : file.name;
    const fileSize = bytesToSize(file.size)

    return (
        <div className="group/file w-full h-full p-3 lg:p-5 bg-gradient-to-b from-white/5 to-white/[.03] line-clamp-2 rounded-[10px] justify-start items-center gap-x-4 flex">
           <img src={FileIconSVG} alt="file-icon" /> 
            <div className="flex-col justify-start items-start gap-2 flex flex-1">
                <div className="main-text text-xs lg:text-sm font-medium line-clamp-1 break-all">{fileNameWithoutExtension}</div>
                <div className="flex flex-row gap-x-2 items-center">
                    <div className="px-1.5 py-0.5 bg-white bg-opacity-5 rounded-md justify-start items-start gap-2.5 flex">
                        <div className="main-text text-opacity-75 text-xs font-medium">{extension.toUpperCase()}</div>
                    </div>
                    <div className="main-text text-opacity-75 text-xs font-medium">{fileSize}</div>
                </div>
            </div>
            <div className="cursor-pointer hidden group-hover/file:block group/itemdelete p-[1px] bg-gradient-to-b from-white/30 to-white/0 rounded-full" onClick={handleRemoveFile}>
                <div className="flex flex-col justify-center items-center h-6 w-6 relative rounded-full bg-[#272727] transition duration-150 hover:bg-[#FF5353]">
                    <svg className="opacity-50 group-hover/itemdelete:opacity-100"
                        width="10"
                        height="2"
                        viewBox="0 0 10 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="flex-grow-0 flex-shrink-0"
                        preserveAspectRatio="none"
                    >
                        <line y1="1.25" x2="10" y2="1.25" stroke="white" strokeWidth="1.5"></line>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default FileContainer;