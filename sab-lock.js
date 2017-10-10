//lock会改变sab的值

const worker4 = new Worker("worker4.js");

let sab = new SharedArrayBuffer(32);
let sa = new Int32Array(sab);

// Set up the lock
Lock.initialize(sa, 0);
const lock = new Lock(sa, 0);
lock.lock();
console.log(Atomics.load(sa, 0));

worker4.addEventListener("message", function(event) {});

worker4.postMessage(sab);

setTimeout(function() {
    lock.unlock();
}, 1000);
