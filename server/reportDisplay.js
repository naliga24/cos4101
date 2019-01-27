"use strict";
//test report for arkom
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

// ----------------------------------------------------------------------------------------------
// Need to populate this with Application paths for popular PDF readers
// ----------------------------------------------------------------------------------------------
//var PDFApplications = ["C:\\Program Files (x86)\\Adobe\\Acrobat 10.0\\Acrobat\\Acrobat.exe"];
var PDFApplications = ["C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe"];
module.exports = function(err, reportName,res) {
    if (err) {
        console.error("Your report", reportName, "had errors", err);
        return;
    }
    var found = false;

    // Add the current working directory to the file so Foxit can find it
    reportName = process.cwd() + "\\" + reportName;

    for (var i=0;i<PDFApplications.length;i++) {
        if (fs.existsSync(PDFApplications[i])) {
            child_process.execFile(PDFApplications[i], [reportName], function () {  });
            found = true;
            break;
        }
    }
    if (found) {
        console.log("Your report has been rendered to", reportName);
    }
    res.status(200).send('Display report complete!')
}
