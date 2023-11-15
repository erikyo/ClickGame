const root = document.documentElement

/**
 * The ClickGame class.
 * A game where the player clicks on the screen to earn points.
 */
class ClickGame {
  /**
   * Constructs a new instance of the class.
   *
   * @param {string} containerClass - The class name of the container element.
   * @param {string} canvasId - The id of the canvas element.
   * @param {string} messageId - The id of the message element.
   * @param {string} scoreboardId - The id of the scoreboard element.
   * @param {string} difficultySliderId - The id of the difficulty slider element.
   * @param {string} scoreSliderId - The id of the score slider element.
   * @param {string} resetButtonId - The id of the reset button element.
   */
  constructor (containerClass, canvasId, messageId, scoreboardId, difficultySliderId, scoreSliderId, resetButtonId) {
    this.container = document.querySelector('.' + containerClass)
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width / 2
    this.height = this.canvas.height / 2
    this.startTime = new Date().getTime()
    this.message = document.getElementById(messageId)
    this.scoreboard = document.getElementById(scoreboardId)
    this.difficultyRange = document.getElementById(difficultySliderId)
    this.scoreRange = document.getElementById(scoreSliderId)
    this.resetButton = document.getElementById(resetButtonId)

    this.isGameActive = true

    this.click = 0
    this.score = 0
    this.win = 1000
    this.difficulty = 5
    this.pointsPerClick = 50
    this.endTime = 0

    this.acceleration = 0.2
    this.floorPos = window.innerHeight

    this.init()
  }

  init () {
    this.difficultyRange.addEventListener('change', this.setDifficulty.bind(this), false)
    this.scoreRange.addEventListener('change', this.setPointsPerClick.bind(this), false)
    this.resetButton.addEventListener('click', this.reset.bind(this))

    this.canvas.addEventListener('click', this.clickHandler.bind(this), false)

    this.interval = setInterval(this.game.bind(this), this.difficulty)
  }

  setDifficulty () {
    this.difficulty = Number(this.difficultyRange.value)
    clearInterval(this.interval)
    this.interval = setInterval(this.game.bind(this), this.difficulty)
    this.reset()
  }

  setPointsPerClick () {
    this.pointsPerClick = Number(this.scoreRange.value)
    this.reset()
  }

