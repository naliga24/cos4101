module.exports = function (app) {

    var user = require('./databaseQuery/user')
    var userType = require('./databaseQuery/userType')
    var table = require('./databaseQuery/table')
    var food = require('./databaseQuery/food')
    var customerQueue = require('./databaseQuery/customerQueue')
    var queueReserve = require('./databaseQuery/queueReserve')
    var order = require('./databaseQuery/order')
    var payment = require('./databaseQuery/payment')
    var foodType = require('./databaseQuery/foodType')
    var report = require('./displayReport/report')

    /* Login.jsx*/
    app.post('/selectUserPermission', user.selectUserPermission)
    app.get('/insertUserTransaction/:loginNo/:loginStatus', user.insertUserTransaction)
    app.get('/updateUserTransaction/:loginNo/:loginStatus', user.updateUserTransaction)
    app.post('/selectUserInfoUserLogin', user.selectUserInfoUserLogin)
    app.post('/selectUserInfoUserPassword', user.selectUserInfoUserPassword)
    app.post('/selectUserInfoUserStatus', user.selectUserInfoUserStatus)
    app.post('/selectUserInfoUserLoginValue', user.selectUserInfoUserLoginValue)
    /* Configuration.jsx*/
    app.put('/updateUserTypeInfo/:permission/:userTypeNo', userType.updateUserTypeInfo)
    app.get('/selectUserTypeInfo', userType.selectUserTypeInfo)
    /* Table.jsx*/
    app.get('/insertTableInfo/:tableCapacity/:useStatus', table.insertTableInfo)
    app.get('/updateTableInfo/:tableNo/:tableCapacity/:useStatus', table.updateTableInfo)
    /* TableSearch.jsx*/
    app.post('/selectTableInfo', table.selectTableInfo)
    /* Food.jsx*/
    app.get('/insertFoodInfo/:foodType/:foodName/:foodPrice/:foodStatus', food.insertFoodInfo)
    app.get('/updateFoodInfo/:foodCode/:foodType/:foodName/:foodPrice/:foodStatus', food.updateFoodInfo)
    app.get('/selectFoodInfoFoodName/:foodName', food.selectFoodInfoFoodName)
    /* FoodSearch.jsx*/
    app.post('/selectFoodInfo', food.selectFoodInfo)
    /* User.jsx*/
    app.post('/insertUserInfo', user.insertUserInfo)
    app.post('/updateUserInfo', user.updateUserInfo)
    /* UserSearch.jsx*/
    app.post('/selectUserInfo', user.selectUserInfo)
    app.get('/selectUserInactiveInfo/:userNo', user.selectUserInactiveInfo)
    /* Queue.jsx*/
    app.post('/insertQueueInfo', customerQueue.insertQueueInfo)
    app.post('/insertQueueFromRegister', customerQueue.insertQueueFromRegister)
    /* QueueManage.jsx*/
    app.get('/selectTableInfoFreeTable', table.selectTableInfoFreeTable)
    app.get('/selectQueueInfoNormal', customerQueue.selectQueueInfoNormal)
    app.get('/selectQueueInfoWait', customerQueue.selectQueueInfoWait)
    app.get('/updateQueueStatusToWait/:queueCode', customerQueue.updateQueueStatusToWait)
    app.get('/updateQueueInfoAndSetTable/:queueCode/:tableNo', customerQueue.updateQueueInfoAndSetTable)
    /* QueueReserve.jsx*/
    app.get('/selectTableForReserve', table.selectTableForReserve)
    app.post('/selectDataReserve', queueReserve.selectDataReserve)
    app.post('/insertDataReserve', queueReserve.insertDataReserve)
    app.post('/checkTime', queueReserve.checkTime)
    app.post('/selectFreeTable', table.selectFreeTable)
    /* Order.jsx*/
    app.get('/selectTableInfoReserveAndFullTable', table.selectTableInfoReserveAndFullTable)
    app.get('/selectQueueInfo/:tableNo', customerQueue.selectQueueInfo)      //Payment.jsx
    app.get('/selectFoodInfoFindFood/:foodName', food.selectFoodInfoFindFood)
    app.get('/insertOrderHeader/:tableNo/:queueCode', order.insertOrderHeader)
    app.get('/insertOrderDetail/:orderCode/:foodCode/:foodType/:foodName/:foodPrice/:foodAmount', order.insertOrderDetail)
    app.get('/selectOrderDetail/:tableNo', order.selectOrderDetail)        //Payment.jsx
    app.get('/selectOrderHeader/:tableNo', order.selectOrderHeader)
    app.get('/deleteOrderDetail/:orderCode/:orderNo', order.deleteOrderDetail)
    app.get('/updateOrderDetail/:orderCode/:orderNo/:foodAmount', order.updateOrderDetail)
    //Cooking.jsx
    app.get('/selectOrderDetailWaiting', order.selectOrderDetailWaiting)
    app.get('/selectOrderDetailCooking', order.selectOrderDetailCooking)
    app.get('/updateOrderDetailToStartCooking/:orderCode/:orderNo', order.updateOrderDetailToStartCooking)
    app.get('/updateOrderDetailToSending/:orderCode/:orderNo', order.updateOrderDetailToSending)
    //Payment.jsx
    app.get('/insertPaymentInfo/:orderCode/:totalAmount/:receiveAmount/:exchangeAmount/:tableNo', payment.insertPaymentInfo)
    app.get('/updatePaymentInfo/:paymentCode/:receiveAmount/:exchangeAmount', payment.updatePaymentInfo)
    app.get('/selectTableInfoFullTable', table.selectTableInfoFullTable)
    //PaymentSearch.jsx
    app.get('/selectTableInfoAllTable', table.selectTableInfoAllTable)
    app.post('/selectPaymentInfo', payment.selectPaymentInfo)
    //Report.jsx
    app.get('/selectReportSummary/:startDate/:endDate', order.selectReportSummary)
    app.get('/selectReportByFoodType/:startDate/:endDate/:foodType', order.selectReportByFoodType)
    app.get('/selectFoodTypeDescription/', foodType.selectFoodTypeDescription)
    app.post('/displayReportSummary/', report.displayReportSummary)
    app.post('/displayReportByFoodType/', report.displayReportByFoodType)
} 
