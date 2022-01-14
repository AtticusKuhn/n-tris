
const canvas = document.getElementById("canvas") as HTMLCanvasElement
const input = document.getElementById("input") as HTMLInputElement;
const pixel = 10
const width = 500;
const height = 500;
const pixelWidth = 500 / pixel;
const pixelhHeight = 500 / pixel;
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
const generatePiece = (): piece => {
    return {
        position: {
            x: 0,
            y: 0,
        },
        shape: [
            // [true, true, true],
            [true, true, true, true, true, true, true]
        ]
    }
}
let currentPiece: piece = generatePiece();

const makeArray = <T>(length: number, element: T): T[] => new Array(length).fill(element)
let board = makeArray(pixelWidth, makeArray(pixelhHeight, false));
function draw() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((xrow, xindex) => {
        xrow.forEach((y, yindex) => {
            // const x = xrow[xindex];
            if (y)
                ctx.fillRect(
                    xindex * pixel,
                    yindex * pixel,
                    pixel,
                    pixel,
                )
            ctx.fillStyle = `hsl(${(yindex * pixel / pixelWidth) * 20}, ${(xindex * pixel / pixelWidth) * 2}%, 50%)`

        })
    })
    ctx.fillStyle = "red"
    currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            if (column)
                ctx.fillRect(
                    currentPiece.position.x + columnIndex * pixel,
                    currentPiece.position.y + rowIndex * pixel,
                    pixel,
                    pixel,
                );
        })
    })

    ctx.fillStyle = "black"
    return canvas;
}
function tick() {
    if (currentPiece.position.y / pixel + pixel > pixelhHeight) {
        currentPiece = generatePiece();
    } else {
        currentPiece.position.y += pixel
    }
}
function main() {
    setInterval(() => {
        tick();
        draw();
    }, 1e2)
}
main();