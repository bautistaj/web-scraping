const puppeteer = require('puppeteer')
const chalk = require('chalk')
const { saveData } = require('./utils')

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

(async () => {
  console.log(`${chalk.green('[Init scrapping]')}`)
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.worldometers.info/coronavirus/')

    const data = await page.evaluate(() => {
      const data = []
      const elements = document.getElementsByClassName('main_table_countries')[0].children[1].children
      for (var element of elements) {
        const object = {
          country: element.children[0].children[0] !== undefined ? element.children[0].children[0].innerHTML : element.children[0].innerHTML,
          totalCases: element.children[1].innerHTML,
          newCases: element.children[2].innerHTML,
          newDeaths: element.children[3].innerHTML,
          totalDeaths: element.children[4].innerHTML,
          totalRecover: element.children[5].innerHTML,
          activeCases: element.children[6].innerHTML,
          seriousCritical: element.children[7].innerHTML,
          topCases: element.children[8].innerHTML,
          topDeaths: element.children[9].innerHTML,
          reported: Date.parse(`${element.children[10].innerHTML.trim()},${new Date().getFullYear()}`)
        }
        data.push(object)
      }
      return data
    })

    await browser.close()
    console.log(`${chalk.green('[End scrapping]')}`)

    console.log(`${chalk.green('[Saving data]')}`)
    
    await saveData(JSON.stringify({data}))
    
    console.log(`${chalk.green('[End to save data]')}`)
  } catch (error) {
    handleFatalError(error)
  }
})()
