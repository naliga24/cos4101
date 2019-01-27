var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.updateUserTypeInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    });
    var sql = `SELECT COUNT(*) FROM user_type_info`
    sql += ` WHERE USER_TYPE_NO = '${req.params.userTypeNo}'`
    sql += ` AND USER_TYPE_NO > '0'`
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows[0]['COUNT(*)'] === 1) {
            sql = `UPDATE user_type_info`
            sql += ` SET USER_TYPE_PERMISSION = '${req.params.permission}'`
            sql += ` WHERE USER_TYPE_NO = '${req.params.userTypeNo}'`
            mysqlConnection.query(sql, function (err, rows, fields) {
                if (err) throw err
                console.log('update 1 row complete!')
                res.send('complete')

            })
            mysqlConnection.end()
        }
    })
}
exports.selectUserTypeInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    });
    var sql = `SELECT * FROM user_type_info`
    sql += ` WHERE USER_TYPE_NO > '0'`
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows.length > 0) {
            res.send(rows)
        }
    })
    mysqlConnection.end()
}