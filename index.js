require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const throttledQueue = require('throttled-queue')

const wait = throttledQueue(3, 1000) // at most 3 requests per second.

const SSM = new AWS.SSM()

console.log(`Profile: ${process.env.AWS_PROFILE}`)

function KeyAndValue(data) {
  const keys = Object.keys(data)
  const values = Object.values(data)

  return {
    keys,
    values,
  }
}

function insertParameters(data) {
  data.keys.map((value, index) => {
    const params = {
      Name: value,
      Value: data.values[index],
      Type: 'String',
    }
    wait(() => {
      SSM.putParameter(params, (err, data) => {
        if (err) console.log(err.code)
        else console.log(params.Name, data)
      })
    })
  })
}

fs.readFile('./Parameters.json', 'utf8', (err, data) => {
  if (err) console.error(err)
  const dataJson = KeyAndValue(JSON.parse(data))
  insertParameters(dataJson)
})
