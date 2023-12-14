import React from "react";
import { useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import "minireset.css";
import "./Generate.css";
import Form from "../Form";
import Preview from "../Preview";
import { db } from "../../Firebase-config";
import emailjs from "emailjs-com";
import { collection, addDoc } from "firebase/firestore";
import { init, storePdfHash } from "../../Web3Client";
import { jsPDF } from "jspdf";

function Generate() {
	// Handling form data and specifying Post request to for certificate generation
	const [formData, setFormData] = useState({
		name: "",
		course: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [certificate, setCertificate] = useState(null);
	const [certid, setCertId] = useState("");
	const ID = uuid().slice(0, 13);

	function generateCertificate(e) {
		e.preventDefault();
		setIsLoading(true);
		setCertId(ID);
		const currentDate = new Date();

		// Get individual components of the date and time
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
		const day = currentDate.getDate();
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const seconds = currentDate.getSeconds();

		// Format the date and time
		const formattedDate = `${year}-${month}-${day}`;
		const formattedTime = `${hours}:${minutes}:${seconds}`;
		const doc = new jsPDF();
		doc.text(
			`Certificate ID: ${ID} \n Username: ${formData.name} \n Course: ${formData.course} \n Date: ${formattedDate} \n Time: ${formattedTime}`,
			10,
			10
		);
		setIsLoading(false);
		doc.save(ID + ".pdf");
	}

	// addfile to IPFS
	// add hash to blockchain
	// add data to collection
	// send email to recipient

	const [buffer, setBuffer] = useState(null);
	const [pdfHash, setPdfHash] = useState(
		"QmZa3wgJrkb6phdL6H1FZJgbVH9c5LcH755LFw3ppYUtrn"
	);
	const [emailId, setEmailID] = useState("");
	let pdf_hash = "";

	function fileToBuffer(e) {
		e.preventDefault();
		const file = e.target.files[0];
		setBuffer(file);
	}

	// Upload PDF to ipfs
	const uploadToIPFS = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		// loading connected account
		init();
		console.log("uploading to ipfs");
		try {
			const pinataApiKey = "9bd56e3bb0f57181591d";
			const pinataApiSecret =
				"96bd936ee2a4550e43d5ed2ca34f7e94350441937d1a2df275cb77bd79226c1a";
			const apiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
			const formData = new FormData();
			formData.append("file", buffer);

			console.log(buffer);
			const response = await axios.post(apiUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					pinata_api_key: pinataApiKey,
					pinata_secret_api_key: pinataApiSecret,
				},
			});
			pdf_hash = response.data.IpfsHash;
			console.log("pdfhash:", pdf_hash);
			//calling StorePdfHash imported from Web3Client.js
			storePdfHash(pdf_hash);
			//calling function to add certId and ipfs hash to Certificates Collection
			addDataToCollection(event);
		} catch (error) {
			console.log("error in uploading files...", error);
		}
	};

	//created ref of collection 'certificates'
	const certificatesCollectionRef = collection(db, "certificates");

	//function to add document in Certificates collection
	const addDataToCollection = async (event) => {
		event.preventDefault();
		setPdfHash(pdf_hash);
		console.log("adding data to Collection");
		console.log("id:", certid);
		console.log("hash:", pdf_hash);
		await addDoc(certificatesCollectionRef, {
			cert_id: certid,
			cert_hash: pdf_hash,
		});
	};

	return (
		<div className="App">
			{/* Generate Certificate */}

			<div className="g-container">
				<header className="g-header">
					<h1 className="g-h1">Generate Certificate</h1>
				</header>

				<section className="g-section">
					<div>
						<Form formData={formData} setFormData={setFormData} />
						<button
							type="button"
							disabled={isLoading}
							onClick={generateCertificate}
						>
							{isLoading ? "Making..." : "Make Certificate"}
						</button>
					</div>
					<div>
						{certificate && (
							<a
								className="download"
								target="_blank"
								rel="noreferrer"
								href={certificate}
							>
								Download
							</a>
						)}
					</div>
				</section>
			</div>

			{/* Upload certificate to IPFS and ethereum and Send mail to recipient */}

			<div className="g1-container">
				<header className="g1-header">
					<h1 className="g1-h1">Upload and Send Certificate</h1>
				</header>
				<section className="g1-section">
					<form className="g1-form">
						<div>
							<label className="g1-label">
								Enter Downloaded Certificate
							</label>
							<input
								className="g1-input1"
								type="file"
								onChange={fileToBuffer}
							></input>
						</div>
						<div>
							<label className="g1-label">
								Enter Recipient Email
							</label>
							<input
								className="g1-input2"
								placeholder="abc@gmail.com"
								autoComplete="off"
								onChange={(event) => {
									setEmailID(event.target.value);
								}}
							></input>
						</div>
						<button
							disabled={isLoading}
							className="g1-button"
							type="button"
							onClick={uploadToIPFS}
						>
							Upload and Send
						</button>
					</form>
					<div className="img-div">
						<img className="g1-img" src="/images/email.jpg" />
					</div>
				</section>
			</div>
		</div>
	);
}
export default Generate;
