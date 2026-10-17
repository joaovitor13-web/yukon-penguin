import Plugin from '../Plugin'


export default class Mail extends Plugin {

    constructor(network) {
        super(network)

        this.events = {
            'send_mail': this.sendMail,
            'receive_mail': this.receiveMail
        }

        this.responses = {
            InsufficientCoins: 0,
            FullInbox: 1,
            Success: 2
        }
    }

    sendMail(args) {
        this.world.client.coins = args.coins

        switch (args.response) {
            case this.responses.InsufficientCoins:
                this.showInsufficientCoins()
                break

            case this.responses.FullInbox:
                this.showFullInbox()
                break

            case this.responses.Success:
                this.showSuccess()
                break
        }
    }

    receiveMail(args) {
        this.world.client?.addPostcard(args)
    }

    showInsufficientCoins() {
        this.showError('Não foi possível enviar o cartão.\nVocê precisa de mais moedas.')
    }

    showFullInbox() {
        this.showError('A caixa de correio deste pinguim está cheia. Não foi possível enviar seu cartão. Tente novamente mais tarde.')
    }

    showSuccess() {
        this.interface.prompt.showMailSuccess('Cartão enviado')
    }

    showError(text) {
        this.interface.prompt.showMailError(text)
    }

}
