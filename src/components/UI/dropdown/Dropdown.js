import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, CogIcon } from "@heroicons/react/20/solid";
import { Refresh } from "@mui/icons-material";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Dropdown({ elements, onChange, isLoading = false }) {
	// const [selected, setSelected] = useState(null)
	const defaultElement = "Loading...";

	const [selected, setSelected] = useState(() =>
		elements ? elements[0] : null
	);
	const [flag, setFlag] = useState(0);

	useEffect(() => {
		if (elements && elements.length > 0 && flag === 0) {
			setSelected(elements[0]);
			setFlag(1);
		}
	}, [elements]);

	useEffect(() => {
		if (selected) {
			onChange(selected);
		}
	}, [selected]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					{/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Search By</Listbox.Label> */}
					<div className="relative mt-0">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
							<span className="flex items-center">
								<span className="ml-3 block truncate">
									{selected}
								</span>
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">

								{elements &&
									elements.map((element) => (
										<Listbox.Option
											key={element}
											className={({ active }) =>
												classNames(
													active
														? "bg-indigo-600 text-white"
														: "text-gray-900",
													"relative cursor-default select-none py-2 pl-3 pr-9"
												)
											}
											value={element}
										>
											{({ selected, active }) => (
												<>
													<div className="flex items-center">
														<span
															className={classNames(
																selected
																	? "font-semibold"
																	: "font-normal",
																"ml-3 block truncate"
															)}
														>
															{element}
														</span>
													</div>

													{selected ? (
														<span
															className={classNames(
																active
																	? "text-white"
																	: "text-indigo-600",
																"absolute inset-y-0 right-0 flex items-center pr-4"
															)}
														>
															<CheckIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								{isLoading && (
									<div className="relative cursor-not-allowed select-none py-2 pl-3 pr-9 text-gray-400 ml-3">
										{defaultElement} <Refresh className="h-5 w-5 mr-2 animate-spin" />
									</div>
								)}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
}
