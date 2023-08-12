var fs = require('fs')
var transformers = require('./transformers.js')
var {overlap, replaceAt, calcOffset, randomSelection, shuffle } = require('./utils.js')
const { FLOOR_COUNT, SIDE_EFFECT_REGULARIZATION } = require('./parametrization.js')
const InnerWallWorker = require('./innerWallWorker.js')

class FeatureGroup {
    constructor(name, features) {
        this.name = name
        this.features = features
        this.placedCounter = 0
        this.weight = Math.round(Math.sqrt(features[0].size[0]*features[0].size[1]))

        if(!FeatureGroup.groups) FeatureGroup.groups = []
        FeatureGroup.groups.push(this)
    }

    tryPlace(floor, x, y) {
        for(let feature of shuffle(this.features)) {
            let {result} = feature.matches(floor.projection, x, y)
            if(result) {
                feature.overlap(floor, x, y)
                this.placedCounter+=this.weight
                return true
            }
        }
        return false
    }

    static random(count) {
        return ()=>randomSelection(this.groups, count)
    }

    static lowest(count) {
        return () => {
            if(this.groups.length < count) return this.groups

            let lowerBound = -1
            let result = []
            while(result.length < count) {
                let min = 1e9
                let minVals = []
                for(let group of this.groups) {
                    if(group.placedCounter < min && group.placedCounter > lowerBound) {
                        min = group.placedCounter
                        minVals = [group]
                    } else if(group.placedCounter == min) {
                        minVals.push(group)
                    }
                }
                result.push(...randomSelection(minVals, count-result.length))
                lowerBound = min
            }
            return result
        }
    }

    static load() {
        for (let file of fs.readdirSync('src/structure/features')) {
            let features = []
            let raw = JSON.parse(fs.readFileSync('src/structure/features/' + file))
            let feature = new Feature(raw.slices, raw.requirements, raw.projection, file.split('.')[0])
            features.push(feature)

            let flagMap = {}
            flagMap[feature.hash()] = true
            for(let t of transformers) {
                let sub_feature = feature.clone_with_transform(t)
                if(flagMap[sub_feature.hash()]) continue
                flagMap[sub_feature.hash()] = true
                features.push(sub_feature)
            }

            new FeatureGroup(file.split('.')[0], features)
        }
    }
}

class Feature {
    constructor(structure, requirements, projection, name) {
        this.name = name
        this.structure = structure
        this.requirements = requirements
        this.projection = overlap(
            JSON.parse(JSON.stringify(requirements).replace(/\*/g, "?")), 
            projection,
            calcOffset(this.requirements, projection)[0],
            calcOffset(this.requirements, projection)[1]
        )
    }

    clone_with_transform(transformer) {
        return new Feature(
            this.structure.map(slice => transformer(slice)), 
            transformer(this.requirements), 
            transformer(this.projection), 
            this.name+" ("+transformer.name.replace(/_/g, " ").replace("bound ", "")+")"
        )
    }

    hash() {
        return JSON.stringify([this.structure, this.requirements, this.projection])
    }

    get size() {
        return [this.requirements[0].length, this.requirements.length]
    }

    matches(projection, x, y) {
        if(x+this.requirements[0].length > projection[0].length) return {result: false}
        if(y+this.requirements.length > projection.length) return {result: false}

        for(let i=0;i<this.requirements.length;i++) {
            for(let j=0;j<this.requirements[i].length;j++) {
                let req = this.requirements[i][j]
                let state = projection[y+i][x+j]
                
                if(req == "*" || req == state) continue
                if(state == "?" && req != "#") continue
                return {result: false}
            }
        }
        return {result: true}
    }

    overlap(floor, x, y) {
        overlap(floor.projection, this.projection, x, y)
        let offset = calcOffset(this.projection, this.structure[0])
        for(let i of [0, 1, 2]) {
            overlap(floor.structure[i*1+1], this.structure[i], x+offset[0], y+offset[1], false, postProcess)
        }
    }
}
function postProcess(block) {
    const blockMapping = {
        "1": ()=>{return Math.floor(Math.random()*8+1)},
    }
    if(!blockMapping[block]) return block
    return blockMapping[block]()
}

class PositionRandomizer {
    constructor(floor) {
        const generateArray = (m, n) =>
            Array.from({ length: m }, (_, i) =>
                Array.from({ length: n }, (_, j) => [i, j])
            ).flat();
        this.base = generateArray(floor.structure[0][0].length, floor.structure[0].length)
        shuffle(this.base)
        this.index = 0
    }

    * get() {
        let startIndex = this.index
        do {
            let currentIdex = this.index;
            if(++this.index >= this.base.length) this.index = 0;
            yield this.base[currentIdex];
        } while(this.index != startIndex)
    }
}

class WaveWorker {
    constructor(buildingBase) {
        this.floor = buildingBase.make_floor()
        this.lastCheck = 0
    }

    cleanUpStructure() {
        for(let y=0;y<this.floor.projection.length;y++) this.floor.projection[y] = this.floor.projection[y].replace(/\?/g, " ")

        for(let i of [1, 2, 3]) {
            for(let y=0;y<this.floor.structure[i].length;y++) {
                for(let x=0;x<this.floor.structure[i][y].length;x++) {
                    if(this.floor.structure[i][y][x] != "?") continue 
                    let newChar = this.floor.projection[y][x]==" "?" ":"#"
                    if(newChar == "#") {
                        console.log("!!!!!!!!")
                    }
                    this.floor.structure[i][y] = replaceAt(this.floor.structure[i][y], x, newChar)
                }
            }
        }
    }

    * getFeatures() {
        let phases = [
            FeatureGroup.lowest(7),
            FeatureGroup.random(3),
            FeatureGroup.lowest(3),
            FeatureGroup.random(3),
            FeatureGroup.lowest(23)
        ]

        for(let phase of phases) {
            let targets = phase()
            for(let target of targets)
                yield target
        }
    }

    generate() {
        let subWorker = new InnerWallWorker(this.floor.structure, this.floor.projection)
        subWorker.apply()

        let positionRandomizer = new PositionRandomizer(this.floor)
        for(let feature of this.getFeatures()) {
            for(let [x, y] of positionRandomizer.get()) {
                if(feature.tryPlace(this.floor, x, y)) break
            }
        }
        
        this.cleanUpStructure()
        return this.floor
    }

}

function logNow(arg) {
    console.log(JSON.parse(JSON.stringify(arg)))
}

FeatureGroup.load()
function generate_floors(building) {
    let generatedFloors = []
    for(let _=0;_<FLOOR_COUNT;_++) {
        let floor = new WaveWorker(building).generate()
        generatedFloors.push(floor)
    }
    console.log("----------------------------------")
    console.log(FeatureGroup.groups.sort((a, b)=>a.placedCounter-b.placedCounter).map(g=>`${g.name}: ${g.placedCounter}`).join("\n"))
    return generatedFloors
}

module.exports = generate_floors