async function getTicketsData() {
  let res = await new Promise(reslove => {
    setTimeout(function() {
      reslove({
        G72: 900,
        D909: 99
      });
    }, 1000);
  });
  self.postMessage(res);
}

self.addEventListener("message", function(event) {});

getTicketsData();
