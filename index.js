const server = require('./src/server')

module.exports = ({
  port = 3000,
  ...config
}) => {
  return ({
    listen: () => server(config).listen(port, () => {
      console.log(`listening on port ${port}`)
    }),
  })
}
