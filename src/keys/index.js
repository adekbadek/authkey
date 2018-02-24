const UIDGenerator = require('uid-generator')

const uidgen = new UIDGenerator()

module.exports = {
  generate: () => uidgen.generateSync(),
}
