const validator = require('email-validator')

module.exports = {
  validateEmail: validator.validate,
}
