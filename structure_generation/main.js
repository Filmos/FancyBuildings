$$ = require('../multiplo.js')
var get_building_bases = require('./building_base.js')
var generate_floors = require('./floor_generation.js')

src = 'src'

function save_building(building, floors) {
    let floorsStruct = []
    for(let floor of floors) {
        let slices = floor.structure
        let filename = `building_${floor.buildingId}_${floor.floorId}`
        eval($$.create(src+'/floor.json', `${out}/parts/${filename}.json`))
        floorsStruct.push({"top": false, "part": filename})
    }
    eval($$.create(src+'/building.json', `${out}/buildings/building_${building.buildingId}.json`))
}

function current_time() {
    let date = new Date()
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function generate_structures() {
    let buildings = get_building_bases()
    for(let b in buildings) {
        let building = buildings[b]
        console.log(`[${current_time()}] Generating building ${building.buildingId}... (${b*1+1}/${buildings.length})`)
        save_building(building, generate_floors(building))
    }

    buildings = buildings.map(building => ({"factor": 1.0, "value": 'building_'+building.buildingId}))
    eval($$.create(src+'/citystyle.json', `${out}/citystyles/citystyle_common.json`))
}
generate_structures()