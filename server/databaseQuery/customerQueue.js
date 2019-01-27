var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.insertQueueInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `INSERT INTO customer_info (CUSTOMER_CODE , CUSTOMER_DATE , CUSTOMER_TIME , CUSTOMER_NAME , CUSTOMER_TELEPHONE , CUSTOMER_EMAIL , CUSTOMER_AMOUNT)`
    sql += ` SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
    sql += ` (SELECT COUNT( CUSTOMER_DATE ) FROM customer_info`
    sql += ` WHERE CUSTOMER_DATE = CURRENT_DATE ) + 1,`
    sql += ` CURRENT_DATE,`
    sql += ` CURRENT_TIME,`
    sql += ` '${req.body.data.customerName}',`
    sql += ` '${req.body.data.customerTelephone}',`
    sql += ` '${req.body.data.customerEmail ? req.body.data.customerEmail : ''}',`
    sql += ` ${req.body.data.customerAmount}`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        console.log(rows)
        console.log(rows.affectedRows)
        if (err) throw err
        if (rows.affectedRows === 1) {
            console.log('insert 1 row complete!')
            sql = `INSERT INTO queue_info( QUEUE_CODE , QUEUE_NO , QUEUE_DATE , QUEUE_TIME , CUSTOMER_CODE , QUEUE_WAIT )`
            sql += ` SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
            sql += ` ( SELECT COUNT( QUEUE_DATE ) FROM queue_info`
            sql += ` WHERE QUEUE_DATE = CURRENT_DATE ) + 1,`
            sql += ` ( SELECT COUNT( QUEUE_DATE ) FROM queue_info`
            sql += ` WHERE QUEUE_DATE = CURRENT_DATE ) + 1,`
            sql += ` CURRENT_DATE,`
            sql += ` CURRENT_TIME,`
            sql += ` ( SELECT CUSTOMER_CODE FROM customer_info`
            sql += ` WHERE CUSTOMER_CODE = ( SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
            sql += ` ( SELECT COUNT( QUEUE_DATE ) FROM queue_info`
            sql += ` WHERE QUEUE_DATE = CURRENT_DATE ) + 1 )),`
            sql += ` ( SELECT COUNT( QUEUE_STATUS ) FROM queue_info`
            sql += ` WHERE QUEUE_STATUS = '1' ) +`
            sql += ` ( SELECT COUNT( QUEUE_STATUS ) FROM queue_info`
            sql += ` WHERE QUEUE_STATUS = '2' )`
            console.log(sql)
            mysqlConnection.query(sql, function (err, rows1, fields) {
                console.log(rows1)
                if (rows1.affectedRows === 1) {
                    console.log('insert 1 row complete!')
                    var sql = `SELECT a.CUSTOMER_NAME , a.CUSTOMER_AMOUNT , a.CUSTOMER_TELEPHONE , a.CUSTOMER_EMAIL ,DATE_FORMAT( a.CUSTOMER_DATE , "%Y-%m-%d" ) AS CUSTOMER_DATE , a.CUSTOMER_TIME ,`
                    sql += ` b.QUEUE_CODE , b.QUEUE_NO , b.QUEUE_WAIT`
                    sql += ` FROM customer_info a , queue_info b`
                    sql += ` WHERE a.CUSTOMER_CODE = b.CUSTOMER_CODE`
                    sql += ` AND a.CUSTOMER_DATE = (SELECT CUSTOMER_DATE from customer_info ORDER BY CUSTOMER_CODE DESC LIMIT 1)`
                    sql += ` AND a.CUSTOMER_TIME = (SELECT CUSTOMER_TIME from customer_info ORDER BY CUSTOMER_CODE DESC LIMIT 1)`
                    mysqlConnection.query(sql, function (err, rows2, fields) {
                        if (err) throw err
                        if (rows2.length > 0) {
                            res.send(rows2)
                            console.log(rows2)
                        } else {
                            res.send("not found!")
                        }
                    })
                    mysqlConnection.end()
                } else if (rows1.affectedRows === 0) {
                    console.log("can't insert!")
                    res.send("2")
                }
            })
        } else if (rows.affectedRows === 0) {
            console.log("can't insert!")
            res.send("0")
        }
    })
}
exports.selectQueueInfoNormal = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.CUSTOMER_NAME , a.CUSTOMER_AMOUNT , a.CUSTOMER_TELEPHONE , b.QUEUE_CODE , b.QUEUE_NO , b.QUEUE_STATUS ,b.TABLE_NO , c.QUEUE_STATUS_DESCRIPTION`
    sql += ` FROM customer_info a , queue_info b , queue_status_info c`
    sql += ` WHERE a.CUSTOMER_CODE = b.CUSTOMER_CODE`
    sql += ` AND b.QUEUE_STATUS = c.QUEUE_STATUS_NO`
    sql += ` AND b.QUEUE_STATUS = '1'`
    sql += ` AND b.TABLE_NO = '0'`
    sql += ` ORDER BY a.CUSTOMER_CODE`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }
