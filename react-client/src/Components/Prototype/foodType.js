const request = require('superagent')

export class foodType {
  constructor() {
  }

  listFoodTypeDescription() {
    request.get('http://localhost:8080/selectFoodTypeDescription/')
    .send()
    .end((err, res) => {
        if (err) { alert(err); return }
        if (res.body) {
            console.log(res.body)
            this.dataFoodType = res.body
        }
    })
  }
}