
//IF USING CLASS RATHER THAN FUNC CONS & OBJECT PROTOTYPE

// class Blockchain {
// 	constructor() {
// 		this.chain = [];
// 		this.pendingTransaction = [];
// 	}

// 	//...methods ...
// }
const uuid = require('uuid/v1');

const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];


function Blockchain() {
	this.chain = [];
	this.pendingTransactions = []; //pending transaction before mined/validated

	//networkNode
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
	//create genesis block
	//since there no previousblockhas, nonce, hash, only pass arbitary number
	this.createNewBlock(100,'0','0');

}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	//create newBlock Object
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions, //pending trasaction set in stone
		nonce: nonce,
		hash: hash,
		//place all new transcations to hashing func and store the has
		previousBlockHash: previousBlockHash
		//hash from exact previous block
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
}

//get the last block of chain [...]
Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
}

//create new transaction
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
	//create transaction object
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
	this.pendingTransactions.push(transactionObj);
	//[...] increasing the index + 1
	return this.getLastBlock()['index'] + 1;
	//number to the block that new transaction will be added to
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
}



Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
	// => repeatedly hash block until it finds correct hash (0000xxxx) => '0000ASDF234'
	// => uses current block data for the hash, but also the previous block hash
	// => continuosly changes nonce value until it finds the correct hash
	// => return to us the nonce value that creates the correct hash
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

	while (hash.substring(0,4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		// console.log(hash);
	}

	return nonce;
}


Blockchain.prototype.isValid = function(blockchain) {
	let validChain = true;

	for (let i = 1; i < blockchain.length; i++) {
		currentBlock = blockchain[i];
		prevBlock = blockchain[i-1];

		//validate every single block inside of chain has correct data
		//re-hash current block, each hash result start with 0000
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);

		if (blockHash.substring(0,4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	}

	//check genesis block
	const genesisBlock  = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] == '0';
	const correntHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if(!correctNonce || !correctPreviousBlockHash || !correntHash || !correctTransactions) validChain = false;


	return validChain;
};



module.exports = Blockchain;

