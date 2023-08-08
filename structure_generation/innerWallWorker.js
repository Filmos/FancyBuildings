Block = {
    Wall: 0,
    MustWall: 1,
    Empty: 2,
    MustEmpty: 3,
    OutOfBounds: 4,

    CanRemoveVertically: 0,
    CanRemoveHorizontally: 1,


    CanPlaceVertically: 0,
    CanPlaceHorizontally: 1,
}

class InnerWallWorker {
    constructor(structure, projection) {
        this.structure = structure;
        this.projection = projection;
        this.floor = this._parseStructure(this.structure);
    }

    apply() {
        this.initalFloor = JSON.parse(JSON.stringify(this.floor))
        // let startTime = Date.now();
        this._generateRooms(this.floor)
        // let roomTime = Date.now();
        this._removeTwoTwoWalls(this.floor)
        // let thinTime = Date.now();
        this._mergeRooms(this.floor)
        this._removeTwoTwoWalls(this.floor)
        // let mergeTime = Date.now();
        this._cleanUp(this.floor, this.initalFloor)

        this._checkMap(this.floor);

        this._placeDoors(this.floor)
        // let placeTime = Date.now();
        this._updateStructure(this.structure, this.projection)
        // let updateTime = Date.now();
        // let finishTime = Date.now()
        // console.log("_generateRooms", roomTime - startTime)
        // console.log("_removeTwoTwoWalls", thinTime - roomTime)
        // console.log("_mergeRooms", mergeTime - thinTime)
        // console.log("_placeDoors", placeTime - mergeTime)
        // console.log("_updateStructure", updateTime - placeTime)
        // console.log("total", finishTime - startTime)
    }

    _parseStructure(structure) {
        let floor = new Array(structure[0].length).fill(0).map(x => new Array(structure[0][0].length))

        function isEmpty(ch) {
            return " b?".includes(ch);
        }

        for (let y = 0; y < structure[0].length; y++) {
            for (let x = 0; x < structure[0][y].length; x++) {
                let pr = this.projection[y][x];
                let ch0 = structure[0][y][x];
                let ch1 = structure[1][y][x];
                let ch2 = structure[2][y][x];

                /*if('#:'.includes(pr)) floor[y][x] = Block.MustWall;
                else if(' '.includes(pr) && !isEmpty(ch0) && !"-_=wsSdD:".includes(ch0)) floor[y][x] = Block.OutOfBounds;
                else if(' '.includes(pr)) floor[y][x] = Block.MustEmpty;
                else if('?'.includes(pr)) floor[y][x] = Block.Empty;
                else throw ["unknown block", pr,ch0,ch1,ch2]*/

                if ('#:'.includes(pr)) floor[y][x] = Block.MustWall;
                else if ('?'.includes(pr)) floor[y][x] = Block.Empty;
                else if (!"#X$e".includes(ch0)) floor[y][x] = Block.OutOfBounds;
                else if (' '.includes(pr)) floor[y][x] = Block.MustEmpty;

                // if (isEmpty(ch0) || "-_=wsSdD:".includes(ch0)) floor[y][x] = Block.OutOfBounds;
                // else if ("?".includes(ch1) && isEmpty(ch2)) floor[y][x] = Block.Empty;
                // else if (" ".includes(ch1)) floor[y][x] = Block.MustEmpty;
                // else floor[y][x] = Block.MustWall;
            }
        }
        return floor;
    }

    _updateStructure(structure, projection) {
        let structure3d = structure.map(x => x.map(y => y.split('')))
        let projection2d = projection.map(y => y.split(''))

        for (let y = 0; y < this.floor.length; y++) {
            let newStr = "";
            for (let x = 0; x < this.floor[y].length; x++) {
                if (this.floor[y][x] != this.initalFloor[y][x]) {
                    switch (this.floor[y][x]) {
                        case Block.Wall:
                        case Block.MustWall:
                            structure3d[1][y][x] = "#"
                            structure3d[2][y][x] = "#"
                            structure3d[3][y][x] = "#"
                            projection2d[y][x] = "#"
                            break;
                        case Block.MustEmpty:
                            structure3d[1][y][x] = " "
                            structure3d[2][y][x] = " "
                            structure3d[3][y][x] = " "
                            projection2d[y][x] = " "
                            break;
                    }
                }
            }
        }
        for (let ch = 0; ch < structure.length; ch++) {
            for (let y = 0; y < structure[ch].length; y++) {
                structure[ch][y] = structure3d[ch][y].join('')
            }
        }
        for (let y = 0; y < projection.length; y++) {
            projection[y] = projection2d[y].join('')
        }
    }


