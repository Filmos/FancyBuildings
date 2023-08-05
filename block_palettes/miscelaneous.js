var { makeSingleBlockPallete, allVariants, makeSimplePalette, makePalleteWithRotation, palleteWithRotation, singleBlockPallete, makeCombinedPalette, overridePlacement, splitPalette, combinedPalette, combineVariants, addToAllVariants } = require('./common.js')

function makeBars() {
    makeSingleBlockPallete('bars', ':', [
        'minecraft:iron_bars', 
        'additionalbars:gold_bars', 
        [0.25, 'additionalbars:waxed_copper_bars'], 
        [0.25, 'additionalbars:waxed_exposed_copper_bars'], 
        [0.25, 'additionalbars:waxed_weathered_copper_bars'], 
        [0.25, 'additionalbars:waxed_oxidized_copper_bars'], 
        ['additionalbars:copper_bars', 'additionalbars:exposed_copper_bars', 'additionalbars:weathered_copper_bars', 'additionalbars:oxidized_copper_bars'],
        'additionalbars:crimson_bars', 
        'additionalbars:warped_bars', 
        [0.2, 'securitycraft:reinforced_iron_bars']
    ]);
}

function makeCeilingDecorations() {
    let palletes = ['minecraft:lantern', 'minecraft:soul_lantern', 'chipped:lantern_4', 'chipped:soul_lantern_3', 'chipped:lantern_1', 'chipped:soul_lantern_1', 'chipped:lantern_2', 'chipped:soul_lantern_2', 'supplementaries:brass_lantern', 'supplementaries:crimson_lantern', 'supplementaries:silver_lantern', 'supplementaries:lead_lantern', 'byg:glowstone_lantern', 'byg:therium_lantern', 'byg:cryptic_lantern']
    palletes = palletes.map(b => b+'[hanging=true]')
    palletes = palletes.concat(['torchmaster:dreadlamp', 'minecraft:bell[attachment=ceiling]', 'laserio:laser_connector[facing=up]', 'supplementaries:sack', 'mcwlights:white_ceiling_light', 'mcwlights:light_gray_ceiling_light', 'mcwlights:gray_ceiling_light', 'mcwlights:black_ceiling_light', 'utilitix:experience_crystal[facing=down]', 'simplylight:illuminant_panel[facing=down]', 'byg:witch_hazel_blossom', 'minecraft:spore_blossom'])

    let candles = ['supplementaries:candle_holder', 'supplementaries:candle_holder_yellow', 'supplementaries:candle_holder_orange', 'supplementaries:candle_holder_gray', 'supplementaries:candle_holder_black']
    for(let candle of candles) {
        for(let i of [1, 2, 3, 4]) 
            palletes.push([1/candles.length/2, `${candle}[candles=${i},face=ceiling]`])
    }

    makeSingleBlockPallete('ceiling_decor', '^', [palletes])
}

