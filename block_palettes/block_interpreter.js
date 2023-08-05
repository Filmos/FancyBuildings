function fillInWeights(blocks) {
    blocks = blocks.map(block => {
        if(typeof block == 'string') return [1, block]
        return block
    })
    let result = []
    let leftover = 128-blocks.length
    let paletteSum = blocks.reduce((a, b) => a + b[0], 0)

    for(let i=0;i<blocks.length;i++) {
        let block = blocks[i]
        let weight = Math.round(block[0]/paletteSum*leftover)
        if(weight > leftover) weight = leftover
        leftover -= weight
        paletteSum -= block[0]
        result.push({
            "random": weight+1,
            "block": block[1]
        })
    }

    return result
}

function paletteToJson(data) {
    if(data.asJson) return data.asJson()
    if(typeof data == 'string') return {block: data}
    
    if(data.length == 1 && typeof data[0] == 'string') return {block: data[0]}
    if(data.length == 1) return {block: data[0][1]}
    return {blocks: fillInWeights(data)}
}

class WithOverridenPlacement {
    constructor(palette) {
        if(typeof palette == "string") palette = [palette]
        if(!Array.isArray(palette) || palette.length == 0) throw new Error("Invalid palette, expected array of strings or [weight, string], got "+JSON.stringify(palette))
        for(let i=0;i<palette.length;i++) {
            if(typeof palette[i] != "string" && typeof palette[i][1] != "string") throw new Error("Invalid palette, expected array of strings or [weight, string], got "+JSON.stringify(palette))
            if(typeof palette[i] == "string") palette[i] = [1, palette[i]]
            if(palette[i][1].indexOf(';') != -1) throw new Error("Invalid block for delayed placement, cannot contain ';', got "+JSON.stringify(palette[i][1]))
            if(palette[i][1].indexOf("'") != -1) throw new Error("Invalid block for delayed placement, cannot contain \"'\", got "+JSON.stringify(palette[i][1]))
            palette[i][1] = palette[i][1].replace(/"/g, '\\"')
        }
        this.palette = palette
    }
    asJson() {
        return {
            "block": "minecraft:repeating_command_block",
            "tag": {"auto": true, "Command": `setblock ~ ~ ~ minecraft:command_block{auto: true, Command: "setblock_delayed ~ ~ ~ '${this.palette.flat().join(';')}'"}`}
        }
    }
}

module.exports = { paletteToJson, WithOverridenPlacement }