var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.selectDataReserve = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `set @ROW_NO := 0;`
    sql += `select ((@ROW_NO:=@ROW_NO + 1)) as RESERVE_NO, `
    sql += `RESERVE_CODE, `
    sql += `DATE_FORMAT(RESERVE_DATE, "%Y/%m/%d") as RESERVE_DATE ,`
    sql += `RESERVE_TABLE_NO, RESERVE_START_TIME, RESERVE_END_TIME, RESERVE_NAME, `
    sql += `RESERVE_AMOUNT, RESERVE_TELEPHONE, RESERVE_EMAIL, CUSTOMER_CODE `
    sql += `from RESERVE_INFO `
    sql += `where RESERVE_DATE = '${req.body.reserveDate}' `
    sql += `and RESERVE_TABLE_NO = '${req.body.tableNo}' `
    sql += `order by RESERVE_CODE`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send(rows);
    })
    mysqlConnection.end()
}

exports.insertDataReserve = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `insert into RESERVE_INFO (RESERVE_CODE , RESERVE_DATE , RESERVE_TABLE_NO, RESERVE_START_TIME , `
    sql += `RESERVE_END_TIME , RESERVE_NAME , RESERVE_AMOUNT , RESERVE_TELEPHONE, RESERVE_EMAIL) `
    sql += `select DATE_FORMAT('${req.body.reserveDate}' , "%y%m%d" ) * 10000 + `
    sql += `(select count(RESERVE_DATE) from RESERVE_INFO `
    sql += `where RESERVE_DATE = '${req.body.reserveDate}' ) + 1, '${req.body.reserveDate}', `
    sql += `'${req.body.tableNo}', '${req.body.startTime}', `
    sql += `'${req.body.endTime}', '${req.body.reserveName}', `
    sql += `'${req.body.reserveAmount}', '${req.body.reserveTelephone}', `
    sql += `'${req.body.reserveEmail ? req.body.reserveEmail : ''}'`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        console.log(rows)
        console.log(rows.affectedRows)
        if (err) throw err
        if (rows.affectedRows === 1) {
            console.log('insert 1 row complete!')
        }
         res.status(200).send()
    })
    mysqlConnection.end()
}

exports.checkTime = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `select ((select count(RESERVE_TABLE_NO) `
    sql += `from RESERVE_INFO `
    sql += `where RESERVE_DATE = '${req.body.reserveDate}' `
    sql += `and RESERVE_TABLE_NO = '${req.body.tableNo}' `
    sql += `and RESERVE_START_TIME between '${req.body.startTime}' and '${req.body.endTime}') + `
    sql += `(select count(RESERVE_TABLE_NO) `
    sql += `from RESERVE_INFO `
    sql += `where RESERVE_DATE = '${req.body.reserveDate}' `
    sql += `and RESERVE_TABLE_NO = '${req.body.tableNo}' `
    sql += `and RESERVE_END_TIME between '${req.body.startTime}' and '${req.body.endTime}')) as COUNT`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send(rows);
    })
    mysqlConnection.end()
}