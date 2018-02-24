const low = require('lowdb')
const lodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('src/db/db.json')
const db = low(adapter)

db._.mixin(lodashId)

const KEY = 'addresses'

const collection = db
  .defaults({ [KEY]: [] })
  .get(KEY)

const getByAddress = (address) => (
  db
    .get(KEY)
    .find({ address })
    .value()
)

module.exports = {
  create: (props) => {
    const found = getByAddress(props.address)
    if (found) {
      return {exists: true}
    } else {
      return collection
        .insert({
          createdAt: +new Date,
          updatedAt: +new Date,
          ...props,
        })
        .write()
    }
  },
}
