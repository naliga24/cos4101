var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

var orderUpdateHeader = function (orderCode, mysqlConnection, req, res) {
  sql = `UPDATE order_header`
  sql += ` SET ORDER_TOTAL_PRICE = (SELECT SUM(FOOD_TOTAL)`
  sql += ` FROM order_detail WHERE ORDER_CODE = '${orderCode}')`
  sql += ` WHERE ORDER_CODE = '${orderCode}'`

    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows.affectedRows === 1) {
            console.log('update 1 row complete!')
        } else if (rows.affectedRows === 0) {
            console.log("can't update!")
        }
    })
    mysqlConnection.end()
}
exports.insertOrderHeader = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `INSERT INTO order_header (ORDER_CODE , ORDER_DATE , ORDER_TIME , QUEUE_CODE , TABLE_ROUND , ORDER_TOTAL_PRICE)`
    sql += ` SELECT DATE_FORMAT( CURRENT_DATE , "%y%m%d" ) * 10000 +`
    sql += ` (SELECT COUNT( ORDER_DATE ) FROM order_header`
    sql += ` WHERE ORDER_DATE = CURRENT_DATE ) + 1,`
    sql += ` CURRENT_DATE,`
    sql += ` CURRENT_TIME,`
    sql += ` '${req.params.queueCode}',`
    sql += ` (SELECT COUNT(a.TABLE_ROUND) + 1`
    sql += ` FROM order_header a , queue_info b`
    sql += ` WHERE a.QUEUE_CODE = b.QUEUE_CODE`
    sql += ` AND b.TABLE_NO = ${req.params.tableNo}`
    sql += ` AND a.ORDER_DATE = CURRENT_DATE),`
    sql += ` 0`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows.affectedRows === 1) {
            console.log('insert 1 row complete!')
            sql = `UPDATE table_info`
            sql += ` SET TABLE_STATUS = '3'`
            sql += ` WHERE TABLE_NO = ${req.params.tableNo}`

            console.log(sql)
            mysqlConnection.query(sql, function (err, rows1, fields) {
                if (err) throw err
                if (rows1.affectedRows === 1) {
                  console.log('update 1 row complete!')
                  res.send("1")
                } else if (rows1.affectedRows === 0) {
                    console.log("can't update!")
                    res.send("2")
                }
            })
            mysqlConnection.end()
        } else if (rows.affectedRows === 0) {
            console.log("can't insert!")
            res.send("0")
        }
        console.log(rows)
    })
}
exports.insertOrderDetail = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `INSERT INTO order_detail (ORDER_CODE , ORDER_NO , FOOD_CODE , FOOD_TYPE , FOOD_NAME , FOOD_PRICE , FOOD_AMOUNT , FOOD_TOTAL , FOOD_DATE , FOOD_TIME , FOOD_STATUS)`
    sql += ` VALUES`
    sql += ` ('${req.params.orderCode}',`
    sql += ` (SELECT COUNT(ORDER_CODE) + 1`
    sql += ` FROM (SELECT ORDER_CODE FROM order_detail)AS x`
    sql += ` WHERE ORDER_CODE = '${req.params.orderCode}'),`
    sql += ` '${req.params.foodCode}',`
    sql += ` '${req.params.foodType}',`
    sql += ` '${req.params.foodName}',`
    sql += ` ${req.params.foodPrice},`
    sql += ` ${req.params.foodAmount},`
    sql += ` ${parseInt(req.params.foodPrice) * parseInt(req.params.foodAmount)},`
    sql += ` CURRENT_DATE,`
    sql += ` CURRENT_TIME,`
    sql += ` '1')`

    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows.affectedRows === 1) {
            console.log('insert 1 row complete!')
            orderUpdateHeader(req.params.orderCode, mysqlConnection, req, res)
            res.send("1")
        } else if (rows.affectedRows === 0) {
            console.log("can't insert!")
            res.send("0")
        }
    })
}
exports.selectOrderDetail = function (req, res) {         //Payment.jsx
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.ORDER_CODE , a.ORDER_NO , a.FOOD_STATUS  , a.FOOD_CODE , b.FOOD_TYPE_DESCRIPTION , a.FOOD_NAME , a.FOOD_PRICE , a.FOOD_AMOUNT , a.FOOD_TOTAL , c.FOOD_STATUS_DESCRIPTION`
    sql += ` FROM order_detail a , food_type_info b , food_status_info c , order_header d , queue_info e`
    sql += ` WHERE a.ORDER_CODE = d.ORDER_CODE`
    sql += ` AND d.QUEUE_CODE = e.QUEUE_CODE`
    sql += ` AND a.FOOD_TYPE = b.FOOD_TYPE_NO`
    sql += ` AND a.FOOD_STATUS = c.FOOD_STATUS_NO`
    sql += ` AND a.ORDER_CODE = (SELECT ORDER_CODE`
    sql += ` FROM order_header`
    sql += ` WHERE QUEUE_CODE = (SELECT QUEUE_CODE`
    sql += ` FROM queue_info`
    sql += ` WHERE TABLE_NO = ${req.params.tableNo}`
    sql += ` ORDER BY QUEUE_CODE DESC LIMIT 1))`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }
exports.selectOrderHeader = function (req, res) {           //Payment.jsx
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT ORDER_CODE , DATE_FORMAT( ORDER_DATE , "%Y-%m-%d" ) AS ORDER_DATE , ORDER_TIME , TABLE_ROUND , ORDER_TOTAL_PRICE`
    sql += ` FROM order_header`
    sql += ` WHERE QUEUE_CODE = (SELECT QUEUE_CODE`
    sql += ` FROM queue_info`
    sql += ` WHERE TABLE_NO = ${req.params.tableNo}`
    sql += ` ORDER BY QUEUE_CODE DESC LIMIT 1)`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      if (rows.length === 1) {
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
exports.deleteOrderDetail = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `DELETE FROM order_detail`
    sql += ` WHERE ORDER_CODE = '${req.params.orderCode}'`
    sql += ` AND ORDER_NO = ${req.params.orderNo}`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      if (rows.affectedRows === 1) {
        console.log('delete 1 row complete!')
  
        sql = `SET @rank:=0;`
        sql += ` UPDATE order_detail`
        sql += ` SET ORDER_NO=@rank:=@rank+1`
        sql += ` WHERE ORDER_CODE = '${req.params.orderCode}'`
  
        console.log(sql)
        mysqlConnection.query(sql, function (err, rows1, fields) {
          if (err) throw err
          orderUpdateHeader(req.params.orderCode, mysqlConnection, req, res)
          res.send("1")
        })
      } else if (rows.affectedRows === 0) {
        console.log("can't delete!")
        res.send("0")
      }
    })
  }  
