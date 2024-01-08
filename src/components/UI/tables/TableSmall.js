import { useContext, useEffect, useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import ButtonSecondary from "../buttons/ButtonSecondary";

export default function TableSmall({ data, title }) {
	useEffect(() => {
		// console.log(data);
	}, [data]);

	return (
		<div className="px-0 px-0 py-2 overflow-x-hidden mt-2">
			<div className="px-5 h-[30px] flex items-end pt-1 text-base font-semibold leading-6 text-gray-900">
				{title}
			</div>
			<div className="mt-2 flow-root scolatela overflow-x-auto">
				{/* <div className="-mx-4 -my-2 overflow-x-auto "> */}
				<div className="inline-block min-w-full py-2 align-middle px-5 table-wrp max-h-96">
					<table className="overflow-scroll min-w-full divide-y divide-gray-300">
						<thead className="sticky top-0 bg-white">
							<tr>
								{data &&
									data[0] &&
									Object.keys(data[0]).map((key, index) => (
										<th
											key={index}
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											{key}
										</th>
									))}
								<th
									scope="col"
									className="relative py-3.5 pl-3 pr-4 "
								>
									<span className="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white max-h-[300px] overflow-auto">
							{data != null &&
								data.map((element, key) => (
									<tr
										key={key}
										className={
											key % 2 === 0 ? "" : "bg-gray-100"
										}
									>
										{Object.entries(element).map(
											([field, value], index) => (
												<td
													key={index}
													className="whitespace-nowrap py-2 px-3 text-sm text-gray-900 "
												>
													{value || 0}
												</td>
											)
										)}
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
		// </div>
	);
}
