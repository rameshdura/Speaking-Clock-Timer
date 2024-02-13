const pomodoroTime = document.querySelector('.pomodoro__time');
const pomodoroState = document.querySelector('.pomodoro__state');
const modes = document.querySelectorAll('.mode');
const getStartedMessage = document.querySelector('.get-started');
const sound = document.querySelector('audio');
let countdown;

modes.forEach(mode => mode.addEventListener('click', switchModes));

function switchModes(e) {
	const secondsForMode = parseInt(e.target.dataset.time, 10);
	modes.forEach(mode => mode.classList.remove('active'));
	e.target.classList.add('active');
	getStartedMessage.style.display = 'none';
	timer(secondsForMode);
}

function speakTime(seconds) {
	
	// Fetch Indian accent voice if available
    const indianVoice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-IN');
	
	
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    let spokenTime = '';

    if (minutes > 0) {
        spokenTime += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    if (secondsRemaining > 0) {
        spokenTime += ` ${secondsRemaining} second${secondsRemaining > 1 ? 's' : ''}`;
    }

    // Creating a SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(spokenTime);

    // Set the voice to Indian accent if available, otherwise use the default voice
    utterance.voice = indianVoice || speechSynthesis.getVoices()[0];

    // Using SpeechSynthesis API to speak the time
    speechSynthesis.speak(utterance);
	
}
function timer(seconds) {
    clearInterval(countdown);
    const start = Date.now();
    const finish = start + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((finish - Date.now()) / 1000);
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            document.title = 'Time Up!';
            sound.currentTime = 5;
            sound.play();
        } else if (secondsLeft % 10 === 0) {
            speakTime(secondsLeft);
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
	const minutes = Math.floor(seconds / 60);
	const secondsRemaining = seconds % 60;
	const displayTime = `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
	document.title = displayTime;
	pomodoroTime.textContent = displayTime;
}



function restartTimer() {
    clearInterval(countdown);
    const activeMode = document.querySelector('.mode.active');
    const secondsForMode = parseInt(activeMode.dataset.time, 10);
    timer(secondsForMode);
}

