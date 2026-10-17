// Reduz a fonte de um texto de largura fixa para que uma linha caiba inteira
export default function fitFontSize(text, fontSize) {
    text.setFontSize(fontSize)

    const maxWidth = text.style.fixedWidth
    if (!maxWidth) return

    text.style.syncFont(text.canvas, text.context)

    const width = text.context.measureText(text.text).width

    if (width > maxWidth) {
        text.setFontSize(Math.floor(fontSize * maxWidth / width))
    }
}
