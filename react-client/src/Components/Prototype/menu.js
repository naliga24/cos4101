let jwt = require('jsonwebtoken');
let auth = sessionStorage.getItem("token");
const request = require('superagent')

export class menu {
  constructor() {
    
  }

  setPermission(){
    console.log(auth)
    if (auth) {
      this.data = jwt.verify(auth, 'shhhhh', function (err, decoded) {
        return decoded.USER_TYPE_PERMISSION;
      });
      console.log(this.data)
    }
  }
}