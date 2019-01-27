import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { login } from './../Prototype/login.js';
let auth = sessionStorage.getItem("token");

class Login extends Component {
    constructor() {
        super()

        this.state = {
            userLogin: '',
            userPassword: '',
        };
        this.onChange = this.onChange.bind(this)
        this.login = this.login.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    login() {
        if(this.state.userLogin && this.state.userPassword){
            var tmp = new login()
            tmp.callCheckUserLogin(this.state.userLogin)
            setTimeout(() => {
                if (tmp.data3.data3 === '1') {
                    tmp.callCheckUserPassword(this.state.userLogin,this.state.userPassword)
                    setTimeout(() => {
                        if (tmp.data4.data4 === '1') {
                            tmp.callCheckUserStatus(this.state.userLogin,this.state.userPassword)
                            setTimeout(() => {
                                if(tmp.data5.data5 === '1'){
                                    tmp.callGetPermissionDetail(this.state.userLogin,this.state.userPassword)
                                    setTimeout(() => {
                                        tmp.writeLogLogin('1')
                                        window.location.reload()
                                    }, 300);
                                }else if(tmp.data5.data5 === '0'){
                                    alert('สถานะผู้ใช้ระบบเท่ากับ “ไม่ใช้งาน”')
                                }
                            }, 300);
                        } else if(tmp.data4.data4 === '0'){
                            alert('ชื่อ password ไม่ถูกต้อง')
                            tmp.writeLogLoginPasswordError('12',this.state.userLogin)
                        }
                    }, 300);
                } else if(tmp.data3.data3 === '0') {
                    alert('ชื่อ username ไม่ถูกต้อง')
                }
            }, 300);
        }else{
            alert('กรอกข้อมูลไม่ครบ')
        }
    }

    render() {
        if (sessionStorage.getItem("token")) { return (<Redirect to={'/HomePage'} />) }
        return (
            <div class='outer'>
                <div class="alert alert-info" role="alert" id='header_login'><h3>เข้าระบบ</h3></div>
                <div class='login'>
                    <h1>เข้าสู่ระบบ</h1><br />
                    <div class="input-group input-group-lg">
                        <span class="input-group-addon" id="sizing-addon1">@</span>
                        <input type="text" class="form-control" maxLength='4' placeholder="Username" aria-describedby="sizing-addon1" name="userLogin" onChange={this.onChange} required />
                    </div><br />
                    <div class="input-group input-group-lg">
                        <span class="input-group-addon" id="sizing-addon1">#</span>
                        <input type="text" class="form-control" maxLength='4' placeholder="Password" aria-describedby="sizing-addon1" name="userPassword" onChange={this.onChange} required />
                    </div><br />
                    <button type="submit" class="btn btn-default navbar-btn" onClick={this.login}>เข้าสู่ระบบ</button>
                </div >
            </div>
        );
    }
}

export default Login;