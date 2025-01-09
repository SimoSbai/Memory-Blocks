let mainPopup = document.querySelector(".nameContainer");
let yourName = document.querySelector(".name span");
let tries = document.querySelector(".tries span");
let input = document.querySelector(".nameField");
let startGameButton = document.querySelector(".control-buttons span");
let level = document.querySelector("#level");
let playerNumbers = document.querySelector("#players");
let currentLevel = document.querySelector(".info-container .lvl");
let groupItems = document.querySelector(".memory-game-blocks");
let items = document.querySelectorAll(".game-block");
let popupFailedContainer = document.querySelector(".popupFailedContainer");
let popupSuccessContainer = document.querySelector(".popupSuccessContainer");
let resultContainer = document.querySelector(".resultcontainer");
let successSound = document.getElementById("success");
let failSound = document.getElementById("fail");
let timeLeft = document.querySelector(".timeLeft span");

// flippedBoxes is used to store two clicked boxes and check if they match
let flippedBoxes = [];

// playersArray is used to store the details of two players and determine the winner
let playersArray = [];

// checked the mode game by choosing player numbers
playerNumbers.addEventListener("change", () => {
  let selectPlayerNumbers = playerNumbers.options[playerNumbers.selectedIndex];
  let yourPlayerNumbersText = selectPlayerNumbers.textContent;
  if (yourPlayerNumbersText == "1") {
    document.querySelector(".selectLevel").style.cssText = "display : flex";
    startGameButton.onclick = onePlayer;
    document.onkeyup = function (e) {
      if (e.key === "Enter") {
        onePlayer();
      }
    };
  } else {
    document.querySelector(".selectLevel").style.cssText = "display : none";
    startGameButton.onclick = morePlayers;
    document.onkeyup = function (e) {
      if (e.key === "Enter") {
        morePlayers();
      }
    };
  }
});

// Function to stores the number of tries you have based on the level you select
let triesLevel;

function selectYourLevel() {
  let yourCurrentLevel = level.options[level.selectedIndex];
  let yourCurrentLevelText = yourCurrentLevel.textContent;

  currentLevel.append(yourCurrentLevelText);
  triesLevel =
    yourCurrentLevelText === "Beginner"
      ? "40"
      : yourCurrentLevelText === "Immediate"
      ? "30"
      : yourCurrentLevelText === "Legend"
      ? "20"
      : "Not Found";
}

// Reset the game state for the next player
function resetGame() {
  flippedBoxes = [];
  tries.textContent = "0";
  items.forEach((item) => {
    item.classList.remove("has-match");
  });
}

// The function that will apply if you choose a single-player mode
function onePlayer() {
  selectYourLevel();
  groupItems.classList.add("disabled");
  setTimeout(() => {
    groupItems.classList.remove("disabled");
  }, 3000);

  yourName.innerHTML = input.value || "Unknown";
  mainPopup.style.display = "none";
  startSingleGame();
}

// The function that will apply if you choose a two-player mode
function morePlayers() {
  groupItems.classList.add("disabled");
  setTimeout(() => {
    groupItems.classList.remove("disabled");
  }, 3000);

  yourName.innerHTML = input.value || "Unknown";
  mainPopup.style.display = "none";
  startMultiGame();
}

// Checks if all boxes are flipped and verifies your success.
function allFlipped() {
  return Array.from(items).every((element) =>
    element.classList.contains("has-match")
  );
}

input.focus();

// Checks if the data is stored in local storage
function getDataFromStorage() {
  if (window.localStorage.getItem("totalPlayers")) {
    playersArray = JSON.parse(window.localStorage.getItem("totalPlayers"));
  }
}

getDataFromStorage();

// Function to add player details and save them in local storage
function savePlayerData(triesHere) {
  let players = {
    playerName: yourName.innerHTML,
    playerTries: triesHere,
  };
  playersArray.push(players);
  window.localStorage.setItem("totalPlayers", JSON.stringify(playersArray));
}

// Check if two elements are match or not
function boxesChecked() {
  if (
    flippedBoxes[0].dataset.technology === flippedBoxes[1].dataset.technology
  ) {
    flippedBoxes[0].classList.remove("is-flipped");
    flippedBoxes[1].classList.remove("is-flipped");

    flippedBoxes[0].classList.add("has-match");
    flippedBoxes[1].classList.add("has-match");
    successSound.play();
  } else {
    flippedBoxes[0].classList.remove("is-flipped");
    flippedBoxes[1].classList.remove("is-flipped");
    tries.textContent++;
    failSound.play();
  }
}

