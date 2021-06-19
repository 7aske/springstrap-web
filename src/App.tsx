import React, { useRef, useEffect, ChangeEvent, useState } from "react";
import run from "./lib/springstrap/src/web";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import M from "materialize-css";

function App() {
	const fileInputRef = useRef<HTMLInputElement | null>();
	const [options, setOptions] = useState<SpringStrapOptions>({
		auditable: false,
		controller: true,
		entity: true,
		lombok: false,
		overwrite: true,
		repository: true,
		service: true,
		serviceimpl: true,
		sort: false,
		specification: false,
		swagger: false,
		domain: "",
		output: undefined,
		tables: undefined,
		type: "mariadb",
		enums: undefined,
		ignore: undefined,
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		M.updateTextFields();
	}, []);

	useEffect(() => {
		console.log(options);
	}, [options]);

	const handleToggleAll = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setOptions({
				...options,
				entity: true,
				repository: true,
				service: true,
				serviceimpl: true,
				controller: true,
			});
		} else {
			setOptions({
				...options,
				entity: false,
				repository: false,
				service: false,
				serviceimpl: false,
				controller: false,
			});
		}
	};

	const handleToggleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
		let val: any = e.target.checked;
		const prop = e.target.name;
		if (prop === "domain") {
			val = e.target.value;
		}
		setOptions({...options, [prop]: val});
	};

	const handleFileRead = (e: any) => {
		setLoading(true);
		let text = e.target!.result;
		const base = options.domain.split(".").pop() || "springstrap";
		const res = run(text, options);
		const zip = new JSZip().folder(base)!;
		res.forEach(file => {
			zip.file(file.filename, file.content);
		});
		zip.generateAsync({type: "blob"})
			.then(function (content) {
				saveAs(content, `${base}.zip`);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const read = () => {
		if (!fileInputRef.current)
			return;
		const file = fileInputRef.current.files![0];
		if (!file)
			return;
		setLoading(true);
		const reader = new FileReader();
		reader.onload = handleFileRead;
		reader.readAsText(file);
	};
	return (
		<div className="App">
			<div className="container">
				<h2>Springstrap <small><a target="_blank" rel="noopener" href="https://github.com/7aske/springstrap">github.com/7aske/springstrap</a></small></h2>
				<div className="row">
					<div className="input-field col s12 m12 l6">
						<input placeholder="com.example" onChange={handleToggleSwitch} value={options.domain}
						       name="domain" type="text"/>
						<label>Domain</label>
					</div>
				</div>
				<div className="row">
					<div className="col s12 m12 l6 no-padding">
						<div className="file-field input-field">
							<div className="btn">
								<span>File</span>
								<input ref={ref => fileInputRef.current = ref} type="file"/>
							</div>
							<div className="file-path-wrapper">
								<input className="file-path" type="text"/>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col s12 l6 no-padding">
						<button className="btn" onClick={read} disabled={loading}>Generate</button>
						<div className="loader">
							<div className={`preloader-wrapper ${loading ? "active" : ""}`}>
								<div className="spinner-layer">
									<div className="circle-clipper left">
										<div className="circle"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<h5>Packages</h5>
				<div className="row switch-flex">
					<div className="truncate">
						All
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleAll}
							       checked={options.entity && options.repository && options.service && options.serviceimpl && options.controller}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Entity
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.entity}
							       name={"entity"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Repository
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.repository}
							       name={"repository"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Service
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.service}
							       name={"service"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Service Implementation
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.serviceimpl}
							       name={"serviceimpl"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Controller
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.controller}
							       name={"controller"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<h5>Other options</h5>
				<div className="row switch-flex">
					<div className="truncate">
						Auditable
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.auditable}
							       name={"auditable"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Swagger
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.swagger}
							       name={"swagger"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
				<div className="row switch-flex">
					<div className="truncate">
						Lombok
					</div>
					<div className="switch">
						<label>
							<input onChange={handleToggleSwitch}
							       checked={options.lombok}
							       name={"lombok"}
							       type="checkbox"/>
							<span className="lever"/>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
