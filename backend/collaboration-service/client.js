// Connect to the server
const socket = io("http://localhost:3003");

const form = document.getElementById('code-container');
const input = document.getElementById('code-input');
const sessionHash = "testHash";    //to be replaced with matching service's session hash

//poll for change in textbox at 1s interval
form.addEventListener('input', debounce (() => { 

    // Get the input value
    const code = input.value;

    // Send the code to the server
    console.log(`Sending code: ${code}`)
    socket.emit('code', sessionHash, code);

}, 1000));

// Handle 'code' events
socket.on('code', (code) => {
    // Update textbox when receive code data from other client
    console.log(`Received code: ${code}`);
    input.value = code;
});

// Handle connection
socket.on("connect", () => {
  console.log(`Connected to the server as ${socket.id}`);

  // Join a session
  socket.emit("joinSession", sessionHash);
});

function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
  }