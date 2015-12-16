# IoT Device

Simple Node.js application meant to run on a "Thing" (ex. Raspberry Pi). Demonstrates
usage of AWS IoT.

## Running

`npm start`

This starts the MQTT client and a static server to serve our example GUI. Visit `localhost:8080` to see a visual status of the state of the device.

## Developing GUI

Make sure you are in `/gui`.

1. `npm install`
2. `gulp`

Visit `localhost:3000`.