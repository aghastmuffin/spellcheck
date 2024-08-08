if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support Speech Synthesis");
    throw new Error("Speech Synthesis is not supported"); //js doesn't have an exit() equivalent so this is the closest we'll get.
}
var msg = new SpeechSynthesisUtterance();
score = 0;
guesses = 5;
if (!localStorage.getItem("highscore")){
    localStorage.setItem("highscore", 0);
}
let word_data;
function addUrlParameter(paramName, paramValue) {
    // Step 1: Get the current URL
    const currentUrl = window.location.href;

    // Step 2: Create a URL object
    const url = new URL(currentUrl);

    // Step 3: Set the parameter
    url.searchParams.set(paramName, paramValue);

    // Step 4: Update the browser's URL without reloading the page
    window.history.pushState({}, '', url);
}

function getmode(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('mode')) {
        const paramValue = urlParams.get('mode'); 
        return paramValue;
    } else{
        return "easy";
    }
}
async function loadGameData(mode) {
    try {
        const response = await fetch(`${mode}.json`); //this could be potentially dangerous but filenames are hardcoded so it should be fine.
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function speak(w){
    msg.text = w;
    window.speechSynthesis.speak(msg); //changed from msg
}
function repeat(){
    window.speechSynthesis.speak(msg); //changed from msg
}
function getRandomWord(words) {
    console.log(words)
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomKey = words[randomIndex];
    return randomKey; //what
}
function array_rm(array, word){
    let index = word_data.indexOf(word);
    if(index > -1){
        array.splice(index, 1);
    }
}
function start_game() {
    let word = getRandomWord(word_data);
    array_rm(word_data, word);
    speak(word);
    console.log(word);
    
}
function check_guess(){
    let guess = document.getElementById("answer").value;
    let word = msg.text.toLowerCase();
    guess = guess.toLowerCase();
    document.getElementById("speller").innerText = ""; //if optimizing check this.
    if(guess === word){
        score += 1;
        if (score > localStorage.getItem("highscore")){
            localStorage.setItem("highscore", score);
        }
        document.getElementById("score").innerText = score;
        document.getElementById("answer").value = "";
        if (score === word_data.length){
            document.getElementById("speller").innerText = `Congratulations! You've completed the ${mode} gamemode!`;
        } else{
            start_game();
        }
    } else {
        console.log("failed")
        //repeat(); //only for hard
        document.getElementById("speller").innerText = ("incorrect! here's how you spell that: " + msg.text);
        start_game();//generate a new word
        document.getElementById("answer").value = "";
        guesses -= 1;
        document.getElementById("guesses").innerText = guesses;
        if(guesses === 0){
            alert("Game Over, your highscore has been saved successfully");
            document.getElementById("start").disabled = true;
            document.getElementById("answer").disabled = true;
        }
    }

}
function isChromiumBased() {
    const userAgent = navigator.userAgent;
    return userAgent.includes('Chrome') || userAgent.includes('Chromium') || userAgent.includes('Edg');
}
async function prep(){
    let dmode = getmode();
    let mode;
    if (dmode === "easy"){
        mode = "easy";
    } else if (dmode === "medium"){
        mode = "medium";
    } else if (dmode === "hard"){
        mode = "hard";
    } else {
        alert("Invalid mode, defaulting to easy");
        mode = "easy";
    }
    word_data = await loadGameData(mode); //let is a global delcaror
    start_game();
}
//first run only
document.getElementById("score").innerText = score;
document.getElementById("guesses").innerText = guesses;
document.getElementById("hs").innerText = localStorage.getItem("highscore");
