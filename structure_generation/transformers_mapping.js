let mappingRotate = {
    "s": "d",
    "S": "D",
    "d": "S",
    "D": "s",
    "⇊": "⇇",
    "⇈": "⇉",
    "⇇": "⇈",
    "⇉": "⇊"
}
let mappingFlipX = {
    "d": "D",
    "D": "d",
    "⇇": "⇉",
    "⇉": "⇇"
}
let mappingFlipY = {
    "s": "S",
    "S": "s",
    "⇊": "⇈",
    "⇈": "⇊"
}

module.exports = {
    mappingFlipX, mappingFlipY, mappingRotate,
    addRotation(chars) {
        mappingFlipX[chars[1]] = chars[3]
        mappingFlipX[chars[3]] = chars[1]
        mappingFlipY[chars[0]] = chars[2]
        mappingFlipY[chars[2]] = chars[0]
        mappingRotate[chars[0]] = chars[3]
        mappingRotate[chars[1]] = chars[0]
        mappingRotate[chars[2]] = chars[1]
        mappingRotate[chars[3]] = chars[2]
    },
    addHalfRotation(chars) {
        mappingRotate[chars[0]] = chars[1]
        mappingRotate[chars[1]] = chars[0]
    }
}