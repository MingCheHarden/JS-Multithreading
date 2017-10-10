self.addEventListener("message", function(event) {
  event.data.a = 40;
  self.postMessage(event.data);
});
