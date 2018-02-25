# authkey
> self-hosted, bare-bones licensing API

Basically a very limited version of what [keygen.sh](https://keygen.sh/) does.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installing / Getting started

### Setting up dev

```shell
git clone https://github.com/adekbadek/authkey.git
cd authkey/
npm i
npm run dev
```

Set up env variables by creating `.env` file (see `.env-example`). You'll need a [mailgun](https://www.mailgun.com/) account for some of them.

Will install the dependencies and run development server.

### Running in production environment

```shell
npm start
```

## Versioning

[SemVer](http://semver.org/) is used (with help of [semantic-release](https://github.com/semantic-release/semantic-release)).
For the versions available, see the [link to tags on this repository](/tags).

## Tests

with [Jest](https://facebook.github.io/jest/)

```shell
npm t
```

## Style guide

using [Standard](https://standardjs.com/)

## Api Reference

| verb | endpoint       | what it does     |
| :------------- | :------------- | :------------- |
| `POST` | `/request/:address` | creates a new auth key for the given address and sends an email with the auth key |
| `POST` | `/verify/:authkey` | verifies the given auth key |

## Database

a JSON file handled with [lowdb](https://github.com/typicode/lowdb)
