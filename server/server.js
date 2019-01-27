const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080
const app = express()
var service = require("./service.js");
var jsxPageLoad = require("./jsxPageLoad.js");

app.use('/react-datepicker', express.static(`${__dirname}/../node_modules/react-datepicker/dist/`))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/../react-client/dist`))
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`)
})

jsxPageLoad(app)
service(app)