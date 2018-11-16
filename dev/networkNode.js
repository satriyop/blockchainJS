const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');
const bitcoin = new Blockchain();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', (req, res) => {
	console.log(nodeAddress);
	res.send(bitcoin);
})

//taking call from /transaction/broadcast
app.post('/transaction', (req,res) => {
	const newTransaction = req.body.newTransaction;
	

	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.`});
})


app.post('/transaction/broadcast', (req,res) => {
	//making new transaction
	//broadcast new

	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	//add new transaction to pending transaction on this node
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	//broadcast the new transaction to entire network and hit the end point /transaction on each nodes
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: { newTransaction: newTransaction },
			json: true
		}

	requestPromises.push(rp(requestOptions)); 
	
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({note: 'Transaction created and broadcast successfully'});
	})
	.catch(error => {
	  console.error('/transaction/broadcast-node Promise error ' + error);
	});

})


app.get('/mine', (req, res) => {
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};

	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
	
	//transaction fee for miner
	//bitcoin.createNewTransaction(12.5, "00", nodeAddress);

	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	//broadcast new Block to network nodes
	requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl =>{
		requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	})

	Promise.all(requestPromises)
	.then(data => {
		//broadcast transaction fee
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress 
			},
			json: true
		}
		return rp(requestOptions);
	})
	.catch(error => {
	  console.error('/mine Promise error ' + error);
	})

	.then(data => {
		res.json({
			note: "New block mined successfully",
			block: newBlock
		});	
	})
	.catch(error => {
	  console.error('/mine Promise error ' + error);
	})
})


//called by /mine to other nodes on the network
app.post('/receive-new-block', (req,res) => {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if ( correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = [];
		res.json  ({
			note: 'New Block received and accepted',
			newBlock: newBlock
		});
	} else {
		res.json ({
			note: 'New Block rejected',
			newBlock: newBlock
		});
	}


})



//register a node and broadcast to the entire network
//pass url to reqbody
app.post('/register-and-broadcast-node', (req, res) => {
	const newNodeUrl = req.body.newNodeUrl;
	//check if newNode is not registered before
	//register the newNode to the current node
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1 ) {
		bitcoin.networkNodes.push(newNodeUrl);
	}

	//broadcast newNode to network
	//making request to each node on the network at end point API register-node
	const regNodesPromise = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		// '/register-node'
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};
		//request rp will be async,reach other nodes on network
		regNodesPromise.push(rp(requestOptions));
	});

	Promise.all(regNodesPromise)
	//register all of nodes on the network to the new node that just registered
		.then(data => {
			const bulkRegisterOptions ={
				uri: newNodeUrl + '/register-nodes-bulk',
				method: 'POST',
				body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
				json: true
			};

			return rp(bulkRegisterOptions);
		})
		.catch(error => {
		  console.error('/register-and-broadcast-node Promise error ' + error);
		})

		.then(data => {
			res.json({note: "New node registered with network successfully"});
		})
		.catch(error => {
		  console.error('/register-and-broadcast-node Promise error ' + error);
		})

})

//taking call from /register-node-and-broadcast
//register a node to network (by each other node)
//to other network node, just simply register but not broadcast
app.post('/register-node', (req,res) => {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode)
		{	
			bitcoin.networkNodes.push(newNodeUrl);
	}	
	res.json({ note: "New node registered successfully." })
})


//taking call from /register-node-and-broadcast
//register multiple node at once
app.post('/register-nodes-bulk', (req, res) => {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;	
	const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		
		if (nodeNotAlreadyPresent && notCurrentNode) {

			bitcoin.networkNodes.push(networkNodeUrl);
		}
	});

	res.json({note: 'Bulk registration successful'});
})


app.get('/consensus', (req, res) => {
	//request to other nodes on the network
	//get copied of their chains
	//compare it with the current node chain
	requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		//compare with current node chain
		const currentNodeChainLength = bitcoin.chain.length;
		let maxChainLenght = currentNodeChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLenght) {
				maxChainLenght = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			}
		})

		if(!newLongestChain || (newLongestChain && !bitcoin.isValid(newLongestChain))) {
			res.json({ 
				note: 'Current chain has not been replaced',
				chain: bitcoin.chain
			}); 
		}
		else if (newLongestChain && bitcoin.isValid(newLongestChain)) {
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransactions = newPendingTransactions;

			res.json({
				note: 'This chain has been replaced',
				chain: bitcoin.chain
			});
		}

	})
})

///////////------Block EXplorer Begin------//////////


app.get('/block/:blockHash', (req,res) => { //localhost:3001/block/asdf3234
	//sending spesific blockhash
	//return the block
	const blockHash = req.params.blockHash;
	const correctBlock = bitcoin.getBlock(blockHash);

	res.json({
		block: correctBlock
	});
})


app.get('/transaction/:transactionId', (req,res) => {
	//sending a transaction ID
	//return the transaction
	const transactionId = req.params.transactionId;
	const transactionData = bitcoin.getTransaction(transactionId);

	res.json({
		transaction: transactionData.transaction,
		block: transactionData.block
	});
})


app.get('/address/:address', (req,res) => {
	//sending an addess
	//return balance & transaction by the address
	const address = req.params.address;
	const addressData = bitcoin.getAddress(address);

	res.json({
		addressData: addressData 
	});
})

app.get('/block-explorer', (req,res) => {
	res.sendFile('./block-explorer/index.html', {root: __dirname});
})






















app.listen(port, () => console.log(`Siap melayani di port ${port}!`))