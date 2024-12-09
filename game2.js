const gameBoard = document.getElementById("game-board");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const resetButton = document.getElementById("reset");
const nextLevelButton = document.getElementById("next-level");

let level = 1;
let timer = null;
let seconds = 0;


const levels = [
  [
    ["red", "blue", "green", "yellow"],
    ["yellow", "green", "blue", "red"],
    [],
    []
  ],
  [
    ["purple", "orange", "pink", "red"],
    ["red", "pink", "orange", "purple"],
    [],
    []
  ]
];


const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};


const startTimer = () => {
  if (timer) clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);
};


const stopTimer = () => {
  if (timer) clearInterval(timer);
};


const createTube = (colors) => {
  const tube = document.createElement("div");
  tube.className = "tube";
  colors.forEach(color => {
    const liquid = document.createElement("div");
    liquid.className = "liquid";
    liquid.style.backgroundColor = color;
    tube.appendChild(liquid);
  });
  tube.addEventListener("click", () => handleTubeClick(tube));
  return tube;
};


const loadLevel = (levelIndex) => {
  gameBoard.innerHTML = "";
  levels[levelIndex].forEach(colors => {
    const tube = createTube(colors);
    gameBoard.appendChild(tube);
  });
  startTimer();
};


let selectedTube = null;

const handleTubeClick = (tube) => {
  if (selectedTube === null) {
    selectedTube = tube;
    tube.style.border = "2px solid green";
  } else if (selectedTube === tube) {
    selectedTube.style.border = "2px solid #333";
    selectedTube = null;
  } else {
    pourLiquid(selectedTube, tube);
    selectedTube.style.border = "2px solid #333";
    selectedTube = null;
  }
};

const pourLiquid = (fromTube, toTube) => {
  const fromLiquids = Array.from(fromTube.children);
  const toLiquids = Array.from(toTube.children);

  if (fromLiquids.length === 0) return;

  const topLiquid = fromLiquids[fromLiquids.length - 1];

  
  const clonedLiquid = topLiquid.cloneNode();
  clonedLiquid.classList.add("liquid-pop");

  
  clonedLiquid.style.position = "absolute";
  clonedLiquid.style.left = `${topLiquid.getBoundingClientRect().left}px`;
  clonedLiquid.style.top = `${topLiquid.getBoundingClientRect().top}px`;

  
  gameBoard.appendChild(clonedLiquid);

  
  setTimeout(() => {
    clonedLiquid.style.left = `${toTube.getBoundingClientRect().left + 5}px`; 
    clonedLiquid.style.top = `${toTube.getBoundingClientRect().top + toTube.offsetHeight - 35}px`; 
  }, 0);

  
  setTimeout(() => {
    toTube.appendChild(clonedLiquid);
    fromTube.removeChild(topLiquid);
    clonedLiquid.style.position = ""; 
    clonedLiquid.style.transition = ""; 
    checkWinCondition(); 
  }, 1000); 
};


const checkWinCondition = () => {
  const tubes = Array.from(gameBoard.children);
  const allSorted = tubes.every(tube => {
    const liquids = Array.from(tube.children);
    return liquids.every((liquid, index, arr) => {
      return index === 0 || liquid.style.backgroundColor === arr[index - 1].style.backgroundColor;
    });
  });

  if (allSorted) {
    setTimeout(() => {
      alert("You won! Proceeding to next level...");
      nextLevelButton.style.display = "block";
    }, 500);
  }
};


resetButton.addEventListener("click", () => {
  stopTimer();
  loadLevel(level - 1);
  nextLevelButton.style.display = "none"; 
});


nextLevelButton.addEventListener("click", () => {
  if (level < levels.length) {
    level++;
    levelDisplay.textContent = level;
    loadLevel(level - 1);
  } else {
    alert("Congratulations! You've completed all levels!");
  }
});


loadLevel(level - 1);





