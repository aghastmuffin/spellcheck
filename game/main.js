if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support Speech Synthesis");
    throw new Error("Speech Synthesis is not supported"); //js doesn't have an exit() equivalent so this is the closest we'll get.
}
var msg = new SpeechSynthesisUtterance();
score = 0;
guesses = 5;
async function loadGameData() {
    try {
        const response = await fetch('easy.json');
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
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomKey = words[randomIndex];
    return randomKey; //what
}

async function start_game() {
    let word_data = await loadGameData()
    let word = getRandomWord(word_data);
    speak(word);
    console.log(word);
}
function check_guess(){
    let guess = document.getElementById("answer").value;
    let word = msg.text.toLowerCase();
    guess = guess.toLowerCase();
    if(guess === word){
        score += 1;
        document.getElementById("score").innerText = score;
        document.getElementById("answer").value = "";
        start_game();
    } else {
        console.log("failed")
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
