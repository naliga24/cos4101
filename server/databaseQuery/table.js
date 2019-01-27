var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.insertTableInfo = function (req, res) {
    console.log(req.params)
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `INSERT INTO table_info ( TABLE_NO , TABLE_CAPACITY , TABLE_STATUS , USE_STATUS )`
    sql += ` SELECT COUNT(*) + 1 , ${req.params.tableCapacity} , '1' , ${req.params.useStatus}`
    sql += ` FROM table_info`
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        console.log(fields)
        console.log(rows)
        if (rows.affectedRows === 1) {
            console.log('insert 1 row complete!')
            res.send("1")
        } else if (rows.affectedRows === 0) {
            console.log("can't insert!")
            res.send("0")
        }
    })
    mysqlConnection.end()
}
exports.updateTableInfo = function (req, res) {
    console.log(req.params)
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `UPDATE table_info`
    sql += ` SET TABLE_CAPACITY = ${req.params.tableCapacity} , USE_STATUS = '${req.params.useStatus}'`
    sql += ` WHERE TABLE_NO = ${req.params.tableNo}`
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        console.log(fields)
        console.log(rows)
        console.log(sql)
        if (rows.affectedRows === 1) {
            console.log('update 1 row complete!')
            res.send("1")
        } else if (rows.affectedRows === 0) {
            console.log("can't update!")
            res.send("0")
        }
    })
    mysqlConnection.end()
}
exports.selectTableInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `SELECT a.TABLE_NO , a.TABLE_CAPACITY , a.TABLE_STATUS , a.USE_STATUS , b.TABLE_STATUS_DESCRIPTION , c.USE_STATUS_DESCRIPTION`
    sql += ` FROM TABLE_INFO a, TABLE_STATUS_INFO b, USE_STATUS_INFO c`
    sql += ` WHERE a.TABLE_STATUS = b.TABLE_STATUS_NO`
    sql += ` AND a.USE_STATUS = c.USE_STATUS_NO`
    sql += ` AND a.TABLE_NO LIKE '%${req.body.data.tableNo}%'`
    sql += req.body.data.dscAsc && req.body.data.tableCapacity ? ` AND a.TABLE_CAPACITY  ${req.body.data.dscAsc} ${req.body.data.tableCapacity}` : ` AND a.TABLE_CAPACITY LIKE '%${req.body.data.tableCapacity}%'`
    sql += ` AND a.TABLE_STATUS LIKE '%${req.body.data.tableStatus}%'`
    sql += ` AND a.USE_STATUS LIKE '%${req.body.data.useStatus}%'`
    sql += ` ORDER BY a.TABLE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        console.log(rows)
        res.send(rows);
    })
    mysqlConnection.end()
}
exports.selectTableInfoFreeTable = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.TABLE_NO , a.TABLE_CAPACITY , b.TABLE_STATUS_DESCRIPTION`
    sql += ` FROM table_info a , table_status_info b, reserve_info c`
    sql += ` WHERE a.TABLE_STATUS = b.TABLE_STATUS_NO`
    sql += ` AND a.TABLE_STATUS = '1'`
    sql += ` AND a.USE_STATUS = '1'`
    sql += ` AND a.TABLE_NO > 0`
    sql += ` AND a.TABLE_NO NOT IN (SELECT reserve_table_no from reserve_info where `
    sql += ` current_date() = reserve_date`
    sql += ` AND date_add(current_time, interval 30  minute) >= reserve_start_time`
    sql += ` AND date_add(current_time, interval 30  minute) <= reserve_end_time group by reserve_table_no)`
    sql += ` GROUP BY a.TABLE_NO , a.TABLE_CAPACITY , b.TABLE_STATUS_DESCRIPTION`
    sql += ` ORDER BY a.TABLE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }
exports.selectTableInfoAllTable = function (req, res) {           //loop                   //Payment.jsx
    var mysqlConnection = mysql.createConnection(connectConfig); 
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.TABLE_NO , a.TABLE_CAPACITY , b.TABLE_STATUS_DESCRIPTION`
    sql += ` FROM table_info a , table_status_info b`
    sql += ` WHERE a.TABLE_STATUS = b.TABLE_STATUS_NO`
    sql += ` AND a.USE_STATUS = '1'`
    sql += ` AND a.TABLE_NO > 0`
    sql += ` ORDER BY a.TABLE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      if (rows.length > 0) {
        res.send(rows)
        console.log(req.body)
        console.log(rows)
      } else {
        res.send("not found!")
        console.log(req.body)
      }
    })
    mysqlConnection.end()
  }
  exports.selectTableInfoFullTable = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.TABLE_NO , a.TABLE_CAPACITY , b.TABLE_STATUS_DESCRIPTION`
    sql += ` FROM table_info a , table_status_info b`
    sql += ` WHERE a.TABLE_STATUS = b.TABLE_STATUS_NO`
    sql += ` AND a.TABLE_STATUS = '3'`
    sql += ` AND a.USE_STATUS = '1'`
    sql += ` AND a.TABLE_NO > 0`
    sql += ` ORDER BY a.TABLE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }

  exports.selectTableInfoReserveAndFullTable = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.TABLE_NO , a.TABLE_CAPACITY , b.TABLE_STATUS_DESCRIPTION`
    sql += ` FROM table_info a , table_status_info b`
    sql += ` WHERE a.TABLE_STATUS = b.TABLE_STATUS_NO`
    sql += ` AND a.USE_STATUS = '1'`
    sql += ` AND a.TABLE_NO > 0`
    sql += ` AND (a.TABLE_STATUS = '2' OR a.TABLE_STATUS = '3')`
    sql += ` ORDER BY a.TABLE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }

  exports.selectTableForReserve = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `select TABLE_NO `
    sql += `from table_info `
    sql += `where TABLE_NO > '0' `
    sql += `order by TABLE_NO`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }

  exports.selectFreeTable = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `select count(TABLE_NO) as COUNT `
    sql += `from table_info `
    sql += `where TABLE_NO = '${req.body.tableNo}' `
    sql += `and TABLE_STATUS = '1'`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }