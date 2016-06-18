io.socket.on('connect', function() {
  console.log("Conectado");
});

io.socket.on('disconnect', function() {
	console.log('Lost connection to server');
});

io.socket.on('onlineUser', function onServerSentEvent (data) {
  // data => {...whatever the server broadcasted...}
  console.log("Usuario nuevo: " + JSON.stringify(data));
});

io.socket.on('message', function (data){
  console.log(data.greeting);
});
