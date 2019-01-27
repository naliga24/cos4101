import { foodType } from './foodType.js'
import { order } from './order.js'
const request = require('superagent')

export class report {
	constructor() {
	}
	
	callListFoodTypeDescription() {
		this.foodTypeOBJ = new foodType()
		this.foodTypeOBJ.listFoodTypeDescription();
	}
	
	callListDataReportSummary(startDate, endDate) {
		this.orderOBJ = new order()
		this.orderOBJ.listDataReportSummary(startDate, endDate);
	}
	
	callListDataReportByFoodType(startDate, endDate, foodType) {
		this.orderOBJ = new order()
		this.orderOBJ.listDataReportByFoodType(startDate, endDate, foodType);
	}

	displayReportSummary(startDate, endDate, dataReport) {
		request.post('http://localhost:8080/displayReportSummary/')
		.send({ startDate: startDate, endDate: endDate, dataReport: dataReport })
		.end((err, res) => {
			if (err) { alert(err); return }
		})
	}

	displayReportByFoodType(startDate, endDate, dataReport) {
		request.post('http://localhost:8080/displayReportByFoodType/')
		.send({ startDate: startDate, endDate: endDate, dataReport: dataReport })
		.end((err, res) => {
			if (err) { alert(err); return }
		})
	}
}