//多个worker和main thread之间作用域隔离，变量不共享

const worker1 = new Worker("worker1.js");
let sharedObj = {
    a: 1,
    b: 2
};
function wirte(sharedObj) {
    document.querySelector(".const").innerHTML = JSON.stringify(sharedObj);
}
// We display output for the worker
worker1.addEventListener("message", function(event) {
    wirte(event.data);
    console.log(`1:${JSON.stringify(sharedObj)}`);
});

worker1.postMessage(sharedObj);
