import Game from './scenes/Game'
import { Score } from './scenes/Score'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 330 }
		}
	},
	scene: [Game, Score]
}

export default new Phaser.Game(config)