    _generateRooms(m) {
        let quicksaveMap = this._get(m)
        let rooms = [];
        let maxTries = 2;
        for (let tries = 0; tries < maxTries; tries++) {
            rooms.length = 0;
            for (let times = 0; times < 30; times++) {
                this._tryPlaceRoom(Math.floor(4 + Math.random() * (times * .8 + 1)), Math.floor(4 + Math.random() * (times * .8 + 1)), m, rooms);
            }
            if (rooms.length > 3) break;
            else if (tries < maxTries - 1) this._set(quicksaveMap, m);
        }
    }

    _removeTwoTwoWalls(floor) {
        function isU(x, y) {
            if (
                (//false &&
                    (floor[y][x - 1] == Block.Wall || floor[y][x - 1] == Block.MustWall) &&
                    (floor[y][x + 1] == Block.Wall || floor[y][x + 1] == Block.MustWall) &&
                    (floor[y - 1][x - 1] == Block.Wall || floor[y - 1][x - 1] == Block.MustWall) &&
                    (floor[y - 1][x] == Block.Wall || floor[y - 1][x] == Block.MustWall) &&
                    (floor[y - 1][x + 1] == Block.Wall || floor[y - 1][x + 1] == Block.MustWall) &&
                    (floor[y + 1][x] == Block.Empty || floor[y + 1][x] == Block.MustEmpty)
                ) || (//false &&
                    (floor[y + 1][x - 1] == Block.Wall || floor[y + 1][x - 1] == Block.MustWall) &&
                    (floor[y + 1][x] == Block.Wall || floor[y + 1][x] == Block.MustWall) &&
                    (floor[y][x - 1] == Block.Wall || floor[y][x - 1] == Block.MustWall) &&
                    (floor[y][x + 1] == Block.Empty || floor[y][x + 1] == Block.MustEmpty) &&
                    (floor[y - 1][x - 1] == Block.Wall || floor[y - 1][x - 1] == Block.MustWall) &&
                    (floor[y - 1][x] == Block.Wall || floor[y - 1][x] == Block.MustWall)
                ) || (
                    (floor[y + 1][x - 1] == Block.Wall || floor[y + 1][x - 1] == Block.MustWall) &&
                    (floor[y + 1][x] == Block.Wall || floor[y + 1][x] == Block.MustWall) &&
                    (floor[y + 1][x + 1] == Block.Wall || floor[y + 1][x + 1] == Block.MustWall) &&
                    (floor[y][x - 1] == Block.Wall || floor[y][x - 1] == Block.MustWall) &&
                    (floor[y][x + 1] == Block.Wall || floor[y][x + 1] == Block.MustWall) &&
                    (floor[y - 1][x] == Block.Empty || floor[y - 1][x] == Block.MustEmpty)
                ) || (
                    (floor[y + 1][x] == Block.Wall || floor[y + 1][x] == Block.MustWall) &&
                    (floor[y + 1][x + 1] == Block.Wall || floor[y + 1][x + 1] == Block.MustWall) &&
                    (floor[y][x - 1] == Block.Empty || floor[y][x - 1] == Block.MustEmpty) &&
                    (floor[y][x + 1] == Block.Wall || floor[y][x + 1] == Block.MustWall) &&
                    (floor[y - 1][x] == Block.Wall || floor[y - 1][x] == Block.MustWall) &&
                    (floor[y - 1][x + 1] == Block.Wall || floor[y - 1][x + 1] == Block.MustWall)
                )
            ) return true
            return false
        }
        function isCorner(x, y) {
            if (
                (//horizontal
                    (floor[y][x + 1] == Block.Wall || floor[y][x + 1] == Block.MustWall) &&
                    (floor[y - 1][x] == Block.Wall || floor[y - 1][x] == Block.MustWall) &&
                    (floor[y + 1][x] == Block.Empty || floor[y + 1][x] == Block.MustEmpty) &&
                    (floor[y + 1][x - 1] == Block.Empty || floor[y + 1][x - 1] == Block.MustEmpty) &&
                    (floor[y][x - 1] == Block.Empty || floor[y][x - 1] == Block.MustEmpty)
                ) || (
                    (floor[y + 1][x] == Block.Wall || floor[y + 1][x] == Block.MustWall) &&
                    (floor[y][x - 1] == Block.Empty || floor[y][x - 1] == Block.MustEmpty) &&
                    (floor[y][x + 1] == Block.Wall || floor[y][x + 1] == Block.MustWall) &&
                    (floor[y - 1][x - 1] == Block.Empty || floor[y - 1][x - 1] == Block.MustEmpty) &&
                    (floor[y - 1][x] == Block.Empty || floor[y - 1][x] == Block.MustEmpty)
                ) || (
                    (floor[y + 1][x] == Block.Empty || floor[y + 1][x] == Block.MustEmpty) &&
                    (floor[y + 1][x + 1] == Block.Empty || floor[y + 1][x + 1] == Block.MustEmpty) &&
                    (floor[y][x - 1] == Block.Wall || floor[y][x - 1] == Block.MustWall) &&
                    (floor[y][x + 1] == Block.Empty || floor[y][x + 1] == Block.MustEmpty) &&
                    (floor[y - 1][x] == Block.Wall || floor[y - 1][x] == Block.MustWall)
                ) || (
                    (floor[y + 1][x] == Block.Wall || floor[y + 1][x] == Block.MustWall) &&
                    (floor[y][x - 1] == Block.Wall || floor[y][x - 1] == Block.MustWall) &&
                    (floor[y][x + 1] == Block.Empty || floor[y][x + 1] == Block.MustEmpty) &&
                    (floor[y - 1][x] == Block.Empty || floor[y - 1][x] == Block.MustEmpty) &&
                    (floor[y - 1][x + 1] == Block.Empty || floor[y - 1][x + 1] == Block.MustEmpty)
                )
            ) return true
            return false
        }
        for (let y = 1; y < floor.length - 1; y++) {
            for (let x = 1; x < floor[y].length - 1; x++) {
                if (floor[y][x] == Block.Wall) {

                    let queue = [[x, y]]
                    while (queue.length > 0) {
                        let pos = queue.pop()
                        let x = pos[0]
                        let y = pos[1]
                        if (floor[y][x] == Block.Wall && (isCorner(x, y) || isU(x, y))) {

                            floor[y][x] = Block.Empty;
                            if (x > 1) queue.push([x - 1, y])
                            if (y > 1) queue.push([x, y - 1])
                            if (x < floor[0].length - 2) queue.push([x + 1, y])
                            if (y < floor.length - 2) queue.push([x, y + 1])

                        }
                        if (queue.length > 200) throw queue
                    }
                }
            }
        }
    }

