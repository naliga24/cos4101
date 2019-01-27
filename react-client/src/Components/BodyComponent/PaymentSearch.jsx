import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { payment } from './../Prototype/payment.js'
import { login } from './../Prototype/login.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
var dateFormat = require('dateformat')

class PaymentSearch extends Component {
    constructor() {
        super();
        this.state = {
            paymentCode: '',
            paymentDate: new Date(),
            paymentDateSTR: '',
            tableNo: '',
            customerName: '',
            data: '',
            data1: '',
            flagStart: true,
        }
        this.searchPayment = this.searchPayment.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.setDateString = this.setDateString.bind(this)
        this.selectTableInfoAllTable = this.selectTableInfoAllTable.bind(this)
    }

    componentWillMount() {
        this.selectTableInfoAllTable()
    }

    selectTableInfoAllTable() {
        var tmp = new payment()
        tmp.callListAllTable()
        window.setTimeout(() => {
            this.setState({ data: tmp.data6.data2 })
        }, 1000);
    }

    searchPayment() {
        var tmp = new payment()
        tmp.searchPaymentDetail(this.state)
        window.setTimeout(() => {
            this.setState({ data1: tmp.data1 })
            this.state.data1.length === 0 && alert('ไม่พบข้อมูลที่ค้นหา')
        }, 1000)
        var log = new login()
        log.writeLogLogout('6')
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
        this.setState({ paymentDateSTR: dateFormat(this.paymentDate, "yyyy-mm-dd") });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การชำระเงิน</h3></div>
                <div class='payment_search'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn disabled">เพิ่มข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn disabled">บันทึกข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>หมายเลขการชำระเงิน<input type="text" class="form-control" aria-describedby="sizing-addon1" placeholder="YYMMDDXXXX" name="paymentCode" onChange={this.onChange} /></h4>
                            <h4>วันที่ชำระเงิน<DatePicker id='date' name="paymentDate" selected={''} onChange={(date) => this.handleChange("paymentDate", date)} dateFormat="yyyy/MM/dd"/></h4>
                            <h4>หมายเลขโต็ะ
                            <select class="selectpicker" name="tableNo" onChange={this.onChange}>
                                    <option selected="selected" disabled hidden></option>
                                    {
                                        this.state.data ? this.state.data.map((item, index) => (
                                            <option>{item.TABLE_NO}</option>
                                        )) : (<option>ไม่มีรายการโต็ะ</option>)
                                    }
                                </select>
                            </h4>
                        </div>
                        <div class='bottom'>
                            <h4>ชื่อลูกค้า<input type="text" class="form-control" aria-describedby="sizing-addon1" name="customerName" onChange={this.onChange} /></h4>
                            <button type="button" class="btn btn-default navbar-btn" onClick={this.searchPayment}>ค้นหา</button>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th class="stickypaymentsearch" scope="col">หมายเลขการชำระเงิน</th>
                                    <th class="stickypaymentsearch" scope="col">หมายเลขโต็ะ</th>
                                    <th class="stickypaymentsearch" scope="col">รอบการใช้บริการ</th>
                                    <th class="stickypaymentsearch" scope="col">หมายเลขคิว</th>
                                    <th class="stickypaymentsearch" scope="col">ชื่อลูกค้า</th>
                                    <th class="stickypaymentsearch" scope="col">จำนวนลูกค้า</th>
                                    <th class="stickypaymentsearch" scope="col">หมายเลขการสั่งอาหาร</th>
                                    <th class="stickypaymentsearch" scope="col">สถานะการชำระเงิน</th>
                                    <th class="stickypaymentsearch" scope="col">แก้ไข</th>
                                    <th class="stickypaymentsearch" scope="col">ดูข้อมูล</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.data1 && this.state.data1.length > 0 ? this.state.data1.map((item, index) => (
                                        <tr>
                                            <td>{item.PAYMENT_CODE}</td>
                                            <td>{item.TABLE_NO}</td>
                                            <td>{item.TABLE_ROUND}</td>
                                            <td>{item.QUEUE_NO}</td>
                                            <td>{item.CUSTOMER_NAME}</td>
                                            <td>{item.CUSTOMER_AMOUNT}</td>
                                            <td>{item.ORDER_CODE}</td>
                                            <td>{item.PAYMENT_STATUS_DESCRIPTION}</td>
                                            <td>
                                                <Link to={{
                                                    pathname: "/Payment",
                                                    data: item,
                                                    editFlag: true,
                                                }} ><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit"><span class="glyphicon glyphicon-pencil"></span></button></p>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={{
                                                    pathname: "/Payment",
                                                    data: item,
                                                    detailFlag: true,
                                                }} ><p data-placement="top" data-toggle="tooltip" title="Detail"><button class="btn btn-primary btn-xs" data-title="Detail" data-toggle="modal" data-target="#detail"><span class="glyphicon glyphicon-pencil"></span></button></p>
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (<tr></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default PaymentSearch;