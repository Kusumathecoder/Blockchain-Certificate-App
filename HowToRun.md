# Blockchain-Certificate-App

This is a Blockchain-based Certificate Generation and Validation System developed by Krishna Tyagi as a 3rd year Mini Project. The system generates certificates, stores them in Firebase and IPFS (using Pinata Services), and allows for easy viewing and verification of certificates using their Certificate ID.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
git clone https://github.com/tyagi-krishna/Blockchain-Certificate-App.git cd Blockchain-Certificate-App

2. Install project dependencies:
npm install

### Setting up the local blockchain

1. Start a local Hardhat node:
npx hardhat node

make sure to keep this running in another tab


### Deploying smart contracts

1. Compile the smart contracts:
npx hardhat compile

2. Deploy the smart contracts to the local network:
npx hardhat run scripts/deploy.js --network localhost

After deploying your smart contracts, you'll need to update any references to the contract addresses in your frontend code
	contract = new web3.eth.Contract(
		StoreHashABI,

		"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
	); this is the aaddress of the contract presend in the web3Client.js file make sure to change the contract address to the one you deployed


### Running the application

1. Start the development server:
npm run dev

2. Open your browser and navigate to `http://localhost:3000` (or the port specified in your project).

## Usage

1. Generate a certificate using the provided interface.
2. The certificate will be stored in Firebase and IPFS.
3. View certificates by entering the Certificate ID.
4. Verify certificates using the pdf_hash on IPFS servers.
5. Download the certificate as a PDF file.

## Technologies Used

- Blockchain: Ethereum (Hardhat for local development)
- Smart Contracts: Solidity
- Frontend: (Add your frontend framework here, e.g., React, Vue, etc.)
- Storage: Firebase and IPFS (Pinata Services)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).




These are the apis to change the firebase and ipfs config

In the Firebase configuration:

You'll need to replace the Firebase config object with your own Firebase project details. This typically includes:
apiKey
authDomain
projectId
storageBucket
messagingSenderId
appId
For IPFS/Pinata Services:

You'll need to update the Pinata API key and secret