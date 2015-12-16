const socket = io.connect('http://127.0.0.1:4000');
// Visual element to represent state
const stateElement = document.getElementById('state');

socket.on('state', function(data) {
  console.log(state);
  const color = data.state.color || data.state.reported.color;
  stateElement.style.background = color;
});
