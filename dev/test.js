//Test Create New Block
const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

const bc1 = {
	chain: [
		{
			index: 1,
			timestamp: 1541531474060,
			transactions: [],
			nonce: 100,
			hash: "0",
			previousBlockHash: "0"
		},
		{
			index: 2,
			timestamp: 1541531508414,
			transactions: [],
			nonce: 18140,
			hash:
				"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
			previousBlockHash: "0"
		},
		{
			index: 3,
			timestamp: 1541531534436,
			transactions: [
				{
					amount: 12.5,
					sender: "00",
					recipient: "bab7f5b0e1f711e8a926ed5b457dd4cb",
					transactionId: "cf3b6cb0e1f711e8a926ed5b457dd4cb"
				},
				{
					amount: 10,
					sender: "ASDFASDF",
					recipient: "QWERQWER",
					transactionId: "d83ae430e1f711e8a926ed5b457dd4cb"
				},
				{
					amount: 20,
					sender: "ASDFASDF",
					recipient: "QWERQWER",
					transactionId: "da091480e1f711e8a926ed5b457dd4cb"
				},
				{
					amount: 30,
					sender: "ASDFASDF",
					recipient: "QWERQWER",
					transactionId: "db9e5a80e1f711e8a926ed5b457dd4cb"
				}
			],
			nonce: 43774,
			hash:
				"0000d8e4d1c8ec76eab72c04f9c259a7e9bc256623e48ed8d1d408cec90e672f",
			previousBlockHash:
				"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
		},
		{
			index: 4,
			timestamp: 1541531555618,
			transactions: [
				{
					amount: 12.5,
					sender: "00",
					recipient: "bab7f5b0e1f711e8a926ed5b457dd4cb",
					transactionId: "deb5aca0e1f711e8a926ed5b457dd4cb"
				},
				{
					amount: 100,
					sender: "ASDFASDF",
					recipient: "QWERQWER",
					transactionId: "e40c4060e1f711e8a926ed5b457dd4cb"
				},
				{
					amount: 200,
					sender: "ASDFASDF",
					recipient: "QWERQWER",
					transactionId: "e678d390e1f711e8a926ed5b457dd4cb"
				},
				{
					amount: 300,
					sender: "ASDFASDF",
					recipient: "QWERQWER",
					transactionId: "e8622d00e1f711e8a926ed5b457dd4cb"
				}
			],
			nonce: 2798,
			hash:
				"0000979370ae09f63bed47730940d5c1415d5b14721902bf258ec30137349681",
			previousBlockHash:
				"0000d8e4d1c8ec76eab72c04f9c259a7e9bc256623e48ed8d1d408cec90e672f"
		},
		{
			index: 5,
			timestamp: 1541531560525,
			transactions: [
				{
					amount: 12.5,
					sender: "00",
					recipient: "bab7f5b0e1f711e8a926ed5b457dd4cb",
					transactionId: "eb55ca80e1f711e8a926ed5b457dd4cb"
				}
			],
			nonce: 69180,
			hash:
				"000051e0664d6f97a2e2a75ec0b724368d3f1482163dcfa4898a15b5d198ea7a",
			previousBlockHash:
				"0000979370ae09f63bed47730940d5c1415d5b14721902bf258ec30137349681"
		},
		{
			index: 6,
			timestamp: 1541531566508,
			transactions: [
				{
					amount: 12.5,
					sender: "00",
					recipient: "bab7f5b0e1f711e8a926ed5b457dd4cb",
					transactionId: "ee421500e1f711e8a926ed5b457dd4cb"
				}
			],
			nonce: 142183,
			hash:
				"000018c3d3b58c029a4db438ed7edd90c67ea3649c5ef20af029fc3dc0191a44",
			previousBlockHash:
				"000051e0664d6f97a2e2a75ec0b724368d3f1482163dcfa4898a15b5d198ea7a"
		}
	]
};

console.log(bitcoin.isValid(bc1.chain));
