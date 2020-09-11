const path = require('path')

function getPrivacyPolicy(req, res) {
  console.log(path.resolve(__dirname + '/../public/privacy-policy.html'))
  res.sendFile(path.resolve(__dirname + '/../public/privacy-policy.html'))

  //res.send('Status(202)')
}

module.exports = {
  getPrivacyPolicy
}