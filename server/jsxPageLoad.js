module.exports = function(app){
const path = require('path')
app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
})
//JSX file page.
app.get('/HomePage', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Queue', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/QueueManage', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/QueueReserve', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Order', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Payment', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/PaymentSearch', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Cooking', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Food', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/FoodSearch', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Table', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/TableSearch', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/User', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/UserType', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/UserSearch', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Configuration', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
  app.get('/Report', function (req, res) {
    res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`))
  })
}
    