    _mergeRooms(floor) {
        let pillarLeftChance = 0.4
        let targetRoomCount;
        let newRoomSizeToSmallerRoomRatio = 0.4
        let m = floor;
        let rooms = this._getAreas(floor, function (x, y, floor) {
            return floor[y][x] == Block.Empty || floor[y][x] == Block.MustEmpty
        })

        let { removeMap } = this._getRemovableWalls(rooms.areasMap, floor);

        for (let y = 1; y < m.length - 1; y++) {
            for (let x = 1; x < m[y].length - 1; x++) {
                if (m[y][x] == Block.Wall && removeMap[y][x] == null) {
                    if (Math.random() < pillarLeftChance) {
                        m[y][x] = Block.MustWall
                    }
                }
            }
        }

        let floorArea = 0
        for (let y = 0; y < floor.length; y++) {
            for (let x = 0; x < floor[y].length; x++) {
                if (floor[y][x] == Block.Empty || floor[y][x] == Block.MustEmpty) {
                    floorArea++;
                }
            }
        }
        if (floorArea > 120) targetRoomCount = 4;
        else if (floorArea > 100) targetRoomCount = 3;
        else targetRoomCount = 2;
        if (Math.random() > .7) targetRoomCount--;
        if (Math.random() > .8) targetRoomCount++;


        for (let times = 0; times < 10; times++) {
            let rooms = this._getAreas(m, function (x, y, m) {
                return m[y][x] == Block.Empty || m[y][x] == Block.MustEmpty
            })
            if (rooms.areaSizes.length <= targetRoomCount) {
                break;
            }

            let { removeMap } = this._getRemovableWalls(rooms.areasMap, m);

            let wallsFound = this._getAreas(removeMap, function (x, y, m) { return m[y][x] != null })
            let wallsMap = wallsFound.areasMap;
            let wallSizes = wallsFound.areaSizes;
            let wallLocations = wallsFound.areaLocations;
            let walls = []
            for (let wallSize of wallSizes) {
                let wallId = walls.length;
                let roomAId, roomBId;
                let wallLocation = wallLocations[wallId];
                let wallX = wallLocation[0];
                let wallY = wallLocation[1];
                if (removeMap[wallY][wallX] == Block.CanRemoveHorizontally) {
                    roomAId = rooms.areasMap[wallY][wallX + 1]
                    roomBId = rooms.areasMap[wallY][wallX - 1]
                } else {
                    roomAId = rooms.areasMap[wallY + 1][wallX]
                    roomBId = rooms.areasMap[wallY - 1][wallX]
                }
                let smallerRoomSize = Math.min(rooms.areaSizes[roomAId], rooms.areaSizes[roomBId])
                let newRoomSize = rooms.areaSizes[roomAId] + rooms.areaSizes[roomBId]

                walls.push([wallId, wallSize, newRoomSize, smallerRoomSize])
            }
            if (walls.length == 0) break;
            if (walls.filter(x => x[1] > 1).length > 0) walls = walls.filter(x => x[1] > 1)
            if (walls.filter(x => x[1] > 2).length > 0) walls = walls.filter(x => x[1] > 2)
            walls = walls.sort((a, b) => ((a[2] * newRoomSizeToSmallerRoomRatio + a[3] * (1 - newRoomSizeToSmallerRoomRatio)) - (b[2] * newRoomSizeToSmallerRoomRatio + b[3] * (1 - newRoomSizeToSmallerRoomRatio))))

            let wallToDestroy = walls[0]
            if (Math.random() > .8) wallToDestroy = walls[Math.floor(Math.random() * walls.length)]
            let wallToDestroyLocation = wallLocations[wallToDestroy[0]]

            for (let y = 1; y < m.length - 1; y++) {
                for (let x = 1; x < m[y].length - 1; x++) {
                    if (wallsMap[y][x] == wallToDestroy[0]) {
                        m[y][x] = Block.MustEmpty
                    }
                }
            }
        }
    }

