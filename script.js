/* =========================================
   DIRMAN CALCULATOR
   PART 3 — GAME ENGINE
========================================= */


/* =========================================
   GAME STATE
========================================= */

const GAME = {
  started: false,
  finished: false,

  startTime: null,
  elapsedSeconds: 0,
  timerInterval: null,

  players: {
    1: {
      score: 0,
      story: []
    },

    2: {
      score: 0,
      story: []
    }
  }
};


/* =========================================
   ELEMENTS
========================================= */

const matchTimer =
  document.getElementById("matchTimer");

const startGameBtn =
  document.getElementById("startGameBtn");

const finishGameBtn =
  document.getElementById("finishGameBtn");


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(seconds) {

  const hours =
    Math.floor(seconds / 3600);

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const secs =
    seconds % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0")
  );

}


/* =========================================
   START GAME
========================================= */

function startGame() {

  if (GAME.started) {
    return;
  }


  GAME.started = true;

  GAME.finished = false;

  GAME.startTime =
    Date.now();


  startGameBtn.textContent =
    "Game Berjalan";

  startGameBtn.disabled =
    true;

  startGameBtn.style.opacity =
    "0.6";


  GAME.timerInterval =
    setInterval(() => {

      GAME.elapsedSeconds =
        Math.floor(
          (
            Date.now() -
            GAME.startTime
          ) / 1000
        );


      matchTimer.textContent =
        formatTime(
          GAME.elapsedSeconds
        );

    }, 1000);

}


/* =========================================
   SCORE BUTTON EVENTS
========================================= */

document
  .querySelectorAll(".score-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      function () {

        const playerNumber =
          Number(
            this.dataset.player
          );

        const action =
          this.dataset.action;


        updateScore(
          playerNumber,
          action
        );

      }
    );

  });


/* =========================================
   UPDATE SCORE
========================================= */

function updateScore(
  playerNumber,
  action
) {

  if (!GAME.started) {

    alert(
      "Mulai game terlebih dahulu."
    );

    return;

  }


  if (GAME.finished) {
    return;
  }


  const input =
    document.getElementById(
      `player${playerNumber}Input`
    );


  const value =
    Math.abs(
      Number(input.value)
    );


  if (
    !value ||
    value <= 0
  ) {

    alert(
      "Masukkan nilai terlebih dahulu."
    );

    return;

  }


  /* =========================================
     PLUS
  ========================================= */

  if (action === "plus") {

    GAME.players[
      playerNumber
    ].score += value;

  }


  /* =========================================
     MINUS
  ========================================= */

  if (action === "minus") {

    GAME.players[
      playerNumber
    ].score -= value;

  }


  /* =========================================
     UPDATE TOTAL SCORE
  ========================================= */

  updateScoreDisplay(
    playerNumber
  );


  /* =========================================
     SAVE TO PLAYER STORY
  ========================================= */

  GAME.players[
    playerNumber
  ].story.push({

    id:
      Date.now(),

    action:
      action,

    value:
      value,

    totalScore:
      GAME.players[
        playerNumber
      ].score,

    time:
      GAME.elapsedSeconds

  });


  /* =========================================
     RENDER STORY PEMAIN INI SAJA
  ========================================= */

  renderPlayerStory(
    playerNumber
  );


  /* Kosongkan input */

  input.value = "";

}


/* =========================================
   UPDATE SCORE DISPLAY
========================================= */

function updateScoreDisplay(
  playerNumber
) {

  const scoreElement =
    document.getElementById(
      `player${playerNumber}Score`
    );


  scoreElement.textContent =
    GAME.players[
      playerNumber
    ].score;

}


/* =========================================
   RENDER PLAYER STORY
========================================= */

