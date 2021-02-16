export class Score extends Phaser.Scene
{
    private _score?: number;
    constructor()
    {
        super('Score');
    }

    init(data)
    {
       console.log(data.score);
       this._score = data.score;
    }

    create()
    {
        const text1 = this.add.text(220, 200, 'FINAL SCORE:', {fontSize: '50px'});
        const text2 = this.add.text(350, 300, this._score.toString() , {fontSize: '100px'});
        const text3 = this.add.text(200, 450, 'click anywhere to reset' , {fontSize: '30px'});

        this.input.once('pointerup', c => {

            this.scene.start('GameScene');

        }, this);
    }
}