function makeFloralDecorations() {
    let palette = {
        chars: ['f', 'F'],
        blocks: [
            [
                ['byg:flowering_indigo_jacaranda_bush', 'byg:flowering_jacaranda_bush', 'byg:jacaranda_bush', 'byg:indigo_jacaranda_bush'],
                ['byg:jacaranda_leaves', 'byg:flowering_jacaranda_leaves', 'byg:indigo_jacaranda_leaves', 'byg:flowering_indigo_jacaranda_leaves']
            ], [
                ['botania:magenta_mystical_flower', 'botania:purple_mystical_flower', 'byg:allium_flower_bush', 'byg:pink_allium_flower_bush', 'minecraft:allium', 'minecraft:pink_tulip', 'byg:alpine_bellflower', 'byg:silver_vase_flower'],
                ['blue_skies:dusk_leaves', 'blue_skies:cherry_leaves', 'blue_skies:crescent_fruit_leaves', 'blue_skies:lunar_leaves', 'forbidden_arcanus:cherrywood_leaves'],
            ], [
                ['botania:red_mystical_flower', 'minecraft:poppy', 'minecraft:red_tulip', 'byg:lazarus_bellflower', 'byg:kovan_flower', 'byg:protea_flower', 'byg:rose', 'byg:torch_ginger', 'byg:pink_daffodil', 'byg:osiria_rose', 'byg:amaranth'],
                ['blue_skies:maple_leaves', 'chipped:acacia_leaves_9', 'ars_nouveau:red_archwood_leaves', 'chipped:jungle_leaves_9', 'chipped:birch_leaves_9', 'chipped:oak_leaves_9', 'chipped:spruce_leaves_9', 'byg:red_maple_leaves', 'byg:red_birch_leaves', 'byg:red_oak_leaves', 'byg:red_spruce_leaves', 'byg:zelkova_leaves']
            ], [
                ['twilightforest:rainbow_oak_sapling'],
                ['twilightforest:rainbow_oak_leaves']
            ], [
                ['minecraft:red_tulip', 'minecraft:orange_tulip', 'minecraft:white_tulip', 'minecraft:pink_tulip', 'byg:cyan_tulip', 'byg:green_tulip', 'byg:magenta_tulip', 'byg:purple_tulip', 'byg:yellow_tulip'],
                ['minecraft:oak_leaves', 'minecraft:spruce_leaves', 'minecraft:birch_leaves', 'minecraft:jungle_leaves', 'minecraft:acacia_leaves', 'minecraft:dark_oak_leaves', 'minecraft:azalea_leaves', 'byg:araucaria_leaves', 'byg:palm_leaves', 'byg:redwood_leaves'],
            ], [
                ['minecraft:acacia_sapling', 'minecraft:jungle_sapling', 'minecraft:birch_sapling', 'minecraft:spruce_sapling', 'minecraft:oak_sapling', 'byg:pine_sapling', 'byg:redwood_sapling', 'croptopia:cinnamon_sapling', 'myrtrees:rubberwood_sapling'],
                ['minecraft:oak_leaves', 'minecraft:spruce_leaves', 'minecraft:birch_leaves', 'minecraft:jungle_leaves', 'minecraft:acacia_leaves', 'minecraft:dark_oak_leaves', 'minecraft:azalea_leaves', 'byg:araucaria_leaves', 'byg:palm_leaves', 'byg:redwood_leaves']
            ], [
                ['minecraft:grass', 'minecraft:fern'],
                ['minecraft:oak_leaves', 'minecraft:spruce_leaves', 'minecraft:birch_leaves', 'minecraft:jungle_leaves', 'minecraft:acacia_leaves', 'minecraft:dark_oak_leaves', 'minecraft:azalea_leaves', 'byg:araucaria_leaves', 'byg:palm_leaves', 'byg:redwood_leaves']
            ], [
                ['byg:alpine_bellflower', 'minecraft:cornflower', 'botania:light_blue_mystical_flower', 'botania:cyan_mystical_flower', 'byg:violet_leather_flower', 'minecraft:blue_orchid', 'byg:blue_sage', 'byg:blue_spruce_sapling'],
                ['blue_skies:starlit_leaves', 'byg:blue_enchanted_leaves', 'blue_skies:bluebright_leaves', 'tconstruct:sky_slime_leaves', 'forbidden_arcanus:cherrywood_leaves']
            ], [
                ['byg:ether_sapling', 'byg:green_enchanted_sapling', 'byg:cyan_rose', 'byg:cyan_tulip'],
                ['byg:fir_leaves', 'byg:ether_leaves', 'integrateddynamics:menril_leaves', 'byg:blue_spruce_leaves']
            ], [
                ['byg:aspen_sapling', 'byg:lollipop_flower', 'byg:orange_amaranth', 'byg:orange_daisy', 'byg:california_poppy', 'byg:guzmania', 'byg:yellow_tulip', 'minecraft:dandelion', 'minecraft:orange_tulip'],
                ['chipped:jungle_leaves_7', 'chipped:oak_leaves_7', 'chipped:spruce_leaves_7', 'chipped:dark_oak_leaves_7', 'chipped:acacia_leaves_7', 'chipped:birch_leaves_7', 'byg:aspen_leaves', 'chipped:oak_leaves_8', 'chipped:jungle_leaves_8', 'chipped:dark_oak_leaves_8', 'chipped:acacia_leaves_8', 'chipped:birch_leaves_8', 'byg:yellow_birch_leaves', 'byg:yellow_spruce_leaves', 'byg:orange_birch_leaves', 'byg:orange_oak_leaves', 'byg:orange_spruce_leaves', 'byg:flowering_nightshade_leaves', 'byg:nightshade_leaves', 'byg:firecracker_leaves']
            ], [
                ['byg:snowdrops', 'byg:white_anemone', 'byg:white_sage', 'byg:angelica', 'byg:bistort', 'byg:winter_rose', 'botania:white_mystical_flower', 'minecraft:azure_bluet', 'minecraft:oxeye_daisy', 'minecraft:lily_of_the_valley', 'minecraft:white_tulip'],
                ['chipped:dark_oak_leaves_11', 'chipped:jungle_leaves_11', 'chipped:oak_leaves_11', 'chipped:spruce_leaves_11', 'blue_skies:frostbright_leaves', 'chipped:acacia_leaves_11']
            ]
        ]
    }
    palette['blocks'] = palette['blocks'].map(p => [p[0], p[1].map(b => b+'[persistent=true]')])
    let subPallettes = splitPalette(palette)
    makeCombinedPalette("floral", subPallettes["F"], overridePlacement(subPallettes["f"]))
    makeSingleBlockPallete("wood_stem", "⬝", [['absentbydesign:wall_acacia_log', [4, 'minecraft:potted_dead_bush'], 'absentbydesign:wall_birch_log', 'absentbydesign:wall_dark_oak_log', 'absentbydesign:wall_jungle_log', 'absentbydesign:wall_oak_log', 'absentbydesign:wall_spruce_log']])
    makeSingleBlockPallete("planter", "⬞", ['supplementaries:planter'])
}

