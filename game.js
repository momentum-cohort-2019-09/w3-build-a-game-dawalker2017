// const colors = {
//     sky: '#5497A7',
//     ground: '#8AFFC1',
//     person: '#7D6B91',
// }


// class Game {
//     constructor() {
//         const canvas = document.getElementById('myGame')

//         this.screen = canvas.getContext('2d')
//         this.size = { width: canvas.width, height: canvas.height }

//     }

//     run() {

//         let skyHeight = Math.floor(this.size.height * 0.85)
//         let groundHeight = this.size.height - skyHeight

//         this.screen.fillStyle = colors.sky
//         this.screen.fillRect(0, 0, this.size.width, skyHeight)

//         this.screen.fillStyle = colors.ground
//         this.screen.fillRect(0, skyHeight, this.size.width, groundHeight)

//         this.screen.fillStyle = colors.person

//         let personX = Math.floor(this.size.width * 0.2)

//         this.screen.fillRect(personX, skyHeight - 12, 10, 10)
//     }
// }

// const game = new Game('myGame')
// game.run()