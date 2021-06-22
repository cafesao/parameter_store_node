require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const throttledQueue = require('throttled-queue')

const KeyAndValue = require('../helpers/KeyAndValue')

const wait = throttledQueue(3, 1000) // at most 3 requests per second.

const SSM = new AWS.SSM()

console.log(`Profile: ${process.env.AWS_PROFILE}`)

function insertParameterJSON(Name, Value) {
  const parameter = `"${Name}": "${Value}",`
  fs.appendFile('./getParameters/Value.json', parameter, (err) => {
    if (err) {
      throw err
    }
    console.log('Parameter + Value = saved.')
  })
}

function getParameter(data) {
  data.keys.map((value, index) => {
    const params = {
      Name: value,
    }
    wait(() => {
      SSM.getParameter(params, (err, response) => {
        if (err) console.log(err.code)
        else {
          console.log(`Name: ${value}`)
          console.log(`Value: ${response.Parameter.Value}`)
          insertParameterJSON(value, response.Parameter.Value)
        }
      })
    })
  })
}

fs.readFile('./getParameters/params.json', 'utf8', (err, data) => {
  if (err) console.error(err)
  const dataJson = KeyAndValue(JSON.parse(data))
  getParameter(dataJson)
})
