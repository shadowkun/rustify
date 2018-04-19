# rustify
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Rust WebAssembly transform for
[Browserify](https://github.com/browserify/browserify). Because this is an
unstable rust feature, at the time of writing it relies on
[wasm-gc](https://github.com/alexcrichton/wasm-gc) to be available from the
command line. See [Installation](#installation) for instructions on how to
install. Probably also doesn't work on Windows.

Because this feature is experimental in Rust, this module should be considered
similarly.

## Usage
```sh
$ browserify -t rustify index.js > bundle.js
```
```js
// index.js
var rust = require('rustify')

var wasm = rust`
  #[no_mangle]
  pub fn add_one(x: i32) -> i32 {
    x + 1
  }
`

WebAssembly.instantiate(wasm, {})
  .then(function (res) {
    var addOne = res.instance.exports.add_one
    console.log(addOne(41))
    console.log(addOne(68))
  }).catch(function (e) {
    console.error('Creating WASM module failed', e)
  })
```

## External
```js
var rust = require('rustify')

var wasm = rust('./add-one.rs')

WebAssembly.instantiate(wasm, {})
  .then(function (res) {
    var addOne = res.instance.exports.add_one
    console.log(addOne(41))
    console.log(addOne(68))
  }).catch(function (e) {
    console.error('Creating WASM module failed', e)
  })
```

## API
### `uint8Array = rust(filename)`
Create a valid `.rs` file to a `Uint8Array`, ready to be passed to the WASM
constructor.

### `uint8Array = rust#string`
Create an inline rust template string to a `Uint8Array`, ready to be passed to
the WASM constructor.

## Installation
With [rustup](https://www.rust-lang.org/install.html) installed:
```sh
$ rustup update nightly
$ rustup target add wasm32-unknown-unknown --toolchain nightly
$ cargo install --git https://github.com/alexcrichton/wasm-gc
```
## Using in command line "$target" is ur rust sourcecode file "*.rs"
```sh
$ rustc +nightly --target wasm32-unknown-unknown "$target" --crate-type=cdylib
```
## recommend
> WebAssembly is not yet integrated with <script type='module'> or ES6 import statements, thus there is not a path to have the browser fetch modules for you using imports.

> The older WebAssembly.compile/WebAssembly.instantiate methods require you to create an ArrayBuffer containing your WebAssembly module binary after fetching the raw bytes, and then compile/instantiate it. This is analogous to new Function(string), except that we are substituting a string of characters (JavaScript source code) with an array buffer of bytes (WebAssembly source code).

> The newer WebAssembly.compileStreaming/WebAssembly.instantiateStreaming methods are a lot more efficient — they perform their actions directly on the raw stream of bytes coming from the network, cutting out the need for the ArrayBuffer step.

> So how do we get those bytes into an array buffer and compiled? The following sections explain.

fetch:
```javascript
fetch('module.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObject)
).then(results => {
  // Do something with the compiled results!
});
```

xmlHttpRequest:
``` javascript
request = new XMLHttpRequest();
request.open('GET', 'simple.wasm');
request.responseType = 'arraybuffer';
request.send();

request.onload = function() {
  var bytes = request.response;
  WebAssembly.instantiate(bytes, importObject).then(results => {
    results.instance.exports.exported_func();
  });
};
```

## Using in Front-end
```sh
$ npm install rustify
```

## License
[Apache-2.0](./LICENSE)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/rustify.svg?style=flat-square
[3]: https://npmjs.org/package/rustify
[4]: https://img.shields.io/travis/browserify/rustify/master.svg?style=flat-square
[5]: https://travis-ci.org/browserify/rustify
[6]: https://img.shields.io/codecov/c/github/browserify/rustify/master.svg?style=flat-square
[7]: https://codecov.io/github/browserify/rustify
[8]: http://img.shields.io/npm/dm/rustify.svg?style=flat-square
[9]: https://npmjs.org/package/rustify
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
