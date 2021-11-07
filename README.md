# xplora-api.js

An unofficial client library for the Xplora API.

## Features

- Simple and lightweight Xplora API client
- Promise-based API (works with `async` / `await`)
- Typescript support
- Isomorphic (works with Node / browsers)

## Install

```bash
$ npm add xplora-api.js
```

## Quickstart

Get your child's location information. ▶️ [Try it out](https://runkit.com/).

```js
const xpa = require("xplora-api.js");

async function main() {
    
    //  Create a new Xplora API handler
    const gqlHandler = new xpa.GQLHandler("+<COUNTRYCODE>", "<PHONENUMBER W/O COUNTRYCODE>", "<YOUR SCRET PASSWORD>", "en-US", "");

    //  Login with the credentials above
    const issueToken = await gqlHandler.login();
    
    //  Get my information
    console.log("Get detailed information about the logged in account ...");
    console.dir(await gqlHandler.getMyInfo(), {depth: null, colors: true});

    //  Let watch report its current location
    console.log("Invoke watch reporting its current location ...");
    console.dir(await gqlHandler.askWatchLocate(issueToken.user.children[0].ward.id), {depth: null, colors: true});

    console.log("    ... waiting 5 sec. for the watch reporting its location to the Xplora Cloud service ...");
    await Sleep(5000);

    //  Get the last reported location
    console.log("Report the watch's last location ...");
}

main();
```

## Additional examples

Please hava a look at the additional examples for your interest:

- [A simple ioBroker script to track children's position](./examples/iobroker/README.md)

## Changelog

0.1.1

- (MiGoller) Added method to let the watch report its current position once.
- (MiGoller) Added method to actively track the watch for 1 minute.

0.1.0

- (MiGoller) First public release. Enjoy ;-)  

## License

### MIT License

Copyright (c) 2021 MiGoller (https://github.com/MiGoller/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
