const Web3 = require("web3");
var Tx = require("ethereumjs-tx").Transaction;
var web3 = new Web3(
  "https://mainnet.infura.io/v3/ee4038b62e4e49dbbf5b24a9cb22ffb6"
);

//MyWallets
const accounts = [
  {
    name: "Account",
    address: "0x8EB6057Ac0bABa7a03aA531E3a83971dCef91b1A",
    private_key:
      "013c37701b38f4e23bcad793056568103d8d87bcf520e6506f56fcf7304e65e9",
  },
  {
    name: "offShoreAccount",
    address: "0x3b53D0B0cAC83F62f12928418189308EC9Fe7287",
  },
];

function listBalances() {
  accounts.forEach((account) => {
    web3.eth.getBalance(account.address, (err, val) => {
      console.log(`${account.name}: ${web3.utils.fromWei(val, "ether")}`);
    });
  });
}

transferFunds = async () => {
  const txCount = await web3.eth.getTransactionCount(accounts[0].address);
  const bufferedPrivateKey = Buffer.from(accounts[0].private_key, "hex");

  const txObject = {
    nonce: web3.utils.toHex(txCount),
    to: accounts[1].address,
    value: web3.utils.toHex(web3.utils.toWei("1", "ether")),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
  };

  const tx = new Tx(txObject, { chain: "ropsten" });
  tx.sign(bufferedPrivateKey);

  const serializedTransaction = tx.serialize().toString("hex");
  const raw = "0x" + serializedTransaction;

  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(txHash);
  });
  listBalances();
};

//BNBToken
const contractAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "withdrawEther",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_value", type: "uint256" }],
    name: "burn",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_value", type: "uint256" }],
    name: "unfreeze",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "freezeOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_value", type: "uint256" }],
    name: "freeze",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    type: "function",
  },
  {
    inputs: [
      { name: "initialSupply", type: "uint256" },
      { name: "tokenName", type: "string" },
      { name: "decimalUnits", type: "uint8" },
      { name: "tokenSymbol", type: "string" },
    ],
    payable: false,
    type: "constructor",
  },
  { payable: true, type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Freeze",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Unfreeze",
    type: "event",
  },
];

listen = async () => {
  const contract = new web3.eth.Contract(abi, contractAddress);
  contract.getPastEvents(
    "allEvents",
    {
      toBlock: 13003030,
      fromBlock: 13000000,
    },
    (err, events) => {
      console.log(`Events caught: ${events.length}`);
      //console.log(events);
    }
  );
};

async function getFrequencyMap() {
  let tally = {};
  const b = await web3.eth.getBlock("latest");
  console.log(b.transactions.length);
  for (let i = 0; i < b.transactions.length; i++) {
    const tx = await web3.eth.getTransaction(b.transactions[i]);
    console.log(i);
    if (tally[`${tx.from}`]) {
      tally[`${tx.from}`]++;
    } else {
      tally[`${tx.from}`] = 1;
    }
  }

  console.log(tally);
}

getFrequencyMap();
