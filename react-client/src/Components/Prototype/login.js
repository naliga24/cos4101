let jwt = require('jsonwebtoken')
const request = require('superagent')
import { user } from './../Prototype/user.js'
import { menu } from './../Prototype/menu.js'
import { userType } from './../Prototype/userType.js'

export class login {
  constructor() {
  }

  getLoginNoLocalStorage() {
    let auth = sessionStorage.getItem("token");
    if (auth) {
      this.data1 = jwt.verify(auth, 'shhhhh', function (err, decoded) {
        return decoded.USER_NO;
      })
      console.log(this.data1)
    }
  }

  callGetPermissionDetail(userLogin,userPassword) {
    this.data = new userType()
    this.data.getPermissionDetail(userLogin,userPassword)
  }

  writeLogLogin(loginStatus) {
    this.getLoginNoLocalStorage()
    request.get('http://localhost:8080/insertUserTransaction/' + this.data1+'/'+loginStatus)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          console.log(res)
        } else if (res.text === "0") {
          console.log(`ไม่สามารถเพิ่มข้อมูล log login ได้`)
        }
      })
  }

  writeLogLogout(loginStatus) {
    this.getLoginNoLocalStorage()
    request.get('http://localhost:8080/updateUserTransaction/' + this.data1+'/'+loginStatus)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          console.log(res)
        } else if (res.text === "0") {
          console.log(`ไม่สามารถอัพเดทข้อมูล log logout ได้`)
        }
      })
  }

  callSetPermission() {
    this.data2 = new menu()
    this.data2.setPermission()
  }

  
  callCheckUserLogin(userLogin) {
    this.data3 = new user()
    this.data3.checkUserLogin(userLogin)
  }

  
  callCheckUserPassword(userLogin,userPassword) {
    this.data4 = new user()
    this.data4.checkUserPassword(userLogin,userPassword)
  }

  callCheckUserStatus(userLogin,userPassword) {
    this.data5 = new user()
    this.data5.checkUserStatus(userLogin,userPassword)
  }

  callGetLoginNo(userLogin){
    this.data6 = new user()
    this.data6.getUserNo(userLogin)
  }

  writeLogLoginPasswordError(loginStatus,userLogin) {
    this.callGetLoginNo(userLogin)
    setTimeout(() => {
      request.get('http://localhost:8080/insertUserTransaction/' + this.data6.data6+'/'+loginStatus)
      .send()
      .end((err, res) => {
        if (err) { alert(err); return }
        if (res.text === "1") {
          console.log(res)
        } else if (res.text === "0") {
          console.log(`ไม่สามารถเพิ่มข้อมูล log login ได้`)
        }
      })      
    }, 300);
  }
}