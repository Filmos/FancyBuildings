let {addRotation, addHalfRotation} = require('./../structure_generation/transformers_mapping.js')
let { paletteToJson, WithOverridenPlacement } = require('./block_interpreter.js')
const defaultDict = (defaultValueFunc) => new Proxy({}, {
    get(target, prop) {
        if (!target[prop]) target[prop] = defaultValueFunc(prop)
        return target[prop];
    }
})

const allVariants = defaultDict((name) => [])

const paletteCounter = defaultDict((name) => 0)
function makePalette(source, name) {
    if(!name) name = source
    name = name.replace(/[^a-zA-Z0-9]/g, '_')
    return $$.create(`src/${source}.json`, `${out}/palettes/${name}_${paletteCounter[name]++}.json`)
}

function makeSimplePalette(name, pallettes) {
    for(let p in pallettes.blocks) {
        let factor = 1
        let source = pallettes.blocks[p]
        if(typeof source[0] == 'number') {
            factor = source[0]
            source = source.slice(1)
        }
        let blocks = source.map((data, charI) => ({
            char: pallettes.chars[charI],
            ...paletteToJson(data)
        }))
        eval(makePalette('simple_palette', name))
    }
}
let rotationBlacklist = [
    'utilitix:experience_crystal[facing=up]', 'minecraft:crafting_table', 'minecraft:brewing_stand', 'minecraft:cartography_table', 'byg:embur_crafting_table', 'byg:holly_crafting_table', 'byg:jacaranda_crafting_table', 'byg:lament_crafting_table', 'apotheosis:reforging_table', 'minecraft:smithing_table', 'byg:pine_crafting_table', 'byg:redwood_crafting_table', 'apotheosis:salvaging_table', 'powah:energy_cell_starter', 'minecraft:air', 'byg:sythian_crafting_table',
    'minecraft:sea_pickle[pickles=1,waterlogged=false]', 'minecraft:sea_pickle[pickles=2,waterlogged=false]', 'ae2:tiny_tnt', 'minecraft:flower_pot', 'supplementaries:hourglass', 'supplementaries:jar', 'twilightforest:firefly_jar', 'supplementaries:urn', 'minecraft:lantern', 'minecraft:soul_lantern', 'minecraft:redstone_wire[north=none,south=none,east=none,west=none]', 'supplementaries:gunpowder[north=none,south=none,east=none,west=none]', 'supplementaries:present_%color%', 'supplementaries:trapped_present_%color%', 'botania:%color%_floating_flower'
]

function palleteWithSuffix(suffixMap, blocks) {
    function addSuffix(block, suffix) {
        if(rotationBlacklist.includes(block) || rotationBlacklist.includes(block[1])) return block
        let combine = b => (b.split(/(?={)/)[0] + suffix + b.split(/(?={)/).slice(1).join("")).replace(/\]\s*\[/g, ',')
        if(typeof block == 'string') return combine(block)
        return [block[0], combine(block[1])]
    }
    let pallete = {
        chars: Object.keys(suffixMap),
        blocks: blocks.map(b => Object.values(suffixMap).map(s => (Array.isArray(b) ? b : [b]).map(n => addSuffix(n, s))))
    }
    return pallete
}
function makePalleteWithSuffix(name, suffixMap, blocks) {makeSimplePalette(name, palleteWithSuffix(suffixMap, blocks))}


function palleteWithRotation(chars, blocks) {
    if(chars.length != 4) throw new Error(`Chars must be 4 characters, got '${chars}' of length ${chars.length}`)
    let suffixMap = {
        [chars[0]]: '[facing=south]',
        [chars[1]]: '[facing=east]',
        [chars[2]]: '[facing=north]',
        [chars[3]]: '[facing=west]'
    }
    addRotation(chars)
    return palleteWithSuffix(suffixMap, blocks)
}
function makePalleteWithRotation(name, chars, blocks) {makeSimplePalette(name, palleteWithRotation(chars, blocks))}

function singleBlockPallete(char, pallettes) {
    if(char.length != 1) throw new Error(`Char must be a single character, got '${char}' of length ${char.length}`)
    return {chars: [char], blocks: pallettes.map(b => typeof b !== "string" && typeof b[0] !== "string" ? [b[0], b.slice(1)]: [b])}
}
function makeSingleBlockPallete(name, char, pallettes) {makeSimplePalette(name, singleBlockPallete(char, pallettes))}

function combinedPalette(...pallettes) {
    let expectedLength = pallettes[0].blocks.length
    let actualLengths = pallettes.map(p => `${p.chars}: ${p.blocks.length}`).join("\n")
    if(pallettes.some(p => p.blocks.length != expectedLength)) throw new Error(`Invalid combined pallette '${name}', all pallettes must have the same number of blocks, got:\n${actualLengths}`)

    let result = {
        chars: pallettes.map(p => p.chars).flat(),
        blocks: pallettes[0].blocks.map((_, i) => pallettes.map(p => p.blocks[i]).flat())
    }
    return result
}
function makeCombinedPalette(name,...pallettes) {makeSimplePalette(name, combinedPalette(...pallettes))}

function splitPalette(palette) {
    return Object.fromEntries(palette.chars.map((c, i) => [c, {
        chars: [c],
        blocks: palette.blocks.map(b => [b[i]])
    }]))
}

function combineVariants(...palettes) {
    for(let pal of palettes) {
        if(!pal.chars) throw new Error(`Palette '${p.name}' does not have a 'chars' property`)
        for(let char of pal.chars) {
            if(!palettes.every(p => p.chars.includes(char))) throw new Error(`Char '${char}' not present in all palettes`)
        }
    }

    let result = JSON.parse(JSON.stringify(palettes[0]))
    for(let pal of palettes.slice(1)) {
        for(let variant of pal.blocks) {
            let reordered = []
            for(let char of result.chars) {
                let index = pal.chars.indexOf(char)
                reordered.push(variant[index])
            }
            result.blocks.push(reordered)
        }
    }
    return result
}

function addToAllVariants(base, addition) {
    if(addition.blocks.length != 1) throw new Error(`Addition must have exactly one variant, got ${addition.blocks.length}`)
    let result = JSON.parse(JSON.stringify(base))
    for(let c in addition.chars) {
        let char = addition.chars[c]
        if(!result.chars.includes(char)) throw new Error(`Char '${char}' not present in base`)
        let index = result.chars.indexOf(char)

        for(let variant of result.blocks)
            variant[index] = variant[index].concat(addition.blocks[0][c])
    }
    return result
}

function overridePlacement(pallette) {
    return {
        chars: pallette.chars,
        blocks: pallette.blocks.map(variant => variant.map(char => new WithOverridenPlacement(char)))
    }
}

module.exports = {
    allVariants, 
    makePalette, makeSimplePalette, 
    singleBlockPallete, makeSingleBlockPallete,
    palleteWithSuffix, makePalleteWithSuffix,
    palleteWithRotation, makePalleteWithRotation,
    overridePlacement,
    combinedPalette, makeCombinedPalette, 
    splitPalette,
    combineVariants, addToAllVariants
} 