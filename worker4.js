importScripts("lock.js");

self.addEventListener("message", function(event) {
  const sab = event.data;
  let sa = new Int32Array(sab);
  const lock = new Lock(sa, 0);
  console.log("Waiting for lock...");
  lock.lock(); // blocks!
  console.log("Unlocked");
  //   console.log(Atomics.load(sa, 0));
});
