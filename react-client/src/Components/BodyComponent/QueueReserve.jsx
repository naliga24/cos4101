import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { login } from './../Prototype/login.js'
import { queueReserve } from './../Prototype/queueReserve.js'
var dateFormat = require('dateformat')
const request = require('superagent')

class QueueReserve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reserveDate: new Date(),
            reserveDateSTR: '',
            currentDateSTR: '',
            dataReserveTable: '',
            reserveTable: '0',
            reserveStartTime: '',
            reserveStartTimeSTR: '',
            reserveEndTime: '',
            reserveEndTimeSTR: '',
            reserveName: '',
            reserveAmount: '0',
            reserveTelephone: '',
            reserveEmail: '',
            dataReserve: '',
            buttonDisble: true,
            checkTime: 0,
            checkTable: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.addReserve = this.addReserve.bind(this);
        this.saveReserve = this.saveReserve.bind(this);
        this.saveRegister = this.saveRegister.bind(this);
        this.clear = this.clear.bind(this);
        this.onChange = this.onChange.bind(this);
        this.selectTableForReserve = this.selectTableForReserve.bind(this);
        this.selectDataReserve = this.selectDataReserve.bind(this);
        this.callCheckTimeForReserve = this.callCheckTimeForReserve.bind(this);
        this.checkFreeTableStatus = this.checkFreeTableStatus.bind(this);
    };

    componentDidMount() {
        this.selectTableForReserve();
        this.setDateString();
    }

    handleChange(name, date) {
        var change1 = {}
        change1[name] = date
        this.setState(change1);
    
        var change2 = {}
        if (name == 'reserveStartTime' || name == 'reserveEndTime') {
            change2[name + 'STR'] = dateFormat(date, "HH:MM:ss")
            this.setState(change2);
        }
        else {
            change2[name + 'STR'] = dateFormat(date, "yyyy-mm-dd")
            this.setState(change2, () => this.selectDataReserve());
        }
    }

    addReserve() {
        this.setState({ buttonDisble: !this.state.buttonDisble, reserveName: '', reserveAmount: '', reserveTelephone: '', reserveEmail: '' })
    }

    saveReserve() {
        this.callCheckTimeForReserve();
        setTimeout(() => {
            if (this.state.reserveTable && this.state.reserveName && this.state.reserveTelephone && this.state.reserveAmount > 0 && this.state.reserveStartTimeSTR < this.state.reserveEndTimeSTR && this.state.checkTime === 0) {
                var queueReserveOBJ = new queueReserve()
                queueReserveOBJ.addDataReserve(this.state.reserveDateSTR, this.state.reserveTable, this.state.reserveStartTimeSTR, this.state.reserveEndTimeSTR, this.state.reserveName, this.state.reserveAmount, this.state.reserveTelephone, this.state.reserveEmail);
                this.clear();
                window.setTimeout(() => {
                    this.selectDataReserve();
                }, 1000)
            }
            else if (this.state.reserveTable == '0') {
                alert('ไม่ได้ระบุหมายเลขโต๊ะ');
            }
            else if (this.state.reserveStartTimeSTR == '') {
                alert('ไม่ได้ระบุเวลาเริ่มต้น');
            }
            else if (this.state.reserveEndTimeSTR == '') {
                alert('ไม่ได้ระบุเวลาสิ้นสุด');
            }
            else if (this.state.reserveName == '') {
                alert('ไม่ได้ระบุชื่อ');
            }
            else if (this.state.reserveAmount == 0) {
                alert('จำนวนลูกค้าต้องมีค่ามากกว่า 0');
            }
            else if (this.state.reserveTelephone == '') {
                alert('ไม่ได้ระบุเบอร์โทร');
            }
            else if (this.state.reserveStartTimeSTR >= this.state.reserveEndTimeSTR) {
                alert('เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด');
            }
            else if (this.state.checkTime !== 0) {
                alert('ช่วงเวลาดังกล่าวมีการจองแล้ว');
            }
        }, 3000);

        var log = new login()
        log.writeLogLogout('3')
    }

    saveRegister(reserveCode, tableNo, reserveName, reserveAmount, reserveTelephone, reserveEmail, customerCode) {
        this.checkFreeTableStatus(tableNo);
        setTimeout(() => {
            if (this.state.currentDateSTR == this.state.reserveDateSTR && customerCode === null && this.state.checkTable !== 0) {
                var queueReserveOBJ = new queueReserve()
                queueReserveOBJ.callAddQueueFormRegister(reserveCode, tableNo, reserveName, reserveAmount, reserveTelephone, reserveEmail);
                window.setTimeout(() => {
                    this.selectDataReserve();
                    alert(`ทำการลงทะเบียนเรียบร้อย`);
                }, 1000)
            }
            else if (this.state.currentDateSTR !== this.state.reserveDateSTR) {
                alert('ไม่ใช่วันที่ทำการจอง  โปรดตรวจสอบ !!!');
            }
            else if (customerCode !== null) {
                alert('ทำการลงทะเบียนแล้ว');
            }
            else if (this.state.checkTable === 0) {
                alert('โต๊ะยังไม่ว่าง  โปรดรอสักครู่ !!!');
            }
        }, 1000);
    }

    clear() {
        this.setState({ buttonDisble: !this.state.buttonDisble });
    }

    onChange(e) {
        if (e.target.name === "reserveTable") {
            this.setState({ reserveTable: e.target.value } , () => this.selectDataReserve());
        }
        else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    setDateString() {
        this.setState({ reserveDateSTR: dateFormat(this.reserveDate, "yyyy-mm-dd") });
        this.setState({ currentDateSTR: dateFormat(this.reserveDate, "yyyy-mm-dd") });
    }

    selectTableForReserve() {
        var queueReserveOBJ = new queueReserve()
        queueReserveOBJ.callListTableForReserve();
        setTimeout(() => {
            this.setState({ dataReserveTable: queueReserveOBJ.tableOBJ.dataTable });
        }, 1000);
    }

    selectDataReserve() {
        var queueReserveOBJ = new queueReserve()
        queueReserveOBJ.listDataReserve(this.state.reserveDateSTR, this.state.reserveTable);
        setTimeout(() => {
            this.setState({ dataReserve: queueReserveOBJ.dataReserve });
        }, 1000);
    }

    callCheckTimeForReserve() {
        var queueReserveOBJ = new queueReserve()
        queueReserveOBJ.checkTimeForReserve(this.state.reserveDateSTR, this.state.reserveTable, this.state.reserveStartTimeSTR, this.state.reserveEndTimeSTR);
        setTimeout(() => {
            this.setState({ checkTime: queueReserveOBJ.dataCheckTime[0].COUNT });
        }, 1000);
    }

    checkFreeTableStatus(tableNo) {
        var queueReserveOBJ = new queueReserve()
        queueReserveOBJ.callCheckFreeTable(tableNo);
        setTimeout(() => {
            this.setState({ checkTable: queueReserveOBJ.tableOBJ.dataCheckTable[0].COUNT });
        }, 1000);
    }

    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการคิว</h3></div>
                <div class='queue_reserve'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.addReserve} disabled={!this.state.buttonDisble}>เพิ่มข้อมูล</button>
                        <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveReserve} disabled={this.state.buttonDisble}>บันทึกข้อมูล</button>
                        <Link to="QueueManage"><button type="button" class="btn btn-default navbar-btn">จัดลำดับคิว</button></Link>
                        <Link to="QueueReserve"><button type="button" class="btn btn-default navbar-btn">จองคิวล่วงหน้า</button></Link>
                    </div>
                    <div class='status'>
                        <div class='top'>
                            <h4 id='reservedate'>วันที่จองคิว<DatePicker name="reserveDate" selected={this.state.reserveDate} onChange={(date) => this.handleChange("reserveDate", date)} dateFormat="yyyy/MM/dd"/></h4>
                            <h4>โต๊ะอาหาร
                                <select class="selectpicker" name="reserveTable" onChange={this.onChange}>
                                    <option value={'0'} selected></option>
                                    {
                                        this.state.dataReserveTable ? this.state.dataReserveTable.map((item) => (
                                            <option value={item.TABLE_NO}>{item.TABLE_NO}</option>
                                        )) : (<option></option>)
                                    }   
                                </select>
                            </h4>
                            <h4 id='reservestarttime'>เวลาเริ่มต้น<DatePicker name="reserveStartTime" showTimeSelect showTimeSelectOnly timeIntervals={15} selected={this.state.reserveStartTime} onChange={(date) => this.handleChange("reserveStartTime", date)} dateFormat="HH:mm" timeCaption="Time" disabled={this.state.buttonDisble} required/></h4>
                            <h4 id='reserveendtime'>เวลาสิ้นสุด<DatePicker name="reserveEndTime" showTimeSelect showTimeSelectOnly timeIntervals={15} selected={this.state.reserveEndTime} onChange={(date) => this.handleChange("reserveEndTime", date)} dateFormat="HH:mm" timeCaption="Time" disabled={this.state.buttonDisble} required/></h4>
                        </div>
                        <div class='middle'>
                            <h4 id='reservename'>ชื่อลูกค้า<input id='reservename' value={this.state.reserveName} type="text" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="reserveName" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                            <h4 id='reserveamount'>จำนวนลูกค้า<input id='reserveamount' value={this.state.reserveAmount} type="number" maxLength="3" min="1" max="999" class="form-control" aria-describedby="sizing-addon1" name="reserveAmount" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                            <h4 id='reservetelephone'>เบอร์โทร<input id='reservetelephone' value={this.state.reserveTelephone} type="number" maxLength="10" class="form-control" aria-describedby="sizing-addon1" name="reserveTelephone" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                        </div>
                        <div class='bottom'>
                            <h4 id='reserveemail'>อีเมล์<input value={this.state.reserveEmail} id='reserveemail' type="email" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="reserveEmail" onChange={this.onChange} disabled={this.state.buttonDisble} required /></h4>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y" id="reservetable">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th class="stickqueue" scope="col">ลำดับที่</th>
                                    <th class="stickqueue" scope="col">รหัสการจอง</th>
                                    <th class="stickqueue" scope="col">วันที่จองคิว</th>
                                    <th class="stickqueue" scope="col">หมายเลขโต๊ะ</th>
                                    <th class="stickqueue" scope="col">เวลาเริ่มต้น</th>
                                    <th class="stickqueue" scope="col">เวลาสิ้นสุด</th>
                                    <th class="stickqueue" scope="col">ชื่อลูกค้า</th>
                                    <th class="stickqueue" scope="col">จำนวนลูกค้า</th>
                                    <th class="stickqueue" scope="col">เบอร์โทร</th>
                                    <th class="stickqueue" scope="col">อีเมล์</th>
                                    <th class="stickqueue" scope="col">รหัสลูกค้า</th>
                                    <th class="stickqueue" scope="col">ลงทะเบียน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.dataReserve ? this.state.dataReserve[1].map((item, index) => (
                                        <tr>
                                            <td>{item.RESERVE_NO}</td>
                                            <td>{item.RESERVE_CODE}</td>
                                            <td>{item.RESERVE_DATE}</td>
                                            <td>{item.RESERVE_TABLE_NO}</td>
                                            <td>{item.RESERVE_START_TIME}</td>
                                            <td>{item.RESERVE_END_TIME}</td>
                                            <td>{item.RESERVE_NAME}</td>
                                            <td>{item.RESERVE_AMOUNT}</td>
                                            <td>{item.RESERVE_TELEPHONE}</td>
                                            <td>{item.RESERVE_EMAIL}</td>
                                            <td>{item.CUSTOMER_CODE}</td>
                                            <td onClick={() => { this.saveRegister(item.RESERVE_CODE, item.RESERVE_TABLE_NO, item.RESERVE_NAME, item.RESERVE_AMOUNT, item.RESERVE_TELEPHONE, item.RESERVE_EMAIL, item.CUSTOMER_CODE) }}><p data-placement="top" data-toggle="tooltip" title="Register"><button class="btn btn-primary btn-xs" data-title="Register" data-toggle="modal" data-target="#save" align="center" disabled={item.CUSTOMER_CODE != null}><span class="glyphicon glyphicon-floppy-disk"></span></button></p></td>
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

export default QueueReserve;