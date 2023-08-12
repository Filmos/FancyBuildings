module.exports = {
    overlap(base, top, pozX=0, pozY=0, override=false, postprocess=(b=>b)) {
        for(let y=0;y<top.length;y++) {
            let newRow = base[y+pozY].slice(0, pozX)
            for(let x=0;x<top[y].length;x++) {
                if(top[y][x] != "*" && (base[y+pozY][x+pozX] == "?" || (override && top[y][x] != "?"))) newRow += postprocess(top[y][x])
                else newRow += base[y+pozY][x+pozX]
            }
            newRow += base[y+pozY].slice(pozX+top[y].length)
            base[y+pozY] = newRow
        }
        return base
    },
    replaceAt(str, index, replacement) {
        try {
            return str.substr(0, index) + replacement + str.substr(index + replacement.length)
        } catch(e) {
            throw new Error(`replaceAt(${str}, ${index}, ${replacement}) failed`)
        }
    },
    calcOffset(base, top) {
        return [
            Math.floor((base[0].length - top[0].length) / 2),
            Math.floor((base.length - top.length) / 2)
        ]
    },
    randomSelection(arr, count) {
        if(arr.length < count) return arr
    
        let result = []
        var copy = arr.slice(0)
        for(let i=0;i<count;i++) {
            let index = Math.floor(Math.random()*copy.length)
            result.push(copy[index])
            copy.splice(index, 1)
        }
        return result
    },
    shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
}