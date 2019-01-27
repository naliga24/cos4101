import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { database } from './../Prototype/database.js'
import { user } from './../Prototype/user.js'
import { login } from './../Prototype/login.js'
let dateFormat = require('dateformat')

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userNo: this.props.location.userNo,
            userLogin: this.props.location.userLogin,
            oldUserLogin: this.props.location.userLogin,
            userPassword: this.props.location.userPassword,
            userName: this.props.location.userName,
            userType: this.props.location.userType,
            inactiveDate: dateFormat(new Date(), "yyyy-mm-dd"),
            inactiveTime: dateFormat(new Date(), "HH:MM:ss"),
            inactiveDetail: '',
            userStatus: this.props.location.userStatus ? this.props.location.userStatus : '1',
            flagEdit: this.props.location.flagEdit,
            buttonDisble: this.props.location.flagEdit,
            tmpDate: new Date(),
        };
        this.saveUser = this.saveUser.bind(this)
        this.add = this.add.bind(this)
        this.clear = this.clear.bind(this)
        this.onChange = this.onChange.bind(this)
        this.getCurrentDate = this.getCurrentDate.bind(this)
        this.setCurrentDate = this.setCurrentDate.bind(this)
        this.userInactiveInfo = this.userInactiveInfo.bind(this)
    }

    componentWillMount() {
        if (this.state.flagEdit && this.state.userStatus == '2') {
            this.userInactiveInfo()
        }
        this.getCurrentDate()
    }

    userInactiveInfo() {
        var tmp = new user()
        tmp.getInactiveInfo(this.state.userNo)
        window.setTimeout(() => {
            tmp.data2 && this.setState({ inactiveDate: tmp.data2.INACTIVE_DATE, inactiveTime: tmp.data2.INACTIVE_TIME, inactiveDetail: tmp.data2.INACTIVE_DETAIL })
        }, 1000);
    }

    setCurrentDate() {
        this.setState({ inactiveDate: dateFormat(new Date(), "yyyy-mm-dd"), inactiveTime: dateFormat(new Date(), "HH:MM:ss") })
        console.log(this.state.inactiveDate)
    }

    getCurrentDate() {
        setInterval(() => {
            this.state.tmpDate.setSeconds(this.state.tmpDate.getSeconds() + 1);
            this.setState({ tmpDate: this.state.tmpDate })
        }, 1000)
    }

    saveUser() {
        if (this.state.userLogin && this.state.userPassword && this.state.userName && this.state.userType && this.state.userStatus) {
            var tmp = new database()
            if (this.state.userLogin !== this.state.oldUserLogin) {
                tmp.callCheckUserLogin(this.state.userLogin)
                setTimeout(() => {
                    if (tmp.user.data3 === '0') {
                        if (this.state.flagEdit) {
                            this.setCurrentDate()
                            setTimeout(() => {
                            tmp.callEditUser(this.state, this.setCurrentDate,this.clear)
                            alert(`แก้ข้อมูลผู้ใช้งานระบบ "${this.state.userLogin}" เรียบร้อย`)
                        }, 1000);
                        } else {
                            tmp.callAddUser(this.state, this.clear)
                            alert(`เพิ่มข้อมูลผู้ใช้งานระบบ "${this.state.userLogin}" เรียบร้อย`)
                        }
                    } else if (tmp.user.data3 === '1' && this.state.flagEdit) {
                        alert(`ไม่สามารถเแก้ไขข้อมูลผู้ใช้งานระบบ "${this.state.userLogin}" ชื่อมีในระบบแล้ว`)
                    }
                    else if (tmp.user.data3 === '1' && !this.state.flagEdit) {
                        alert(`ไม่สามารถเพิ่มข้อมูลผู้ใช้งานระบบ "${this.state.userLogin}" ชื่อมีในระบบแล้ว`)
                    }
                }, 300);
            } else if (this.state.flagEdit) {
                this.setCurrentDate()
                            setTimeout(() => {
                tmp.callEditUser(this.state, this.setCurrentDate,this.clear)
                alert(`แก้ข้อมูลผู้ใช้งานระบบ "${this.state.userLogin}" เรียบร้อย`)
            }, 1000);
            }
        } else if (!this.state.userLogin) {
            alert("ชื่อในการเข้าระบบไม่ถูกต้อง")
        } else if (!this.state.userPassword) {
            alert("รหัสผ่านไม่ถูกต้อง")
        } else if (!this.state.userName) {
            alert("ชื่อผู้ใช้งานระบบไม่ถูกต้อง")
        } else if (!this.state.userType) {
            alert("ประเภทผู้ใช้งานไม่ถูกต้อง")
        }
        var log = new login()
        log.writeLogLogout('9')
    }
    add() {
        this.setState({ buttonDisble: !this.state.buttonDisble });
    }
    clear() {
        this.setState({ buttonDisble: !this.state.buttonDisble, flagEdit: false, userLogin: '', userPassword: '', userName: '', userType: '', userStatus: '1' })
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        if (!sessionStorage.getItem("token")) { return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการฐานข้อมูล > ผู้ใช้งานระบบ</h3></div>
                <div class='user'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn" onClick={this.add} disabled={this.state.buttonDisble}>เพิ่มข้อมูล</button>
                        <button type="submit" class="btn btn-default navbar-btn" onClick={this.saveUser} disabled={!this.state.buttonDisble}>บันทึกข้อมูล</button>
                        <Link to="UserSearch"><button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button></Link>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>ชื่อในการเข้าใช้ระบบ<input value={this.state.userLogin} type="text" maxLength="4" class="form-control" aria-describedby="sizing-addon1" name="userLogin" onChange={this.onChange} disabled={!this.state.buttonDisble || (this.state.userStatus == '2' && this.state.inactiveDate)} required /></h4>
                            <h4>รหัสผ่าน<input value={this.state.userPassword} type="text" maxLength="4" class="form-control" aria-describedby="sizing-addon1" name="userPassword" onChange={this.onChange} disabled={!this.state.buttonDisble || (this.state.userStatus == '2' && this.state.inactiveDate)} required /></h4>
                            <h4>ชื่อผู้ใช้งานระบบ<input value={this.state.userName} type="text" maxLength="30" class="form-control" aria-describedby="sizing-addon1" name="userName" onChange={this.onChange} disabled={!this.state.buttonDisble || (this.state.userStatus == '2' && this.state.inactiveDate)} required /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>ประเภทผู้ใช้งาน
                                <select class="selectpicker" name="userType" onChange={this.onChange} disabled={!this.state.buttonDisble || (this.state.userStatus == '2' && this.state.inactiveDate)} required>
                                    <option></option>
                                    <option value='1' selected={this.state.userType == '1' ? true : false}>ผู้จัดการ</option>
                                    <option value='2' selected={this.state.userType == '2' ? true : false}>แคชเชียร์</option>
                                    <option value='3' selected={this.state.userType == '3' ? true : false}>พ่อครัว</option>
                                </select>
                            </h4>
                            <h4 id='status'>สถานะ<select class="selectpicker" name="userStatus" onChange={this.onChange} disabled={!this.state.flagEdit}>
                                <option value='1' selected={this.state.userStatus == '1' ? true : false}>ใช้งาน</option>
                                <option value='2' selected={this.state.userStatus == '2' ? true : false}>ไม่ใช้งาน</option>
                            </select></h4>
                        </div>
                    </div>
                    <div class='status1'>
                        <div class='top'>
                            <h4>รายละเอียดในการไม่ใช้งาน<input value={this.state.inactiveDetail && this.state.userStatus == '2' ? this.state.inactiveDetail : ''} type="text" maxLength="50" class="form-control" aria-describedby="sizing-addon1" name="inactiveDetail" onChange={this.onChange} disabled={!this.state.flagEdit || this.state.userStatus == '1'} required /></h4>
                        </div>
                        <div class='bottom'>
                            <h4>วันหยุดใช้งาน<input value={this.state.inactiveDate && this.state.userStatus == '2' ? this.state.inactiveDate.slice(0, 10) : dateFormat(this.state.tmpDate, "yyyy-mm-dd")} type="text" class="form-control" aria-describedby="sizing-addon1" name="inactiveDate" disabled /></h4>
                            <h4 id='inactivetime' >เวลาหยุดใช้งาน<input value={this.state.inactiveTime && this.state.userStatus == '2' ? this.state.inactiveTime : dateFormat(this.state.tmpDate, "HH:MM:ss")} type="text" class="form-control" aria-describedby="sizing-addon1" name="inactiveTime" disabled /></h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default User;