function renderPlayerStory(
  playerNumber
) {

  const story =
    GAME.players[
      playerNumber
    ].story;


  const storyList =
    document.getElementById(
      `player${playerNumber}StoryList`
    );


  const emptyStory =
    document.getElementById(
      `player${playerNumber}EmptyStory`
    );


  const storyCount =
    document.getElementById(
      `player${playerNumber}StoryCount`
    );


  /* =========================================
     STORY COUNT
  ========================================= */

  storyCount.textContent =
    story.length;


  /* =========================================
     EMPTY STATE
  ========================================= */

  if (story.length === 0) {

    emptyStory.style.display =
      "flex";

    storyList.innerHTML =
      "";

    return;

  }


  emptyStory.style.display =
    "none";


  storyList.innerHTML =
    "";


  /* =========================================
     TERBARU DI ATAS
  ========================================= */

  const reversedStory =
    [...story].reverse();


  reversedStory.forEach(
    item => {

      const storyItem =
        document.createElement(
          "div"
        );


      storyItem.className =
        "story-item";


      const symbol =
        item.action === "plus"
          ? "+"
          : "−";


      storyItem.innerHTML = `

        <div
          class="
            story-icon
            ${item.action}
          "
        >
          ${symbol}
        </div>


        <div
          class="story-content"
        >

          <strong>
            ${symbol}${item.value}
          </strong>

          <span>
            ${formatTime(
              item.time
            )}
          </span>

        </div>


        <div
          class="
            story-value
            ${item.action}
          "
        >
          ${item.totalScore}
        </div>

      `;


      storyList.appendChild(
        storyItem
      );

    }
  );

}


/* =========================================
   PLAYER NAME → STORY NAME
========================================= */

function syncPlayerName(
  playerNumber
) {

  const nameInput =
    document.getElementById(
      `player${playerNumber}Name`
    );


  const storyName =
    document.getElementById(
      `player${playerNumber}StoryName`
    );


  const name =
    nameInput.value.trim();


  if (name) {

    storyName.textContent =
      name;

  } else {

    storyName.textContent =
      `Pemain ${playerNumber}`;

  }

}


/* =========================================
   NAME INPUT EVENTS
========================================= */

document
  .getElementById(
    "player1Name"
  )
  .addEventListener(
    "input",
    function () {

      syncPlayerName(1);

    }
  );


document
  .getElementById(
    "player2Name"
  )
  .addEventListener(
    "input",
    function () {

      syncPlayerName(2);

    }
  );


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

  if (!GAME.started) {

    alert(
      "Belum ada pertandingan yang berjalan."
    );

    return;

  }


  if (GAME.finished) {

    researchGame();

    return;

  }


  const confirmFinish =
    confirm(
      "Selesaikan pertandingan dan lihat hasil riset?"
    );


  if (!confirmFinish) {
    return;
  }


  GAME.finished =
    true;


  clearInterval(
    GAME.timerInterval
  );


  startGameBtn.textContent =
    "Game Selesai";


  finishGameBtn.textContent =
    "Lihat Hasil Riset";


  /* =========================================
     DISABLE SCORE BUTTONS
  ========================================= */

  document
    .querySelectorAll(
      ".score-btn"
    )
    .forEach(button => {

      button.disabled =
        true;

      button.style.opacity =
        "0.4";

    });


  researchGame();

}


/* =========================================
   RESEARCH GAME
========================================= */

function researchGame() {

  const player1Name =
    document
      .getElementById(
        "player1Name"
      )
      .value
      .trim() ||
    "Pemain 1";


  const player2Name =
    document
      .getElementById(
        "player2Name"
      )
      .value
      .trim() ||
    "Pemain 2";


  const researchData = {

    duration:
      GAME.elapsedSeconds,


    player1: {

      name:
        player1Name,

      finalScore:
        GAME.players[1].score,

      totalActivity:
        GAME.players[1]
          .story.length,

      story:
        GAME.players[1]
          .story

    },


    player2: {

      name:
        player2Name,

      finalScore:
        GAME.players[2].score,

      totalActivity:
        GAME.players[2]
          .story.length,

      story:
        GAME.players[2]
          .story

    }

  };


  console.log(
    "HASIL RISET GAME:",
    researchData
  );

}


/* =========================================
   BUTTON EVENTS
========================================= */

startGameBtn.addEventListener(
  "click",
  startGame
);


finishGameBtn.addEventListener(
  "click",
  finishGame
);


/* =========================================
   INITIAL RENDER
========================================= */

syncPlayerName(1);
syncPlayerName(2);

renderPlayerStory(1);
renderPlayerStory(2);

/* =========================================
   PWA SERVICE WORKER
========================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    function () {

      navigator.serviceWorker
        .register("./service-worker.js")
        .then(function () {

          console.log(
            "Dirman Calculator PWA aktif"
          );

        })
        .catch(function (error) {

          console.log(
            "Service Worker gagal:",
            error
          );

        });

    }
  );

}