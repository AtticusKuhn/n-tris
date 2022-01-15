
const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d");
const input = document.getElementById("input") as HTMLInputElement;
const pixel = 20
const pixelWidth = 10;
const pixelHeight = 24;
const width = pixelWidth * pixel;
const height = pixelHeight * pixel;

const momevement = 3
canvas.width = width;
canvas.height = height;
type shape = boolean[][]
type position = {
    x: number,
    y: number,
}
type piece = {
    position: position,
    shape: shape,
}
const generateShape = (n: number): shape => {
    if (n === 1) {
        return [[true]]
    } else {
        let s = generateShape(n - 1)
        if (Math.random() > 1 / n) {
            s[Math.floor(Math.random() * s.length)].push(true)
        } else {
            s.push([true])
        }
        return s;
    }
}
const generatePiece = (n: number = 4): piece => {
    return {
        position: {
            x: 0,
            y: 0,
        },
        shape: generateShape(n)
    }
}
let currentPiece: piece = generatePiece();
const mod = (num: number, base: number): number => {
    if (num < 0) {
        return mod(num + base, base)
    } else {
        return num % base
    }
}
const safeGet = <T>(array: T[], index: number): T => {
    if (array.length === 0) {
        throw new Error(`cannot get an empty array`)
    }
    return array[mod(Math.floor(index), array.length)]
}
const clone = <T>(x: T): T => {
    if (Array.isArray(x)) {
        //@ts-ignore
        return [...x]
    } else if (typeof x === "object") {
        return { ...x }
    } else {
        return x
    }
}
const keys = {
    "w": false,
    "a": false,
    s: false,
    d: false,
}
window.addEventListener("keydown", (keyboardEvent) => {
    const { key } = keyboardEvent
    if (Object.keys(keys).includes(keyboardEvent.key)) {
        keys[key] = true
    }
})
window.addEventListener("keyup", (keyboardEvent) => {
    const { key } = keyboardEvent
    if (Object.keys(keys).includes(keyboardEvent.key)) {
        keys[key] = false
    }
})
const makeArray = <T>(length: number, element: T): T[] => {
    let x: T[] = []
    for (let i = 0; i < length; i++) {
        x.push(clone(element))
    }
    console.log(x)
    return x;
}
const drawPixel = (x: number, y: number): void => ctx.fillRect(
    x,
    y,
    pixel,
    pixel,
)
const makeBoard = (): boolean[][] => makeArray(pixelWidth, [...makeArray(pixelHeight - 1, false), ...makeArray(pixelWidth, true)]);
let board: boolean[][] = makeBoard();
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    iterateCoveringArray(board, (xindex, yindex) => {
        ctx.fillStyle = `hsl(${(yindex / pixelHeight) * 360}, ${(xindex / pixelWidth) * 100}%, 60%)`
        drawPixel(xindex * pixel, yindex * pixel)
    })
    // ctx.fillStyle = "red"
    iterateCoveringArray(currentPiece.shape, (columnIndex, rowIndex) =>
        drawPixel(
            currentPiece.position.x + columnIndex * pixel,
            currentPiece.position.y + rowIndex * pixel,
        )
    )
}
const iterateCoveringArray = (piece: boolean[][], func: (xindex: number, yindex: number) => any): void => {
    if (!Array.isArray(piece)) throw new Error(`iterateCoveringArray expected an array but got ${piece}`)
    piece.forEach((row, xindex) => {
        if (!Array.isArray(row)) throw new Error(`iterateCoveringArray expected an array of arrays but got row ${row}`)
        row.forEach((y, yindex) => {
            if (y) {
                func(xindex, yindex)
            }
        })
    })
}
const doesCollide = (x: number, y: number): boolean => {
    let ret = false
    iterateCoveringArray(currentPiece.shape, (xindex, yindex) => {
        const xamount = xindex + Math.floor(x / pixel)
        const yamount = yindex + Math.floor(y / pixel)
        if (yamount > pixelHeight) ret = true
        if (safeGet(safeGet(board, xamount), yamount)) return ret = true
    })
    return ret
}
const transpose = <T>(array: T[][]): T[][] => array[0].map((_, colIndex) => array.map(row => row[colIndex]));

function tick() {
    if (transpose(board)[0].some(x => x)) {
        console.log(board[0])
        board = makeBoard()
    }
    let row = transpose(board).findIndex(row => row.every(x => x))
    if (row !== -1 && row !== 23) {
        console.log("row", row)
        board = board.splice(row, 1)
        board.push(makeArray(pixelWidth, true))
    }
    if (keys.d) currentPiece.position.x = mod(currentPiece.position.x + 3, width - 10)
    if (keys.s) currentPiece.position.y = mod(currentPiece.position.y + 7, height - 10)
    if (keys.a) currentPiece.position.x = mod(currentPiece.position.x - 3, width - 10)
    if (keys.w) currentPiece.position.y = mod(currentPiece.position.y - 3, height - 10)

    currentPiece.position.y += momevement
    const collides = doesCollide(currentPiece.position.x, currentPiece.position.y)
    if (collides) {
        console.log("collides!")
        currentPiece.shape.forEach((row, xindex) => {
            row.forEach((y, yindex) => {
                if (y) {
                    // console.log(`setting (${xindex + Math.floor(currentPiece.position.x / pixel)},${yindex + Math.floor(currentPiece.position.y / pixel)} )`)
                    if (board[(xindex + Math.floor(currentPiece.position.x / pixel))] !== undefined)
                        board[(xindex + Math.floor(currentPiece.position.x / pixel))]
                        [(yindex + Math.floor(currentPiece.position.y / pixel)) - 1] = true
                }
            })
        })
        //@ts-ignore
        currentPiece = generatePiece(input.value);

    } else {

    }
}
function main() {
    setInterval(() => {
        tick();
        draw();
    }, 33)
}
main();