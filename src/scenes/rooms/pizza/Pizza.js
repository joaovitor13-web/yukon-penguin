import RoomScene from '../RoomScene'

// Sala local em Phaser: o minijogo original continua sendo executado pelo Ruffle.
export default class Pizza extends RoomScene {
    constructor() {
        super('Pizza')
        this.music = '20'
    }

    _preload() {}

    get roomPhysics() { return true }

    addPhysics() {
        this.matter.world.setBounds(0, 0, 1520, 960)
        this.block = this.matter.add.rectangle(760, 165, 1520, 330, { isStatic: true })
    }

    _create() {
        const g = this.add.graphics()
        g.fillStyle(0xf1d8a4).fillRect(0, 0, 1520, 960)
        g.fillStyle(0xa95d3d).fillRect(0, 330, 1520, 630)
        g.lineStyle(3, 0x80442e, .5)
        for (let y = 340; y < 960; y += 75) {
            g.lineBetween(0, y, 1520, y)
            for (let x = (y % 2 ? 0 : 90); x < 1520; x += 210) g.lineBetween(x, y, x, y + 75)
        }
        g.fillStyle(0x536d52).fillRect(0, 260, 1520, 70)
        g.fillStyle(0x35483a).fillRect(0, 320, 1520, 14)
        // Forno e balcão.
        g.fillStyle(0xba6944).fillRoundedRect(70, 120, 265, 215, 28)
        g.fillStyle(0x412b27).fillRoundedRect(110, 190, 185, 138, 45)
        g.fillStyle(0xf3ab39).fillEllipse(200, 295, 135, 34)
        g.fillStyle(0x814c36).fillRoundedRect(38, 360, 470, 100, 25)
        g.fillStyle(0xe7c897).fillRoundedRect(30, 340, 490, 45, 16)
        g.fillStyle(0x537567).fillRoundedRect(305, 290, 110, 56, 8)
        // Mesa do chef e quadros do salão.
        this.label(200, 80, 'PIZZARIA', 34, '#4d392b')
        g.fillStyle(0x513e30).fillRoundedRect(580, 70, 300, 175, 14)
        g.fillStyle(0x294b43).fillRoundedRect(591, 81, 278, 153, 8)
        this.label(730, 114, 'NO CARDÁPIO', 22, '#fff0c5')
        this.label(730, 161, 'Pizza • Amigos • Diversão', 19, '#fff0c5')
        this.label(730, 202, 'Uma mesa para todo pinguim', 15, '#fff0c5')
        for (const [x, y] of [[380, 630], [1150, 590], [1100, 790]]) {
            const table = this.add.graphics().setPosition(x, y).setDepth(y)
            table.fillStyle(0x653f31).fillEllipse(0, 20, 235, 95)
            table.fillStyle(0xf3e5c8).fillEllipse(0, 0, 235, 95)
            table.lineStyle(5, 0xbb5345).strokeEllipse(0, 0, 235, 95)
            table.fillStyle(0xc39654).fillEllipse(0, -4, 100, 43)
            table.fillStyle(0xe8ba65).fillEllipse(0, -7, 84, 32)
            table.fillStyle(0xb84d3e)
            for (const dx of [-22, 6, 23]) table.fillEllipse(dx, -8 + dx / 4, 12, 7)
        }
        // Portas clicáveis: o salão continua compartilhado entre os jogadores.
        this.door(1360, 'PLAZA', 'Voltar à praça', () => this.triggerRoom(300, 1152, 520), 0x426b67)
        this.door(1050, 'COZINHA', 'Jogar Pizzatron 3000', () => this.triggerGame(910), 0x8e3934)
        this.label(760, 865, 'Clique na porta da cozinha para fazer pizzas!', 24, '#fff2d2')
        this.events.emit('scene-awake')
    }

    label(x, y, text, size, color) {
        return this.add.text(x, y, text, { fontFamily: 'Arial', fontSize: `${size}px`, color, align: 'center' }).setOrigin(.5)
    }

    door(x, title, hint, callback, color) {
        this.add.rectangle(x, 224, 210, 215, 0x54392f).setStrokeStyle(5, 0xe6be80)
        const door = this.add.rectangle(x, 234, 184, 192, color)
        this.label(x, 165, title, 24, '#fff3d7')
        this.label(x, 226, title === 'COZINHA' ? 'PIZZATRON\n3000' : 'SAÍDA', 27, '#fff3d7')
        this.label(x, 310, hint, 15, '#fff3d7')
        door.isButton = true
        door.setInteractive({ useHandCursor: true })
        door.on('pointerover', () => door.setFillStyle(color, .8))
        door.on('pointerout', () => door.setFillStyle(color))
        door.on('pointerup', pointer => { if (pointer.button === 0) callback() })
    }
}
