$$ = require('./multiplo.js')
out = 'dist'
$$.clear(out)
$$.clone('src/static', out)
out += '/data/lostcities/lostcities'

const { allVariants } = require('./block_palettes/common.js')
const { generatePalettes } = require('./block_palettes/index.js')
customCode = ""

function sanitizeName(name) {
    return name.replace(/[: _"'{}\][]/g, '_').toLowerCase()
}

(function make_glass_variants() {
    let variants = [
        ["connectedglass:borderless_glass", "connectedglass:borderless_glass_pane"],
        ["connectedglass:clear_glass", "connectedglass:clear_glass_pane"],
        ["connectedglass:scratched_glass", "connectedglass:scratched_glass_pane"],
        ["create:tiled_glass", "create:tiled_glass_pane"],
        ["create:framed_glass", "create:framed_glass_pane"],
        ["create:horizontal_framed_glass", "create:horizontal_framed_glass_pane"],
        ["create:vertical_framed_glass", "create:vertical_framed_glass_pane"],
        ["tconstruct:seared_glass", "tconstruct:seared_glass_pane"],
        ["tconstruct:scorched_glass", "tconstruct:scorched_glass_pane"],
        ["tconstruct:soul_glass", "tconstruct:soul_glass_pane"],
        ["tconstruct:clear_tinted_glass", "connectedglass:scratched_glass_black_pane"],
        ["connectedglass:tinted_borderless_glass", "connectedglass:scratched_glass_black_pane"],
        ["industrialforegoing:dark_glass", "connectedglass:scratched_glass_black_pane"],
        ["mob_grinding_utils:tinted_glass", "connectedglass:scratched_glass_black_pane"],
    ]
    let colored_variants = [
        ["connectedglass:borderless_glass_$", "connectedglass:borderless_glass_$_pane"],
        ["connectedglass:clear_glass_$", "connectedglass:clear_glass_$_pane"],
        ["connectedglass:scratched_glass_$", "connectedglass:scratched_glass_$_pane"],
        ["mcwwindows:$_mosaic_glass", "connectedglass:scratched_glass_$_pane"],
        ["connectedglass:tinted_borderless_glass_$", "connectedglass:scratched_glass_$_pane"]
    ]
    for (let i in [2, 5, 6, 7, 8, 9, 10]) colored_variants.push(["chipped:$_stained_glass_" + i, "chipped:$_stained_glass_pane_" + i])
    for (let scheme of [[["white", "gray", "light_gray", "black"], 0.12], [["orange", "magenta", "light_blue", "yellow", "lime", "pink", "cyan", "purple", "blue", "brown", "green", "red"], 0.03]])
        for (let color of scheme[0])
            for (let base of colored_variants) variants.push([base[0].replace(/\$/g, color), base[1].replace(/\$/g, color), scheme[1]])

    for (let v of variants) {
        let filename = sanitizeName(v[0]+'_'+v[1])
        let glass_block = v[0]
        let glass_pane = v[1]
        let glass_variant_factor = v[2] || 1
        eval($$.create('src/glass.json', out + '/palettes/glass_' + filename + '.json'))
    }
})();

generatePalettes();
eval($$.create('src/style.json', out + '/styles/standard.json'));
eval($$.create('src/fancyBuildings.js', 'dist/server_scripts/fancyBuildings.js'));

(function make_floor_structures() {require('./structure_generation/main.js')})();


$$.clear('D:/Games/curseforge/minecraft/Instances/All the Mods 7 - ATM7/kubejs/data/lostcities')
$$.clone('dist', 'D:/Games/curseforge/minecraft/Instances/All the Mods 7 - ATM7/kubejs')
console.log('Done!')