import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { report } from './../Prototype/report.js'
var dateFormat = require('dateformat')

class Report extends Component {
	constructor(props) {
        super(props)
        this.state = {
            startDate: new Date(),
            startDateSTR: '',
            endDate: new Date(),
            endDateSTR: '',
            foodTypeNo: '0',
            foodTypeDescription: ''
		}
        
        this.selectFoodTypeDescription = this.selectFoodTypeDescription.bind(this);
        this.selectReportSummary = this.selectReportSummary.bind(this);
        this.selectReportByFoodType = this.selectReportByFoodType.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setDateString = this.setDateString.bind(this);
    }
    
    componentDidMount() {
        this.selectFoodTypeDescription();
        this.setDateString();
    }
	
	selectFoodTypeDescription() {
		var reportOBJ = new report()
        reportOBJ.callListFoodTypeDescription();
        setTimeout(() => {
            this.setState({ foodTypeDescription: reportOBJ.foodTypeOBJ.dataFoodType });
        }, 1000);
    }

    selectReportSummary() {
        if (this.state.startDateSTR <= this.state.endDateSTR) {
            var reportOBJ = new report()
            reportOBJ.callListDataReportSummary(this.state.startDateSTR, this.state.endDateSTR);
            setTimeout(() => {
                reportOBJ.displayReportSummary(dateFormat(this.state.startDateSTR, "yyyy/mm/dd"), dateFormat(this.state.endDateSTR, "yyyy/mm/dd"), reportOBJ.orderOBJ.dataReportSummary);
            }, 1000);
        }
        else {
            alert('วันที่สิ้นสุดจะต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น')
        }
		
    }

    selectReportByFoodType() {
        if (this.state.startDateSTR <= this.state.endDateSTR) {
            var reportOBJ = new report()
            reportOBJ.callListDataReportByFoodType(this.state.startDateSTR, this.state.endDateSTR, this.state.foodTypeNo);
            setTimeout(() => {
                reportOBJ.displayReportByFoodType(dateFormat(this.state.startDateSTR, "yyyy/mm/dd"), dateFormat(this.state.endDateSTR, "yyyy/mm/dd"), reportOBJ.orderOBJ.dataReportByFoodType);
            }, 1000);
            
        }
        else {
            alert('วันที่สิ้นสุดจะต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น')
        }
    }

    onChange(e) {
        var tmp = e.target.value.split(',')
        this.setState({ foodTypeNo: tmp[0] });
    }

    handleChange(name, date) {
        var change1 = {}
        change1[name] = date
        this.setState(change1);

        var change2 = {}
        change2[name + 'STR'] = dateFormat(date, "yyyy-mm-dd")
        this.setState(change2);
    }

    setDateString() {
        this.setState({ startDateSTR: dateFormat(this.startDate, "yyyy-mm-dd") });
        this.setState({ endDateSTR: dateFormat(this.endDate, "yyyy-mm-dd") });
    }
	
    render() {
        if (!sessionStorage.getItem("token")){ return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>รายงาน</h3></div>
                <div class='configuration'>
                    <div class='status'>
                        <div id='top'>
                            <h4>วันที่เริ่มต้น<DatePicker name="startDate" selected={this.state.startDate} onChange={(date) => this.handleChange("startDate", date)} dateFormat="yyyy/MM/dd"/></h4>
                            <h4>วันที่สิ้นสุด<DatePicker name="endDate" selected={this.state.endDate} onChange={(date) => this.handleChange("endDate", date)} dateFormat="yyyy/MM/dd"/></h4>
                            <h4>ประเภทอาหาร
                                <select class="selectpicker" name="foodType" onChange={this.onChange} >
                                    <option value={'0'} selected></option>
                                    {
                                        this.state.foodTypeDescription ? this.state.foodTypeDescription.map((item, index) => (
                                            <option value={item.FOOD_TYPE_NO + ',' + item.FOOD_TYPE_DESCRIPTION}>{item.FOOD_TYPE_DESCRIPTION}</option>
                                        )) : (<option></option>)
                                    }
                                </select>
                            </h4>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th scope="col">ลำดับที่</th>
                                <th scope="col">ชื่อรายงาน</th>
                                <th scope="col">ดูรายงาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>รายงานสรุปยอดขายประจำวัน</td>
                                <td onClick={() => { this.selectReportSummary() }}><p data-placement="top" data-toggle="tooltip" title="SearchReport1"><button class="btn btn-info btn-xs" data-title="SearchReport1" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-search"></span></button></p></td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>รายงานสรุปยอดขายแยกตามประเภทอาหาร</td>
                                <td onClick={() => { this.selectReportByFoodType() }}><p data-placement="top" data-toggle="tooltip" title="SearchReport2"><button class="btn btn-info btn-xs" data-title="SearchReport2" data-toggle="modal" data-target="#search" ><span class="glyphicon glyphicon-search"></span></button></p></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Report;