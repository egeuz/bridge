//HANDLE AUDIO RECORDING
const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });
    const start = () => mediaRecorder.start();
    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });
        mediaRecorder.stop();
      });
    resolve({ start, stop });
  });
let recorder = null;  
let audio = null;
const recordStop = async () => {
  if (recorder) {
    audio = await recorder.stop();
    recorder = null;
    document.querySelector("#record-stop-button").classList.remove('recording');
    document.querySelector("#play-audio-button").disabled = false;
  } else {
    recorder = await recordAudio();
    recorder.start();
    document.querySelector("#record-stop-button").classList.add('recording');
    document.querySelector("#play-audio-button").disabled = true;
  }
};
const playAudio = () => {
  if (audio && typeof audio.play === "function") {
    audio.play();
  }
};

// while (!audio.paused) {
//   document.querySelector("#play-audio-button").disabled = true;
// }

//HANDLE QUESTIONS
const questionArray = [
  "Why do people become addicted to things?",
  "In our globalized world, are nations and borders still necessary?",
  "What do you think matters more, nature or nurture?",
  "Is the world too populated?",
  "Is going to university important to become successful?",
  "Should daylight savings time be abolished?",
  "Should military service be mandatory?",
  "Should pets be allowed in public spaces?"
];

//Randomly generate a question on launch
const rng = (min, max) => Math.floor(Math.random() * max - min) + min;
document.getElementById('question').innerHTML = questionArray[rng(0, questionArray.length-1)];