function makeDeskDecor() {
    let deskDecor = [
        'minecraft:sea_pickle[pickles=1,waterlogged=false]', 'minecraft:sea_pickle[pickles=2,waterlogged=false]', 
        'ae2:tiny_tnt', 'minecraft:flower_pot', 'supplementaries:hourglass', 'supplementaries:jar', 'twilightforest:firefly_jar', 'supplementaries:urn', 'minecraft:lantern', 'minecraft:soul_lantern',
        'minecraft:redstone_wire[north=none,south=none,east=none,west=none]', 'supplementaries:gunpowder[north=none,south=none,east=none,west=none]',
        ...['supplementaries:present_%color%', 'supplementaries:trapped_present_%color%'].map(x=>[0.5, x]),
        'botania:%color%_floating_flower',
        'supplementaries:globe_sepia', 'supplementaries:globe', 'create:peculiar_bell', 'create:haunted_bell', 'supplementaries:statue' 
    ]
    let totalWeight = deskDecor.reduce((total, current) => total+(typeof current == "string" ? 1 : current[0]), 0)
    deskDecor.push([totalWeight*1.5, 'minecraft:air'])
    makeSimplePalette('desk_decor', overridePlacement(palleteWithRotation('⇣⇢⇡⇠', [deskDecor])))
}

