import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { cooking } from './../Prototype/cooking.js'
import { login } from './../Prototype/login.js'
const request = require('superagent');

class Cooking extends Component {
    constructor() {
        super();
        this.state = {
            data: null,
            data1: null,
        };
        this.selectOrderDetailWaiting = this.selectOrderDetailWaiting.bind(this)
        this.selectOrderDetailCooking = this.selectOrderDetailCooking.bind(this)
        this.startCooking = this.startCooking.bind(this)
        this.startSending = this.startSending.bind(this)
    }

    selectOrderDetailWaiting() {
        var tmp = new cooking()
        tmp.callListWaitCookingDetail()
        window.setTimeout(() => {
            this.setState({ data: tmp.data.data5 })
        }, 300);
    }

    selectOrderDetailCooking() {
        var tmp = new cooking()
        tmp.callListWaitSendingDetail()
        window.setTimeout(() => {
            this.setState({ data1: tmp.data1.data6 })
        }, 300);
    }

    startCooking(orderCode, orderNo) {
        var tmp = new cooking()
        tmp.addCookingDetail(orderCode, orderNo)
        window.setTimeout(() => {
            this.selectOrderDetailCooking()
        }, 1000);
        var log = new login()
        log.writeLogLogout('5')
    }

    startSending(orderCode, orderNo) {
        var tmp = new cooking()
        tmp.addSendingDetail(orderCode, orderNo)
        window.setTimeout(() => {
            this.selectOrderDetailCooking()
        }, 1000);
        var log = new login()
        log.writeLogLogout('5')
    }

    componentWillMount() {
        setInterval(() => {
            this.selectOrderDetailWaiting()
        }, 2000)
        this.selectOrderDetailCooking()
    }
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การทำอาหาร</h3></div>
                <div class='cooking'>
                    <div class="table-wrapper-scroll-y" id="first">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th class='stickycooking' scope="col">หมายเลขโต็ะ</th>
                                    <th class='stickycooking' scope="col">ลำดับที่</th>
                                    <th class='stickycooking' scope="col">รหัสสินค้า</th>
                                    <th class='stickycooking' scope="col">ประเภท</th>
                                    <th class='stickycooking' scope="col">ชื่ออาหาร</th>
                                    <th class='stickycooking' scope="col">จำนวน</th>
                                    <th class='stickycooking' scope="col">สถานะ</th>
                                    <th class='stickycooking' scope="col">ทำอาหาร</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.data ? this.state.data.map((item, index) => (
                                        <tr>
                                            <td>{item.TABLE_NO}</td>
                                            <td>{item.ORDER_NO}</td>
                                            <td>{item.FOOD_CODE}</td>
                                            <td>{item.FOOD_TYPE_DESCRIPTION}</td>
                                            <td>{item.FOOD_NAME}</td>
                                            <td>{item.FOOD_AMOUNT}</td>
                                            <td>{item.FOOD_STATUS_DESCRIPTION}</td>
                                            <td onClick={() => { this.startCooking(item.ORDER_CODE, item.ORDER_NO) }}><p data-placement="top" data-toggle="tooltip" title="Save"><button class="btn btn-primary btn-xs" data-title="Save" data-toggle="modal" data-target="#save" ><span class="glyphicon glyphicon-floppy-disk"></span></button></p></td>
                                        </tr>
                                    )) : (<tr></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    <div class="table-wrapper-scroll-y" id="second">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th class='stickycooking' scope="col">หมายเลขโต็ะ</th>
                                <th class='stickycooking' scope="col">ลำดับที่</th>
                                <th class='stickycooking' scope="col">รหัสสินค้า</th>
                                <th class='stickycooking' scope="col">ประเภท</th>
                                <th class='stickycooking' scope="col">ชื่ออาหาร</th>
                                <th class='stickycooking' scope="col">จำนวน</th>
                                <th class='stickycooking' scope="col">สถานะ</th>
                                <th class='stickycooking' scope="col">ส่งอาหาร</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data1 ? this.state.data1.map((item, index) => (
                                    <tr>
                                        <td>{item.TABLE_NO}</td>
                                        <td>{item.ORDER_NO}</td>
                                        <td>{item.FOOD_CODE}</td>
                                        <td>{item.FOOD_TYPE_DESCRIPTION}</td>
                                        <td>{item.FOOD_NAME}</td>
                                        <td>{item.FOOD_AMOUNT}</td>
                                        <td>{item.FOOD_STATUS_DESCRIPTION}</td>
                                        <td onClick={() => { this.startSending(item.ORDER_CODE, item.ORDER_NO) }}><p data-placement="top" data-toggle="tooltip" title="Save"><button class="btn btn-primary btn-xs" data-title="Save" data-toggle="modal" data-target="#save" ><span class="glyphicon glyphicon-floppy-disk"></span></button></p></td>
                                    </tr>
                                )) : (<tr></tr>)
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cooking;