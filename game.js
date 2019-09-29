//==================================================================//==================================================================//
const colors = {
    sky: '#5497A7',
    cloud: '#EBEBD3',
    ground: '#8AFFC1',
    person: '#FFF275',
    enemy: '#FF3C38',
}

//========================================================================================|GAME|============================//
class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext('2d')
        this.size = { width: canvas.width, height: canvas.height }
        this.groundY = Math.floor(this.size.height * 0.8)
        this.runSpeed = 1
        this.bodies = []
        this.ticksSinceEnemy = 0
        this.keyboard = new Keyboarder()
        this.gameOver = false

        let playerSize = {
            width: 20,
            height: 20
        }

        let playerLocation = {
            x: Math.floor(this.size.width * 0.2),
            y: this.groundY - (playerSize.height / 2) - 2
        }

        this.player = new Player(playerLocation, playerSize)
        this.addBody(this.player)
    }

    addBody(body) {
        this.bodies.push(body)
    }

    //----------------------------------------------|GAME_RUN|----------------------//
    run() {
        const tick = () => {
            this.update()
            this.draw()

            if (!this.gameOver) {
                window.requestAnimationFrame(tick)
            }
        }

        tick()
    }

    addEnemy() {
        this.addBody(new Enemy({ x: this.size.width, y: this.groundY - 15 }, { width: 30, height: 30 }))
    }

    addClouds() {
        const cloudCenter = { x: this.size.width, y: Math.floor(Math.random() * this.size.height / 2) }
        const cloudSize = { width: Math.random() * 20 + 10, height: Math.random() * 200 + 10 }
        this.addBody(new Clouds(cloudCenter, cloudSize))
    }

    //----------------------------------------------|GAME_UPDATE|-------------------//
    update() {
        const enemyOccurance = this.ticksSinceEnemy * 0.0001
        if (Math.random() < enemyOccurance) {
            this.addEnemy()
            this.ticksSinceEnemy = 0
        } else {
            this.ticksSinceEnemy++
        }

        if (Math.random() < 0.01) {
            this.addClouds()
        }

        for (let body of this.bodies) {
            body.update(this)
            if (colliding(this.player, body)) {
                this.gameOver = true
            }
        }

        this.bodies = this.bodies.filter(bodyOnScreen)
    }


    //----------------------------------------------|GAME_DRAW|---------------------//
    draw() {
        let skyHeight = Math.floor(this.size.height * 0.8)
        let groundHeight = this.size.height - skyHeight
        this.screen.fillStyle = colors.sky
        this.screen.fillRect(0, 0, this.size.width, skyHeight)

        this.screen.fillStyle = colors.ground
        this.screen.fillRect(0, skyHeight, this.size.width, groundHeight)

        for (let body of this.bodies) {
            body.draw(this.screen)
        }
    }
}

//========================================================================================|CLOUDS|==========================//
class Clouds {
    constructor(center, size) {
        this.center = center
        this.size = size
        this.safe = true
    }

    //----------------------------------------------|CLOUDS_UPDATE|-----------------//
    update(game) {
        this.center.x -= game.runSpeed / 2
    }

    //----------------------------------------------|CLOUDS_DRAW|-------------------//
    draw(screen) {
        screen.fillStyle = colors.cloud
        screen.fillRect(
            this.center.x - (this.size.width / 2),
            this.center.y, -(this.size.height / 2),
            this.size.width, this.size.height)
    }
}

//========================================================================================|PLAYER|============================//
class Player {
    constructor(center, size) {
        this.center = center
        this.size = size
        this.startingY = center.y
        this.velocityY = 0
        this.jumping = false
    }

    //----------------------------------------------|PLAYER_UPDATE|–----------------//
    update(game) {
        this.center.y -= this.velocityY

        if (this.jumping) {
            this.velocityY -= 1
            if (this.center.y >= this.startingY) {
                this.center.y = this.startingY
                this.velocityY = 0
                this.jumping = false
            }
        }

        if (game.keyboard.isDown(Keyboarder.KEYS.S) && !this.jumping) {
            this.jumping = true
            this.velocityY = 15
        }

    }


    //----------------------------------------------|PLAYER_DRAW|-------------------//
    draw(screen) {
        screen.fillStyle = colors.person
        screen.fillRect(
            this.center.x - (this.size.width / 2),
            this.center.y, -(this.size.height / 2),
            this.size.width, this.size.height)

    }
}

//========================================================================================|ENEMY|===========================//
class Enemy {
    constructor(center, size) {
        this.center = center
        this.size = size
    }

    //----------------------------------------------|ENEMY_UPDATE|------------------//
    update(game) {
        this.center.x -= game.runSpeed
    }

    //----------------------------------------------|ENEMY_DRAW|--------------------//
    draw(screen) {
        screen.fillStyle = colors.enemy
        screen.fillRect(
            this.center.x - (this.size.width / 2),
            this.center.y, -(this.size.height / 2),
            this.size.width, this.size.height)
    }
}

//========================================================================================|KEYBOARDER|======================//
class Keyboarder {
    constructor() {
        this.keyState = {}

        window.addEventListener('keydown', function(e) {
            this.keyState[e.keyCode] = true
        }.bind(this))

        window.addEventListener('keyup', function(e) {
            this.keyState[e.keyCode] = false
        }.bind(this))
    }

    isDown(keyCode) {
        return this.keyState[keyCode] === true
    }

    on(keyCode, callback) {
        window.addEventListener('keydown', function(e) {
            if (e.keyCode === keyCode) {
                callback()
            }
        })
    }
}

function bodyOnScreen(body) {
    return body.center.x > 0 - body.size.width
}

function colliding(b1, b2) {
    return !(
        b1.safe ||
        b2.safe ||
        b1 === b2 ||
        b1.center.x + b1.size.width / 2 < b2.center.x - b2.size.width / 2 ||
        b1.center.y + b1.size.height / 2 < b2.center.y - b2.size.height / 2 ||
        b1.center.x - b1.size.width / 2 > b2.center.x + b2.size.width / 2 ||
        b1.center.y - b1.size.height / 2 > b2.center.y + b2.size.height / 2

    )
}


Keyboarder.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83, SPACE: 32 }

//==========================================================================================================================//
const game = new Game('myGame')
game.run()

//==================================================================//==================================================================//