exports.selectQueueInfoWait = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.CUSTOMER_NAME , a.CUSTOMER_AMOUNT , a.CUSTOMER_TELEPHONE , b.QUEUE_CODE , b.QUEUE_NO , b.QUEUE_STATUS ,b.TABLE_NO , c.QUEUE_STATUS_DESCRIPTION`
    sql += ` FROM customer_info a , queue_info b , queue_status_info c`
    sql += ` WHERE a.CUSTOMER_CODE = b.CUSTOMER_CODE`
    sql += ` AND b.QUEUE_STATUS = c.QUEUE_STATUS_NO`
    sql += ` AND b.QUEUE_STATUS = '2'`
    sql += ` AND b.TABLE_NO = '0'`
    sql += ` ORDER BY a.CUSTOMER_CODE`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }
 exports.updateQueueStatusToWait = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `UPDATE queue_info`
    sql += ` SET QUEUE_STATUS = '2'`
    sql += ` WHERE QUEUE_CODE = '${req.params.queueCode}'`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
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
exports.updateQueueInfoAndSetTable = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
        var sql = `UPDATE table_info`
        sql += ` SET table_status = '2'`
        sql += ` WHERE TABLE_NO = ${req.params.tableNo}`
        console.log(sql)
        mysqlConnection.query(sql, function (err, rows, fields) {
          if (err) throw err
          if (rows.affectedRows === 1) {
            console.log('update 1 row complete!')
            var sql = `UPDATE queue_info`
            sql += ` SET QUEUE_STATUS = '3',`
            sql += ` TABLE_NO = ${req.params.tableNo}`
            sql += ` WHERE QUEUE_CODE = '${req.params.queueCode}'`
            console.log(sql)
            mysqlConnection.query(sql, function (err, rows1, fields) {
              if (err) throw err
              console.log(rows1)
              if (rows1.affectedRows === 1) {
                console.log('update 1 row complete!')
                res.send("1")
              } else if (rows1.affectedRows === 0) {
                console.log("can't update!")
                res.send("0")
              }
            })
            mysqlConnection.end()
          } else if (rows.affectedRows === 0) {
            console.log("can't update!")
            res.send("0")
          }
        })
  }
exports.selectQueueInfo = function (req, res) {                     //Payment.jsx
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.QUEUE_CODE , a.QUEUE_NO , b.CUSTOMER_NAME , b.CUSTOMER_AMOUNT`
    sql += ` FROM queue_info a , customer_info b`
    sql += ` WHERE a.CUSTOMER_CODE = b.CUSTOMER_CODE`
    sql += ` AND a.TABLE_NO = ${req.params.tableNo}`
    sql += ` ORDER BY QUEUE_CODE DESC`
    sql += ` LIMIT 1`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      if (rows.length === 1) {
        res.send(rows)
        console.log(req.body)
        console.log(rows)
      } else {
        res.send("0")
        console.log(req.body)
      }
    })
    mysqlConnection.end()
}

