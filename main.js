
  // Write to Firebase
  // function writeData() {
  //   database.ref("test/value").set(345);
  // }

  // // Read from Firebase
  // database.ref("test/value").on("value", (snapshot) => {
  //   const temp = snapshot.val();
  //   console.log("value", temp);
  //   document.getElementById("run").innerHTML = temp;
  // });

  // Complete Project Details at: https://RandomNerdTutorials.com/

// Database Paths
var dataFloatPath = 'test/value';
// var dataIntPath = 'test/int';

// Get a database reference 
const databaseFloat = database.ref(dataFloatPath);
// const databaseInt = database.ref(dataIntPath);

// Variables to save database current values
var floatReading;
// var intReading;

//solinoid value
const solenoidRef = database.ref("Solenoid/State");

    const button = document.getElementById("solenoidButton");
    const stateText = document.getElementById("solenoidState");

    // Listen to Firebase value changes
    solenoidRef.on("value", (snapshot) => {
      const state = snapshot.val();
      updateUI(state);
    });

    // Update Firebase on button click
    function toggleSolenoid() {
      solenoidRef.once("value").then((snapshot) => {
        const currentState = snapshot.val();
        const newState = currentState === "ON" ? "OFF" : "ON";
        solenoidRef.set(newState);
      });
    }

    // Update UI based on current state
    function updateUI(state) {
      if (state === "ON") {
        button.textContent = "ON";
        button.classList.remove("bg-red-500", "hover:bg-red-600");
        button.classList.add("bg-green-500", "hover:bg-green-600");
        stateText.textContent = "Water stopped";
      } else {
        button.textContent = "OFF";
        button.classList.remove("bg-green-500", "hover:bg-green-600");
        button.classList.add("bg-red-500", "hover:bg-red-600");
        stateText.textContent = "Water Flowing";
      }
    }


// ultrasonic sensor code 
window.addEventListener("DOMContentLoaded", () => {
  // Get Firebase database reference
  const db = firebase.database();
  const levelRef = db.ref("WaterTank/Level_percent");

  // Get HTML elements
  const levelText = document.getElementById("tankLevelText");
  const ctx = document.getElementById("tankLevelChart").getContext("2d");

  // Create Chart
  const tankChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Filled", "Empty"],
      datasets: [{
        data: [0, 100],
        backgroundColor: ["#3B82F6", "#E5E7EB"]
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: { legend: { display: false } }
    }
  });

  // Listen to changes in Firebase
  levelRef.on("value", (snapshot) => {
    const level = snapshot.val();
    if (typeof level === "number") {
      tankChart.data.datasets[0].data = [level, 100 - level];
      tankChart.update();
      levelText.textContent = `${level}%`;
    } else {
      levelText.textContent = "Invalid Data";
    }
  });
});

// for system alert
 // Reference to the leak status in Firebase
 const leakStatusRef = database.ref('SystemStatus/SystemAlert');

 // Function to toggle the alert icon visibility
 function toggleLeakAlert(isLeakDetected) {
   const alertIcon = document.getElementById('alertIcon');
   const alertMessage = document.getElementById('alertMessage');

   if (isLeakDetected) {
     alertIcon.classList.remove('hidden');  // Show the alert icon
     alertMessage.textContent = 'Leak Detected!';  // Update the message
     alertMessage.classList.add('text-red-600'); // Change text color to red
   } else {
     alertIcon.classList.add('hidden');     // Hide the alert icon
     alertMessage.textContent = 'No leak detected.';  // Update the message
     alertMessage.classList.remove('text-red-600'); // Reset text color
     alertMessage.classList.add('text-green-600'); // Change text color to green
   }
 }

 // Listen for changes in the leakDetected status in Firebase
 leakStatusRef.on('value', (snapshot) => {
   const leakDetected = snapshot.val(); // This will be true or false
   toggleLeakAlert(leakDetected);
 });


 // for twilio message
 function toggleLeakAlert(isLeakDetected) {
  const alertIcon = document.getElementById('alertIcon');
  const alertMessage = document.getElementById('alertMessage');

  if (isLeakDetected) {
    alertIcon.classList.remove('hidden');
    alertMessage.textContent = 'Leak Detected!';
    alertMessage.classList.add('text-red-600');

    // Trigger backend to send SMS
    fetch('http://localhost:3000/send-leak-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: '+916369052640' // replace with user's real number
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('✅ SMS sent');
      } else {
        console.error('❌ Failed to send SMS:', data.error);
      }
    })
    .catch(error => console.error('❌ Fetch error:', error));

  } else {
    alertIcon.classList.add('hidden');
    alertMessage.textContent = 'No leak detected.';
    alertMessage.classList.remove('text-red-600');
    alertMessage.classList.add('text-green-600');
  }
}

 