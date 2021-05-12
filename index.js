require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')

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
      Overwrite: true,
      Type: 'String',
    }
    SSM.putParameter(params, (err, data) => {
      if (err) console.log(err, err.stack)
      else console.log(data)
    })
  })
}

fs.readFile('./Parameters.json', 'utf8', (err, data) => {
  if (err) console.error(err)
  const dataJson = KeyAndValue(JSON.parse(data))
  insertParameters(dataJson)
})
