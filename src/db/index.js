const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

module.exports = ({dbFile = 'db.json'}) => {
  const adapter = new FileSync(dbFile)
  const db = low(adapter)

  db._.mixin(lodashId)

  const MAIN_KEY = 'addresses'

  const collection = db
    .defaults({ [MAIN_KEY]: [] })
    .get(MAIN_KEY)

  const findByProp = (prop) => (
    db
      .get(MAIN_KEY)
      .find(prop)
  )

  return {
    create: (props) => {
      const found = findByProp({address: props.address}).value()
      if (found) {
        return {exists: true, ...found}
      } else {
        return collection
          .insert({
            createdAt: +new Date(),
            updatedAt: +new Date(),
            verificationsCount: 0,
            ...props,
          })
          .write()
      }
    },
    verifyKey: authkey => {
      const found = findByProp({authkey})
      const foundValue = found.value()
      if (foundValue) {
        found
          .assign({
            lastVerified: +new Date(),
            verificationsCount: foundValue.verificationsCount + 1,
          })
          .write()
        return found
      } else {
        return false
      }
    },
    getKeyByAddress: address => (
      findByProp({address})
        .value()
    ),
    reset: () => {
      db.get(MAIN_KEY)
        .remove()
        .write()
    },
  }
}
