import RoomScene from '../RoomScene'

import { Animation, MoveTo, ShowHint, SimpleButton } from '@components/components'


// Layout e atlas da mina original, adaptados de CPJourney-2/yukon.
// O minijogo Cart Surfer continua sendo executado pelo Ruffle.
export default class Mine extends RoomScene {

    constructor() {
        super('Mine')

        /** @type {Array<Phaser.GameObjects.Image|Phaser.GameObjects.Container>} */
        this.sort

        this.roomTriggers = {
            'cave': () => this.triggerRoom(806, 1280, 655),
            'cart': () => this.triggerGame(905),
            // Sem a Mina da Caverna (813), o túnel do fundo volta para a Cabana.
            'cavemine': () => this.triggerRoom(807, 760, 640),
            // Puffle Rescue indisponível neste cliente.
            'rescue': null
        }
    }

    _preload() {
        this.load.pack('mine-pack', 'assets/media/rooms/mine/mine-pack.json')
    }

    _create() {
        this.add.image(760, 489, 'mine', 'bg/bg')

        // Entrada do túnel com fiação e luzes.
        const entranceContainer = this.add.container(764, 235)
        const entrance = this.add.sprite(0, 0, 'mine', 'bg/entrance0001')
        const lightanim = this.add.sprite(55, -50, 'mine', 'bg/lightanim0001')
        const tiltedLight = this.add.image(93, -37, 'mine', 'bg/light2')
        tiltedLight.angle = 20
        entranceContainer.add([
            entrance,
            this.add.image(38, -83, 'mine', 'bg/wire'),
            this.add.image(-24, -56, 'mine', 'bg/light1'),
            this.add.image(25, -51, 'mine', 'bg/light2'),
            tiltedLight,
            lightanim,
            this.add.image(20, -57, 'mine', 'bg/wood')
        ])

        this.add.image(542, 84, 'mine', 'bg/rescuesign0001')
        this.add.image(557, 187, 'mine', 'bg/pufflerescue0001')

        const chair = this.add.image(571, 296, 'mine', 'chair')
        this.add.image(398, 213, 'mine', 'bg/equipment')

        const rocks = this.add.image(795.53, 339.72, 'mine', 'rocks')
        rocks.setOrigin(0.44227, 0.63862)

        // Mesa com puffle e telefone.
        const table = this.add.container(582.96, 374.98)
        const puffleShadow = this.add.ellipse(55, -20, 44, 12, 0x5b300e, 0.56)
        const puffle = this.add.sprite(55.04, -33.98, 'mine', 'table/puffle0001')
        const telephone = this.add.sprite(-52.96, -32.98, 'mine', 'table/telephone0001')
        table.add([this.add.image(-4.96, -6.98, 'mine', 'table/table'), puffleShadow, puffle, telephone])

        const wood = this.add.image(1116, 365.54, 'mine', 'wood')
        wood.setOrigin(0.5, 0.92588)

        const shovel = this.add.image(909.98, 458.79, 'mine', 'shovel')
        shovel.setOrigin(0.46084, 0.82144)

        const cartAnim = this.add.sprite(1209, 367, 'mine', 'cartanim0001')
        cartAnim.setOrigin(0.11807, 0.67016)
        cartAnim.visible = false

        const cart2 = this.add.image(1138, 425.28, 'mine', 'cart2')
        cart2.setOrigin(0.5, 0.60128)

        const cart1 = this.add.image(1009, 469.7, 'mine', 'cart1')
        cart1.setOrigin(0.5, 0.63166)

        // Parede de trás com lanterna e vela.
        const caveWallBack = this.add.container(406.28, 426.22)
        const candle = this.add.sprite(-94, -230, 'mine', 'cavewallback/candle0001')
        caveWallBack.add([
            this.add.image(274.72, -185.22, 'mine', 'cavewallback/wall'),
            this.add.image(-95, -261, 'mine', 'cavewallback/lantern'),
            candle
        ])

        const caveWallFront = this.add.image(157, 582, 'mine', 'cavewallfront')
        caveWallFront.setOrigin(0.25692, 0.85916)

        const mineSign = this.add.image(1289.35, 518.8, 'mine', 'minesign0001')
        mineSign.setOrigin(0.63965, 0.86225)

        const foreground = this.add.image(-3.5, 969, 'mine', 'foreground')
        foreground.setOrigin(0, 1)

        this.sort = [foreground, mineSign, cart1, shovel, cart2, wood, caveWallFront, caveWallBack, rocks, chair, table]

        this.animate(entrance, 'bg/entrance', 81)
        this.animate(lightanim, 'bg/lightanim', 160)
        this.animate(candle, 'cavewallback/candle', 14)

        this.hoverAnimate(puffle, 'table/puffle', 60, this.add.rectangle(637, 342, 50, 50))
        this.hoverAnimate(telephone, 'table/telephone', 28, this.add.rectangle(530, 344, 60, 50))
        telephone.on('animationstart', () => this.soundManager.play('mine-telephone'))

        // Carrinho do Cart Surfer: ao passar o mouse, o carrinho balança.
        const cartAnimation = this.animate(cartAnim, 'cartanim', 7, false)
        cartAnimation.repeat = 0
        cartAnimation.showOnStart = true

        const cartButton = this.add.polygon(1238.17, 303.72,
            '84.94 75.32 83.77 -93.42 309.93 -92.24 314.76 85.46 159.12 126.8')
        cartButton.setOrigin(0.54622, 0.03508)
        cartButton.setInteractive(cartButton.geom, Phaser.Geom.Polygon.Contains)
        const cartShowHint = new ShowHint(cartButton)
        cartShowHint.text = 'cart_hint'
        const cartMoveTo = new MoveTo(cartButton)
        cartMoveTo.x = 1260
        cartMoveTo.y = 400
        const cartSimpleButton = new SimpleButton(cartButton)
        cartSimpleButton.hoverCallback = () => cartAnimation.play()
        cartSimpleButton.hoverOutCallback = () => cartAnim.visible = false

        this.events.emit('scene-awake')
    }

    animate(sprite, key, end, autoPlay = true) {
        const animation = new Animation(sprite)
        animation.key = key
        animation.end = end
        animation.autoPlay = autoPlay

        return animation
    }

    hoverAnimate(sprite, key, end, zone) {
        const animation = this.animate(sprite, key, end, false)
        animation.repeat = 0

        zone.setInteractive()
        zone.on('pointerover', () => {
            if (!sprite.anims.isPlaying) animation.play()
        })
    }

}