// Popup that will appear if the player remembers all box positions (for multi-players mode)
function successPopup() {
  popupSuccessContainer.style.cssText = "display:none";
  mainPopup.style.display = "flex";
  document.querySelector(".allPlayers").remove();
  document.querySelector(".selectLevel").remove();
  input.value = "";
  input.focus();
  resetGame();
  startGameButton.onclick = morePlayers;
  document.onkeyup = function (e) {
    if (e.key === "Enter") {
      morePlayers();
    }
  };
}

// A condition that shows a failure popup if the player reaches their try limit
function failedPopup() {
  if (tries.textContent == triesLevel) {
    savePlayerData(tries.textContent);
    popupFailedContainer.style.cssText = "display:flex";
    failSound.play();
    document.querySelector(".fieldPopup span").innerHTML = "Play Again";
    document.querySelector(".fieldPopup span").onclick = function () {
      location.reload();
      window.localStorage.clear();
    };
    document.onkeyup = function (e) {
      if (e.key === "Enter") {
        location.reload();
        window.localStorage.clear();
      }
    };
  }
}

// Assign a random order to each element
function orderBoxes(event) {
  event.style.cssText = `order: ${Math.floor(Math.random() * items.length)}`;
}

// Quick hint for the boxes
function quickHint(event) {
  let timeOut = 4;

  let quickHintTime = setInterval(() => {
    event.classList.add("is-flipped");
    timeOut--;
    if (timeOut === 0) {
      clearInterval(quickHintTime);
      event.classList.remove("is-flipped");
    }
  }, 1000);
}

// Starts the game in multiplayer mode
function startMultiGame() {
  items.forEach((element) => {
    orderBoxes(element);

    quickHint(element);

    // Compare two boxes event
    element.onclick = function () {
      this.classList.add("is-flipped");
      flippedBoxes.push(this);

      // Check if two elements have been clicked
      if (flippedBoxes.length === 2) {
        groupItems.classList.add("disabled");
        setTimeout(() => {
          boxesChecked();

          if (allFlipped()) {
            savePlayerData(tries.textContent);
            popupSuccessContainer.style.cssText = "display:flex";
            successSound.play();
            document.querySelector(".successPopup span").onclick = function () {
              successPopup();
            };

            document.onkeyup = function (e) {
              if (e.key === "Enter") {
                successPopup();
              }
            };

            // Checks if both players have completed the game, and if so, shows the result
            if (playersArray.length === 2) {
              let minTries = playersArray.map((e) => parseInt(e.playerTries));
              let theWinner = playersArray.filter(
                (e) => e.playerTries == Math.min(...minTries)
              );
              document
                .querySelector(".winnerName")
                .append(theWinner[0].playerName);
              document
                .querySelector(".player1 h3")
                .append(playersArray[0].playerName);
              document
                .querySelector(".player1 span")
                .append(playersArray[0].playerTries);
              document
                .querySelector(".player2 h3")
                .append(playersArray[1].playerName);
              document
                .querySelector(".player2 span")
                .append(playersArray[1].playerTries);
              popupFailedContainer.remove();
              popupSuccessContainer.remove();
              resultContainer.style.cssText = "display:flex";
              document.querySelector(".playAgain").onclick = function () {
                window.localStorage.clear();
                location.reload();
              };
              document.onkeyup = function (e) {
                if (e.key === "Enter") {
                  window.localStorage.clear();
                  location.reload();
                }
              };
            }
          }

          flippedBoxes = [];
          groupItems.classList.remove("disabled");
        }, 1000);
      }
    };
  });
}

// Starts the game in single player mode
function startSingleGame() {
  items.forEach((element) => {
    orderBoxes(element);

    quickHint(element);

    // Compare two boxes event
    element.onclick = function () {
      this.classList.add("is-flipped");
      flippedBoxes.push(this);

      // Check if two elements have been clicked
      if (flippedBoxes.length === 2) {
        groupItems.classList.add("disabled");
        setTimeout(() => {
          boxesChecked();

          failedPopup();

          if (allFlipped()) {
            savePlayerData(tries.textContent);
            popupSuccessContainer.style.cssText = "display:flex";
            successSound.play();
            document.querySelector(".successPopup span").innerHTML =
              "Play Again";
            document.querySelector(".successPopup span").onclick = function () {
              location.reload();
              window.localStorage.clear();
            };
            document.onkeyup = function (e) {
              if (e.key === "Enter") {
                location.reload();
                window.localStorage.clear();
              }
            };
          }

          flippedBoxes = [];
          groupItems.classList.remove("disabled");
        }, 1000);
      }
    };
  });
}
