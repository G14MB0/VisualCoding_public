import { useContext, useEffect, useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import ButtonSecondary from "../buttons/ButtonSecondary";

export default function AssetList({ data, title, message, setArray }) {
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(
		new Array(data?.length || 0).fill(0)
	);
	const [searchColumn, setSearchColumn] = useState(
		data && data[0] && Object.keys(data[0])[0]
	);

	const handleCheckboxChange = (index) => {
		const newSelected = [...selected];
		newSelected[index] = newSelected[index] === 0 ? 1 : 0;
		setSelected(newSelected);
	};

	const handleDropdownChange = (value) => {
		setSearchColumn(value);
	};

	const handleClearAll = (value) => {
		setSelected(Array(data.length).fill(0));
	};

	useEffect(() => {
		setArray(selected);
	}, [selected]);

	useEffect(() => {
		setSelected(new Array(data?.length || 0).fill(0));
		setSearchColumn(data && data[0] && Object.keys(data[0])[0]);
	}, [data]);

	const columns = data && data[0] && Object.keys(data[0]);

	return (
		<div className="px-0 px-0 py-2 overflow-x-hidden">
			<div className="flex align-center justify-between">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">
						{title}
					</h1>
					<p className="mt-2 text-sm text-gray-700">{message}</p>
				</div>
				<div className="mt-4"></div>
			</div>
			<div className="grid grid-cols-6 pb-2 ml-1">
				<input
					className="col-span-3 relative h-[36px] my-auto rounded-md bg-white py-1.5 pl-3 mr-2 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={`Search by ${searchColumn}`}
				/>
				<div className="col-span-2 mr-2 my-auto">
					<Dropdown
						elements={columns}
						onChange={handleDropdownChange}
					/>
				</div>
				<div className="col-span-1">
					<ButtonSecondary
						children={"Clear All"}
						onClick={handleClearAll}
					/>
				</div>
			</div>
			<div className="mt-2 flow-root ">
				<div className="-mx-4 -my-2 overflow-x-auto ">
					<div className="inline-block min-w-full py-2 align-middle px-5 table-wrp max-h-96">
						<table className="overflow-scroll min-w-full divide-y divide-gray-300">
							<thead className="sticky top-0 bg-white">
								<tr>
									<th
										key={999}
										scope="col"
										className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									></th>
									{data &&
										data[0] &&
										Object.keys(data[0]).map(
											(key, index) => (
												<th
													key={index}
													scope="col"
													className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
												>
													{key}
												</th>
											)
										)}
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
											style={{
												display:
													!search ||
													(element[searchColumn] &&
														element[searchColumn]
															.toLowerCase()
															.includes(
																search.toLowerCase()
															))
														? ""
														: "none",
											}}
											className={
												key % 2 === 0
													? undefined
													: "bg-gray-50 "
											}
										>
											<td>
												<input
													type="checkbox"
													checked={
														selected[key] === 1
													}
													onChange={() =>
														handleCheckboxChange(
															key
														)
													}
													className="form-checkbox  ml-2 h-5 w-5 text-blue-600 border rounded bg-gray-200"
												/>
											</td>
											{Object.entries(element).map(
												([field, value], index) => (
													<td
														key={index}
														className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900 "
													>
														{value || "null"}
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
		</div>
	);
}
