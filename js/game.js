$(document).ready(function () {
  const racingTrack = $("#racing-track");
  const playerVehicle = $("#player-vehicle");
  const scorePanel = $("#current-score");
  let score = 0;
  let speed = 5;
  let gameInterval;
  let obstacleInterval;

  // Move player vehicle
  $(document).on("keydown", function (e) {
    const vehiclePos = playerVehicle.position();
    const trackWidth = racingTrack.width();
    const trackHeight = racingTrack.height();
    const vehicleWidth = playerVehicle.width();
    const vehicleHeight = playerVehicle.height();

    switch (e.key) {
      case "ArrowLeft": // Move left
        if (vehiclePos.left > 0)
          playerVehicle.css("left", vehiclePos.left - 20);
        break;
      case "ArrowRight": // Move right
        if (vehiclePos.left < trackWidth - vehicleWidth)
          playerVehicle.css("left", vehiclePos.left + 20);
        break;
      case "ArrowUp": // Move up
        if (vehiclePos.top > 0) playerVehicle.css("top", vehiclePos.top - 20);
        break;
      case "ArrowDown": // Move down
        if (vehiclePos.top < trackHeight - vehicleHeight)
          playerVehicle.css("top", vehiclePos.top + 20);
        break;
    }
  });

  // Create obstacle
  function createObstacle() {
    const obstacle = $('<div class="obstacle"></div>');

    // Random horizontal position within the track boundaries
    const obstacleLeft = Math.random() * (racingTrack.width() - 50); 

    obstacle.css({
      top: "-100px", // Start above the track
      left: obstacleLeft, // Random horizontal position
      position: "absolute"
    });

    racingTrack.append(obstacle);
  }

  // Move obstacles
  function moveObstacles() {
    $(".obstacle").each(function () {
      const obstacle = $(this);
      const obstaclePos = obstacle.position();

      // Move obstacle
      obstacle.css("top", obstaclePos.top + speed);

      // Remove if off-screen
      if (obstaclePos.top > racingTrack.height()) {
        obstacle.remove();
        score += 10; 
        scorePanel.text(score);
      }

      // Collision detection
      if (checkCollision(playerVehicle, obstacle)) {
        endGame();
      }
    });
  }

  // Collision detection
  function checkCollision(player, obstacle) {
    const p = player.position();
    const o = obstacle.position();
    return !(
      p.top + player.height() < o.top ||
      p.top > o.top + obstacle.height() ||
      p.left + player.width() < o.left ||
      p.left > o.left + obstacle.width()
    );
  }

  function startGame() {
    score = 0;
    speed = 5;
    scorePanel.text(score);

    // Dynamically reset the player's vehicle position
    const trackWidth = racingTrack.width();
    const trackHeight = racingTrack.height();
    const carWidth = playerVehicle.width();
    const carHeight = playerVehicle.height();

    playerVehicle.css({
      left: (trackWidth - carWidth) / 2, // Center horizontally
      top: trackHeight - carHeight - 20 // Near bottom with padding
    });

    $("#game-controls").hide(); // Hide start button

    gameInterval = setInterval(() => {
      moveObstacles();
      speed += 0.01; // Gradually increase speed
    }, 30);

    obstacleInterval = setInterval(createObstacle, 1000);
  }

  // End game
  function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    $(".obstacle").remove(); // Clear obstacles
    $("#start-game-btn").text("Restart Game").show(); // Change button text
    $("#game-controls").show(); // Show controls again
  }

  // Button listener
  $("#start-game-btn").on("click", function () {
    startGame();
  });
});