function makeResourceBlocks() {
    let base = [
        ['thermal:fire_tnt', 'thermal:ice_tnt', 'thermal:lightning_tnt', 'thermal:phyto_tnt', 'thermal:ender_tnt', 'thermal:glowstone_tnt', 'thermal:redstone_tnt', 'thermal:slime_tnt'],
        ['minecraft:coal_ore', 'minecraft:iron_ore', 'minecraft:copper_ore', 'minecraft:gold_ore', 'minecraft:redstone_ore', 'minecraft:lapis_ore', 'minecraft:diamond_ore', 'minecraft:emerald_ore', 'alltheores:aluminum_ore', 'alltheores:nickel_ore', 'alltheores:lead_ore', 'alltheores:osmium_ore', 'alltheores:platinum_ore', 'alltheores:silver_ore', 'alltheores:tin_ore', 'alltheores:zinc_ore', 'alltheores:iridium_ore', 'securitycraft:iron_mine', 'securitycraft:gold_mine', 'securitycraft:emerald_mine', 'securitycraft:diamond_mine', 'ae2:quartz_ore', 'mysticalagriculture:prosperity_ore', 'mysticalagriculture:inferium_ore'],
        ['minecraft:deepslate_coal_ore', 'minecraft:deepslate_iron_ore', 'minecraft:deepslate_copper_ore', 'minecraft:deepslate_gold_ore', 'minecraft:deepslate_redstone_ore', 'minecraft:deepslate_emerald_ore', 'minecraft:deepslate_lapis_ore', 'minecraft:deepslate_diamond_ore', 'alltheores:aluminum_slate_ore', 'alltheores:lead_slate_ore', 'alltheores:nickel_slate_ore', 'alltheores:osmium_slate_ore', 'alltheores:platinum_slate_ore', 'alltheores:silver_slate_ore', 'alltheores:tin_slate_ore', 'alltheores:uranium_slate_ore', 'alltheores:zinc_slate_ore', 'alltheores:iridium_slate_ore', 'ae2:deepslate_quartz_ore', 'mysticalagriculture:deepslate_prosperity_ore', 'mysticalagriculture:deepslate_inferium_ore', 'securitycraft:deepslate_iron_mine', 'securitycraft:deepslate_gold_mine', 'securitycraft:deepslate_emerald_mine', 'securitycraft:deepslate_diamond_mine'],
        ['minecraft:cobblestone', 'minecraft:netherrack', 'minecraft:end_stone'],
        ['minecraft:stripped_oak_wood', 'minecraft:stripped_spruce_wood', 'minecraft:stripped_birch_wood', 'minecraft:stripped_jungle_wood', 'minecraft:stripped_acacia_wood', 'minecraft:stripped_dark_oak_wood', 'blue_skies:stripped_bluebright_wood', 'blue_skies:stripped_starlit_wood', 'blue_skies:stripped_frostbright_wood', 'blue_skies:stripped_lunar_wood', 'blue_skies:stripped_dusk_wood', 'blue_skies:stripped_maple_wood', 'blue_skies:stripped_cherry_wood', 'evilcraft:undead_wood_stripped', 'forbidden_arcanus:stripped_cherrywood', 'forbidden_arcanus:stripped_mysterywood', 'hexerei:stripped_mahogany_wood', 'hexerei:stripped_willow_wood', 'byg:stripped_blue_enchanted_wood', 'byg:stripped_bulbis_wood', 'byg:stripped_palo_verde_wood', 'twilightforest:stripped_mining_wood', 'byg:stripped_jacaranda_wood', 'byg:stripped_redwood_wood', 'twilightforest:stripped_twilight_oak_wood', 'twilightforest:stripped_canopy_wood', 'twilightforest:stripped_mangrove_wood', 'twilightforest:stripped_dark_wood', 'twilightforest:stripped_time_wood', 'twilightforest:stripped_transformation_wood'],
        ['supplementaries:soap_block'],
        ['minecraft:hay_block', 'farmersdelight:rice_bale', 'farmersdelight:straw_bale', 'supplementaries:flax_block', 'thermal:barley_block', 'thermal:flax_block'],
        ['minecolonies:composted_dirt', 'farmersdelight:organic_compost', 'farmersdelight:rich_soil'],
        ['farmersdelight:carrot_crate', 'farmersdelight:potato_crate', 'farmersdelight:beetroot_crate', 'farmersdelight:cabbage_crate', 'farmersdelight:tomato_crate', 'farmersdelight:onion_crate', 'thermal:corn_block', 'thermal:onion_block', 'thermal:radish_block', 'thermal:sadiroot_block', 'thermal:spinach_block', 'thermal:bell_pepper_block', 'thermal:eggplant_block', 'thermal:green_bean_block', 'thermal:hops_block', 'thermal:strawberry_block', 'thermal:tomato_block', 'thermal:apple_block', 'thermal:carrot_block', 'thermal:potato_block', 'thermal:beetroot_block'],
        ['thermal:rice_block', 'thermal:peanut_block', 'thermal:coffee_block', 'thermal:tea_block'],
        ['chipped:barrel_14', 'chipped:barrel_15', 'chipped:barrel_6', 'chipped:barrel_7'].reduce((a, b) => a.concat(["east", "west", "north", "south", "up"].map(x=>`${b}[facing=${x}]`)), []),
        ['botania:white_petal_block', 'botania:orange_petal_block', 'botania:magenta_petal_block', 'botania:light_blue_petal_block', 'botania:yellow_petal_block', 'botania:lime_petal_block', 'botania:pink_petal_block', 'botania:gray_petal_block', 'botania:light_gray_petal_block', 'botania:cyan_petal_block', 'botania:purple_petal_block', 'botania:blue_petal_block', 'botania:brown_petal_block', 'botania:green_petal_block', 'botania:red_petal_block', 'botania:black_petal_block', 'byg:white_petal_block', 'byg:blue_petal_block', 'byg:light_blue_petal_block', 'byg:purple_petal_block', 'byg:red_petal_block', 'byg:yellow_petal_block']
    ]

    makeSimplePalette('resource_block', {
        chars: ['᙭','᙮'],
        blocks: base.map(x => {
            return [x, [...x, [x.length*2, 'minecraft:air']]]
        })
    })
}

