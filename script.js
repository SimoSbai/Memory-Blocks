let yourName = document.querySelector(".name span");
let tries = document.querySelector(".tries span");
let input = document.querySelector(".nameField");
let startGameButton = document.querySelector(".control-buttons span");
let level = document.querySelector("#level");
let currentLevel = document.querySelector(".info-container .lvl");
let items = document.querySelectorAll(".game-block");
let popupFailedContainer = document.querySelector(".popupFailedContainer");
let popupSuccessContainer = document.querySelector(".popupSuccessContainer");

let newArray = [];

startGameButton.addEventListener("click", () => {
  yourName.innerHTML = input.value;
  if (input.value !== "") {
    selectYourLevel();
    document.querySelector(".nameContainer").remove();
    startTheGame();
  }
});

document.onkeyup = function (e) {
  if (e.key === "Enter") {
    yourName.innerHTML = input.value;
    if (input.value !== "") {
      selectYourLevel();
      document.querySelector(".nameContainer").remove();
      startTheGame();
    }
  }
};

function selectYourLevel() {
  let yourCurrentLevel = level.options[level.selectedIndex];
  let yourCurrentLevelText = yourCurrentLevel.textContent;
  currentLevel.innerHTML = yourCurrentLevelText;
  yourCurrentLevelText === "Beginner"
    ? (tries.innerHTML = "40")
    : yourCurrentLevelText === "Immediate"
    ? (tries.innerHTML = "30")
    : yourCurrentLevelText === "Legend"
    ? (tries.innerHTML = "20")
    : "Not Found";
}

function allFlipped() {
  return Array.from(items).every((element) =>
    element.classList.contains("is-flipped")
  );
}

input.focus();

function startTheGame() {
  items.forEach((element) => {
    let timeOut = 3;

    // Assign a random order to each element
    element.style.cssText = `order: ${Math.floor(
      Math.random() * items.length
    )}`;

    // Quick hint for the boxes
    let quickHintTime = setInterval(() => {
      element.classList.add("is-flipped");
      timeOut--;
      if (timeOut === 0) {
        clearInterval(quickHintTime);
        element.classList.remove("is-flipped");
      }
    }, 1000);

    // Compare two boxes event
    element.onclick = function () {
      this.classList.add("is-flipped");
      newArray.push(this);

      // Check if two elements have been clicked
      if (newArray.length === 2) {
        document.querySelector(".memory-game-blocks").style.cssText =
          "pointer-events : none";
        setTimeout(() => {
          if (
            newArray[0].dataset.technology === newArray[1].dataset.technology
          ) {
            newArray[0].classList.add("has-match");
            newArray[1].classList.add("has-match");
          } else {
            newArray[0].classList.remove("is-flipped");
            newArray[1].classList.remove("is-flipped");
            tries.textContent--;
          }
          if (tries.textContent == 0) {
            popupFailedContainer.style.cssText = "display:flex";
            document.querySelector(".fieldPopup span").onclick = function () {
              location.reload();
            };
          }
          if (allFlipped()) {
            popupSuccessContainer.style.cssText = "display:flex";
            document.querySelector(".successPopup span").onclick = function () {
              location.reload();
            };
          }
          newArray = [];
          document.querySelector(".memory-game-blocks").style.cssText =
            "pointer-events : auto";
        }, 1000);
      }
    };
  });
}
