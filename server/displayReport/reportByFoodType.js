var Report = require('fluentReports').Report;
var displayReport = require('../reportDisplay');
var dateFormat = require('dateformat');
var commaNumber = require('comma-number')

exports.displayReportByFoodType = function(startDate, endDate, dataReport, res)  {
  'use strict';

  var header = function(rpt, data) {
    // Date Printed - Top Left
    rpt.fontSize(9);
    rpt.print(dateFormat(new Date(), "yyyy/mm/dd" + "      HH:MM:ss"), {align: 'right'});

    // Report Title
    rpt.newline();
    rpt.print('  รายงานสรุปยอดขายแยกตามประเภทอาหาร', {fontBold: true, fontSize: 16, align: 'center'});
    rpt.newline();
    rpt.print('วันที่เริ่มต้น     ' + startDate + "                  วันที่สิ้นสุด     " + endDate, {fontBold: true, fontSize: 12, align: 'center'});

  // Detail Header
    rpt.newline();
    rpt.newline();
    rpt.print('_________________________________________________________________________________________________', {align: 'center'});
    rpt.newline();
    rpt.fontBold();
    rpt.band([
      {data: 'ลำดับที่', width: 100, align: 'center'},
      {data: 'วันที่ขายสินค้า', width: 150, align: 'center'},
      {data: 'ประเภทสินค้า', width: 100, align: 'center'},
      {data: 'ยอดขายสินค้า (บาท)', width: 150, align: 'right'}
    ]);
    rpt.fontNormal();
    rpt.print('_________________________________________________________________________________________________', {align: 'center'});
  };

  var detail = function(rpt, data) {
  // Detail Body
    rpt.newline();
    rpt.band([
      {data: data.NO, width: 100, align: 'center'},
      {data: data.DATE, width: 150, align: 'center'},
      {data: data.FOOD_TYPE, width: 100, align: 'center'},
      {data: commaNumber(data.TOTAL_PRICE + '.00'), width: 150, align: 'right'}
    ]);
  };

  var finalSummary = function(rpt, data) {
    rpt.newline();
    rpt.print('_________________________________________________________________________________________________', {align: 'center'});
    rpt.newline();
    rpt.band([
      {data: 'รวม', width: 350, align: 'center'},
      {data: commaNumber(rpt.totals.TOTAL_PRICE + '.00'), width: 150, align: 'right'}
    ]);
   // rpt.print('รวม', {fontBold: true, width: 350, align: 'center'});
    rpt.print('_________________________________________________________________________________________________', {align: 'center'});    
  };

  // Optional -- If you don't pass a report name, it will default to "report.pdf"
  var rptName =  "Report By Food Type.pdf";


  var resultReport = new Report(rptName,{ font: 'tahoma' })
    //.pageHeader( [""] )// Optional

  // Settings
    console.log('data report',dataReport)
    resultReport
      .data(dataReport)
      .registerFont('tahoma', { normal: './server/font/tahoma.ttf' })
      .fontsize(9)
      .margins(40)
      .detail(detail)
      .groupBy(dataReport['NO'], Report.show.once)
      .sum("TOTAL_PRICE")
      .footer(finalSummary)
      .header(header, {pageBreakBefore: true});    

  // creates debug output so that you can see how the report is built.
  resultReport.printStructure();
  console.time("Rendered");
  resultReport.render(function(err, name) {
      console.timeEnd("Rendered");
      displayReport(err, name, res);
  });

}
