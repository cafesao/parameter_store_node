require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')
const throttledQueue = require('throttled-queue')

const wait = throttledQueue(3, 1000) // at most 3 requests per second.

const SSM = new AWS.SSM()

const pathFile = './getParams/Value.json'

console.log(`Profile: ${process.env.AWS_PROFILE}`)

function insertParameterJSON(param) {
  fs.appendFile(pathFile, param, (err) => {
    if (err) {
      throw err
    }
    console.log('Saved.')
  })
}

function deleteFile() {
  fs.unlink(pathFile, () => {})
}

/*
  TODO Maximum of results is 50, use Token (Look at documentation)
  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#describeParameters-property
*/
function describeParams() {
  SSM.describeParameters({ MaxResults: '50' }, (err, data) => {
    data.Parameters.map((value) => getParams(value.Name))
  })
}

function getParams(nameParam) {
  wait(() => {
    SSM.getParameter({ Name: nameParam }, (err, response) => {
      if (err) console.log(err.code)
      else {
        console.log(`Name: ${nameParam}`)
        console.log(`Value: ${response.Parameter.Value}`)
        insertParameterJSON(`"${nameParam}": "${response.Parameter.Value}",`)
      }
    })
  })
}

deleteFile()
describeParams()
