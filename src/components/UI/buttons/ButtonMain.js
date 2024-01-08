import React, { useEffect, useState } from "react";
import { Style } from "@mui/icons-material";

export default function ButtonMain({
	onClick,
	children,
	loadingTrigger,
	disabled,
	buttonProgress,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (loadingTrigger) {
			setIsLoading(true);
		} else {
			// Set progress to 100% when loading is complete
			// setProgress(100);
			// Wait for a second before setting isLoading to false
			const timeout = setTimeout(() => {
				setIsLoading(false);
				setProgress(0);
			}, 2000);
			// Clear the timeout if the component unmounts or if loadingTrigger changes
			return () => clearTimeout(timeout);
		}
	}, [loadingTrigger]);

	useEffect(() => {
		setProgress(buttonProgress);
		console.log(buttonProgress);
	}, [buttonProgress]);

	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`my-2 relative progress-button overflow-hidden ${
				disabled ? "buttonDisabled" : "buttonMain"
			}`}
		>
			{isLoading ? (
				<span
					className="absolute inset-0 bg-green-300 opacity-75 transition-all duration-500"
					style={{ width: `${progress}%` }}
				/>
			) : (
				""
			)}
			{isLoading ? (
				<svg
					className="animate-spin h-5 w-5 mr-2 ..."
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : (
				""
			)}
			{isLoading ? "Processing..." : children}
		</button>
	);
}
