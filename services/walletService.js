//-----------------------------------------------------------IMPORTS----------------------------------------------------------
const Web3 = require("web3");
const web3 = new Web3(
  "https://ropsten.infura.io/v3/ee4038b62e4e49dbbf5b24a9cb22ffb6"
);
const { Transaction } = require("ethereumjs-tx");
const Tx = Transaction;
const messages = require("../localization/messages");
const { tokenABI, tokenAddress } = require("./token");
const InputDataDecoder = require("ethereum-input-data-decoder");
const decoder = new InputDataDecoder(tokenABI);
const contract = new web3.eth.Contract(tokenABI, tokenAddress);
const mongoose = require("mongoose");
const { accounts, mongoPass } = require("../secrets.json");
const walletSchema = require("../models/walletSchema");
const userSchema = require("../../Playground/models/user-schema");
const mongoPath = `mongodb+srv://aly:${mongoPass}@cluster0.fwdpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//-------------------------------------------------Initialize Dependencies--------------------------------------------------
mongoose
  .connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(`Error connecting to MongoDB: ${e}`);
  });
const fs = require("fs");
const wordFile = fs.readFileSync("../localization/words_alpha.txt", {
  encoding: "utf8",
  flag: "r",
});
const dictionary = wordFile.split("\r\n");

//-------------------------------------------------------Wallet Management----------------------------------
async function createWallet(password) {
  try {
    const userWallet = web3.eth.accounts.wallet.create(1);
    const wordList = await createWordList();
    let uw = new walletSchema({
      password,
      wordList,
      wallet: userWallet.encrypt(password),
    });
    const res = await uw.save();
    console.log(res);
    return {
      message: messages.wallet.createWallet.success,
      data: { _id: res._id, userWallet },
    };
  } catch (e) {
    console.log(e);
    return { message: messages.wallet.createWallet.failure, data: null };
  }
}

async function createWordList() {
  try {
    let unique = false;
    let wordList = [];
    while (!unique) {
      for (let i = 0; i < 6; i++) {
        let randWord =
          dictionary[Math.floor(Math.random() * dictionary.length)];
        wordList.push(randWord);
      }
      const res = await walletSchema.findOne({ wordList: wordList });
      if (res) {
        console.log("wordList already exists in DB.\n Regenerating list...");
      } else {
        unique = true;
        console.log("Unique wordList generated.");
      }
    }
    return wordList;
  } catch (e) {
    console.log(e);
  }
}

async function recoverWallet(wordList, newPassword) {
  try {
    const res = await walletSchema.findOne({ wordList: wordList });
    if (res) {
      const wallet = web3.eth.accounts.wallet.decrypt(res.wallet, res.password);
      res.password = newPassword;
      res.wallet = wallet.encrypt(newPassword);
      res.save();
      return { message: messages.wallet.retrieveWallet.success, data: wallet };
    } else {
      return { message: messages.wallet.retrieveWallet.failure, data: null };
    }
  } catch (e) {
    console.log(e);
  }
}

async function signIn(_id, password) {
  try {
    res = await walletSchema.findById(_id);
    if (res) {
      if (res.password == password) {
        return { message: messages.wallet.signIn.success };
      } else {
        return { message: messages.wallet.signIn.failure };
      }
    } else {
      return { message: messages.wallet.signIn.user_not_found };
    }
  } catch (e) {
    console.log(e);
  }
}
//--------------------------------------------Wallet Operation Functions--------------------------------------------
async function createAccount(userWallet) {
  try {
    const account = web3.eth.accounts.create();
    userWallet.add(account);
    await walletSchema.findOne({ wallet: userWallet.encrypt("secretKey") });
    if (account) {
      return {
        message: messages.wallet.createAccount.success,
        data: account,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: messages.wallet.createAccount.failure,
      data: null,
    };
  }
}

async function getBalance(address) {
  try {
    const response = await web3.eth.getBalance(address);
    if (response) {
      return {
        message: messages.wallet.getBalance.success,
        data: response,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: messages.wallet.getBalance.failure,
      data: null,
    };
  }
}

async function transfer(from, to, privKey, amount) {
  try {
    //Create TxObject
    const txCount = await web3.eth.getTransactionCount(from);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: to,
      value: web3.utils.toHex(amount),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    };
    const tx = new Tx(txObject, { chain: "ropsten" });

    //SignTransaction
    const pKey = Buffer.from(privKey, "hex");
    tx.sign(pKey);

    //SerializeTransaction
    const serializedTransaction = tx.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    //Send
    const response = await web3.eth.sendSignedTransaction(raw);
    if (response) {
      return { message: messages.wallet.transfer.success, data: response };
    }
  } catch (e) {
    console.log(`Error during wallet.transfer: ${e}`);
    return { message: messages.wallet.transfer.failure, data: null };
  }
}
async function getTransaction(txHash) {
  try {
    const tx = await web3.eth.getTransaction(txHash);

    if (tx) {
      if (tx.input !== "0x") {
        tx.input = decoder.decodeData(tx.input);

        //Make it readable
        const readableData = {
          method: tx.input.method,
        };
        for (let i = 0; i < 2; i++) {
          readableData[`${tx.input.names[i]}`] =
            tx.input.inputs[i].toString(10);
        }
        readableData._to = "0x" + readableData._to;
        readableData._value = web3.utils.fromWei(readableData._value, "ether");
        tx.input = readableData;
      }
      return { message: messages.wallet.getTransaction.success, data: tx };
    }
  } catch (e) {
    console.log(e);
    return { message: messages.wallet.getTransaction.failure, data: null };
  }
}

async function getTokenName() {
  try {
    const contractName = await contract.methods.name().call();
    if (contractName) {
      return {
        message: messages.wallet.getTokenName.success,
        data: contractName,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: messages.wallet.getTokenName.failure,
      data: null,
    };
  }
}
async function getTokenSymbol() {
  try {
    const contractSymbol = await contract.methods.symbol().call();
    if (contractSymbol) {
      return {
        message: messages.wallet.getTokenSymbol.success,
        data: contractSymbol,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: messages.wallet.getTokenSymbol.failure,
      data: null,
    };
  }
}
async function getTokenSupply() {
  try {
    const contractSupply = await contract.methods.totalSupply().call();
    if (contractSupply) {
      return {
        message: messages.wallet.getTokenSupply.success,
        data: contractSupply,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: messages.wallet.getTokenSupply.failure,
      data: null,
    };
  }
}
async function getTokenBalance(address) {
  try {
    const contractBalanceWei = await contract.methods.balanceOf(address).call();
    const contractBalance = web3.utils.fromWei(contractBalanceWei, "ether");
    console.log(contractBalance);
    if (contractBalance) {
      return {
        message: messages.wallet.getTokenBalance.success,
        data: contractBalance,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      message: messages.wallet.getTokenBalance.failure,
      data: null,
    };
  }
}

async function transferTokens(from, to, privKey, amount) {
  try {
    //Create TxObject
    amount = web3.utils.toWei(amount, "ether");

    const txCount = await web3.eth.getTransactionCount(from);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      from: from,
      to: tokenAddress,
      value: "0x0",
      gasLimit: web3.utils.toHex(210000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      data: contract.methods.transfer(to, amount).encodeABI(),
    };
    const tx = new Tx(txObject, { chain: "ropsten" });

    //SignTransaction
    const pKey = Buffer.from(privKey, "hex");
    tx.sign(pKey);

    //SerializeTransaction
    const serializedTransaction = tx.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    //Send
    const response = await web3.eth.sendSignedTransaction(raw);
    console.log(response);
    if (response) {
      return {
        message: messages.wallet.transferTokens.success,
        data: response,
      };
    }
  } catch (e) {
    console.log(`Error during wallet.transfer: ${e}`);
    return { message: messages.wallet.transferTokens.failure, data: null };
  }
}

async function test() {
  //MyWallets
  await createWallet("aly");
}

module.exports = {
  signIn,
  createWallet,
  recoverWallet,
  createAccount,
  transfer,
  getBalance,
  getTransaction,
  getTokenName,
  getTokenSymbol,
  getTokenSupply,
  getTokenBalance,
  transferTokens,
};
