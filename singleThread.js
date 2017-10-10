function getTicketsData() {
  return new Promise(reslove => {
    setTimeout(function() {
      reslove({
        G72: 900,
        D909: 99
      });
    }, 1000);
  });
}

async function init(params) {
  let res = {};
  console.log(JSON.stringify(res));
  console.time();
  res = await getTicketsData(1000);
  console.log(JSON.stringify(res));
  console.timeEnd();
}

init();
