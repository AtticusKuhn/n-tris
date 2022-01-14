var canvas = document.getElementById("canvas");
var input = document.getElementById("input");
var pixel = 10;
var width = 500;
var height = 500;
var pixelWidth = 500 / pixel;
var pixelhHeight = 500 / pixel;
canvas.width = width;
canvas.height = height;
var generatePiece = function () {
    return {
        position: {
            x: 0,
            y: 0
        },
        shape: [
            // [true, true, true],
            [true, true, true, true, true, true, true]
        ]
    };
};
var currentPiece = generatePiece();
var makeArray = function (length, element) { return new Array(length).fill(element); };
var board = makeArray(pixelWidth, makeArray(pixelhHeight, false));
function draw() {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach(function (xrow, xindex) {
        xrow.forEach(function (y, yindex) {
            // const x = xrow[xindex];
            if (y)
                ctx.fillRect(xindex * pixel, yindex * pixel, pixel, pixel);
            ctx.fillStyle = "hsl(" + (yindex * pixel / pixelWidth) * 20 + ", " + (xindex * pixel / pixelWidth) * 2 + "%, 50%)";
        });
    });
    ctx.fillStyle = "red";
    currentPiece.shape.forEach(function (row, rowIndex) {
        row.forEach(function (column, columnIndex) {
            if (column)
                ctx.fillRect(currentPiece.position.x + columnIndex * pixel, currentPiece.position.y + rowIndex * pixel, pixel, pixel);
        });
    });
    ctx.fillStyle = "black";
    return canvas;
}
function tick() {
    if (currentPiece.position.y / pixel + pixel > pixelhHeight) {
        currentPiece = generatePiece();
    }
    else {
        currentPiece.position.y += pixel;
    }
}
function main() {
    setInterval(function () {
        tick();
        draw();
    }, 1e2);
}
main();
