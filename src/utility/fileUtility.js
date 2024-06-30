export const bytesToSize = (bytes) => {
	const kilobytes = bytes / 1024; // Convert bytes to kilobytes
	if (kilobytes < 1024) {
		return kilobytes.toFixed(2) + ' KB'; // Display in kilobytes with 2 decimal places
	} else if (kilobytes < 1024 * 1024) {
		return (kilobytes / 1024).toFixed(2) + ' MB'; // Display in megabytes with 2 decimal places
	} else{
		return (kilobytes / (1024 * 1024)).toFixed(2) + ' GB'; // Display in gigabytes with 2 decimal places
	} 
}
