import { useState } from "react";

function CopyTextElementEmbed({ children, textToCopy }) {
    const [isCopied, setIsCopied] = useState(false);

    function handleCopyUrl() {
        const unsecuredCopyToClipboard = (textToCopy) => {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try { 
                document.execCommand('copy') 
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000); // 1000 milliseconds (1 second)
            } catch (err) { console.error('Unable to copy to clipboard', err) } 
            document.body.removeChild(textArea) 
        };

        /**
         * Copies the text passed as param to the system clipboard
         * Check if using HTTPS and navigator.clipboard is available
         * Then uses standard clipboard API, otherwise uses fallback
        */
        if (window.isSecureContext && navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 2000); // 1000 milliseconds (1 second)
                })
                .catch((error) => {
                    console.error('Copy failed:', error);
                });
        } else {
            unsecuredCopyToClipboard(textToCopy);
        }
    }
    return ( 
        <div className="relative flex flex-row gap-4 items-center cursor-pointer" onClick={() => handleCopyUrl()}>
            <div className={`absolute -top-[32px] transition duration-300 left-0 right-0 flex justify-center ${!isCopied && 'hidden'}`}>
                <div className="flex-col justify-start items-center inline-flex">
                    <div className="px-2.5 py-[5px] shadow-lg bg-black/90 rounded-[5px] flex-col justify-start items-start gap-2.5 flex">
                        <div className="main-text text-sm">Copied</div>
                    </div>
                    <svg className="fill-black/90" width="13" height="7" viewBox="0 0 13 9" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.49998 8.5L0.149127 -5.87879e-06L12.8508 -4.76837e-06L6.49998 8.5Z" />
                    </svg>
                </div>
            </div>
            { children } 
        </div>
    );
}

export default CopyTextElementEmbed;