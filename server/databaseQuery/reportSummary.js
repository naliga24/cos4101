var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.selectFoodTypeDescription = function (req, res) {
    console.log(req.params)
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `select FOOD_TYPE_NO , FOOD_TYPE_DESCRIPTION from FOOD_TYPE_INFO `
    sql += `order by FOOD_TYPE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send(rows);
    })
    mysqlConnection.end()
}