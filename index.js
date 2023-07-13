const prompt = require('prompt-sync')();
const secret = getRandomWord('words.txt');
const availableLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
let lettersLeft = [...availableLetters];
let searchWord = new Array(secret.length).fill('_');
let guessesLimit = 8;

console.log('\nWelcome to the game, Hangman!');
console.log(`I am thinking of a word that is ${secret.length} letters long.`);
console.log('--------------------------\n');

while (true) {
  console.log(`You have ${guessesLimit} guesses left.`);
  console.log(`Available letters: ${lettersLeft.join('')}`);
  const playerInput = prompt('Please guess a letter: ').trim().toLowerCase();

  // guessing letter by letter
  if (+playerInput.length === 1) {
    if (availableLetters.indexOf(playerInput) === -1) {
      console.log(`Oops! '${playerInput}' is not a valid letter: ${searchWord.join(' ')}`);
      console.log('--------------------------\n');
      continue;
    }
    if (secret.includes(playerInput) && lettersLeft.indexOf(playerInput) === -1) {
      console.log(`Oops! You've already guessed that letter: ${searchWord.join(' ')}`);
      console.log('--------------------------\n');
      continue;
    }
    if (secret.includes(playerInput)) {
      lettersLeft.splice(+lettersLeft.indexOf(playerInput), 1);
      const indexes = getAllIndexes(secret.split(''), playerInput);
      for (const i of indexes) searchWord[i] = playerInput;
      console.log(`Good guess: ${searchWord.join(' ')}`);
      console.log('--------------------------\n');
    }
    if (!secret.includes(playerInput)) {
      guessesLimit -= 1;
      console.log(`Oops! That letter is not in my word: ${searchWord.join(' ')}`);
      console.log('--------------------------\n');
    }
  }

  // guessing the whole word at once
  if (+playerInput.length > 1) {
    if (playerInput.split('').some(char => !availableLetters.includes(char))) {
      console.log(`Oops! '${playerInput}' contains invalid letter: ${searchWord.join(' ')}`);
      console.log('--------------------------\n');
      continue;
    }
    if (secret === playerInput) {
      console.log(`Congratulations, you won! The word was '${secret}'.\n`);
      break;
    }
    if (secret !== playerInput) {
      console.log(`Sorry, bad guess. The word was '${secret}'.\n`);
      break;
    }
  }

  // check if the player has revealed all the letters
  if (!searchWord.includes('_')) {
    console.log(`Congratulations, you won! The word was '${secret}'.\n`);
    break;
  }

  // check if the player has any guessing attempts available
  if (guessesLimit === 0) {
    console.log(`Sorry, you ran out of guesses. The word was '${secret}'.\n`);
    break;
  }
}

// helper functions
function getAllIndexes(arr, val) {
  const indexes = [];
  for(let i = 0; i < arr.length; i++) {
    if (arr[i] === val) indexes.push(i);
  }
  return indexes;
}

function getRandomWord(file) {
  const fs = require('fs');
  const str = fs.readFileSync(`./assets/${file}`, 'utf-8');
  const arr = str.split(' ');
  // checking for invalid words
  for (const [index, word] of arr.entries()) {
    if (!word || word.length < 2) {
      arr.splice(index, 1); // remove 1 element at that index
    }
  }
  return arr[getRandomNumber(0, arr.length)];
}

function getRandomNumber(min, max) {
  const number = Math.random() * (max - min) + min;
  return Math.floor(number);
}