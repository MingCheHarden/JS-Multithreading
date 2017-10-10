self.addEventListener("message", function(event) {
  let sab = event.data;
  Atomics.add(sab, 0, 199);
});
