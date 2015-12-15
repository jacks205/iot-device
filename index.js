var awsIot = require('aws-iot-device-sdk');

/*
{
  "host": "A2C4ZSVXIY9QE0.iot.us-west-2.amazonaws.com",
  "port": 8883,
  "clientId": "mything",
  "thingName": "mything",
  "caCert": "root-CA.crt",
  "clientCert": "6ed8d31c27-certificate.pem.crt",
  "privateKey": "6ed8d31c27-private.pem.key"
}
*/

var thingShadows = awsIot.thingShadow({
   keyPath: './6ed8d31c27-private.pem.key',
  certPath: './6ed8d31c27-certificate.pem.crt',
    caPath: './rootCA.pem',
  clientId: 'mything',
    region: 'us-west-2'
});

//
// Thing shadow state
//
var rgbLedLampState = {"state":{"reported":{"green":0}}};

//
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;

thingShadows.on('connect', function() {
//
// After connecting to the AWS IoT platform, register interest in the
// Thing Shadow named 'RGBLedLamp'.
//
    thingShadows.register( 'mything' );
//
// 2 seconds after registering, update the Thing Shadow named 
// 'RGBLedLamp' with the latest device state and save the clientToken
// so that we can correlate it with status or timeout events.
//
// Note that the delay is not required for subsequent updates; only
// the first update after a Thing Shadow registration using default
// parameters requires a delay.  See API documentation for the update
// method for more details.
//
    setTimeout( function() {
       clientTokenUpdate = thingShadows.update('mything', rgbLedLampState  );
       }, 1000 );
    });

thingShadows.on('status', 
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

thingShadows.on('delta', 
    function(thingName, stateObject) {
       console.log('received delta '+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout '+' on '+operation+': '+
                   clientToken);
    });