    _checkMap(floor){
        let rooms = this._getAreas(floor, function (x, y, floor) {
            return floor[y][x] == Block.Empty || floor[y][x] == Block.MustEmpty
        })
        if (rooms.areaSizes.length == 1) this.fail = true;
    }

    _placeDoors(floor) {
        for (let tries = 0; tries < 6; tries++) {
            let rooms = this._getAreas(floor, function (x, y, floor) {
                return floor[y][x] == Block.Empty || floor[y][x] == Block.MustEmpty
            })
            if (rooms.areaSizes.length == 1) break;

            let doorPlacements = []
            for (let y = 1; y < floor.length - 1; y++) {
                for (let x = 1; x < floor[y].length - 1; x++) {
                    let ra = rooms.areasMap;
                    let fl = floor;
                    if (fl[y][x] !== Block.Wall) continue;
                    if (ra[y + 1][x] != ra[y - 1][x] && ra[y + 1][x] != -1 && ra[y - 1][x] != -1
                        && (fl[y][x + 1] == Block.Wall || fl[y][x + 1] == Block.MustWall) && (fl[y][x - 1] == Block.Wall || fl[y][x - 1] == Block.MustWall)) {
                        doorPlacements.push([x, y, 0, null, 1])
                    }
                    if (ra[y][x + 1] != ra[y][x - 1] && ra[y][x + 1] != -1 && ra[y][x - 1] != -1
                        && (fl[y + 1][x] == Block.Wall || fl[y + 1][x] == Block.MustWall) && (fl[y - 1][x] == Block.Wall || fl[y - 1][x] == Block.MustWall)) {
                        doorPlacements.push([x, y, 1, null, 1])
                    }
                    if (ra[y + 1][x] != ra[y - 1][x] && ra[y + 1][x] != -1 && ra[y - 1][x] != -1) {
                        doorPlacements.push([x, y, 0, null, 0])
                    }
                    if (ra[y][x + 1] != ra[y][x - 1] && ra[y][x + 1] != -1 && ra[y][x - 1] != -1) {
                        doorPlacements.push([x, y, 1, null, 0])
                    }
                }
            }
            if (doorPlacements.length == 0) {
                return;
            }
            if (doorPlacements.filter(_ => _[4] == 1).length > 0) {
                doorPlacements = doorPlacements.filter(_ => _[4] == 1)
            }
            let weightedDoorPlacements = [];
            for (let el of doorPlacements) {
                let x = el[0]
                let y = el[1]
                let weight = 9 - Math.floor(Math.sqrt((x - 7) ** 2 + (y - 7) ** 2) + Math.random() * 2);
                for (let i = 0; i < weight; i++) {
                    weightedDoorPlacements.push([x, y, el[2], weight])
                }
            }
            doorPlacements = weightedDoorPlacements
            if (doorPlacements.length > 0) {
                if (doorPlacements.length > 1) {
                    doorPlacements.sort((a, b) => b[3] - a[3])
                    doorPlacements.length = Math.floor(doorPlacements.length * .8)
                }
                let doorPlacement = doorPlacements[Math.floor(Math.random() * doorPlacements.length)]

                if (doorPlacement[2] != 0) {
                    let x = doorPlacement[0]
                    let y = doorPlacement[1]
                    floor[y][x] = Block.MustEmpty
                    floor[y][x - 1] = Block.MustEmpty
                    floor[y][x + 1] = Block.MustEmpty
                } else {
                    let x = doorPlacement[0]
                    let y = doorPlacement[1]
                    floor[y][x] = Block.MustEmpty
                    floor[y - 1][x] = Block.MustEmpty
                    floor[y + 1][x] = Block.MustEmpty
                }
            }
        }
    }

