// รับค่าขององค์ประกอบต่าง ๆ ของเกม
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// กำหนดค่าเริ่มต้นของตัวแปรเกม
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

// ฟังก์ชันสำหรับรีเซ็ตเกม
const resetGame = () => {
    // รีเซ็ตค่าตัวแปรเกมและองค์ประกอบของ UI
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    // รีเซ็ตการแสดงคำที่ต้องทาย
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    // เปิดใช้งานปุ่มใหม่
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    // ซ่อน Modal เกม
    gameModal.classList.remove("show");
}

// ฟังก์ชันสำหรับรับคำศัพท์และคำใบ้จากรายการคำศัพท์
const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

// ฟังก์ชันสำหรับการจบเกม
const gameOver = (isVictory) => {
    // แสดง Modal เมื่อเกมจบ
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

// ฟังก์ชันสำหรับเริ่มต้นเกมเมื่อคลิกที่ปุ่มตัวอักษร
const initGame = (button, clickedLetter) => {
    // ตรวจสอบว่าตัวอักษรที่คลิกอยู่ในคำศัพท์หรือไม่
    if(currentWord.includes(clickedLetter)) {
        // แสดงตัวอักษรที่ถูกต้องบนการแสดงคำ
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // หากตัวอักษรที่คลิกไม่มีอยู่ในคำศัพท์ ก็เพิ่มจำนวนครั้งที่ทายผิดและแสดงภาพคนตาย
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    // ปิดใช้งานปุ่มที่คลิกแล้วเพื่อไม่ให้ผู้เล่นคลิกซ้ำ
    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // เรียกใช้ฟังก์ชัน gameOver หากตรงกับเงื่อนไข
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// สร้างปุ่มตัวอักษรและเพิ่มอีเวนต์ลิสเนอร์
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// เริ่มเกมเมื่อโหลดหน้าเว็บ
getRandomWord();
// เริ่มเกมใหม่เมื่อคลิกที่ปุ่ม Play Again
playAgainBtn.addEventListener("click", getRandomWord);
