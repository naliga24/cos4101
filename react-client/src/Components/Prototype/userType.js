const request = require('superagent')

export class userType {
  constructor() {
  }

  listPermission() {
    request.get('http://localhost:8080/selectUserTypeInfo')
      .send()
      .end((err, res) => {
        if (err) { console.log(err); return; }
        this.data = res.body
      })
  }

  editPermission(permission, userTypeNo) {
      request.put('http://localhost:8080/updateUserTypeInfo/' + permission + '/' + userTypeNo)
      .send()
      .end((err, res) => {
        if (err) { console.log(err); return; }
        if (res) {
          console.log(res)
          //this.alert_msg = `แก้ไขสิทธิ์ในการเข้าใช้งานของ "${userTypeName}" เรียบร้อย`
        }
      });
  }

  getPermissionDetail(userLogin, userPassword) {
    request.post('http://localhost:8080/selectUserPermission')
      .send({ userLogin: userLogin, userPassword: userPassword })
      .end((err, res) => {
        if (err) { return; }
        if (res.body.token.length > 30) {
          sessionStorage.setItem("token", res.body.token)
        }
      });
  }

}