// scratch component
const startButton = document.getElementById("start-button");
const homeScreen = document.getElementById("home-screen");
const gameContainer = document.getElementById("game-container");

startButton.addEventListener("click", () => {
  homeScreen.style.display = "none";
  gameContainer.style.display = "block";
});
