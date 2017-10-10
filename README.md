# JavaScript多线程能力

## HTML5带给web开发的多线程能力——web worker

https://html.spec.whatwg.org/multipage/workers.html#workers

先来看下web worker怎么用：

multiThread.js
```JS
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
```

worker1.js
```JS
self.addEventListener("message", function(event) {
  event.data.a = 44;
  setTimeout(function() {
    self.postMessage(event.data);
  }, 100);
});

```
worker是在后台起了一个工作线程，来执行js运算，通信机制是基于事件通知模型。

但要多注意一点的是：

1.每个worker和主线程、每个worker之间作用域隔离，变量不共享。

2.worker不能操作dom。

这个时候，worker就好像是一个帮忙干活的临时工，适用场景自然就是主线程干活吃力的时候，多叫几个worker过来帮帮忙，但是这几个worker之间还都位于不同的神位面，各忙各的，2333，我们从小接受的教育是团结互助1+1>2。

在实际应用程序设计中，我们不追求1+1>2，但各个线程之间如果能增加通信与控制，一是代码容易写（虽然也很恶心，但是C语言好像是这样的？），二能与其他多线程语言接轨，JS的平台就会更广阔。

SharedArrayBuffer和Atomics给JS带来了这些能力。

## ES2018提出的SharedArrayBuffer and Atomics完善了JS的多线程能力

### SharedArrayBuffer、Atomics 

SharedArrayBuffer：worker与主线程之间都可以操作的一块共享内存。

Atomics：提供两类方法，一类是可以对SharedArrayBuffer进行原子操作的方法（add()、load()、or()等），一类是可以控制线程进行等待、触发的方法（wait()、 wake()）。
```
The Atomics object provides functions that operate indivisibly (atomically) on shared memory array cells as well as functions that let agents wait for and dispatch primitive events.
```

#### SharedArrayBuffer
sharedArraybuffer.js
```JS
//shared memory

const worker3 = new Worker("worker3.js");

let sab = new Int32Array(new SharedArrayBuffer(32));

worker3.addEventListener("message", function(event) {});

worker3.postMessage(sab);

setTimeout(function() {
  let a = Atomics.load(sab, 0);
  console.log(a);
}, 1000);
```

```
Shared Array Buffers are a primitive building block for higher-level concurrency abstractions.
```
SharedArrayBuffer起初是为了建立程序控制锁而创建的。（话说我开始一直以为他是为了打破作用域隔离，认为他是为了减少内存的公共变量），来来来，赶紧说说为啥，不然又懵逼了...


### 多线程程序运行的控制权——锁 lock.js
lock.js基于SharedArrayBuffer和Atomics

sab-lock.js
```JS
const worker4 = new Worker("worker4.js");

let sab = new SharedArrayBuffer(32);
let sa = new Int32Array(sab);

// Set up the lock
Lock.initialize(sa, 0);
const lock = new Lock(sa, 0);
lock.lock();
//lock()会改变sab的值
console.log(Atomics.load(sa, 0));

worker4.addEventListener("message", function(event) {});

worker4.postMessage(sab);

setTimeout(function() {
  lock.unlock();
}, 1000);
```
worker4.js
```JS
importScripts("lock.js");

self.addEventListener("message", function(event) {
  const sab = event.data;
  let sa = new Int32Array(sab);
  const lock = new Lock(sa, 0);
  console.log("Waiting for lock...");
  lock.lock(); // blocks!
  console.log("Unlocked");//至少1s后执行
});

```

worker4.js中lock.lock()类似于async方法中的await：worker执行到lock()时，worker的程序执行暂停。

等待主线程给他解锁后才能执行（其他worker能否给解锁？）。


至此，我们介绍了JavaScript多线程编程的方式。

在我的理解来看，多线程能力并不是用来替代单线程，而是设计来补足单线程的不足，比如多线程能力能让JS更适合跑在CPU、GPU（WebGL）等需要大量计算的场景上，可以让JS跑在多线程语言（C语言）适用的场景。

世界第一语言？⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄


## See also

[ES proposal: Shared memory and atomics](http://2ality.com/2017/01/shared-array-buffer.html)

[Atomic](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)

[ECMAScript® 2018 Language Specification](https://tc39.github.io/ecma262/)

[HTML-worker](https://html.spec.whatwg.org/multipage/workers.html)