exports.insertQueueFromRegister = function (req, res) {
  var mysqlConnection = mysql.createConnection(connectConfig);
  mysqlConnection.connect(function (err) {
      if (err) throw err
  })
  var sql = `INSERT INTO customer_info (CUSTOMER_CODE , CUSTOMER_DATE , CUSTOMER_TIME , CUSTOMER_NAME , CUSTOMER_TELEPHONE , CUSTOMER_EMAIL , CUSTOMER_AMOUNT)`
  sql += ` SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
  sql += ` (SELECT COUNT( CUSTOMER_DATE ) FROM customer_info`
  sql += ` WHERE CUSTOMER_DATE = CURRENT_DATE ) + 1,`
  sql += ` CURRENT_DATE,`
  sql += ` CURRENT_TIME,`
  sql += ` '${req.body.reserveName}',`
  sql += ` '${req.body.reserveTelephone}',`
  sql += ` '${req.body.reserveEmail ? req.body.reserveEmail : ''}',`
  sql += ` '${req.body.reserveAmount}'`
  console.log(sql)
  mysqlConnection.query(sql, function (err, rows, fields) {
      console.log(rows)
      console.log(rows.affectedRows)
      if (err) throw err
      if (rows.affectedRows === 1) {
          console.log('insert 1 row complete!')
          sql = `INSERT INTO queue_info( QUEUE_CODE , QUEUE_NO , QUEUE_DATE , QUEUE_TIME , CUSTOMER_CODE , QUEUE_WAIT , TABLE_NO , QUEUE_STATUS )`
          sql += ` SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
          sql += ` ( SELECT COUNT( QUEUE_DATE ) FROM queue_info`
          sql += ` WHERE QUEUE_DATE = CURRENT_DATE ) + 1,`
          sql += ` ( SELECT COUNT( QUEUE_DATE ) FROM queue_info`
          sql += ` WHERE QUEUE_DATE = CURRENT_DATE ) + 1,`
          sql += ` CURRENT_DATE,`
          sql += ` CURRENT_TIME,`
          sql += ` ( SELECT CUSTOMER_CODE FROM customer_info`
          sql += ` WHERE CUSTOMER_CODE = ( SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
          sql += ` ( SELECT COUNT( QUEUE_DATE ) FROM queue_info`
          sql += ` WHERE QUEUE_DATE = CURRENT_DATE ) + 1 )),`
          sql += ` '0', '${req.body.tableNo}', '3'`
          console.log(sql)
          mysqlConnection.query(sql, function (err, rows1, fields) {
              console.log(rows1)
              if (rows1.affectedRows === 1) {
                  console.log('insert 1 row complete!')
                  sql = `UPDATE table_info`
                  sql += ` SET table_status = '2'`
                  sql += ` WHERE TABLE_NO = ${req.body.tableNo}`
                  mysqlConnection.query(sql, function (err, rows2, fields) {
                    console.log(rows2)
                    console.log(rows.affectedRows)
                    if (err) throw err
                    if (rows.affectedRows === 1) {
                      console.log('update 1 row complete!')
                      sql = `UPDATE reserve_info`
                      sql += ` SET CUSTOMER_CODE = (SELECT MAX(CUSTOMER_CODE) FROM customer_info)`
                      sql += ` where RESERVE_CODE = '${req.body.reserveCode}'`
                      mysqlConnection.query(sql, function (err, rows3, fields) {
                        console.log(rows3)
                        console.log(rows.affectedRows)
                        if (err) throw err
                        if (rows.affectedRows === 1) {
                          console.log('update 1 row complete!')
                          mysqlConnection.end()
                        }
                      })
                    }
                  })
              }   
          })
      } else if (rows.affectedRows === 0) {
          console.log("can't insert!")
          res.send("0")
      }
  })
}