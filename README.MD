<div align="center">
    <h1>AminoDorksTS</h1>
    <a href="https://t.me/aminodorks"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
    <a href="https://www.npmjs.com/package/aminodorks"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM"></a>
</div>
<div align="center">
    <img src="https://img.shields.io/npm/dm/amino.dorks" alt="Downloads">
    <img src="https://img.shields.io/npm/v/amino.dorks.svg" alt="Version">
    <h2>AminoDorksTS is a TypeScript library that interacts with the AminoApps API.</h2>
</div>


## Table of Contents
-----------------

* [Features](#features)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Features
--------

AminoDorks contains a many features as a library for AminoApps, for example
* So much methods to interacting with API
* Generation of special signature from Android with KeyStore bypassing
* Non-limited requests rate limit for signatures generation
* Huge priority for creating user bots for stressing
* Supporting of so much types with API interacting
* [Fully open source code of server-side](https://github.com/thatcelt/dorks_api)

## Getting Started
---------------

To get started with AminoDorks, follow these steps:
1. Initialize npm package: `npm init`
2. Install TypeScript: `npm i -g typescript`
3. Initialize TypeScript config and configure it: `tsc --init`
4. Install package via npm: `npm i amino.dorks`
5. Get your individual API_KEY from our [Telegram Bot](https://t.me/aminodorks_bot)

## Usage
-----
### Basic authorization

```typescript
import { AminoDorks } from 'amino.dorks';

const main = async () => {
    const aminoDorks = new AminoDorks('API_KEY');
    const response = await aminoDorks.authenticate('email@example.com', 'password');
    console.log(`Logged in ${response.account.nickname}`);
};

main();
```

### Actions in other communities

```typescript
import { AminoDorks } from 'amino.dorks';

const main = async () => {
    const aminoDorks = new AminoDorks('API_KEY');
    const response = await aminoDorks.authenticate('email@example.com', 'password');
    
    const aminoDorksNdc = aminoDorks.setNdcId('NDC_ID') // now we can use this instance for interacting with community
    await aminoDorksNdc.playLottery() // for example, for play lottery to get some coins
};

main();
```

## API Documentation
-----------------

* In development...


## Contributing
------------

Contributions are welcome! Please submit a pull request with your changes.

## License
-------

AminoDorksTS is licensed under the MIT License. See LICENSE for more information.
If you're will use my generators - write about it to my [DM](https://t.me/celt_is_god)