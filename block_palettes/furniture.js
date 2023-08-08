var { makeSingleBlockPallete, allVariants, makeSimplePalette, makePalleteWithRotation, palleteWithRotation, singleBlockPallete, makeCombinedPalette, palleteWithMultiblock, overridePlacement, splitPalette, combinedPalette, palleteWithSuffix } = require('./common.js')
var { addAsymmetricRotation } = require('./../structure_generation/transformers_mapping.js')

class PaletteMultiplier {
    constructor(paletteBase) {
        this.palettes = [paletteBase]
        this.base = paletteBase.blocks.length
    }

    add(palette) {
        if(palette.blocks.length%this.base != 0) 
            throw new Error(`Palette '${palette.chars}' has an invalid number of blocks, must be a multiple of ${this.base}, got ${palette.blocks.length}`)
        
        let previousLength = this.palettes[0].blocks.length/this.base
        for(let p of this.palettes) {
            let pBlocks = [...p.blocks]
            for(let i=0;i<palette.blocks.length/this.base-1;i++) p.blocks.push(...pBlocks)
        }
        
        let newBlocks = []
        for(let i=0;i<palette.blocks.length;i+=this.base) {
            for(let j=0;j<previousLength;j++) {
                newBlocks.push(...palette.blocks.slice(i, i+this.base))
            }
        }
        palette.blocks = newBlocks
        this.palettes.push(palette)
    }

    make(name) {
        return makeCombinedPalette(name, ...this.palettes)
    }
}

function makeFurniture() {
    let worker = new PaletteMultiplier(singleBlockPallete('✜', ['cfm:oak_table', 'cfm:spruce_table', 'cfm:birch_table', 'cfm:jungle_table', 'cfm:acacia_table', 'cfm:dark_oak_table', 'cfm:crimson_table', 'cfm:warped_table'].map(x => `${x}[waterlogged=false]`)))
    worker.add(palleteWithRotation('⇑⇐⇓⇒', ['cfm:oak_chair', 'cfm:spruce_chair', 'cfm:birch_chair', 'cfm:jungle_chair', 'cfm:acacia_chair', 'cfm:dark_oak_chair', 'cfm:crimson_chair', 'cfm:warped_chair', 'cfm:stripped_oak_chair', 'cfm:stripped_spruce_chair', 'cfm:stripped_birch_chair', 'cfm:stripped_jungle_chair', 'cfm:stripped_acacia_chair', 'cfm:stripped_dark_oak_chair', 'cfm:stripped_crimson_chair', 'cfm:stripped_warped_chair'].map(x => `${x}[waterlogged=false]`)))
    worker.add(makeDoors())
    worker.add(overridePlacement(palleteWithRotation('⍗⍈⍐⍇', ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'crimson', 'warped'].map(x => `sophisticatedstorage:barrel{woodType: "${x}"}`))))
    worker.add(overridePlacement(palleteWithRotation('ᐱᐸᐯᐳ', ['cfm:oak_desk', 'cfm:spruce_desk', 'cfm:birch_desk', 'cfm:jungle_desk', 'cfm:acacia_desk', 'cfm:dark_oak_desk', 'cfm:crimson_desk', 'cfm:warped_desk'].map(x => `${x}[waterlogged=false]`))))
    worker.add(palleteWithRotation('ᐽᑅᐻᑁ', ['cfm:oak_bedside_cabinet', 'cfm:spruce_bedside_cabinet', 'cfm:birch_bedside_cabinet', 'cfm:jungle_bedside_cabinet', 'cfm:acacia_bedside_cabinet', 'cfm:dark_oak_bedside_cabinet', 'cfm:crimson_bedside_cabinet', 'cfm:warped_bedside_cabinet'].map(x => `${x}[waterlogged=false]`)))
    worker.add(makeStairs())
    worker.add(singleBlockPallete('ᙚ', ['minecraft:oak_planks', 'minecraft:spruce_planks', 'minecraft:birch_planks', 'minecraft:jungle_planks', 'minecraft:acacia_planks', 'minecraft:dark_oak_planks', 'minecraft:crimson_planks', 'minecraft:warped_planks']))
    worker.add(makeSlabs())
    worker.make('furniture')
}