  drawCircle () {
    if (this.score > this.win) {
      this.score = this.win
    }
    this.ctx.beginPath()
    this.ctx.arc(this.width, this.height, this.canvas.width / 2.25, 0, Math.PI * 2)
    this.ctx.strokeStyle = '#aaa'
    this.ctx.lineWidth = 25
    this.ctx.stroke()
    this.ctx.closePath()

    this.ctx.beginPath()
    this.ctx.arc(this.width, this.height, this.canvas.width / 2.25, 0, Math.PI * 2 * this.score / this.win)
    this.ctx.strokeStyle = '#0095DD'
    this.ctx.lineWidth = 25
    this.ctx.stroke()
    this.ctx.closePath()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0) // reset transform
  }

  drawScore () {
    this.scoreboard.textContent = `score: ${this.score} - click: ${this.click}`
  }

  reset () {
    this.score = 0
    this.click = 0
    this.message.textContent = ''
    this.scoreboard.textContent = ''
    if (!this.isGameActive || this.canStartNewGame()) {
      this.isGameActive = true
    }
  }

  handlePlusOneAnimation (clickX, clickY) {
    // Added properties for animation
    const clickedAnimation = document.createElement('div')
    clickedAnimation.className = 'animated-el click-animation'

    // Display +1 animation
    clickedAnimation.textContent = '🔝'
    clickedAnimation.style.position = 'absolute'
    clickedAnimation.style.left = clickX + 'px'
    clickedAnimation.style.top = clickY + 'px'
    clickedAnimation.style.transform = 'translateY(0)' // Change this value based on how high you want it to go
    clickedAnimation.style.transition = 'transform 1.5s ease-out, opacity 1s ease-in'

    this.container.appendChild(clickedAnimation)

    new Promise(function (resolve) {
      setTimeout(() => resolve(1), 100)
    }).then(function () {
      const shift = Math.round(Math.random() * 150) + 100
      clickedAnimation.style.transform = `translateY(-${shift}px) scale(3)`
      clickedAnimation.style.opacity = 0
      setTimeout(() => {
        clickedAnimation.remove()
      }, 3000)
    })
  }

  canStartNewGame () {
    const currentTime = new Date().getTime()
    const timeSinceWin = (currentTime - this.endTime) / 1000

    return timeSinceWin >= 5
  }

  handleGravityAnimation (clickX, clickY) {
    const fallingObject = document.createElement('img')
    fallingObject.src = 'assets/fff.png'
    fallingObject.className = 'animated-el gravity-animation'

    this.container.appendChild(fallingObject)

    const initialSpeed = Math.random() * 20 + 2 // Random speed between 2 and 7
    const initialAngle = Math.random() * -1 * Math.PI // Random angle in radians

    const velocityX = initialSpeed * Math.cos(initialAngle)
    let velocityY = initialSpeed * Math.sin(initialAngle)

    let positionX = clickX - fallingObject.width / 2
    let positionY = clickY - fallingObject.height / 2

    fallingObject.style.left = positionX + 'px'
    fallingObject.style.top = positionY + 'px'

    const animate = () => {
      positionX += velocityX
      positionY += velocityY
      velocityY += this.acceleration
      velocityY += this.acceleration

      if (positionY > this.floorPos) {
        fallingObject.remove()
      } else {
        fallingObject.style.left = positionX + 'px'
        fallingObject.style.top = positionY + 'px'
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  setScore (value) {
    const valuePercentile = Math.round(value / this.win * 100)
    root.style.setProperty('--game-value', valuePercentile + '%')
  }

  clickHandler (e) {
    if (!this.isGameActive && this.canStartNewGame()) {
      // If the game is not active, reset and start a new game
      this.reset()
      this.isGameActive = true
      this.startTime = new Date().getTime()
    } else {
      if (this.score !== this.win && this.isGameActive) {
        this.score += this.pointsPerClick
        this.setScore(this.score)
        this.click++

        // Get canvas position
        const canvasRect = this.container.getBoundingClientRect()

        // Calculate click coordinates relative to the canvas
        const clickX = e.clientX - canvasRect.left
        const clickY = e.clientY - canvasRect.top

        this.handlePlusOneAnimation(clickX, clickY)
        this.handleGravityAnimation(clickX, clickY)
      }
    }
  }

  winnerWinner () {
    this.isGameActive = false // Pause the game
    this.endTime = new Date().getTime()
    const timeElapsed = (this.endTime - this.startTime) / 1000 // Convert to seconds

    const timeFactor = 1000 / timeElapsed // Adjust as needed
    const clickFactor = 1000 * this.click // Adjust as needed
    const difficultyFactor = 1000 / parseInt(this.difficulty)
    const scoreValueFactor = 100000 / parseInt(this.pointsPerClick)

    const overallScore = Math.floor((timeFactor + clickFactor + difficultyFactor + scoreValueFactor) / 4)

    this.message.textContent = `YOU WIN 🎉!\nScore: ${overallScore}`
    this.scoreboard.textContent = `Time: ${timeElapsed.toFixed(2)}s - Clicks: ${this.click}`
  }

  /**
   * Updates the game state and renders the game on the canvas.
   *
   * @return {boolean} Returns true if the game is over, false otherwise.
   */
  game () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawCircle()
    if (this.isGameActive) {
      if (this.score === 0) {
        this.message.textContent = 'tap the screen to start'
        this.scoreboard.textContent = `difficulty: ${this.difficulty} - ppc: ${this.pointsPerClick}`
      } else {
        this.drawScore()
      }
    }

    if (this.score >= this.win) {
      if (this.isGameActive) {
        this.winnerWinner()
      } else {
        return true
      }
    } else if (this.score === 0) {
      this.score = 0
      this.startTime = new Date().getTime()
    } else {
      this.score -= 1
      this.setScore(this.score)
    }
  }
}

new ClickGame('container', 'canvas', 'message', 'scoreboard', 'slider-difficulty', 'slider-score-size', 'reset')
