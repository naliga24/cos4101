var mysql = require('mysql2')
var connectConfig = require('./../configDB').connectConfig

exports.insertFoodInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `SELECT COUNT(*) FROM food_info`
    sql += ` WHERE FOOD_NAME = '${req.params.foodName}'`
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows[0]['COUNT(*)'] === 0) {
            sql = `SELECT FOOD_TYPE_NO * 100000 + FOOD_SYSTEM_NO + 1 AS fcode`
            sql += ` FROM food_type_info`
            sql += ` WHERE FOOD_TYPE_NO = '${req.params.foodType}'`
            mysqlConnection.query(sql, function (err, rows1, fields) {
                if (err) throw err
                console.log(rows1)
                sql = `UPDATE food_type_info`
                sql += ` SET FOOD_SYSTEM_NO = FOOD_SYSTEM_NO + 1`
                sql += ` WHERE FOOD_TYPE_NO = '${req.params.foodType}'`
                mysqlConnection.query(sql, function (err, rows2, fields) {
                    if (err) throw err
                    sql = `INSERT INTO food_info ( FOOD_CODE , FOOD_TYPE , FOOD_NAME , FOOD_PRICE , FOOD_STATUS )`
                    sql += ` VALUES`
                    sql += ` ('${rows1[0].fcode}',`
                    sql += ` '${req.params.foodType}',`
                    sql += ` '${req.params.foodName}',`
                    sql += ` ${req.params.foodPrice},`
                    sql += ` '${req.params.foodStatus}')`
                    console.log(sql)
                    console.log(req.params)
                    mysqlConnection.query(sql, function (err, rows3, fields) {
                        if (err) throw err
                        console.log(rows3.affectedRows)
                        if (rows3.affectedRows === 1) {
                            console.log('insert 1 row complete!')
                            res.send("1")
                        } else if (rows3.affectedRows === 0) {
                            console.log("can't insert!")
                            res.send("2")
                        }
                    })
                    mysqlConnection.end()
                })
            })
        } else {
            res.send('0')
        }
    })
}
exports.updateFoodInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
        if (err) throw err
    })
    var sql = `UPDATE food_info`
    sql += ` SET FOOD_TYPE = '${req.params.foodType}',`
    sql += ` FOOD_NAME = '${req.params.foodName}',`
    sql += ` FOOD_PRICE = ${req.params.foodPrice},`
    sql += ` FOOD_STATUS = '${req.params.foodStatus}'`
    sql += ` WHERE FOOD_CODE = '${req.params.foodCode}'`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
        if (err) throw err
        if (rows.affectedRows === 1) {
            console.log('update 1 row complete!');
            res.send("1")
        } else if (rows.affectedRows === 0) {
            console.log("can't update!")
            res.send("0")
        }
    })
    mysqlConnection.end()
}
exports.selectFoodInfo = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
      if (err) throw err
    });
    var sql = `SELECT a.FOOD_CODE , a.FOOD_TYPE , a.FOOD_NAME , a.FOOD_PRICE , a.FOOD_STATUS , b.FOOD_TYPE_DESCRIPTION ,  c.USE_STATUS_DESCRIPTION`
    sql += ` FROM food_info a, food_type_info b, use_status_info c`
    sql += ` WHERE a.FOOD_TYPE = b.FOOD_TYPE_NO`
    sql += ` AND a.FOOD_STATUS = c.USE_STATUS_NO`
    sql += ` AND a.FOOD_CODE LIKE '%${req.body.data.foodCode}%'`
    sql += ` AND a.FOOD_NAME LIKE '%${req.body.data.foodName}%'`
    sql += req.body.data.dscAsc && req.body.data.foodPrice ? ` AND a.FOOD_PRICE  ${req.body.data.dscAsc} ${req.body.data.foodPrice}` : ` AND a.FOOD_PRICE LIKE '%${req.body.data.foodPrice}%'`
    sql += ` ORDER BY a.FOOD_CODE`
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      console.log(rows)
      res.send(rows);
    })
    mysqlConnection.end()
  }
exports.selectFoodInfoFindFood = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig);
    mysqlConnection.connect(function (err) {
      if (err) throw err
    })
    var sql = `SELECT a.FOOD_CODE , a.FOOD_PRICE , a.FOOD_TYPE , a.FOOD_NAME ,b.FOOD_TYPE_DESCRIPTION `
    sql += ` FROM food_info a , food_type_info b`
    sql += ` WHERE a.FOOD_TYPE = b.FOOD_TYPE_NO`
    sql += ` AND a.FOOD_NAME = '${req.params.foodName}'`
    sql += ` AND a.FOOD_STATUS = '1'`
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

  exports.selectFoodInfoFoodName = function (req, res) {
    var mysqlConnection = mysql.createConnection(connectConfig)
    mysqlConnection.connect(function (err) {
      if (err) throw err
    });
    var sql = `SELECT COUNT(FOOD_NAME)`
    sql += ` FROM food_info`
    sql += ` WHERE FOOD_NAME = '${req.params.foodName}'`
  
    console.log(sql)
    mysqlConnection.query(sql, function (err, rows, fields) {
      if (err) throw err
      if (rows[0]['COUNT(FOOD_NAME)'] === 1) {
        res.send("1")
      }else if (rows[0]['COUNT(FOOD_NAME)'] === 0){
        res.send("0")
      }
    })
    mysqlConnection.end()
  }