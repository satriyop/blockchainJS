//Test Create New Block
const Blockchain = require ('./blockchain');

const bitcoin = new Blockchain();


// bitcoin.createNewBlock(111, '1234ASDF', 'ASDF01234');
// // bitcoin.createNewBlock(222, '1234ASDF', 'ASDF01234');
// // bitcoin.createNewBlock(333, '1234ASDF', 'ASDF01234');
// bitcoin.createNewTransaction(100, 'SAT00001', 'RAT00001');
// //mine a block
// //put pending transaction to blockchain after mine
// bitcoin.createNewBlock(222, '5678QWER', 'QWER5678');



// bitcoin.createNewTransaction(1, 'SAT00001', 'RAT00001');
// bitcoin.createNewTransaction(10, 'SAT00001', 'RAT00001');
// console.log (bitcoin.createNewTransaction(100, 'SAT00001', 'RAT00001'));

// bitcoin.createNewBlock(333, '5678QWER', 'QWER5678');


//lastest block
// console.log (bitcoin.getLastBlock());

//blockchain
console.log(bitcoin);



// const previousBlockHash = 'ASDFASDFASDF';
// const currentBlockData = [
// 	{
// 		amount: 10,
// 		sender: 'ASDFASDF',
// 		recipient: 'FDASFDA'
// 	},
// 	{
// 		amount: 10,
// 		sender: 'ASDFASDF',
// 		recipient: 'FDASFDA'
// 	},
// 	{
// 		amount: 10,
// 		sender: 'ASDFASDF',
// 		recipient: 'FDASFDA'
// 	}

// ];
// console.log (bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 21132));
// const nonce = 1000;

// console.log (bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));