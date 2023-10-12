const clockDisplay = document.getElementById("clock-display");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const ampmSelect = document.getElementById("ampm");
const setAlarmButton = document.getElementById("set-alarm");
const alarmList = document.getElementById("alarm-list");
// ============================================================================================

// Update the clock display
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = "AM";

    // It will convert time to 12-hour format
    if (hours >= 12) {
        ampm = "PM";
        if (hours > 12) {
            hours = hours - 12;
        }
    }

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    clockDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

// It will update clock every second
setInterval(updateClock, 1000);
// ============================================================================================

// Array to store the alarm timeout
const alarmTimeouts = [];

// Array to store the alarm times that have been set
const setAlarmTimes = [];


// Function to set alarms
function setAlarm() {
    const hours = parseInt(hoursInput.value);
    const minutes = parseInt(minutesInput.value);
    const seconds = parseInt(secondsInput.value);
    const ampm = ampmSelect.value;

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        alert("Please enter valid values for hours (1-12), minutes (0-59), and seconds (0-59).");
        return;
    }

    let alarmHours = hours;
    if (ampm === "PM" && hours !== 12) {
        alarmHours = alarmHours + 12;
    } else if (ampm === "AM" && hours === 12) {
        alarmHours = 0;
    }

    const alarmTime = `${alarmHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // It will check if the alarm time is already set
    if (setAlarmTimes.includes(alarmTime)) {
        alert(`Alarm for ${alarmTime} is already set.`);
        return;
    }

    setAlarmTimes.push(alarmTime);

    const alarmItem = document.createElement("li");
    alarmItem.innerHTML = `
            <span>${alarmTime} ${ampm}</span>
            <button class="delete-button">Delete</button>
        `;

    alarmList.appendChild(alarmItem);

    // It will clear input fields for next values
    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";

    // Calculate the time until the alarm
    const now = new Date();
    // console.log(now);
    let alarmTimediff;

    if (alarmHours > now.getHours() || (alarmHours === now.getHours() && minutes > now.getMinutes())) {
        // Alarm time is in the future on the same day
        alarmTimediff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), alarmHours, minutes, seconds) - now;
    } else {
        // Alarm time is tomorrow
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, alarmHours, minutes, seconds);
        alarmTimediff = tomorrow - now;
    }

    const alarmTimeout = setTimeout(function () {
        playAlarmSound();
    }, alarmTimediff);


    alarmTimeouts.push(alarmTimeout);

}
// ============================================================================================


// Function to play the alarm sound
function playAlarmSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioElement = new Audio("mixkit-digital-clock-digital-alarm-buzzer-992.wav");
    const source = audioContext.createMediaElementSource(audioElement);

    source.connect(audioContext.destination);

    audioElement.play();

    setTimeout(function () {
        audioElement.pause();
        audioElement.currentTime = 0;
    }, 20000);

}
// ============================================================================================


setAlarmButton.addEventListener("click", setAlarm);

// Function to delete the alarm
function deleteAlarm(alarmIndex) {

    // Get the alarm time from the alarm item
    const alarmItem = alarmList.children[alarmIndex];
    const alarmTime = alarmItem.querySelector("span").textContent;

    // It will remove the alarm time from the setAlarmTimes array
    const timeIndex = setAlarmTimes.indexOf(alarmTime);
    if (timeIndex !== -1) {
        setAlarmTimes.splice(timeIndex, 1);
    }

    // It will cancel the scheduled alarm
    clearTimeout(alarmTimeouts[alarmIndex]);

    // Remove the alarm item from the list
    alarmList.removeChild(alarmList.children[alarmIndex]);
    alarmTimeouts.splice(alarmIndex, 1);
}


alarmList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
        const alarmIndex = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
        if (alarmIndex !== -1) {
            deleteAlarm(alarmIndex);
        }
    }
});


