'use strict';
require('dotenv').config();
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const {
  askContractAddress,
  askAccounts,
  askActions,
  askContinue,
  askStoreFavoriteNumber,
  askAddPerson,
  askPersonFavoriteNumber,
  askGetPersonByIndex,
  askGasApproveOrInsertGas
} = require('./inquirer-questions');

const simpleStorageJson = fs.readJSONSync(path.resolve(__dirname, 'build', 'SimpleStorage.json'));
const abi = simpleStorageJson['abi'];

(async function () {
  let contractAddress =
    process.env.CONTRACT_ADDRESS || (await inquirer.prompt(askContractAddress)).contractAddress;

  const web3Provider = new Web3.providers.HttpProvider(process.env.HTTP_WEB3_HOST);
  const web3 = new Web3(web3Provider);
  const contract = new web3.eth.Contract(abi, contractAddress);
  const accounts = await web3.eth.getAccounts();

  const askAccount = async () => {
    const { account } = await inquirer.prompt(askAccounts(accounts));

    return account;
  };

  const storeFavoriteNumber = async () => {
    const account = await askAccount();
    const { favoriteNumber } = await inquirer.prompt(askStoreFavoriteNumber);

    await contract.methods
      .store(favoriteNumber)
      .send({
        from: account
      })
      .on('receipt', (receipt) => {
        console.log('your receipt:');
        console.log(receipt);
        console.log('\n');
      });
  };

  const retrieveFavoriteNumber = async () => {
    const account = await askAccount();

    await contract.methods
      .retrieve()
      .call({
        from: account
      })
      .then((result) => {
        console.log(`stored favorite number is ${result}`);
      });
  };

  const addPerson = async () => {
    const account = await askAccount();
    const { name, favoriteNumber } = await inquirer.prompt(askAddPerson);

    const estimatedGas = await contract.methods.addPerson(name, favoriteNumber).estimateGas({
      from: account
    });

    const { isApproved, gasAmount } = await inquirer.prompt(askGasApproveOrInsertGas(estimatedGas));

    const providedGas = isApproved ? estimatedGas : gasAmount;

    await contract.methods
      .addPerson(name, favoriteNumber)
      .send({
        from: account,
        gas: providedGas
      })
      .on('receipt', (receipt) => {
        console.log('your receipt:');
        console.log(receipt);
        console.log('\n');
      });
  };

  const getPersonFavoriteNumber = async () => {
    const account = await askAccount();
    const { name } = await inquirer.prompt(askPersonFavoriteNumber);

    await contract.methods
      .nameToFavoriteNumber(name)
      .call({
        from: account
      })
      .then((result) => {
        console.log(`${name} favorite number is ${result}`);
      });
  };

  const getPersonByIndex = async () => {
    const account = await askAccount();
    const { index } = await inquirer.prompt(askGetPersonByIndex);

    await contract.methods
      .people(index)
      .call({
        from: account
      })
      .then((result) => {
        const { favoriteNumber, name } = result;
        console.log(`Person at index ${index} is ${name} with favorite number ${favoriteNumber}`);
      });
  };

  const continueAction = async () => {
    const { anyMoreAction } = await inquirer.prompt(askContinue);

    if (anyMoreAction) {
      console.log('\n');
      await startAction();
    }
  };

  const startAction = async () => {
    let action = (await inquirer.prompt(askActions)).action;

    switch (action) {
      case 'Store Favorite Number':
        await storeFavoriteNumber();
        break;
      case 'Retrieve Favorite Number':
        await retrieveFavoriteNumber();
        break;
      case 'Add Person':
        await addPerson();
        break;
      case 'Get Person Favorite Number':
        await getPersonFavoriteNumber();
        break;
      case 'Get Person By Index':
        await getPersonByIndex();
        break;
    }
    await continueAction();
  };

  await startAction();
})();