function makeKitchen() {
    const colors = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
    let modern = combinedPalette(
        palleteWithRotation('ᑧᑩᑨᑪ', colors.map(x => `cfm:${x}_kitchen_sink`)),
        palleteWithRotation('ᑌᑐᑎᑕ', colors.map(x => [`cfm:${x}_kitchen_drawer`, `cfm:${x}_kitchen_counter`]))
    )
    modern = addToAllVariants(modern, palleteWithRotation('ᑨᑪᑧᑩ', ['cookingforblockheads:oven']))
    let oldStyle = combinedPalette(
        palleteWithRotation('ᑨᑪᑧᑩ', colors.map(x => ['farmersdelight:stove',  ...['cookingforblockheads:cooking_table', 'cookingforblockheads:sink'].map(y => `${y}[has_color=true,color=${x}]`)])),
        palleteWithRotation('ᑎᑕᑌᑐ', colors.map(x => `cookingforblockheads:counter[has_color=true,color=${x}]`))
    )
    makeSimplePalette("kitchen_counter", overridePlacement(combineVariants(modern, oldStyle)))

    let utils = ['cookingforblockheads:milk_jar', 'cookingforblockheads:fruit_basket', 'cookingforblockheads:toaster', 'cookingforblockheads:cow_jar', 'farmersdelight:cooking_pot', 'farmersdelight:skillet'].reduce((full, cur) => full.concat(['south', 'east', 'west', 'north'].map(x => `${cur}[facing=${x}]`)), [])
    utils.push([utils.length*2, 'minecraft:air'])
    makeSingleBlockPallete('kitchen_top', 'ᐝ', [utils])

    let fridge = combinedPalette(
        combineVariants(
            palleteWithRotation('⮙⮘⮛⮚', ['cfm:freezer_light', 'cfm:freezer_dark']),
            palleteWithRotation('⮛⮚⮙⮘', ['cookingforblockheads:fridge'])
        ),
        combineVariants(
            palleteWithRotation('⮝⮜⮟⮞', ['cfm:fridge_light', 'cfm:fridge_dark']),
            palleteWithRotation('⮟⮞⮝⮜', ['cookingforblockheads:fridge'])
        )
    )
    makeSimplePalette("kitchen_fridge", fridge)
}

