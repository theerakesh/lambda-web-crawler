const AWS = require("aws-sdk")


AWS.config.update({
  region: 'ap-south-1'
})
const s3 = new AWS.S3()

var uploadParams = {
  Bucket: process.env.S3BucketName,
  Body: '',
  Key: ''
};


exports.handler = async (event, context) => {
  const status = event["statusCode"]
  if (status !== 200) {
    return {
      'statusCode': 400,
      'body': 'first lambda erred!!! plz check if the domain is crawlable'
    }
  }
  const url = event["domain"]
  let res
  try {
    res = await (await s3.listObjectsV2({ Bucket: process.env.S3BucketName, Prefix: `${url}/` }).promise()).Contents
    console.log(res)
  } catch (e) {
    return {
      'statusCode': 400,
      'body': JSON.stringify(e)
    }
  }
  let emails = new Set()
  let phones = new Set()
  for (r of res) {
    try {

      const objectData = await (await s3.getObject({ Bucket: process.env.S3BucketName, Key: r.Key }).promise()).Body.toString('utf-8')
      let email_matches = objectData.match(/\w+@\w+\.[a-z]+/g)
      let phone_matches = objectData.match(/(?<!\d)(\+ ?\d{1,2}\s?)\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)/g)
      if (email_matches) {
        for (let i of email_matches) {
          emails.add(i)
        }
      }
      if (phone_matches) {
        for (let i of phone_matches) {
          phones.add(i)
        }
      }
    } catch (e) {
      return {
        'statusCode': 400,
        'body': JSON.stringify(e)
      }
    }
  }
  return {
    'statusCode': 200,
    'body': `emails: ${JSON.stringify([...emails])} \n phones: ${JSON.stringify([...phones])}`
  }
}