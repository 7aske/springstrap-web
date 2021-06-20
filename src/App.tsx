import React, { useRef, useEffect, ChangeEvent, useState } from "react";
import springstrap from "./lib/springstrap/src/web";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import M from "materialize-css";
import ReactTooltip from "react-tooltip";

function App() {
	const fileInputRef = useRef<HTMLInputElement | null>();
	const selectRef = useRef<HTMLSelectElement | null>();
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
		security: false,
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
		if (selectRef.current)
			M.FormSelect.init(selectRef.current, {
				dropdownOptions: {
					onCloseEnd: e => {
						setOptions({...options, type: (e as any).value.toLowerCase()});
					},
				},
			});
	}, [selectRef.current]);

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
		if (!text) {
			M.toast({html: "No file selected", classes: "theme-accent theme-black-text"});
			setLoading(false);
			return;
		}
		const base = options.domain.split(".").pop() || "springstrap";
		let res: { filename: string, content: string }[] = [];
		try {
			res = springstrap(text, options);
		} catch (e) {
			if (e.message && e.message.startsWith("Syntax error")) {
				M.toast({html: "Selected file is not a valid DDL file.", classes: "theme-accent theme-black-text"});
			} else {
				M.toast({html: e.message, classes: "theme-accent theme-black-text"});
			}
			setLoading(false);
			return;
		}

		if (res.length === 0) {
			M.toast({html: "Failed to generate", classes: "theme-accent theme-black-text"});
			setLoading(false);
			return;
		}

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
		if (!fileInputRef.current) {
			M.toast({html: "No file selected", classes: "theme-accent theme-black-text"});
			return;
		}
		const file = fileInputRef.current.files![0];
		if (!file) {
			M.toast({html: "No file selected", classes: "theme-accent theme-black-text"});
			return;
		}
		setLoading(true);
		const reader = new FileReader();
		reader.onload = handleFileRead;
		reader.readAsText(file);
	};
	return (
		<div className="App">
			<div className="container">
				<h2>Springstrap <small><a target="_blank" rel="noopener"
				                          href="https://github.com/7aske/springstrap">github.com/7aske/springstrap</a></small>
				</h2>
				<div>
					<p>
						Utility for generating a CRUD Spring Application from a database DDL
					</p>
				</div>
				<div className="row">
					<div className="input-field col s12 m12 l6">
						<input placeholder="com.example" onChange={handleToggleSwitch} value={options.domain}
						       name="domain" type="text"/>
						<label>Domain <small>(optional)</small></label>
					</div>
				</div>
				<div className="row">
					<div className="input-field col s12 m12 l6">
						<select ref={ref => selectRef.current = ref}>
							<option selected value="mariadb">MariaDB</option>
							<option value="mysql">MySQL</option>
						</select>
						<label>DDL Syntax</label>
					</div>
				</div>
				<div className="row">
					<div className="col s12 m12 l6">
						<div className="file-field input-field">
							<div className="btn">
								<span>File</span>
								<input ref={ref => fileInputRef.current = ref} type="file"/>
							</div>
							<div className="file-path-wrapper">
								<input placeholder="DDL file (MariaDB, MySQL)" className="file-path" type="text"/>
							</div>
						</div>
					</div>
				</div>
				<h5>Packages<i data-for="package-info"
				               data-tip="Select between packages you want to generate. Generated code is highly opinionated."
				               className="material-icons tiny">help</i></h5>
				<ReactTooltip id="package-info" effect="solid" place="right" type="dark"/>
				<div className="row">
					<div className="col s12 switch-flex">
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
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
				</div>
				<h5>Controller Parameters</h5>
				<div className="row">
					<div className="col s12 switch-flex">
						<div className="truncate">
							JPA Specification
						</div>
						<div className="switch">
							<label>
								<input onChange={handleToggleSwitch}
								       checked={options.specification}
								       name={"specification"}
								       type="checkbox"/>
								<span className="lever"/>
							</label>
							<i data-for="specification-info"
							   data-tip="Add converters and parsers to allow using generic JpaSpecification queries on all entities. Queries are parsed from a custom URL based query language"
							   className="material-icons tiny">help</i>
							<ReactTooltip id="specification-info" effect="solid" place="right" type="dark"/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
						<div className="truncate">
							Sort
						</div>
						<div className="switch">
							<label>
								<input onChange={handleToggleSwitch}
								       checked={options.sort}
								       name={"sort"}
								       type="checkbox"/>
								<span className="lever"/>
							</label>
							<i data-for="sort-info"
							   data-tip="Add converter and request parameter for using Spring Sort objects in entity controllers"
							   className="material-icons tiny">help</i>
							<ReactTooltip id="sort-info" effect="solid" place="right" type="dark"/>
						</div>
					</div>
				</div>
				<h5>Other options</h5>
				<div className="row">
					<div className="col s12 switch-flex">
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
							<i data-for="auditable-info"
							   data-tip="Make all entity classes extend a generic Auditable class that has recordStatus, lastModifiedBy, lastModifiedDate and createdDate fields"
							   className="material-icons tiny">help</i>
							<ReactTooltip id="auditable-info" effect="solid" place="right" type="dark"/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
							<i data-for="swagger-info" data-tip="Adds Swagger2 configuration class"
							   className="material-icons tiny">help</i>
							<ReactTooltip id="swagger-info" effect="solid" place="right" type="dark"/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
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
							<i data-for="lombok-info" data-tip="Replaces code with Lombok annotations where possible"
							   className="material-icons tiny">help</i>
							<ReactTooltip id="lombok-info" effect="solid" place="right" type="dark"/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col s12 switch-flex">
						<div className="truncate">
							Spring Security
						</div>
						<div className="switch">
							<label>
								<input onChange={handleToggleSwitch}
								       checked={options.security}
								       name={"security"}
								       type="checkbox"/>
								<span className="lever"/>
							</label>
							<i data-for="security-info" data-tip="Implements basic Spring Security with com.auth0.java-jwt package."
							   className="material-icons tiny">help</i>
							<ReactTooltip id="security-info" effect="solid" place="right" type="dark"/>
						</div>
					</div>
				</div>
				<div className="row">
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
		</div>
	);
}

export default App;