module.exports = function() {
    makeBars()
    makeCeilingDecorations()
    makeSingleBlockPallete('elevator', 'e', ['elevatorid:elevator_white', 'elevatorid:elevator_light_gray', 'elevatorid:elevator_gray', 'elevatorid:elevator_black'].map(f=>f+'[directional=false]'))
    makeSingleBlockPallete('bookshelf', '⬛', [['minecraft:bookshelf', 'chipped:bookshelf_1', 'chipped:bookshelf_2', 'chipped:bookshelf_3', 'chipped:bookshelf_4', 'chipped:bookshelf_5', 'chipped:bookshelf_6', 'chipped:bookshelf_7', 'chipped:bookshelf_8', 'chipped:bookshelf_9', 'chipped:bookshelf_10', 'chipped:bookshelf_11', 'chipped:bookshelf_12', 'chipped:bookshelf_13', 'chipped:bookshelf_14', 'chipped:bookshelf_15', 'chipped:bookshelf_16']])
    makeSingleBlockPallete('enchanting_table', '⬚', ['minecraft:enchanting_table'])
    makeSingleBlockPallete('enchanting_bookshelf', '⬜', [['minecraft:bookshelf', [0.035, 'botania:mana_pylon']]])
    makeFloralDecorations()
    makeSimplePalette('mob_head', overridePlacement(palleteWithRotation('↧↦↥↤', [[
        'tconstruct:spider_wall_head', 'tconstruct:drowned_wall_head', 'tconstruct:husk_wall_head', 'tconstruct:enderman_wall_head', 'minecraft:creeper_wall_head', 'tconstruct:blaze_wall_head', 'minecraft:zombie_wall_head', 'tconstruct:stray_wall_head', 'minecraft:skeleton_wall_skull', 'tconstruct:zombified_piglin_wall_head', 'tconstruct:piglin_brute_wall_head', 'tconstruct:piglin_wall_head', 'tconstruct:cave_spider_wall_head',
        ...['twilightforest:naga_wall_trophy', 'twilightforest:lich_wall_trophy', 'twilightforest:minoshroom_wall_trophy', 'twilightforest:hydra_wall_trophy', 'twilightforest:ur_ghast_wall_trophy', 'twilightforest:knight_phantom_wall_trophy', 'twilightforest:alpha_yeti_wall_trophy', 'twilightforest:snow_queen_wall_trophy', 'twilightforest:quest_ram_wall_trophy'].map(x => [0.2, x]),
        [0.05, 'botania:gaia_wall_head'],
        [2.5, "minecraft:air"]
    ]])))
    makePalleteWithRotation('utilities', '↡↠↟↞', [['minecraft:chipped_anvil', 'minecraft:anvil', 'integrateddynamics:logic_programmer', 'domum_ornamentum:architectscutter', 'corail_woodcutter:twilight_oak_woodcutter', 'powah:magmator_starter', 'powah:furnator_starter', 'tconstruct:crafting_station', 'apotheosis:salvaging_table', 'minecraft:damaged_anvil', 'powah:energy_cell_starter', 'mysticalagriculture:inferium_furnace', 'byg:redwood_crafting_table', 'byg:pine_crafting_table', 'byg:lament_crafting_table', 'byg:jacaranda_crafting_table', 'byg:holly_crafting_table', 'byg:sythian_crafting_table', 'tconstruct:part_builder', 'mysticalagriculture:basic_reprocessor', 'tconstruct:tinker_station', 'ironfurnaces:iron_furnace', 'utilitix:experience_crystal[facing=up]', 'cookingforblockheads:cooking_table', 'silentgear:material_grader', 'rftoolscontrol:programmer', 'charginggadgets:charging_station', 'silentgear:salvager', 'utilitix:crude_furnace', 'byg:embur_crafting_table', 'blue_skies:snowcap_oven', 'minecraft:furnace', 'minecraft:loom', 'minecraft:smoker', 'minecraft:blast_furnace', 'minecraft:cartography_table', 'minecraft:grindstone', 'minecraft:smithing_table', 'minecraft:stonecutter', 'minecraft:brewing_stand', 'minecraft:crafting_table', 'securitycraft:smoker_mine', 'securitycraft:furnace_mine', 'securitycraft:blast_furnace_mine']])
    makeSingleBlockPallete('table', 'ߠ', [['cfm:oak_table', 'cfm:spruce_table', 'cfm:birch_table', 'cfm:jungle_table', 'cfm:acacia_table', 'cfm:dark_oak_table', 'cfm:crimson_table', 'cfm:warped_table', 'cfm:stone_table', 'cfm:granite_table', 'cfm:diorite_table', 'cfm:andesite_table', 'cfm:stripped_oak_table', 'cfm:stripped_spruce_table', 'cfm:stripped_birch_table', 'cfm:stripped_jungle_table', 'cfm:stripped_acacia_table', 'cfm:stripped_dark_oak_table', 'cfm:stripped_crimson_table', 'cfm:stripped_warped_table'].map(x=>`${x}[waterlogged=false]`)])
    makeSingleBlockPallete('cake', 'ߑ', [[
        ...[1, 2, 3].map(i=>`farmersdelight:sweet_berry_cheesecake[bites=${i}]`), [6, 'farmersdelight:sweet_berry_cheesecake'], 
        ...['tconstruct:blood_cake', 'tconstruct:ender_cake', 'tconstruct:magma_cake', 'minecraft:cake', 'createaddition:chocolate_cake', 'createaddition:honey_cake', 'thermal:carrot_cake', 'thermal:chocolate_cake', 'thermal:potion_cake', 'thermal:spice_cake', 'tconstruct:earth_cake', 'tconstruct:sky_cake'].reduce((total, current) => [...total, [6, current], ...[ 1, 2, 3, 5].map(i=>`${current}[bites=${i}]`)], [])
    ]])
    makeSingleBlockPallete('chain', 'ߊ', ['minecraft:chain', 'additionallanterns:obsidian_chain', 'additionallanterns:basalt_chain', 'additionallanterns:andesite_chain', 'additionallanterns:diorite_chain', 'additionallanterns:granite_chain', 'additionallanterns:normal_sandstone_chain', 'additionallanterns:red_sandstone_chain', 'additionallanterns:smooth_stone_chain', 'additionallanterns:quartz_chain', 'additionallanterns:end_stone_chain', 'additionallanterns:prismarine_chain', 'additionallanterns:dark_prismarine_chain', 'additionallanterns:blackstone_chain', 'additionallanterns:normal_nether_bricks_chain', 'additionallanterns:red_nether_bricks_chain', 'additionallanterns:crimson_chain', 'additionallanterns:warped_chain', 'additionallanterns:purpur_chain', 'additionallanterns:bricks_chain', 'forbidden_arcanus:arcane_golden_chain', 'securitycraft:reinforced_chain'])
    makeSingleBlockPallete('campfire', 'ߍ', [['minecraft:soul_campfire', [4, 'minecraft:campfire'], 'occultism:spirit_campfire', 'byg:boric_campfire', 'byg:cryptic_campfire']])
    makeSingleBlockPallete('composter', 'ߛ', ['minecraft:composter'])
    makeSingleBlockPallete('moss', 'ߎ', ['minecraft:moss_block'])
    makeDeskDecor()
    makePalleteWithRotation('trapdoor', '⥐⥏⥎⥑', ['minecraft:iron_trapdoor', 'everythingcopper:copper_trapdoor', 'supplementaries:lead_trapdoor', 'supplementaries:silver_trapdoor', 'minecraft:dark_oak_trapdoor', 'minecraft:spruce_trapdoor'].map(x=>`${x}[half=top]`))
    makeSimplePalette('mirror', overridePlacement(palleteWithRotation('ᑭᓇᑯᓀ', ['minecraft:light_gray_wall_banner{Patterns: [{Pattern: "dls", Color: 0}, {Pattern: "gru", Color: 3}, {Pattern: "gra", Color: 0}, {Pattern: "bo", Color: 15}]}'])))
    makeResourceBlocks()
    makePalleteWithRotation('smart_storage', 'ᕕᕙᕓᕗ', ['toms_storage:ts.crafting_terminal', 'toms_storage:ts.storage_terminal'].map(x=>`${x}[pos=down]`))
    makeSingleBlockPallete('smart_storage_connector', 'ᕔ', ['toms_storage:ts.inventory_connector'])
    makeKitchen()
}