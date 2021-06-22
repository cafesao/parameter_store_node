require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const throttledQueue = require('throttled-queue')

const KeyAndValue = require('../helpers/KeyAndValue')

const wait = throttledQueue(3, 1000) // at most 3 requests per second.

const SSM = new AWS.SSM()

console.log(`Profile: ${process.env.AWS_PROFILE}`)

function insertParameter(name, value) {
  const params = {
    Name: name,
    Value: value,
    Type: 'String',
  }
  wait(() => {
    SSM.putParameter(params, (err, data) => {
      if (err) console.log(err.code)
      else console.log(params.Name, data)
    })
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
          console.log(`NameOld: ${value}`)
          console.log(`NameNew: ${data.values[index]}`)
          console.log(`Value: ${response.Parameter.Value}`)
          insertParameter(data.values[index], response.Parameter.Value)
        }
      })
    })
  })
}

fs.readFile('./getAddParameters/params.json', 'utf8', (err, data) => {
  if (err) console.error(err)
  const dataJson = KeyAndValue(JSON.parse(data))
  getParameter(dataJson)
})