function makeDoors() {
    let base = [
        ['mcwtrpdoors:oak_four_panel_trapdoor', 'mcwdoors:oak_four_panel_door', 'mcwtrpdoors:oak_paper_trapdoor', 'mcwdoors:oak_paper_door', 'mcwtrpdoors:oak_cottage_trapdoor', 'mcwdoors:oak_cottage_door', 'mcwtrpdoors:oak_barn_trapdoor', 'mcwdoors:oak_barn_door'],
        ['mcwtrpdoors:spruce_four_panel_trapdoor', 'mcwdoors:spruce_four_panel_door', 'mcwtrpdoors:spruce_paper_trapdoor', 'mcwdoors:spruce_paper_door', 'minecraft:spruce_trapdoor', 'minecraft:spruce_door', 'mcwtrpdoors:spruce_barn_trapdoor', 'mcwdoors:spruce_barn_door'],
        ['mcwtrpdoors:birch_four_panel_trapdoor', 'mcwdoors:birch_four_panel_door', 'minecraft:birch_trapdoor', 'minecraft:birch_door', 'mcwtrpdoors:birch_cottage_trapdoor', 'mcwdoors:birch_cottage_door', 'mcwtrpdoors:birch_barn_trapdoor', 'mcwdoors:birch_barn_door'],
        ['mcwtrpdoors:jungle_four_panel_trapdoor', 'mcwdoors:jungle_four_panel_door', 'mcwtrpdoors:jungle_paper_trapdoor', 'mcwdoors:jungle_paper_door', 'mcwtrpdoors:jungle_cottage_trapdoor', 'mcwdoors:jungle_cottage_door', 'mcwtrpdoors:jungle_barn_trapdoor', 'mcwdoors:jungle_barn_door'],
        ['mcwtrpdoors:acacia_four_panel_trapdoor', 'mcwdoors:acacia_four_panel_door', 'mcwtrpdoors:acacia_paper_trapdoor', 'mcwdoors:acacia_paper_door', 'mcwtrpdoors:acacia_cottage_trapdoor', 'mcwdoors:acacia_cottage_door', 'mcwtrpdoors:acacia_barn_trapdoor', 'mcwdoors:acacia_barn_door'],
        ['minecraft:dark_oak_trapdoor', 'minecraft:dark_oak_door', 'mcwtrpdoors:dark_oak_paper_trapdoor', 'mcwdoors:dark_oak_paper_door', 'mcwtrpdoors:dark_oak_cottage_trapdoor', 'mcwdoors:dark_oak_cottage_door', 'mcwtrpdoors:dark_oak_barn_trapdoor', 'mcwdoors:dark_oak_barn_door'],
        ['mcwtrpdoors:crimson_four_panel_trapdoor', 'mcwdoors:crimson_four_panel_door', 'mcwtrpdoors:crimson_paper_trapdoor', 'mcwdoors:crimson_paper_door', 'mcwtrpdoors:crimson_cottage_trapdoor', 'mcwdoors:crimson_cottage_door', 'mcwtrpdoors:crimson_barn_trapdoor', 'mcwdoors:crimson_barn_door'],
        ['mcwtrpdoors:warped_four_panel_trapdoor', 'mcwdoors:warped_four_panel_door', 'mcwtrpdoors:warped_paper_trapdoor', 'mcwdoors:warped_paper_door', 'mcwtrpdoors:warped_cottage_trapdoor', 'mcwdoors:warped_cottage_door', 'mcwtrpdoors:warped_barn_trapdoor', 'mcwdoors:warped_barn_door']
    ]

    let trapdoors = []
    for(let j = 0; j < base[0].length; j+=2) {for(let i = 0; i < base.length; i++) {
            trapdoors.push(`${base[i][j]}`)
    }}
    let trapdoors_opened = palleteWithRotation('┬├┴┤', trapdoors.map(x => `${x}[half=bottom,open=true]`))
    let trapdoors_closed = palleteWithRotation('╥╞╨╡', trapdoors.map(x => `${x}[half=top,open=false]`))

    let doors = []
    for(let j = 1; j < base[0].length; j+=2) {for(let i = 0; i < base.length; i++) {
            doors.push(`${base[i][j]}`)
    }}
    let chars = '↾↼⇃⇁↿↽⇂⇀'
    addAsymmetricRotation(chars)
    let suffixMap = {
        [chars[0]]: '[facing=south,hinge=left,half=upper]',
        [chars[1]]: '[facing=east,hinge=left,half=upper]',
        [chars[2]]: '[facing=north,hinge=left,half=upper]',
        [chars[3]]: '[facing=west,hinge=left,half=upper]',
        [chars[4]]: '[facing=south,hinge=right,half=upper]',
        [chars[5]]: '[facing=east,hinge=right,half=upper]',
        [chars[6]]: '[facing=north,hinge=right,half=upper]',
        [chars[7]]: '[facing=west,hinge=right,half=upper]'
    }
    let door_upper = palleteWithSuffix(suffixMap, doors)
    
    chars = '⥔⥒⥙⥗⥘⥖⥕⥓'
    addAsymmetricRotation(chars)
    suffixMap = {
        [chars[0]]: '[facing=south,hinge=left,half=lower]',
        [chars[1]]: '[facing=east,hinge=left,half=lower]',
        [chars[2]]: '[facing=north,hinge=left,half=lower]',
        [chars[3]]: '[facing=west,hinge=left,half=lower]',
        [chars[4]]: '[facing=south,hinge=right,half=lower]',
        [chars[5]]: '[facing=east,hinge=right,half=lower]',
        [chars[6]]: '[facing=north,hinge=right,half=lower]',
        [chars[7]]: '[facing=west,hinge=right,half=lower]'
    }
    let door_lower = palleteWithSuffix(suffixMap, doors)

    return combinedPalette(trapdoors_opened, trapdoors_closed, door_upper, door_lower)
}

function makeStairs() {
    let base = ['minecraft:oak_stairs', 'minecraft:spruce_stairs', 'minecraft:birch_stairs', 'minecraft:jungle_stairs', 'minecraft:acacia_stairs', 'minecraft:dark_oak_stairs', 'minecraft:crimson_stairs', 'minecraft:warped_stairs']
    let stairsBottom = palleteWithRotation('ᙎᙐᙏᙓ', base.map(x => `${x}[half=bottom]`))
    let stairsTop = palleteWithRotation('ᙡᙣᙢᙦ', base.map(x => `${x}[half=top]`))
    return combinedPalette(stairsBottom, stairsTop)
}

function makeSlabs() {
    let base = ['minecraft:oak_slab', 'minecraft:spruce_slab', 'minecraft:birch_slab', 'minecraft:jungle_slab', 'minecraft:acacia_slab', 'minecraft:dark_oak_slab', 'minecraft:crimson_slab', 'minecraft:warped_slab']
    return combinedPalette(
        singleBlockPallete('ᖲ', base.map(x => `${x}[type=bottom]`)), 
        singleBlockPallete('ᖰ', base.map(x => `${x}[type=top]`))
    )
}

module.exports = makeFurniture