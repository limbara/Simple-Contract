const { default: validator } = require('validator')

const askContractAddress = [
  {
    type: 'input',
    name: 'contractAddress',
    message: 'Input a contract Address?',
    validate(value) {
      if (validator.isEthereumAddress(value)) {
        return true
      }
      return 'Please enter a valid contract address'
    }
  }
]

const askActions = [
  {
    type: 'list',
    name: 'action',
    message: 'What you want to do?',
    choices: [
      'Store Favorite Number',
      'Retrieve Favorite Number',
      'Add Person',
      'Get Person Favorite Number',
      'Get Person By Index'
    ]
  }
]

const askContinue = [
  {
    type: 'confirm',
    name: 'anyMoreAction',
    message: 'Is there any more action?',
    default: false
  }
]

const askStoreFavoriteNumber = [
  {
    type: 'input',
    name: 'favoriteNumber',
    message: 'What is your favorite number?',
    validate(value) {
      const valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

const askAddPerson = [
  {
    type: 'input',
    name: 'name',
    message: 'What is his/her name?',
    validate(value) {
      if (!validator.isEmpty(value) && validator.isAlpha(value)) {
        return true
      }

      return 'Please enter a valid name'
    }
  },
  {
    type: 'input',
    name: 'favoriteNumber',
    message: 'What is the favorite number?',
    validate(value) {
      const valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

const askPersonFavoriteNumber = [
  {
    type: 'input',
    name: 'name',
    message: 'What is his/her name?',
    validate(value) {
      if (!validator.isEmpty(value) && validator.isAlpha(value)) {
        return true
      }

      return 'Please enter a valid name'
    }
  }
]

const askGetPersonByIndex = [
  {
    type: 'input',
    name: 'index',
    message: 'What is the index?',
    validate(value) {
      const valid = !isNaN(parseFloat(value))
      return valid || 'Please enter a number'
    },
    filter: Number
  }
]

/**
 * @param {Array.<String>} accounts
 * @returns
 */
const askAccounts = (accounts) => {
  return [
    {
      type: 'list',
      name: 'account',
      message: 'Who is going to do it?',
      choices: accounts
    }
  ]
}

/**
 * @param {Number} estimatedGas
 * @returns
 */
const askGasApproveOrInsertGas = (estimatedGas) => {
  return [
    {
      type: 'confirm',
      name: 'isApproved',
      message: `Approve estimated gas ${estimatedGas}? or insert your own`,
      default: true
    },
    {
      type: 'input',
      name: 'gasAmount',
      message: 'Enter gas amount:',
      validate(value) {
        const valid = !isNaN(parseFloat(value))
        return valid || 'Please enter a number'
      },
      when(answers) {
        return answers.isApproved === false
      },
      filter: Number
    }
  ]
}

module.exports = {
  askContractAddress,
  askAccounts,
  askActions,
  askContinue,
  askStoreFavoriteNumber,
  askAddPerson,
  askPersonFavoriteNumber,
  askGetPersonByIndex,
  askGasApproveOrInsertGas
}
