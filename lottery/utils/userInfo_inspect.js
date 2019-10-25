/*
name 用户姓名
*/

const isValidCustomerName = name => {
  const nameReg = new RegExp(/^[\u4e00-\u9fa5 ]{2,6}$/)
  return (
    nameReg.test(name) &&
    name.indexOf('先生') === -1 &&
    name.indexOf('女士') === -1 &&
    name.indexOf('小姐') === -1 &&
    name.indexOf('男士') === -1
  )
}

const isValidCustomerID = id => {
  const numberReg = new RegExp(
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  )
  return numberReg.test(id)
}

const isValidCustomerTelephone = telephone => {
  const telephoneReg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
  return telephoneReg.test(telephone)
}

module.exports =  { isValidCustomerName, isValidCustomerID, isValidCustomerTelephone }
