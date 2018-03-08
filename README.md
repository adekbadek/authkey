# authkey
> self-hosted, bare-bones licensing API

Basically a very limited version of what [keygen.sh](https://keygen.sh/) does.

[![npm](https://img.shields.io/npm/v/authkey.svg)](https://www.npmjs.com/package/authkey)
[![Build Status](https://travis-ci.org/adekbadek/authkey.svg?branch=master)](https://travis-ci.org/adekbadek/authkey)
[![Coverage Status](https://coveralls.io/repos/github/adekbadek/authkey/badge.svg?branch=master)](https://coveralls.io/github/adekbadek/authkey?branch=master)[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Quick start

1. configure [Amazon SES](https://aws.amazon.com/ses/) or get some gmail creds

1. install

  ```shell
  npm i authkey
  ```

1. use

  ```javascript
  const authkey = require('authkey')

  authkey({
    from: 'superthing@things.com'
    productName: 'SuperThing',
    mailerConfig: {
      // see below for other services
      type: 'gmail',
      credentials: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      }
    },
  }).listen()
  ```

### `mailerConfig` options

| service (`type`) | required `credentials` |
| :------------- | :------------- |
| `amazonSES` | `accessKeyId`, `secretAccessKey`, `region` |
| `gmail` | `user`, `pass` |


## API Reference

| verb | endpoint       | what it does     |
| :------------- | :------------- | :------------- |
| `POST` | `/request/:address` | creates a new auth key for the given address and sends an email with the auth key |
| `POST` | `/verify/:authkey` | verifies the given auth key |

## Database

a JSON file handled with [lowdb](https://github.com/typicode/lowdb)

## Versioning

[SemVer](http://semver.org/) is used (with help of [semantic-release](https://github.com/semantic-release/semantic-release)).

## Contributing

```shell
git clone https://github.com/adekbadek/authkey.git
cd authkey/
npm i
npm t
```

Will install the dependencies and run tests in watch mode.

### Tests

with [Jest](https://facebook.github.io/jest/)

```shell
npm t
```

### Style guide

using [Standard](https://standardjs.com/)
