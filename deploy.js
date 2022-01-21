require('dotenv').config();

const fs = require('fs-extra');
const path = require('path');
const Web3 = require('web3');

const simpleStorageJson = fs.readJSONSync(path.resolve(__dirname, 'build', 'SimpleStorage.json'));

const abi = simpleStorageJson['abi'];
const bytecode = simpleStorageJson['evm']['bytecode']['object'];

const web3Provider = new Web3.providers.HttpProvider(process.env.HTTP_WEB3_HOST);
const web3 = new Web3(web3Provider);

(async function () {
  const account = process.env.CONTRACT_ACCOUNT_ADDRESS;

  const contract = new web3.eth.Contract(abi);
  let providedGas = 0;

  await contract
    .deploy({
      data: bytecode
    })
    .estimateGas(
      {
        from: account
      },
      (err, gas) => {
        if (err) {
          console.log(err);
        }
        providedGas = gas;
        console.log(`estimated gas to deploy ${gas}`);
      }
    );

  contract
    .deploy({
      data: bytecode
    })
    .send({
      from: account,
      gas: providedGas
    })
    .then((contract) => {
      console.log('Contract was deployed at the following address: ');
      console.log(contract.options.address);
    })
    .catch((err) => {
      console.log(err);
    });
})();
