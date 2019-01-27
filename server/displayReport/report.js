var reportSummary = require('./reportSummary.js')
var reportByFoodType = require('./reportByFoodType.js')

exports.displayReportSummary = function (req, res) {
    reportSummary.displayReportSummary(req.body.startDate, req.body.endDate, req.body.dataReport, res);
}

exports.displayReportByFoodType = function (req, res) {
    reportByFoodType.displayReportByFoodType(req.body.startDate, req.body.endDate, req.body.dataReport, res);
}
