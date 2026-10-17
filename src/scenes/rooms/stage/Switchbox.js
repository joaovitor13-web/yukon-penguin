import BaseContainer from '@scenes/base/BaseContainer'

import { Animation, SimpleButton } from '@components/components'


// Mesa de controle do palco, adaptada de CPJourney-2/yukon.
// Cada alavanca ou botão toca sua animação e volta ao quadro inicial.
export default class Switchbox extends BaseContainer {

    constructor(scene, x, y) {
        super(scene, x ?? 0, y ?? 0)

        const backswitch = scene.add.image(-1.97, -20.39, 'stage-basic', 'switchbox/backswitch')
        backswitch.setOrigin(0.44624, 0.25766)
        this.add(backswitch)

        const switches = [
            ['switchone', -85.15, -42.82, [0.43729, 0.57016], 18, true],
            ['switchtwo', -57.7, -46.08, [0.49379, 0.5074], 13, true],
            ['switchthree', -31.37, -59.73, [0.50746, 0.52935], 15, false],
            ['switchfour', -10.38, -35.77, [0.44012, 0.66286], 12, false],
            ['switchfive', 21.06, -56.83, [0.52237, 0.62004], 15, false],
            ['switchsix', 50.07, -42.47, [0.4851, 0.58469], 13, true],
            ['switchseven', 73.08, -47.77, [0.44672, 0.45699], 14, true],
            ['switcheight', 95.8, -46.6, [0.47302, 0.7061], 13, true]
        ]

        for (const [name, sx, sy, origin, end, reset] of switches) {
            const sprite = scene.add.sprite(sx, sy, 'stage-basic', `switchbox/${name}0001`)
            sprite.setOrigin(...origin)
            this.add(sprite)

            const animation = new Animation(sprite)
            animation.key = `switchbox/${name}`
            animation.end = end
            animation.repeat = 0
            animation.autoPlay = false

            // Botões coloridos ficam pressionados; alavancas voltam à posição inicial.
            if (reset) sprite.on('animationcomplete', () => sprite.setFrame(`switchbox/${name}0001`))

            const button = new SimpleButton(sprite)
            button.callback = () => {
                if (!sprite.anims.isPlaying) animation.play()
            }
        }
    }

}
