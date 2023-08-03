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
    addAsymmetricRotation(chars) {
        mappingRotate[chars[0]] = chars[3]
        mappingRotate[chars[1]] = chars[0]
        mappingRotate[chars[2]] = chars[1]
        mappingRotate[chars[3]] = chars[2]
        mappingRotate[chars[4]] = chars[7]
        mappingRotate[chars[5]] = chars[4]
        mappingRotate[chars[6]] = chars[5]
        mappingRotate[chars[7]] = chars[6]

        mappingFlipX[chars[0]] = chars[4]
        mappingFlipX[chars[1]] = chars[7]
        mappingFlipX[chars[2]] = chars[6]
        mappingFlipX[chars[3]] = chars[5]
        mappingFlipX[chars[4]] = chars[0]
        mappingFlipX[chars[7]] = chars[1]
        mappingFlipX[chars[6]] = chars[2]
        mappingFlipX[chars[5]] = chars[3]

        mappingFlipY[chars[0]] = chars[6]
        mappingFlipY[chars[1]] = chars[5]
        mappingFlipY[chars[2]] = chars[4]
        mappingFlipY[chars[3]] = chars[7]
        mappingFlipY[chars[6]] = chars[0]
        mappingFlipY[chars[5]] = chars[1]
        mappingFlipY[chars[4]] = chars[2]
        mappingFlipY[chars[7]] = chars[3]
    },
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