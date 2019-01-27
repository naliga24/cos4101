var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.insertPaymentInfo = function (req, res) {
        console.log(req.params)
        var mysqlConnection = mysql.createConnection(connectConfig)
        mysqlConnection.connect(function (err) {
          if (err) throw err
        })
        var sql = `INSERT INTO payment_info (PAYMENT_CODE , PAYMENT_DATE , PAYMENT_TIME , ORDER_CODE , TOTAL_AMOUNT , RECEIVE_AMOUNT , EXCHANGE_AMOUNT , PAYMENT_STATUS)`
        sql += ` SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
        sql += ` (SELECT COUNT( PAYMENT_DATE )`
        sql += ` FROM payment_info`
        sql += ` WHERE PAYMENT_DATE = CURRENT_DATE ) + 1,`
        sql += ` CURRENT_DATE,`
        sql += ` CURRENT_TIME,`
        sql += ` '${req.params.orderCode}',`
        sql += ` ${req.params.totalAmount},`
        sql += ` ${req.params.receiveAmount},`
        sql += ` ${req.params.exchangeAmount},`
        sql += ` '1'`
        console.log(sql)
        mysqlConnection.query(sql, function (err, rows, fields) {
          if (err) throw err
          console.log(fields)
          console.log(rows)
          if (rows.affectedRows === 1) {
            console.log('insert 1 row complete!')
            var sql = `UPDATE table_info`
            sql += ` SET TABLE_STATUS = '1'`
            sql += ` WHERE TABLE_NO = ${req.params.tableNo}`
            console.log(sql)
            mysqlConnection.query(sql, function (err, rows1, fields) {
              if (err) throw err
              if (rows1.affectedRows === 1) {
                console.log('update 1 row complete!')
                var sql = `SELECT a.PAYMENT_CODE , DATE_FORMAT( a.PAYMENT_DATE,"%Y-%m-%d" )AS PAYMENT_DATE , a.PAYMENT_TIME , a.RECEIVE_AMOUNT, a.EXCHANGE_AMOUNT , b.PAYMENT_STATUS_DESCRIPTION`
                sql += ` FROM payment_info a , payment_status_info b`
                sql += ` WHERE a.PAYMENT_STATUS = b.PAYMENT_STATUS_NO`
                sql += ` AND a.ORDER_CODE = '${req.params.orderCode}'`
                console.log(sql)
                mysqlConnection.query(sql, function (err, rows2, fields) {
                  if (err) throw err
                  console.log(rows2)
                  res.send(rows2)
                })
                mysqlConnection.end()
              } else if (rows.affectedRows === 0) {
                console.log("can't update!")
                res.send("2")
              }
            })
          } else if (rows.affectedRows === 0) {
            console.log("can't insert!")
            res.send("0")
          }
        })
      }    
exports.updatePaymentInfo = function (req, res) {
        var mysqlConnection = mysql.createConnection(connectConfig)
        mysqlConnection.connect(function (err) {
          if (err) throw err
        })
        var sql = `UPDATE payment_info`
        sql += ` SET RECEIVE_AMOUNT = ${req.params.receiveAmount},`
        sql += ` EXCHANGE_AMOUNT = ${req.params.exchangeAmount}`
        sql += ` WHERE PAYMENT_CODE = '${req.params.paymentCode}'`
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
exports.selectPaymentInfo = function (req, res) {
        var mysqlConnection = mysql.createConnection(connectConfig);
        mysqlConnection.connect(function (err) {
          if (err) throw err
        })
        var sql = `SELECT d.PAYMENT_CODE , b.TABLE_NO , c.TABLE_ROUND , b.QUEUE_NO , a.CUSTOMER_NAME , a.CUSTOMER_AMOUNT , c.ORDER_CODE , e.PAYMENT_STATUS_DESCRIPTION , f.TABLE_CAPACITY , DATE_FORMAT(c.ORDER_DATE , "%Y-%m-%d") AS ORDER_DATE , c.ORDER_TIME , c.ORDER_TOTAL_PRICE , DATE_FORMAT(d.PAYMENT_DATE , "%Y-%m-%d") AS PAYMENT_DATE , d.PAYMENT_TIME , d.RECEIVE_AMOUNT , d.EXCHANGE_AMOUNT`
        sql += ` FROM customer_info a , queue_info b , order_header c , payment_info d , payment_status_info e , table_info f`
        sql += ` WHERE a.CUSTOMER_CODE = b.CUSTOMER_CODE`
        sql += ` AND b.QUEUE_CODE = c.QUEUE_CODE`
        sql += ` AND c.ORDER_CODE = d.ORDER_CODE`
        sql += ` AND d.PAYMENT_STATUS = e.PAYMENT_STATUS_NO`
        sql += ` AND b.TABLE_NO = f.TABLE_NO`
        sql += ` AND d.PAYMENT_CODE LIKE '%${req.body.data.paymentCode}%'`
        sql += ` AND d.PAYMENT_DATE LIKE '%${req.body.data.paymentDateSTR}%'`
        sql += ` AND b.TABLE_NO LIKE '%${req.body.data.tableNo}%'`
        sql += ` AND a.CUSTOMER_NAME LIKE '%${req.body.data.customerName}%'`
        sql += ` ORDER BY d.PAYMENT_DATE DESC , d.PAYMENT_TIME DESC`
        console.log(sql)
        mysqlConnection.query(sql, function (err, rows, fields) {
          if (err) throw err
          res.send(rows)
        })
        mysqlConnection.end()
      }      
