//shared memory

const worker3 = new Worker("worker3.js");

let sab = new Int32Array(new SharedArrayBuffer(32));

worker3.addEventListener("message", function(event) {});

worker3.postMessage(sab);

setTimeout(function() {
  let a = Atomics.load(sab, 0);
  console.log(a);
}, 1000);
