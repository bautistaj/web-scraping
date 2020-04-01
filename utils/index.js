const fs = require('fs')

const handleError = (error) => {
  if (error) {
    console.log(error.message)
  }

  console.log('Data saved correctly')
}

const saveData = async (data) => {
  await fs.writeFileSync('./data/data.json', data, 'utf-8', handleError)
}

module.exports = {
  saveData
}