    _cleanUp(floor, initialFloor) {
        for (let y = 0; y < floor.length; y++) {
            for (let x = 0; x < floor[y].length; x++) {
                if (floor[y][x] == Block.MustEmpty && initialFloor[y][x] == Block.Empty) {
                    floor[y][x] = Block.Empty
                }
                else if (floor[y][x] == Block.MustWall && initialFloor[y][x] == Block.Empty) {
                    floor[y][x] = Block.Wall
                }
            }
        }
    }

    _getRoomPlacements(w, h, m) {
        let placements = []; // [x, y, rotation]
        for (let y = 0; y <= m.length - h; y++) {
            for (let x = 0; x <= m[y].length - w; x++) {

                let wrong = false;
                let emptyCount = 0;
                let wallsToCreate = 0
                for (let yy = 0; yy < h; yy++) {
                    for (let xx = 0; xx < w; xx++) {
                        if (yy == 0 || yy == h - 1 || xx == 0 || xx == w - 1) {
                            if (m[y + yy][x + xx] == Block.MustEmpty || m[y + yy][x + xx] == Block.OutOfBounds) {
                                wrong = true;
                            } else if (m[y + yy][x + xx] == Block.Empty) {
                                wallsToCreate++;
                            }
                        } else {
                            if (m[y + yy][x + xx] == Block.Wall || m[y + yy][x + xx] == Block.MustWall || m[y + yy][x + xx] == Block.OutOfBounds) {
                                wrong = true;
                            } else {
                                if (m[y + yy][x + xx] == Block.Empty) {
                                    emptyCount++;
                                }
                            }
                        }
                    }
                }

                if (!wrong && wallsToCreate + emptyCount > 0) {
                    placements.push([x, y, w, h, wallsToCreate])
                }
            }
        }
        if (w != h) {
            let tmp = w;
            w = h;
            h = tmp;
            for (let i = 0; i <= m.length - h; i++) {
                for (let j = 0; j <= m[i].length - w; j++) {

                    let wrong = false;
                    let emptyCount = 0;
                    let wallsToCreate = 0
                    for (let ii = 0; ii < h; ii++) {
                        for (let jj = 0; jj < w; jj++) {
                            if (ii == 0 || ii == h - 1 || jj == 0 || jj == w - 1) {
                                if (m[i + ii][j + jj] == Block.MustEmpty || m[i + ii][j + jj] == Block.OutOfBounds) {
                                    wrong = true;
                                } else if (m[i + ii][j + jj] == Block.Empty) {
                                    wallsToCreate++;
                                }
                            } else {
                                if (m[i + ii][j + jj] == Block.Wall || m[i + ii][j + jj] == Block.MustWall || m[i + ii][j + jj] == Block.OutOfBounds) {
                                    wrong = true;
                                } else {
                                    if (m[i + ii][j + jj] == Block.Empty) {
                                        emptyCount++;
                                    }
                                }
                            }
                        }
                    }

                    if (!wrong && wallsToCreate + emptyCount > 0) {
                        placements.push([j, i, w, h, wallsToCreate])
                    }
                }
            }
        }
        return placements;
    }

