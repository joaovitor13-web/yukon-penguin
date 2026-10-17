import CoinPrompt from '@scenes/interface/prompts/CoinPrompt'
import ErrorPrompt from './ErrorPrompt'
import ItemPrompt from '@scenes/interface/prompts/ItemPrompt'
import InputPrompt from '@scenes/interface/prompts/InputPrompt'
import LoadingPrompt from '@scenes/interface/prompts/LoadingPrompt'
import WindowPrompt from '@scenes/interface/prompts/WindowPrompt'

import MailErrorPrompt from '@scenes/interface/prompts/MailErrorPrompt'
import MailSuccessPrompt from '@scenes/interface/prompts/MailSuccessPrompt'


export default class PromptController {

    constructor(scene) {
        this.interface = scene

        this.crumbs = this.interface.crumbs
        this.network = this.interface.network
        this.world = this.interface.world

        this.prompts = []

        this.coin = this.createPrompt(CoinPrompt)
        this.error = this.createPrompt(ErrorPrompt)
        this.item = this.createPrompt(ItemPrompt)
        this.input = this.createPrompt(InputPrompt)
        this.loading = this.createPrompt(LoadingPrompt)
        this.window = this.createPrompt(WindowPrompt)

        this.mailError = this.createPrompt(MailErrorPrompt)
        this.mailSuccess = this.createPrompt(MailSuccessPrompt)
    }

    get coins() {
        return this.world.client.coins
    }

    get isPromptVisible() {
        return this.prompts.some(prompt => prompt.visible === true)
    }

    createPrompt(promptClass) {
        const prompt = new promptClass(this.interface, 760, 480)

        this.prompts.push(prompt)
        this.interface.add.existing(prompt)

        return prompt
    }

    showCoin(coins = 0) {
        this.coin.show(coins)
    }

    showError(text, buttonText = 'Ok', callback = () => this.error.close()) {
        this.error.show(text, buttonText, callback)
    }

    showItem(item) {
        this.item.showItem(item)
    }

    showFurniture(furniture) {
        this.item.showFurniture(furniture)
    }

    showIgloo(igloo) {
        if (this.world.client.igloos.includes(igloo)) {
            return this.showError('Você já tem este iglu.')
        }

        let text = `Você gostaria de comprar ${this.crumbs.igloos[igloo].name} por ${this.crumbs.igloos[igloo].cost} moedas? Você tem ${this.world.client.coins} moedas no momento.`

        this.showWindow(text, 'dual', () => {
            this.network.send('add_igloo', { igloo: igloo })
            this.interface.prompt.window.close()
        })
    }

    showFloor(floor) {
        if (floor == this.world.room.args.flooring) {
            return this.showError('Você já tem este piso.')
        }

        let text = `Você gostaria de comprar ${this.crumbs.flooring[floor].name} por ${this.crumbs.flooring[floor].cost} moedas? Você tem ${this.world.client.coins} moedas no momento.`

        this.showWindow(text, 'dual', () => {
            this.network.send('update_flooring', { flooring: floor })
            this.interface.prompt.window.close()
        })
    }

    showWindow(text, buttonLayout = 'single', callback = () => this.window.close(), noCallback = () => this.window.close()) {
        this.window.show(text, buttonLayout, callback, noCallback)
    }

    showLoading(text) {
        this.loading.show(text)
    }

    showMailError(text) {
        this.mailError.show(text)
    }

    showMailSuccess(text) {
        this.mailSuccess.show(text)
    }

    showAdopt(typeId) {
        const maxPets = 18

        if (this.world.client.pets.length >= maxPets) {
            return this.showError(this.getFormatString('max_pets', maxPets))
        }

        this.item.showAdopt(typeId)
    }

    showAdoptName(typeId) {
        this.input.showAdoptName(typeId)
    }

    showPetFood(pet) {
        if (this.coins < 10) return this.showLowCoins()

        this.item.showPetFood(pet)
    }

    showPetBath(pet) {
        if (this.coins < 5) return this.showLowCoins()

        this.item.showPetBath(pet)
    }

    showPetGum(pet) {
        if (this.coins < 5) return this.showLowCoins()

        this.item.showPetGum(pet)
    }

    showPetCookie(pet) {
        if (this.coins < 5) return this.showLowCoins()

        this.item.showPetCookie(pet)
    }

    showLowCoins() {
        this.showError(this.getString('low_coin_warn'))
    }

    getString(...args) {
        return this.interface.getString(...args)
    }

    getFormatString(id, ...args) {
        return this.interface.getFormatString(id, ...args)
    }

    hideAll() {
        this.loading.close()
    }

}
