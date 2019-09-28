//==================================================================//==================================================================//
const colors = {
    sky: '#5497A7',
    ground: '#8AFFC1',
    person: '#FFF275',
    enemy: '#FF3C38',
}

//========================================================================================|GAME|============================//
class Game {
    constructor() {
        const canvas = document.getElementById('myGame')
        this.screen = canvas.getContext('2d')
        this.size = { width: canvas.width, height: canvas.height }
        this.groundY = Math.floor(this.size.height * 0.8)
        this.runSpeed = 1
        this.bodies = []
        this.ticksSinceEnemy = 0
        this.keyboard = new Keyboarder()

        let playerSize = {
            width: 30,
            height: 40
        }

        let playerLocation = {
            x: Math.floor(this.size.width * 0.2),
            y: this.groundY - (playerSize.height / 2.5 - 1)
        }

        this.addBody(new Player(playerLocation, playerSize))
        this.addBody(new Enemy({ x: this.size.width - 20, y: this.groundY - 35 }, { width: 50, height: 50 }))
    }

    addBody(body) {
        this.bodies.push(body)
    }

    //----------------------------------------------|GAME_RUN|----------------------//
    run() {
        const tick = () => {
            this.update()
            this.draw()
            window.requestAnimationFrame(tick)
        }

        tick()
    }

    addEnemy() {
        this.addBody(new Enemy({ x: this.size.width, y: this.groundY - 35 }, { width: 50, height: 50 }))

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
    }

    //----------------------------------------------|GAME_DRAW|---------------------//
    draw() {
        let skyHeight = Math.floor(this.size.height * 0.85)
        let groundHeight = this.size.height - skyHeight
        this.screen.fillStyle = colors.sky
        this.screen.fillRect(0, 0, this.size.width, skyHeight)

        this.screen.fillStyle = colors.ground
        this.screen.fillRect(0, skyHeight, this.size.width, groundHeight)

        for (let body of this.bodies) {
            body.update(this)
            body.draw(this.screen)
        }
    }

}

//========================================================================================|PLAYER|============================//
class Player {
    constructor(center, size) {
        this.center = center
        this.size = size
        this.startingY = center.y
        this.velocityY = 0
    }

    //----------------------------------------------|PLAYER_UPDATE|–----------------//
    update() {
        this.center.y -= this.velocityY
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

Keyboarder.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83 }

//==========================================================================================================================//
const game = new Game('myGame')
game.run()

//==================================================================//==================================================================//