    _corridorTest(m) {
        let count = 0;
        for (let y = 1; y < m.length - 1; y++) {
            for (let x = 1; x < m[y].length - 1; x++) {
                if (m[y][x] != Block.MustEmpty && m[y][x] != Block.Empty) continue;
                if (((m[y][x - 1] == Block.MustWall || m[y][x - 1] == Block.Wall) && (m[y][x + 1] == Block.MustWall || m[y][x + 1] == Block.Wall))
                    || ((m[y - 1][x] == Block.MustWall || m[y - 1][x] == Block.Wall) && (m[y + 1][x] == Block.MustWall || m[y + 1][x] == Block.Wall))) {
                    count++;
                }
            }
        }
        return count;
    }

    _placeRect(x1, y1, x2, y2, m) {
        for (let i = y1; i <= y2; i++) {
            for (let j = x1; j <= x2; j++) {
                if (i == y1 || j == x1 || i == y2 || j == x2) {
                    if (m[i][j] == Block.Empty) m[i][j] = Block.Wall;
                } else {
                    m[i][j] = Block.MustEmpty;
                }
            }
        }
    }

    _tryPlaceRoom(w, h, m, rs) {
        let placements = this._getRoomPlacements(w, h, m)
        if (placements.length > 0) {
            let startCorridorCount = this._corridorTest(m)
            let sav = this._get(m)

            let realPlacements = []
            for (let i = 0; i < placements.length; i++) {
                let placement = placements[i]
                this._placeRect(placement[0], placement[1], placement[0] + placement[2] - 1, placement[1] + placement[3] - 1, m);

                if (this._corridorTest(m) <= startCorridorCount) {
                    realPlacements.push(placement)
                }
                this._set(sav, m)
            }
            if (realPlacements.length > 0) {
                let placement = realPlacements[Math.floor(Math.random() * realPlacements.length)]
                this._placeRect(placement[0], placement[1], placement[0] + placement[2] - 1, placement[1] + placement[3] - 1, m);

                rs?.push(placement)
            }
        }
    }

    _getRemovableWalls(areasMap, m) {
        let removeMap = new Array(m.length).fill(0).map(x => new Array(m[0].length).fill(null));
        for (let y = 1; y < m.length - 1; y++) {
            for (let x = 1; x < m[y].length - 1; x++) {
                if (m[y][x] == Block.Wall && areasMap[y - 1][x] != areasMap[y + 1][x] && areasMap[y - 1][x] != -1 && areasMap[y + 1][x] != -1) {
                    removeMap[y][x] = Block.CanRemoveVertically
                }
                if (m[y][x] == Block.Wall && areasMap[y][x - 1] != areasMap[y][x + 1] && areasMap[y][x - 1] != -1 && areasMap[y][x + 1] != -1) {
                    removeMap[y][x] = Block.CanRemoveHorizontally
                }
            }
        }
        return { removeMap }
    }

    _getAreas(m, canPaint) {
        let areasMap = new Array(m.length).fill(0).map(x => new Array(m[0].length).fill(-1));
        let areaCounter = 0;
        let areaSizes = [];
        let areaLocations = []
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                if (canPaint(j, i, m) && areasMap[i][j] < 0) {
                    areaSizes.push(1)
                    areaLocations.push([j, i])
                    this._floodFill(j, i, areaCounter++, areasMap, areaSizes, canPaint, m)
                }
            }
        }
        return { areasMap, areaSizes, areaLocations }
    }

    _floodFill(startX, startY, colorId, areasMap, areaSizes, canFill, m) {
        let h = m.length;
        let w = m[0].length;
        let queue = [[startX, startY]]

        while (queue.length > 0) {
            let p = queue.pop();
            let x = p[0];
            let y = p[1];
            if (canFill(x, y, m) && areasMap[y][x] < 0) {
                areasMap[y][x] = colorId;
                areaSizes[colorId]++;
                if (x > 0) queue.push([x - 1, y])
                if (y > 0) queue.push([x, y - 1])
                if (x < w - 1) queue.push([x + 1, y])
                if (y < h - 1) queue.push([x, y + 1])
            }
        }
    }


    _set(json, m) {
        let strArr = JSON.parse(json)
        for (let y = 0; y < strArr.length; y++) {
            for (let x = 0; x < strArr[y].length; x++) {
                m[y][x] = strArr[y][x]
            }
        }
    }

    _get() {
        return JSON.stringify(this.floor)
    }
}
module.exports = InnerWallWorker;