import React, { useState } from "react";
import "./Verify.css";
import { db } from "../../Firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import axios from "axios"; // Make sure to install axios: npm install axios

function Verify() {
  const certificatesCollectionRef = collection(db, "certificates");

  const [searchId, setSearchId] = useState("");
  const [srcResult, setSrcResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const getCertHash = async () => {
    setLoading(true);
    setSrcResult("");
    setIsVerified(false);

    if (searchId) {
      const q = query(
        certificatesCollectionRef,
        where("cert_id", "==", searchId)
      );
      const queryData = await getDocs(q);
      const matchedData = queryData.size;

      if (matchedData) {
        queryData.forEach(async (doc) => {
          const certHash = doc.data().cert_hash;
          console.log(certHash);
          setSrcResult(certHash);

          // Verify the hash on IPFS
          try {
            const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${certHash}`);
            if (response.status === 200) {
              setIsVerified(true);
            } else {
              setIsVerified(false);
            }
          } catch (error) {
            console.error("Error verifying certificate on IPFS:", error);
            setIsVerified(false);
          }
        });
      } else {
        alert("No such Certificate with ID exists");
      }
    } else {
      alert("Enter Certificate ID");
    }
    setLoading(false);
  };

  return (
    <div className="Verify App">
      <div className="v-container">
        <header className="v-header">
          <h1 className="v-h1">Verify Certificates</h1>
        </header>

        <section className="v-section">
          <input
            className="v-input"
            placeholder="Enter Certificate ID"
            autoComplete="off"
            onChange={(event) => setSearchId(event.target.value)}
          />
          <button
            disabled={loading}
            className="v-button"
            type="button"
            onClick={getCertHash}
          >
            Verify
          </button>
          {isVerified && (
            <div className="v-certified-div">
              <h2 className="certified">Certificate is valid and verified on IPFS</h2>
            </div>
          )}
          {srcResult && !isVerified && (
            <div className="v-certified-div">
              <h2 className="not-certified">Certificate could not be verified on IPFS</h2>
            </div>
          )}
          {srcResult && (
            <a
              className="v-download"
              target="_blank"
              rel="noreferrer"
              href={`https://gateway.pinata.cloud/ipfs/${srcResult}`}
            >
              View Certificate
            </a>
          )}
        </section>
      </div>
    </div>
  );
}

export default Verify;
