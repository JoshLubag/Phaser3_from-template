import Phaser from 'phaser'

export default class Game extends Phaser.Scene 
{
    private _player?: Phaser.Physics.Arcade.Sprite;
    private _platforms?: Phaser.Physics.Arcade.StaticGroup;
    private _controls?: Phaser.Types.Input.Keyboard.CursorKeys;
    private _stars?: Phaser.Physics.Arcade.Group;
    private _bombs?: Phaser.Physics.Arcade.Group;
    private _scoreText?: Phaser.GameObjects.Text;
    private _timerText?: Phaser.GameObjects.Text;

    private _isHit?: boolean;
    private _score?: number;
    private _bombVelocity?: number;
    private _timeValue?: number;

    constructor() 
    {
        super('GameScene')
    }

    init ()
    {
        this._isHit = false;
        this._score = 0;
        this._bombVelocity = 200;
        this._timeValue = 10;
    }

    preload() 
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() 
    {
        this.add.image(400, 300, 'sky');
        this._bombs = this.physics.add.group();
        this._platforms = this.createPlatforms();
        this.setupPlayerAnims();
        this.createStars();

        this._scoreText = this.add.text(16, 16, 'Score: ' + this._score);
        this._timerText = this.add.text(350, 16, '01:00');
        this._timerText.setFontSize(30);

       this._player = this.physics.add.sprite(100, 450, 'dude');
       this._player.setBounce(0.2);
       this._player.setCollideWorldBounds(true);

       const timedEvent = this.time.addEvent({ delay: 1000, callback: this.onTimer, callbackScope: this, loop: true });

        this.physics.add.collider(this._player, this._platforms);
        this.physics.add.collider(this._stars, this._platforms);
        this.physics.add.collider(this._bombs, this._platforms);
        this.physics.add.collider(this._bombs, this._bombs);
        this.physics.add.overlap(this._player, this._stars, this.collectHandler, undefined, this);
        this.physics.add.collider(this._bombs, this._player, this.hitHandler, undefined, this);
        this._controls = this.input.keyboard.createCursorKeys();

    }

    update() 
    {
        if (this._controls?.left.isDown)
        {
            this._player?.setVelocityX(-160);
            this._player?.anims.play('left', true);
        }
        else if (this._controls?.right.isDown)
        {
            this._player?.setVelocityX(160);
            this._player?.anims.play('right', true);
        }
        else
        {
            this._player?.setVelocityX(0);
            this._player?.anims.play('turn');
        }
        if (this._controls?.up.isDown && this._player?.body.touching.down)
        {
            this._player.setVelocityY(-330);
        }

    }

    private collectHandler(player: Phaser.GameObjects.GameObject, object: Phaser.GameObjects.GameObject)
    {
        this.updateScore(10);
        const obj = object as Phaser.Physics.Arcade.Image;
        obj.disableBody(true, true);

        if (this._stars?.countActive(true) === 0)
        {
            this._stars.children.iterate(c =>
                {
                    const child = c as Phaser.Physics.Arcade.Image
                    child.enableBody(true, child.x, 0, true, true)
                });
            this.addBomb(2);
        }

        
    }

    private hitHandler(player: Phaser.GameObjects.GameObject, bomb: Phaser.GameObjects.GameObject)
    {
        this.updateScore(-10);

        const obj = bomb as Phaser.Physics.Arcade.Image;
        obj.disableBody(true, true);

        if (!this._isHit)
        {
            this._isHit = true;
            
            const p = player as Phaser.Physics.Arcade.Sprite;
            p.setTint(0xff0000);
            p.setVelocity(0,0);
            p.anims.play('turn');
            this.time.delayedCall(500, cb =>
                {
                    this.resetHit(player)
                });
            // if (p.body.touching.left)
            // {
            //     p.setVelocityX(500);
            // }
            // else if (p.body.touching.right)
            // {
            //     p.setVelocityX(-500);
            // }
        }

    }

    private addBomb(amount: number)
    {
        for (let x = 0; x < amount; x++)
        {
            const x  = (this._player?.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bomb = this._bombs?.create(x, 0, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-this._bombVelocity, this._bombVelocity), 50);
        }
        this._bombVelocity += 30;
    }


    private createPlatforms()
    {
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        return platforms;
    }

    private setupPlayerAnims()
    {
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

    private createStars()
    {
        this._stars = this.physics.add.group(
            {
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
            });

        this._stars.children.iterate(c =>
            {
                const child = c as Phaser.Physics.Arcade.Image
                child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2))
            });
    }

    private resetHit(player: Phaser.GameObjects.GameObject)
    {
        if (this._isHit)
        {
            this._isHit = false;
            const p = player as Phaser.Physics.Arcade.Sprite;
            p.clearTint();
            
            this.addBomb(1);
        }
    }

    private updateScore(points: number)
    {
        this._score += points;
        this._scoreText?.setText('Score ' + this._score);
    }

    private formatTime(seconds: number){
        let minutes = Math.floor(seconds/60);
        let partInSeconds = seconds%60;
        return `${minutes}:${partInSeconds}`;
    }

    private onTimer()
    {
        this._timeValue -= 1;
        this._timerText.setText(this.formatTime(this._timeValue));

        if (this._timeValue <= 0)
        {
            this.onGameOver();
        }
    }

    private onGameOver()
    {
        this.scene.start('Score', {score: this._score})
    }
}
