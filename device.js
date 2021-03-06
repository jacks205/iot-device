var awsIot = require('aws-iot-device-sdk');
var http = require('http');
var staticServer = require('node-static');
var io = require('socket.io')();

/**
  Setup AWS IoT MQTT
 */
var thingShadows = awsIot.thingShadow({
   keyPath: './certs/6ed8d31c27-private.pem.key',
  certPath: './certs/6ed8d31c27-certificate.pem.crt',
    caPath: './certs/rootCA.pem',
  clientId: 'thing',
    region: 'us-west-2'
});
var globalSocket;

function setupIoTConnection(thingShadows) {
  return function() {
    /**
      After connecting to the AWS IoT platform, register interest in the
      Thing Shadow named 'thing'.
    */
    console.log('Reqesting updates on thing');
    thingShadows.register('thing');
  }
}

function notifyGUIOfStatus(socket) {
  return function(thingName, stat, clientToken, stateObject) {
    /**
     Emit state data over WebSocket to client (GUI)
    */
    console.log(JSON.stringify(stateObject));
    if(globalSocket)
      globalSocket.emit('state', stateObject);
  }
}

thingShadows.on('connect', setupIoTConnection(thingShadows));
// Don't seem to get this
thingShadows.on('status', notifyGUIOfStatus(globalSocket));
// But get this
thingShadows.on('delta',
    function(thingName, stateObject) {
        console.log('received delta '+' on '+thingName+': '+
                   JSON.stringify(stateObject));
        if(globalSocket)
          globalSocket.emit('state', stateObject);
        var color = stateObject.state.color;
        console.log(color);
        /**
          We see that someone has requested to change the state. So
          here we acknowledge that it has been changed by "reporting" back.
        */
        thingShadows.update('thing', { "state": { "reported": { "color": color }}});
    });


io.on('connection', function(socket) {
  console.log('socket connected')
  // Hacky AF
  globalSocket = socket;
});

io.listen(4000);


// Start static server to serve GUI
var files = new staticServer.Server('./gui/dist');
http.createServer(function (request, response) {
    request.addListener('end', function () {
      files.serve(request, response);
    }).resume();
}).listen(8080);