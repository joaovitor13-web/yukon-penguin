import BaseLoader from './BaseLoader'


export default class IglooPetLoader extends BaseLoader {

    constructor(scene) {
        super(scene)

        this.baseURL = '/assets/media/pet/sprites/'
        this.keyPrefix = 'pet/sprites/'
    }

    loadPet(typeId, callback) {
        if (!(typeId in this.crumbs.pets)) return

        const pet = this.crumbs.pets[typeId]
        const name = pet.key || pet.name.toLowerCase()
        const key = this.getKey(name)

        if (this.checkComplete('json', key, () => {
            this.onFileComplete(key, callback)
        })) {
            return
        }

        this.multiatlas(key, `${name}.json`)
        this.start()
    }

    onFileComplete(key, callback) {
        if (!this.textureExists(key)) {
            return
        }

        this.memory.register(key)

        callback(key)
    }

}
