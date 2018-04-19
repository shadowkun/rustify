var importObject = {
          imports: {
            imported_func: function(arg) {
              console.log(arg);
            }
          }
        };
  
        request = new XMLHttpRequest();
        // u should put wasm in www dir
        request.open('GET', 'rust/add.wasm');
        request.responseType = 'arraybuffer';
        request.send();
  
        request.onload = function() {
          var bytes = request.response;
          WebAssembly.instantiate(bytes, importObject)
          .then(function (res) {
                var addOne = res.instance.exports.add_one
                console.log(addOne(41))
                console.log(addOne(68))
            }).catch(function (e) {
                console.error('Creating WASM module failed', e)
            })
        };