exports.updateOrderDetail = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `UPDATE order_detail`
    sql += ` SET FOOD_AMOUNT = ${req.params.foodAmount},`
    sql += ` FOOD_TOTAL = ${req.params.foodAmount} * FOOD_PRICE`
    sql += ` WHERE ORDER_CODE = '${req.params.orderCode}'`
    sql += ` AND ORDER_NO = ${req.params.orderNo}`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      if (rows.affectedRows === 1) {
        console.log('update 1 row complete!')
        orderUpdateHeader(req.params.orderCode, mysqlConnection, req, res)
        res.send("1")
      } else if (rows.affectedRows === 0) {
        console.log("can't update!")
        res.send("0")
      }
    })
  }
exports.selectOrderDetailWaiting = function (req, res) { //loop
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT e.TABLE_NO , a.ORDER_NO , a.FOOD_CODE , b.FOOD_TYPE_DESCRIPTION , a.FOOD_NAME , a.FOOD_AMOUNT , c.FOOD_STATUS_DESCRIPTION , a.ORDER_CODE`
    sql += ` FROM order_detail a , food_type_info b , food_status_info c , order_header d , queue_info e`
    sql += ` WHERE a.ORDER_CODE = d.ORDER_CODE`
    sql += ` AND d.QUEUE_CODE = e.QUEUE_CODE`
    sql += ` AND a.FOOD_TYPE = b.FOOD_TYPE_NO`
    sql += ` AND a.FOOD_STATUS = c.FOOD_STATUS_NO`
    sql += ` AND a.FOOD_STATUS = '1'`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }    
exports.selectOrderDetailCooking = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT e.TABLE_NO , a.ORDER_NO , a.FOOD_CODE , b.FOOD_TYPE_DESCRIPTION , a.FOOD_NAME , a.FOOD_AMOUNT , c.FOOD_STATUS_DESCRIPTION , a.ORDER_CODE`
    sql += ` FROM order_detail a , food_type_info b , food_status_info c , order_header d , queue_info e`
    sql += ` WHERE a.ORDER_CODE = d.ORDER_CODE`
    sql += ` AND d.QUEUE_CODE = e.QUEUE_CODE`
    sql += ` AND a.FOOD_TYPE = b.FOOD_TYPE_NO`
    sql += ` AND a.FOOD_STATUS = c.FOOD_STATUS_NO`
    sql += ` AND a.FOOD_STATUS = '2'`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      res.send(rows)
    })
    mysqlConnection.end()
  }  
