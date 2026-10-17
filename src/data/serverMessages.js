// Mensagens enviadas em inglês pelo yukon-server, exibidas em português no cliente.
const messages = {
    'Sorry this room is currently full': 'Desculpe, esta sala está cheia no momento',
    'Sorry, this name is not available. Please try again': 'Desculpe, este nome não está disponível. Tente novamente',
    'You need more coins.': 'Você precisa de mais moedas.',
    'You already have this item.': 'Você já tem este item.',
    'This item is not currently available.': 'Este item não está disponível no momento.',
    'Penguin not found. Try Again?': 'Pinguim não encontrado. Tentar de novo?',
    'Incorrect password. NOTE: Passwords are CaSe SeNsiTIVE': 'Senha incorreta. ATENÇÃO: a senha diferencia MAIÚSCULAS e minúsculas',
    'Banned:\nYou are banned forever': 'Banido:\nVocê foi banido para sempre',
    'You must provide your Penguin Name to enter Club Penguin': 'Você precisa informar o nome do seu pinguim para entrar no Club Penguin',
    'Your Penguin Name is too short. Please try again': 'O nome do seu pinguim é muito curto. Tente novamente',
    'Your Penguin Name is too long. Please try again': 'O nome do seu pinguim é muito longo. Tente novamente',
    'You must provide your password to enter Club Penguin': 'Você precisa informar sua senha para entrar no Club Penguin',
    'Your password is too short. Please try again': 'Sua senha é muito curta. Tente novamente',
    'Your password is too long. Please try again': 'Sua senha é muito longa. Tente novamente'
}

const patterns = [
    [/^Banned:\nYou are banned for the next (\d+) hours$/, hours => `Banido:\nVocê está banido pelas próximas ${hours} horas`],
    [/^Your ID: (\d+)$/, id => `Seu ID: ${id}`],
    [/^Users online: (\d+)$/, count => `Pinguins on-line: ${count}`]
]

export default function translateServerMessage(message) {
    if (message in messages) {
        return messages[message]
    }

    for (const [pattern, format] of patterns) {
        const match = pattern.exec(message)

        if (match) {
            return format(...match.slice(1))
        }
    }

    return message
}
