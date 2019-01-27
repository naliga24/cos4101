import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { database } from './../Prototype/database.js'
import { login } from './../Prototype/login.js'

class UserSearch extends Component {
    constructor() {
        super();
        this.state = {
            userNo: '',
            userLogin: '',
            userPassword: '',
            userName: '',
            userType: '',
            userStatus: '',
            data: '',
        };
        this.searchUser = this.searchUser.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    searchUser() {
        var tmp = new database()
        tmp.callSearchUser(this.state) 
        window.setTimeout(() => {
            this.setState({data:tmp.user.data1})
            this.state.data.length === 0 && alert('ไม่พบข้อมูลที่ค้นหา')
        }, 1500);
        var log = new login()
        log.writeLogLogout('9')
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state)
    }
    
    render() {
        if (!sessionStorage.getItem("token")){ return (<Redirect to={'/'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_product'><h3>การจัดการฐานข้อมูล > ผู้ใช้งานระบบ</h3></div>
                <div class='user_search'>
                    <div class='button'>
                        <button type="button" class="btn btn-default navbar-btn disabled">เพิ่มข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn disabled">บันทึกข้อมูล</button>
                        <button type="button" class="btn btn-default navbar-btn">ค้นหาข้อมูล</button>
                    </div>

                    <div class='status'>
                        <div class='top'>
                            <h4>ชื่อในการเข้าใช้ระบบ<input type="text" class="form-control" aria-describedby="sizing-addon1" name="userLogin" onChange={this.onChange}/></h4>
                            <h4>ชื่อผู้ใช้งานระบบ<input type="text" class="form-control" aria-describedby="sizing-addon1" name="userName" onChange={this.onChange}/></h4>
                            <button type="button" class="btn btn-default navbar-btn" onClick={this.searchUser}>ค้นหา</button>
                        </div>
                    </div>
                    <div class="table-wrapper-scroll-y">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th class='stickyusersearch' scope="col">ชื่อในการเข้าระบบ</th>
                                <th class='stickyusersearch' scope="col">ชื่อผู้ใช้งานระบบ</th>
                                <th class='stickyusersearch' scope="col">ประเภทผู้ใช้งานระบบ</th>
                                <th class='stickyusersearch' scope="col">สถานะ</th>
                                <th class='stickyusersearch' scope="col">แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data ? this.state.data.map((item, index) => (
                                    <tr>
                                        <td>{item.USER_LOGIN}</td>
                                        <td>{item.USER_NAME}</td>
                                        <td>{item.USER_TYPE_NAME}</td>
                                        <td>{item.USE_STATUS_DESCRIPTION}</td>
                                        <td>
                                        <Link onClick={(e) => item.USER_TYPE == '0' ? e.preventDefault() : ''} to={{
                                            pathname: "/User",
                                            userNo: item.USER_NO,
                                            userLogin: item.USER_LOGIN,
                                            userPassword: item.USER_PASSWORD,
                                            userName: item.USER_NAME,
                                            userType: item.USER_TYPE,
                                            userStatus: item.USER_STATUS,
                                            flagEdit: true,                               
                                        }} ><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" disabled={item.USER_TYPE == '0'}><span class="glyphicon glyphicon-pencil"></span></button></p>
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
        );
    }
}

export default UserSearch;