import RoomScene from '../RoomScene'

import { Animation, Button, MoveTo, ShowHint } from '@components/components'


// Layout e atlas da pizzaria original, adaptados de CPJourney-2/yukon.
// O minijogo Pizzatron continua sendo executado pelo Ruffle.
export default class Pizza extends RoomScene {

    constructor() {
        super('Pizza')

        /** @type {Array<Phaser.GameObjects.Image|Phaser.GameObjects.Container>} */
        this.sort

        this.roomTriggers = {
            'plaza': () => this.triggerRoom(300, 1152, 520),
            'pizzatron': () => this.triggerGame(910)
        }
        this.music = '20'
    }

    _preload() {
        this.load.pack('pizza-pack', 'assets/media/rooms/pizza/pizza-pack.json')
    }

    _create() {
        const scaled = (x, y, frame) => this.add.image(x, y, 'pizza', frame).setScale(1.02)

        scaled(760, 483, 'bg')
        const bead_door = scaled(385, 241, 'bead-door')

        const piano = this.add.image(1270.6, 447.8, 'pizza', 'piano')
        piano.setOrigin(0.14971, 0.62236)

        const door = scaled(837, 265, 'door')
        scaled(187, 515, 'pizza-pan')
        scaled(110, 457, 'oven')

        const foreground = scaled(112, 957.7, 'foreground')
        foreground.setOrigin(0.5, 0.93879)

        const chair1 = scaled(414, 609, 'chair1')
        const chair2 = scaled(577, 609, 'chair2')
        const table1 = this.addTable(494, 664, 'table1', 5, -84, [0.47077, 0.58791])

        const chair3 = scaled(677, 719, 'chair3')
        const chair4 = this.add.image(840, 719, 'pizza', 'chair4')
        const table2 = this.addTable(763, 775, 'table2', -4, -79, [0.61509, 0.75921], true)

        const chair5 = scaled(987, 687, 'chair5')
        const chair6 = scaled(1159, 687, 'chair6')
        const table3 = this.addTable(1071, 735, 'table3', -3, -79, [0.51046, 0.77399])

        const steam = this.add.sprite(43, 165, 'pizza', 'smoke0001')
        const fire = this.add.sprite(110, 770, 'pizza', 'fire0001').setScale(1.02)

        // Balcão com livro de pedidos e caixa registradora.
        const counter = this.add.container(528, 452.57)
        const book = this.add.sprite(60, -103, 'pizza', 'book-hover0001').setScale(1.02)
        book.setOrigin(0.4676, 0.55917)
        const register = this.add.sprite(-65, -87, 'pizza', 'register0001').setScale(1.02)
        register.setOrigin(0.5, 0.88386)
        counter.add([scaled(0, -19.57, 'big-table'), book, register])

        this.add.image(381, 32, 'pizza', 'sign')

        this.sort = [piano, chair1, chair2, chair3, chair4, chair5, chair6, counter, table3, table2, table1, foreground]

        // Porta de contas para a cozinha (Pizzatron).
        const beadDoorButton = new Button(bead_door)
        beadDoorButton.spriteName = 'bead-door'
        beadDoorButton.pixelPerfect = true
        const beadDoorShowHint = new ShowHint(bead_door)
        beadDoorShowHint.text = 'pizzatron_hint'
        const beadDoorMoveTo = new MoveTo(bead_door)
        beadDoorMoveTo.x = 384
        beadDoorMoveTo.y = 405

        // Saída para a Plaza.
        const doorButton = new Button(door)
        doorButton.spriteName = 'door'
        doorButton.pixelPerfect = true
        const doorMoveTo = new MoveTo(door)
        doorMoveTo.x = 837
        doorMoveTo.y = 450

        this.animate(steam, 'smoke', 5)
        this.animate(fire, 'fire', 8)

        // Animações de passar o mouse sobre o livro e o caixa.
        this.hoverAnimate(book, 'book-hover', 16, this.add.rectangle(593, 361, 140, 40))
        this.hoverAnimate(register, 'register', 42, this.add.rectangle(463, 331, 110, 100))

        this.events.emit('scene-awake')
    }

    addTable(x, y, frame, candleX, candleY, origin, flip = false) {
        const table = this.add.container(x, y)

        const candle = this.add.sprite(candleX, candleY, 'pizza', 'candle-fire10001')
        candle.setScale(0.5)
        candle.setOrigin(...origin)
        candle.flipX = flip

        table.add([this.add.image(0, 0, 'pizza', frame).setScale(1.02), candle])
        this.animate(candle, 'candle-fire1', 14)

        return table
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
