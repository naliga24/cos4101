const request = require('superagent')
import { userType } from './userType.js'

export class configuration {
  constructor() {
  }

  editUserType(permission, userTypeNo){
    this.data = new userType()
    this.data.editPermission(permission, userTypeNo)
  }

  callListPermission(){
    this.data1 = new userType()
    this.data1.listPermission()
  }

}