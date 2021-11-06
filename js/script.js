const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");


let word = "magnolia";
const guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
  const res = await fetch ("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
  const words = await res.text();
  const wordArray = words.split("\n");
  const randomIndex = Math.floor(Math.random() * wordArray.length);
  word = wordArray[randomIndex].trim();
  placeholder(word);
  };

getWord();


const placeholder = function (word) {
  const placeholderLetters = [];
  for (const letter of word) {
    console.log(letter);
    placeholderLetters.push("☀️");
    placeholderLetters.push("●");
  }
  wordInProgress.innerText = placeholderLetters.join("");
};

placeholder(word);


guessLetterButton.addEventListener("click", function (e) {
  e.preventDefault();
  message.innerText= "";
  const guess = letterInput.value;
  const goodGuess = validateInput(guess);
  
  if (goodGuess) {
      //we've got a letter! lets guess!
      makeGuess(guess);
  }
  letterInput.value = "";
});

const validateInput = function (input){
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        //is the input empty?
        message.innerText = "please enter a letter.";
      } else if (input.length > 1) {
          //did you type more than one letter?
        message.innerText = "Please enter a single letter.";
      } else if (!input.match(acceptedLetter)) {
          //did you type a number or something not a letter
          message.innerText = "Please enter a letter from A to Z";
      } 
      else {
        return input;
     }
    };

    const makeGuess = function (guess) {
        guess = guess.toUpperCase();
        if (guessedLetters.includes(guess)) {
            message.innerText = "You already guessed that letter. Try again!";
        } else {
            guessedLetters.push(guess);
            console.log(guessedLetters);
            updateGuessesRemaining(guess);
            showGuessedLetters();
            updateWordInProgress (guessedLetters);
        }  
    };

    const showGuessedLetters = function () {
      guessedLettersElement.innerHTML = "";
      for (const letter of guessedLetters) {
        const li = document.createElement ("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
      }
};

const updateWordInProgress = function (guessedLetters){
  const wordUpper = word.toUpperCase();
  const wordArray = wordUpper.split("");
  const revealWord = [];
  for ( const letter of wordArray){
    if (guessedLetters.includes(letter)) {
      revealWord.push(letter.toUpperCase());
    } else {
      revealWord.push ("●");
    }
    }

    wordInProgress.innerText = revealWord.join("");
    checkIfWin();
  };

  const updateGuessesRemaining = function (guess) {
   const upperWord = word.toUpperCase();
   if (!upperWord.includes(guess)) {
     message.innerText = `Sorry, the word has no ${guess}.`;
     remainingGuesses -= 1;
   } else {
     message.innerText = `Good guess! the word has the letter ${guess}.`;
   }

   if (remainingGuesses === 0) {
     message.innerHTML = `Game over! the word was <span class = "highlight">${word}</span>.`;
     startOver();
    } else if (remainingGuesses === 1 ) {
     remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
   } else {
     remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
   }
  };

const checkIfWin = function () {
   if (word.toUpperCase() === wordInProgress.innerText) {
     message.classList.add("win");
     message.innerHTML = `<p class="highlight">You guessed the word correctly! Congrats!</p>`;
   }
};

const startOver = function() {
  guessLetterButton.classList.add("hide");
  remainingGuessesElement.classList.add("hide");
  guessedLettersElement.classList.add("hide");
  playAgainButton.classList.add("hide");
};

playAgainButton.addEventListener("click" , function() {
  message.classList.remove("win");
  message.innerText = "";
  guessedLetters = [];
  remainingGuesses = 8;
  remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  guessedLettersElement.innerHTML = "";

  //grab a new word

  getWord();

  //show the right UI elements

  guessLetterButton.classList.remove("hide");
  playAgainButton.classList.add("hide");
  remainingGuessesElement.classList.remove("hide");
  guessedLettersElement.classList.remove("hide");
});