exports.updateOrderDetailToStartCooking = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `UPDATE order_detail`
    sql += ` SET FOOD_STATUS = '2'`
    sql += ` WHERE ORDER_CODE = '${req.params.orderCode}'`
    sql += ` AND ORDER_NO = ${req.params.orderNo}`
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
exports.updateOrderDetailToSending = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `UPDATE order_detail`
    sql += ` SET FOOD_STATUS = '3'`
    sql += ` WHERE ORDER_CODE = '${req.params.orderCode}'`
    sql += ` AND ORDER_NO = ${req.params.orderNo}`
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

  exports.selectReportSummary = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `set @ROW_NO := 0;`
    sql += `select ((@ROW_NO:=@ROW_NO + 1)) AS NO , `
    sql += `DATE_FORMAT(ORDER_DATE, "%Y/%m/%d") AS DATE , `
    sql += `SUM(ORDER_TOTAL_PRICE) AS TOTAL_PRICE `
    //sql += `FORMAT(SUM(ORDER_TOTAL_PRICE), 2) AS TOTAL_PRICE `
    sql += `from ORDER_HEADER `
    sql += `where ORDER_DATE between '${req.params.startDate}' and '${req.params.endDate}' `
    sql += `group by ORDER_DATE `
    sql += `order by ORDER_DATE`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows) {
        if (err) throw err
        console.log(rows)
        res.send(rows);
    })
    mysqlConnection.end()
  }  

  exports.selectReportByFoodType = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    if (req.params.foodType == '0') {
      var sql = `set @ROW_NO := 0;`
      sql += `select ((@ROW_NO:=@ROW_NO + 1)) AS NO ,`
      sql += `DATE_FORMAT(a.FOOD_DATE, "%Y/%m/%d") AS DATE , `
      sql += `b.FOOD_TYPE_DESCRIPTION AS FOOD_TYPE, `
      sql += `SUM(a.FOOD_TOTAL) AS TOTAL_PRICE `
      //sql += `FORMAT(SUM(a.FOOD_TOTAL), 2) AS TOTAL_PRICE `
      sql += `from ORDER_DETAIL a, FOOD_TYPE_INFO b `
      sql += `where a.FOOD_TYPE = b.FOOD_TYPE_NO `
      sql += `and a.FOOD_DATE between '${req.params.startDate}' and '${req.params.endDate}' `
      sql += `group by a.FOOD_DATE, a.FOOD_TYPE `
      sql += `order by a.FOOD_DATE, a.FOOD_TYPE`
    }
    else {
      var sql = `set @ROW_NO := 0;`
      sql += `select ((@ROW_NO:=@ROW_NO + 1)) AS NO ,`
      sql += `DATE_FORMAT(a.FOOD_DATE, "%Y/%m/%d") AS DATE , `
      sql += `b.FOOD_TYPE_DESCRIPTION AS FOOD_TYPE, `
      sql += `SUM(a.FOOD_TOTAL) AS TOTAL_PRICE `
      //sql += `FORMAT(SUM(a.FOOD_TOTAL), 2) AS TOTAL_PRICE `
      sql += `from ORDER_DETAIL a, FOOD_TYPE_INFO b `
      sql += `where a.FOOD_TYPE = b.FOOD_TYPE_NO `
      sql += `and a.FOOD_DATE between '${req.params.startDate}' and '${req.params.endDate}' `
      sql += `and a.FOOD_TYPE = '${req.params.foodType}' `
      sql += `group by a.FOOD_DATE, a.FOOD_TYPE `
      sql += `order by a.FOOD_DATE, a.FOOD_TYPE`
    }
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows) {
        if (err) throw err
        console.log(rows)
        res.send(rows);
    })
    mysqlConnection.end()
  }  