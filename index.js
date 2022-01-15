var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var input = document.getElementById("input");
var pixel = 20;
var pixelWidth = 10;
var pixelHeight = 24;
var width = pixelWidth * pixel;
var height = pixelHeight * pixel;
var momevement = 3;
canvas.width = width;
canvas.height = height;
var generateShape = function (n) {
    if (n === 1) {
        return [[true]];
    }
    else {
        var s = generateShape(n - 1);
        if (Math.random() > 1 / n) {
            s[Math.floor(Math.random() * s.length)].push(true);
        }
        else {
            s.push([true]);
        }
        return s;
    }
};
var generatePiece = function (n) {
    if (n === void 0) { n = 4; }
    return {
        position: {
            x: 0,
            y: 0
        },
        shape: generateShape(n)
    };
};
var currentPiece = generatePiece();
var mod = function (num, base) {
    if (num < 0) {
        return mod(num + base, base);
    }
    else {
        return num % base;
    }
};
var safeGet = function (array, index) {
    if (array.length === 0) {
        throw new Error("cannot get an empty array");
    }
    return array[mod(Math.floor(index), array.length)];
};
var clone = function (x) {
    if (Array.isArray(x)) {
        //@ts-ignore
        return __spreadArray([], x, true);
    }
    else if (typeof x === "object") {
        return __assign({}, x);
    }
    else {
        return x;
    }
};
var keys = {
    "w": false,
    "a": false,
    s: false,
    d: false
};
window.addEventListener("keydown", function (keyboardEvent) {
    var key = keyboardEvent.key;
    if (Object.keys(keys).includes(keyboardEvent.key)) {
        keys[key] = true;
    }
});
window.addEventListener("keyup", function (keyboardEvent) {
    var key = keyboardEvent.key;
    if (Object.keys(keys).includes(keyboardEvent.key)) {
        keys[key] = false;
    }
});
var makeArray = function (length, element) {
    var x = [];
    for (var i = 0; i < length; i++) {
        x.push(clone(element));
    }
    console.log(x);
    return x;
};
var drawPixel = function (x, y) { return ctx.fillRect(x, y, pixel, pixel); };
var makeBoard = function () { return makeArray(pixelWidth, __spreadArray(__spreadArray([], makeArray(pixelHeight - 1, false), true), makeArray(pixelWidth, true), true)); };
var board = makeBoard();
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    iterateCoveringArray(board, function (xindex, yindex) {
        ctx.fillStyle = "hsl(" + (yindex / pixelHeight) * 360 + ", " + (xindex / pixelWidth) * 100 + "%, 60%)";
        drawPixel(xindex * pixel, yindex * pixel);
    });
    // ctx.fillStyle = "red"
    iterateCoveringArray(currentPiece.shape, function (columnIndex, rowIndex) {
        return drawPixel(currentPiece.position.x + columnIndex * pixel, currentPiece.position.y + rowIndex * pixel);
    });
}
var iterateCoveringArray = function (piece, func) {
    if (!Array.isArray(piece))
        throw new Error("iterateCoveringArray expected an array but got " + piece);
    piece.forEach(function (row, xindex) {
        if (!Array.isArray(row))
            throw new Error("iterateCoveringArray expected an array of arrays but got row " + row);
        row.forEach(function (y, yindex) {
            if (y) {
                func(xindex, yindex);
            }
        });
    });
};
var doesCollide = function (x, y) {
    var ret = false;
    iterateCoveringArray(currentPiece.shape, function (xindex, yindex) {
        var xamount = xindex + Math.floor(x / pixel);
        var yamount = yindex + Math.floor(y / pixel);
        if (yamount > pixelHeight)
            ret = true;
        if (safeGet(safeGet(board, xamount), yamount))
            return ret = true;
    });
    return ret;
};
var transpose = function (array) { return array[0].map(function (_, colIndex) { return array.map(function (row) { return row[colIndex]; }); }); };
function tick() {
    if (transpose(board)[0].some(function (x) { return x; })) {
        console.log(board[0]);
        board = makeBoard();
    }
    var row = transpose(board).findIndex(function (row) { return row.every(function (x) { return x; }); });
    if (row !== -1 && row !== 23) {
        console.log("row", row);
        board = board.splice(row, 1);
        board.push(makeArray(pixelWidth, true));
    }
    if (keys.d)
        currentPiece.position.x = mod(currentPiece.position.x + 3, width - 10);
    if (keys.s)
        currentPiece.position.y = mod(currentPiece.position.y + 7, height - 10);
    if (keys.a)
        currentPiece.position.x = mod(currentPiece.position.x - 3, width - 10);
    if (keys.w)
        currentPiece.position.y = mod(currentPiece.position.y - 3, height - 10);
    currentPiece.position.y += momevement;
    var collides = doesCollide(currentPiece.position.x, currentPiece.position.y);
    if (collides) {
        console.log("collides!");
        currentPiece.shape.forEach(function (row, xindex) {
            row.forEach(function (y, yindex) {
                if (y) {
                    // console.log(`setting (${xindex + Math.floor(currentPiece.position.x / pixel)},${yindex + Math.floor(currentPiece.position.y / pixel)} )`)
                    if (board[(xindex + Math.floor(currentPiece.position.x / pixel))] !== undefined)
                        board[(xindex + Math.floor(currentPiece.position.x / pixel))][(yindex + Math.floor(currentPiece.position.y / pixel)) - 1] = true;
                }
            });
        });
        //@ts-ignore
        currentPiece = generatePiece(input.value);
    }
    else {
    }
}
function main() {
    setInterval(function () {
        tick();
        draw();
    }, 33);
}
main();
