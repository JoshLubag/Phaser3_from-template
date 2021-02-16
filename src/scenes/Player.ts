import { Physics } from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite
{
    public _player?: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, x:number, y: number) 
    {
        super(scene, x, y, 'Texture');
    }

    public get player()
    {
        return this._player;
    }

    preload() 
    {
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() 
    {
        this._player = this.physics.add.sprite(100, 450, 'dude');

        this._player.setBounce(0.2);
        this._player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

    }

    update() {

    }
}