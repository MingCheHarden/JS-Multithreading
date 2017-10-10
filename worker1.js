self.addEventListener("message", function(event) {
  event.data.a = 44;
  setTimeout(function() {
    self.postMessage(event.data);
  }, 100);
});
