(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Agent = /** @class */ (function () {
    function Agent(grid) {
        this.disabled = false;
        this.mX = 1;
        this.mY = 1;
        this.mGame = grid;
        this.measure();
        this.disabled = false;
        this.ux = this.mGame.canvas.circle(20);
        this.ux.fill("#f06");
        this.ux.center(this.mGame.UX_SIZE / (2 * this.mGame.GRID_SIZE), this.mGame.UX_SIZE - (this.mGame.UX_SIZE / (2 * this.mGame.GRID_SIZE)));
    }
    Object.defineProperty(Agent.prototype, "x", {
        get: function () { return this.mX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "y", {
        get: function () { return this.mY; },
        enumerable: true,
        configurable: true
    });
    Agent.prototype.move = function (move) {
        if (this.disabled) {
            return;
        }
        if (move === Move.Up && this.mY < this.mGame.GRID_SIZE) {
            this.mY += 1;
        }
        else if (move === Move.Down && this.mY > 1) {
            this.mY -= 1;
        }
        else if (move === Move.Right && this.mX < this.mGame.GRID_SIZE) {
            this.mX += 1;
        }
        else if (move === Move.Left && this.mX > 1) {
            this.mX -= 1;
        }
        this.render();
        this.measure();
        this.score();
    };
    Agent.prototype.measure = function () {
        this.mGame.getTile(this.x, this.y).measured = true;
        return this.mGame.getTile(this.x, this.y).measurement;
    };
    Agent.prototype.score = function () {
        var _this = this;
        var tile = this.mGame.getTile(this.mX, this.mY);
        if (tile.hasWumpus) {
            // Add text and a Rectangle behind it
            this.ux.animate().fill("#000000").radius(5);
            var rect_1 = this.mGame.canvas
                .rect(this.mGame.UX_SIZE, this.mGame.UX_SIZE / this.mGame.GRID_SIZE)
                .center(this.mGame.UX_SIZE / 2, this.mGame.UX_SIZE / 2).fill("#000000");
            var text_1 = this.mGame.canvas.text("Wumpus ate you.")
                .font({ family: "Helvetica", size: 60, fill: "white" })
                .center(this.mGame.UX_SIZE / 2, this.mGame.UX_SIZE / 2);
            // Reset the game 2 seconds later
            setTimeout(function () {
                _this.mGame.reset();
                rect_1.remove();
                text_1.remove();
            }, 2500);
            this.disabled = true;
        }
        else if (tile.hasPit) {
            this.ux.animate().fill("#000000").radius(5);
            // Add text and a Rectangle behind it
            var rect_2 = this.mGame.canvas
                .rect(this.mGame.UX_SIZE, this.mGame.UX_SIZE / this.mGame.GRID_SIZE)
                .center(this.mGame.UX_SIZE / 2, this.mGame.UX_SIZE / 2).fill("#000000");
            var text_2 = this.mGame.canvas.text("Oops, you fell in a Pit.")
                .font({ family: "Helvetica", size: 60, fill: "white" })
                .center(this.mGame.UX_SIZE / 2, this.mGame.UX_SIZE / 2);
            // Reset the game 2 seconds later
            setTimeout(function () {
                _this.mGame.reset();
                rect_2.remove();
                text_2.remove();
            }, 2500);
            this.disabled = true;
        }
        else if (tile.hasGold) {
            this.ux.animate().fill("#FFD000").radius(25);
            // Add text and a Rectangle behind it
            var rect_3 = this.mGame.canvas
                .rect(this.mGame.UX_SIZE, this.mGame.UX_SIZE / this.mGame.GRID_SIZE)
                .center(this.mGame.UX_SIZE / 2, this.mGame.UX_SIZE / 2).fill("#FFD000");
            var text_3 = this.mGame.canvas.text("You Won GOLD!.")
                .font({ family: "Helvetica", size: 60, fill: "black" })
                .center(this.mGame.UX_SIZE / 2, this.mGame.UX_SIZE / 2);
            // Reset the game 2 seconds later
            setTimeout(function () {
                _this.mGame.reset();
                rect_3.remove();
                text_3.remove();
            }, 2500);
            this.disabled = true;
        }
    };
    Agent.prototype.reset = function () {
        this.mX = 1;
        this.mY = 1;
        this.render();
        this.ux.finish();
        this.ux.fill("#f06");
        this.ux.radius(10);
        this.disabled = false;
    };
    Agent.prototype.render = function () {
        this.ux.finish();
        var BLOCK_SIZE = this.mGame.UX_SIZE / this.mGame.GRID_SIZE;
        this.ux.animate().center(BLOCK_SIZE * this.mX - BLOCK_SIZE / 2, this.mGame.UX_SIZE - BLOCK_SIZE * this.mY + BLOCK_SIZE / 2);
        this.console();
    };
    Agent.prototype.console = function () {
        var pos = this.mGame.getTile(this.mX, this.mY);
        if (pos.hasGold) {
            $("#agent-console").html("Thank you for helping me find all this gold");
        }
        else if (pos.hasPit || pos.hasWumpus) {
            $("#agent-console").html("You were supposed to help me, I am dead now.");
        }
        else if (pos.hasStench && pos.hasBreeze) {
            $("#agent-console").html("There is a <strong>stench</strong> and there is a <strong>breeze</strong>!!!");
        }
        else if (pos.hasStench) {
            $("#agent-console").html("What's that <strong>stench?</strong> Wumpus must be around.");
        }
        else if (pos.hasBreeze) {
            $("#agent-console").html("There is a <strong>breeze</strong>. Careful not to fall in a pit.");
        }
        else {
            $("#agent-console").html("I feel <strong>safe</strong> here, nothing around.");
        }
    };
    return Agent;
}());
exports.Agent = Agent;
var Move;
(function (Move) {
    Move[Move["Left"] = 0] = "Left";
    Move[Move["Right"] = 1] = "Right";
    Move[Move["Up"] = 2] = "Up";
    Move[Move["Down"] = 3] = "Down";
})(Move = exports.Move || (exports.Move = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Filtering = /** @class */ (function () {
    /**
     * Generates a new analysis space, makes 8 boards, and 2 text-outputs
     * and stores them as nested SVG in this.canvas[].
     *
     * @param game
     *
     * @notes
     *
     * The space on the X-axis of canvas is allotted as follows:
     *  1.00 * UX_SIZE * 4: Models for Each possible move
     *  0.01 * UX_SIZE * 4: separator space
     *  =======================================================
     *  TOTAL: 4.04 * UX_SIZE on the Y Axis
     *
     * The space on the Y-axis of canvas is allotted as follows:
     *  0.25 * UX_SIZE: Banner of what move it is
     *  1.00 * UX_SIZE: Models for Wumpus
     *  0.01 * UX_SIZE: separator space
     *  0.25 * UX_SIZE: Banner of what move it is
     *  1.00 * UX_SIZE: Models for Pit
     *  0.04 * UX_SIZE: separator space
     *  0.25 * UX_SIZE: Conclusions for the move
     *  =======================================================
     *  TOTAL: 2.80 * UX_SIZE on the Y Axis
     */
    function Filtering(game) {
        this.canvas = [];
        this.ELEMENT = "drawing-models";
        this.UX_SIZE = 250;
        this.game = game;
        // Initializing the 8 nested SVG canvases for each future move
        this.canvasParent = SVG(this.ELEMENT).size(this.UX_SIZE * 4.04, this.UX_SIZE * 2.77);
        var moveTexts = ["Right", "Up", "Left", "Down"];
        for (var i = 0; i < 4; i++) {
            // Generate the Banner for Wumpus
            this.canvasParent.rect(this.UX_SIZE, this.UX_SIZE * 0.25)
                .center((i * 1.01 + 0.5) * this.UX_SIZE, 0.125 * this.UX_SIZE)
                .fill({ color: "#000000" });
            this.canvasParent.text("Move " + moveTexts[i] + ", Check Wumpus")
                .center((i * 1.01 + 0.5) * this.UX_SIZE, 0.125 * this.UX_SIZE)
                .font({ fill: "#ffffff" });
            // Generate Models for Wumpus
            this.canvas[i] = this.canvasParent.nested().size(this.UX_SIZE, this.UX_SIZE);
            this.canvas[i].center((i * 1.01 + 0.5) * this.UX_SIZE, 0.75 * this.UX_SIZE);
            // Generate the Banner for Pits
            this.canvasParent.rect(this.UX_SIZE, this.UX_SIZE * 0.25)
                .center((i * 1.01 + 0.5) * this.UX_SIZE, 1.385 * this.UX_SIZE)
                .fill({ color: "#000000" });
            this.canvasParent.text("Move " + moveTexts[i] + ", Check Pit")
                .center((i * 1.01 + 0.5) * this.UX_SIZE, 1.385 * this.UX_SIZE)
                .font({ fill: "#ffffff" });
            // Generate Models for Pits
            this.canvas[i + 4] = this.canvasParent.nested().size(this.UX_SIZE, this.UX_SIZE);
            this.canvas[i + 4].center((i * 1.01 + 0.5) * this.UX_SIZE, 2.01 * this.UX_SIZE);
            // Generate the Results
            this.canvas[i + 8] = this.canvasParent.nested().size(this.UX_SIZE, this.UX_SIZE * 0.25);
            this.canvas[i + 8].center((i * 1.01 + 0.5) * this.UX_SIZE, 2.675 * this.UX_SIZE);
        }
        this.render();
    }
    /**
     * Renders all possible models of the future and why they hold true or false.
     * Currently tries to filter utilizing the features of this space.
     */
    Filtering.prototype.render = function () {
        var curX = this.game.agent.x;
        var curY = this.game.agent.y;
        var valid = [];
        for (var x = 0; x < 8; x++) {
            // delete the old grid and assume model is valid
            this.canvas[x].clear();
            valid[x] = true;
            // generating the index of the next tile
            var posX = curX;
            var posY = curY;
            if ((x === 0 || x === 4) && (curX < this.game.GRID_SIZE)) {
                posX++;
            }
            else if ((x === 1 || x === 5) && (curY < this.game.GRID_SIZE)) {
                posY++;
            }
            else if ((x === 2 || x === 6) && (curX > 1)) {
                posX--;
            }
            else if ((x === 3 || x === 7) && (curY > 1)) {
                posY--;
            }
            // Quit if there are no valid moves
            if (curX === posX && curY === posY) {
                this.canvas[x].rect(this.UX_SIZE, this.UX_SIZE)
                    .fill({ color: "#ddd", opacity: "0.5" });
                this.canvas[x].rect(this.UX_SIZE, this.UX_SIZE * 0.2)
                    .fill({ color: "#f00", opacity: "0.2" })
                    .center(this.UX_SIZE / 2, this.UX_SIZE / 2);
                this.canvas[x].text("Invalid Move")
                    .font({ weight: "bold" })
                    .center(this.UX_SIZE / 2, this.UX_SIZE / 2);
                continue;
            }
            // check if model contradicts the current knowledge base
            if (this.game.getTile(posX, posY).measured) {
                valid[x] = false;
            }
            // finding the neighbors after the move
            var list = [];
            for (var i = 0; i < this.game.GRID_SIZE * this.game.GRID_SIZE; i++) {
                list[i] = false;
            }
            for (var _i = 0, _a = this.game.getNeighbors(this.game.getTile(posX, posY)); _i < _a.length; _i++) {
                var tile = _a[_i];
                list[this.game.GRID_SIZE * (tile.x - 1) + (tile.y - 1)] = true;
            }
            // creating the full grid
            for (var i = 1; i <= 4; i++) {
                for (var j = 1; j <= 4; j++) {
                    // Generate the tile
                    var r = this.canvas[x]
                        .rect((0.25) * this.UX_SIZE, (0.25) * this.UX_SIZE)
                        .center((i - 0.5) * this.UX_SIZE / 4, (4.5 - j) * this.UX_SIZE / 4);
                    var s = this.canvas[x]
                        .rect((0.15) * this.UX_SIZE, (0.15) * this.UX_SIZE)
                        .center((i - 0.5) * this.UX_SIZE / 4, (4.5 - j) * this.UX_SIZE / 4);
                    // Copying the measurement colors
                    if (this.game.getTile(i, j).measured) {
                        r.fill({ color: this.game.getTile(i, j).measurement });
                    }
                    else {
                        r.fill({ color: "#dddddd" });
                    }
                    if (x < 4) {
                        // Dealing with Wumpus here
                        if (list[this.game.GRID_SIZE * (i - 1) + (j - 1)]) {
                            s.fill({ color: "#ff3837" });
                            if (this.game.getTile(i, j).measured && !this.game.getTile(i, j).hasStench) {
                                valid[x] = false;
                                this.canvas[x].text("x").font({ fill: "#ffffff", weight: "bold", size: "large" })
                                    .center((i - 0.5) * this.UX_SIZE / 4, (4.5 - j) * this.UX_SIZE / 4);
                            }
                        }
                        else {
                            s.fill({ color: "#4e9d36" });
                            if (this.game.getTile(i, j).measured && this.game.getTile(i, j).hasStench) {
                                valid[x] = false;
                                this.canvas[x].text("x").font({ fill: "#ffffff", weight: "bold", size: "large" })
                                    .center((i - 0.5) * this.UX_SIZE / 4, (4.5 - j) * this.UX_SIZE / 4);
                            }
                        }
                    }
                    else if (x < 8) {
                        // Dealing with Pits here
                        if (list[this.game.GRID_SIZE * (i - 1) + (j - 1)]) {
                            s.fill({ color: "#646464" });
                            if (this.game.getTile(i, j).measured && !this.game.getTile(i, j).hasBreeze) {
                                valid[x] = false;
                                this.canvas[x].text("x").font({ fill: "#ffffff", weight: "bold", size: "large" })
                                    .center((i - 0.5) * this.UX_SIZE / 4, (4.5 - j) * this.UX_SIZE / 4);
                            }
                        }
                        else {
                            s.fill({ color: "#ffffff" });
                        }
                    }
                    // Render the agent itself
                    if (posX === i && posY === j) {
                        this.canvas[x].circle(10).fill({ color: "#ff0066" })
                            .center((i - 0.5) * this.UX_SIZE / 4, (4.5 - j) * this.UX_SIZE / 4);
                    }
                }
            }
            // Check and label if the model was valid or not
            if (!valid[x]) {
                this.canvas[x].rect(this.UX_SIZE, this.UX_SIZE * 0.2)
                    .fill({ color: "#f00", opacity: "0.2" })
                    .center(this.UX_SIZE / 2, this.UX_SIZE / 2);
                this.canvas[x].text("Model Invalid, Square Safe")
                    .font({ weight: "bold" })
                    .center(this.UX_SIZE / 2, this.UX_SIZE / 2);
            }
            else if (valid[x]) {
                this.canvas[x].rect(this.UX_SIZE, this.UX_SIZE * 0.2)
                    .fill({ color: "#00ff00", opacity: "0.2" })
                    .center(this.UX_SIZE / 2, this.UX_SIZE / 2);
                this.canvas[x].text("Model is Correct, Move is Risky.")
                    .font({ weight: "bold" })
                    .center(this.UX_SIZE / 2, this.UX_SIZE / 2);
            }
        }
        // Label for each move whether it should be played or not
        for (var i = 0; i < 4; i++) {
            this.canvas[i + 8].clear();
            if (valid[i] || valid[i + 4]) {
                this.canvas[i + 8].rect(this.UX_SIZE, this.UX_SIZE * 0.25)
                    .fill({ color: "#ff7b69" });
                this.canvas[i + 8].text("We ain't doing this.")
                    .center(this.UX_SIZE * 0.5, this.UX_SIZE * 0.125)
                    .font({ weight: "bold" });
            }
            else {
                this.canvas[i + 8].rect(this.UX_SIZE, this.UX_SIZE * 0.25)
                    .fill({ color: "#89ff4f" });
                this.canvas[i + 8].text("This is Safe, Good to Go.")
                    .center(this.UX_SIZE * 0.5, this.UX_SIZE * 0.125)
                    .font({ weight: "bold" });
            }
        }
    };
    return Filtering;
}());
exports.Filtering = Filtering;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GodSight = /** @class */ (function () {
    function GodSight(game) {
        this.CENTERS = [];
        this.tiles = [];
        this.displayed = false;
        this.canvas = game.canvas.nested();
        this.BLOCK_SIZE = game.UX_SIZE / game.GRID_SIZE;
        this.GRID_SIZE = game.GRID_SIZE;
        this.tiles = game.tiles;
        for (var i = 0; i < this.GRID_SIZE; i++) {
            this.CENTERS[i] = this.BLOCK_SIZE * i + this.BLOCK_SIZE / 2;
        }
    }
    GodSight.prototype.render = function () {
        if (this.displayed) {
            return;
        }
        for (var i = 0; i < this.GRID_SIZE; i++) {
            for (var j = 0; j < this.GRID_SIZE; j++) {
                if (this.tiles[i][j].hasStench) {
                    var s1 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
                    s1.center(this.CENTERS[i], this.CENTERS[j] - this.BLOCK_SIZE * 0.25);
                    s1.fill({ color: "#ff0000", opacity: 0.3 });
                    var t1 = this.canvas.text("Stench");
                    t1.center(this.CENTERS[i], this.CENTERS[j] - this.BLOCK_SIZE * 0.25);
                    t1.font({ weight: "bold", fill: "black" });
                }
                if (this.tiles[i][j].hasWumpus) {
                    var s2 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
                    s2.center(this.CENTERS[i], this.CENTERS[j] - this.BLOCK_SIZE * 0.10);
                    s2.fill({ color: "#ff0000", opacity: 1.0 });
                    var t2 = this.canvas.text("Wumpus");
                    t2.center(this.CENTERS[i], this.CENTERS[j] - this.BLOCK_SIZE * 0.10);
                    t2.font({ weight: "bold", fill: "white" });
                }
                if (this.tiles[i][j].hasGold) {
                    var s5 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
                    s5.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.00);
                    s5.fill({ color: "#ffff00", opacity: 1.0 });
                    var t5 = this.canvas.text("Gold");
                    t5.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.00);
                    t5.font({ weight: "bold", fill: "black" });
                }
                if (this.tiles[i][j].hasPit) {
                    var s3 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
                    s3.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.10);
                    s3.fill({ color: "#000000", opacity: 1.0 });
                    var t3 = this.canvas.text("Pit");
                    t3.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.10);
                    t3.font({ weight: "bold", fill: "white" });
                }
                if (this.tiles[i][j].hasBreeze) {
                    var s4 = this.canvas.rect(this.BLOCK_SIZE * 0.6, this.BLOCK_SIZE * 0.15);
                    s4.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.25);
                    s4.fill({ color: "#000000", opacity: 0.3 });
                    var t4 = this.canvas.text("Breeze");
                    t4.center(this.CENTERS[i], this.CENTERS[j] + this.BLOCK_SIZE * 0.25);
                    t4.font({ weight: "bold", fill: "black" });
                }
            }
        }
        this.displayed = true;
    };
    GodSight.prototype.hide = function () {
        this.canvas.clear();
        this.displayed = false;
    };
    return GodSight;
}());
exports.GodSight = GodSight;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var agent_1 = require("./agent");
var tile_1 = require("./tile");
var filtering_1 = require("./filtering");
var Grid = /** @class */ (function () {
    function Grid() {
        this.GRID_SIZE = 4;
        this.UX_SIZE = 600;
        this.ELEMENT = "drawing";
        this.tiles = [];
        for (var i = 0; i < this.GRID_SIZE; i++) {
            this.tiles[i] = [];
            for (var j = 0; j < this.GRID_SIZE; j++) {
                this.tiles[i][j] = new tile_1.Tile(i + 1, this.GRID_SIZE - j, this.UX_SIZE / this.GRID_SIZE);
            }
        }
        this.render();
        this.agent = new agent_1.Agent(this);
        this.modelFilter = new filtering_1.Filtering(this);
    }
    Grid.prototype.getTile = function (i, j) {
        i = i - 1;
        j = this.GRID_SIZE - j;
        if (i < 0 || j < 0 || i >= this.GRID_SIZE || j >= this.GRID_SIZE) {
            throw new Error("Accessing invalid tile index (" + i + "," + j + ")");
        }
        return this.tiles[i][j];
    };
    Grid.prototype.getNeighbors = function (tile) {
        var result = [];
        if (tile.x > 1) {
            result.push(this.getTile(tile.x - 1, tile.y));
        }
        if (tile.x < this.GRID_SIZE) {
            result.push(this.getTile(tile.x + 1, tile.y));
        }
        if (tile.y > 1) {
            result.push(this.getTile(tile.x, tile.y - 1));
        }
        if (tile.y < this.GRID_SIZE) {
            result.push(this.getTile(tile.x, tile.y + 1));
        }
        return result;
    };
    Grid.prototype.sensorUpdate = function () {
        // Loop over all tiles
        for (var i = 0; i < this.GRID_SIZE; i++) {
            for (var j = 0; j < this.GRID_SIZE; j++) {
                // Check if tile[i][j] has a breeze/stench due to a neighbors.
                var stench = false;
                var breeze = false;
                for (var _i = 0, _a = this.getNeighbors(this.tiles[i][j]); _i < _a.length; _i++) {
                    var neighbor = _a[_i];
                    stench = neighbor.hasWumpus || stench;
                    breeze = neighbor.hasPit || breeze;
                }
                // Set the measurement of the tile based on it's neighbors and render.
                this.tiles[i][j].measurement = breeze
                    ? (stench ? tile_1.Measurement.StenchyBreeze : tile_1.Measurement.Breeze)
                    : (stench ? tile_1.Measurement.Stench : tile_1.Measurement.Safe);
                this.tiles[i][j].render();
            }
        }
    };
    Grid.prototype.reset = function () {
        for (var i = 0; i < this.GRID_SIZE; i++) {
            for (var j = 0; j < this.GRID_SIZE; j++) {
                this.tiles[i][j].reset();
            }
        }
        this.getTile(1, 1).measured = true;
        this.agent.reset();
        this.modelFilter.render();
    };
    Grid.prototype.render = function () {
        this.canvas = SVG(this.ELEMENT).size(this.UX_SIZE, this.UX_SIZE);
        var BLOCK_SIZE = this.UX_SIZE / this.GRID_SIZE;
        for (var i = 0; i < this.GRID_SIZE; i++) {
            for (var j = 0; j < this.GRID_SIZE; j++) {
                this.tiles[i][j].canvas = this.canvas.nested()
                    .attr({ x: BLOCK_SIZE * i, y: BLOCK_SIZE * j });
                this.tiles[i][j].render();
            }
        }
    };
    return Grid;
}());
exports.Grid = Grid;

},{"./agent":1,"./filtering":2,"./tile":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var agent_1 = require("./agent");
var god_1 = require("./god");
var grid_1 = require("./grid");
var game = new grid_1.Grid();
game.getTile(3, 1).hasPit = true;
game.getTile(3, 3).hasPit = true;
game.getTile(4, 4).hasPit = true;
game.getTile(1, 3).hasWumpus = true;
game.getTile(2, 3).hasGold = true;
game.sensorUpdate();
var god = new god_1.GodSight(game);
$("#mode-game").on("click", function () { god.hide(); });
$("#mode-god").on("click", function () { god.render(); });
// Binding the Keypress Event
$("html").on("keydown", function (e) {
    if (e.which === 37 || e.which === "A".charCodeAt(0)) {
        game.agent.move(agent_1.Move.Left);
        game.modelFilter.render();
    }
    else if (e.which === 38 || e.which === "W".charCodeAt(0)) {
        game.agent.move(agent_1.Move.Up);
        game.modelFilter.render();
    }
    else if (e.which === 39 || e.which === "D".charCodeAt(0)) {
        game.agent.move(agent_1.Move.Right);
        game.modelFilter.render();
    }
    else if (e.which === 40 || e.which === "S".charCodeAt(0)) {
        game.agent.move(agent_1.Move.Down);
        game.modelFilter.render();
    }
});

},{"./agent":1,"./god":3,"./grid":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile = /** @class */ (function () {
    function Tile(x, y, blockSize) {
        if (blockSize === void 0) { blockSize = 100; }
        this.mX = x;
        this.mY = y;
        this.mWumpus = false;
        this.mPit = false;
        this.mGold = false;
        this.BLOCK_SIZE = blockSize;
        this.mMeasurement = Measurement.Safe;
        this.mMeasured = false;
    }
    Object.defineProperty(Tile.prototype, "canvas", {
        set: function (canvas) { this.mCanvas = canvas; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "x", {
        get: function () { return this.mX; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "y", {
        get: function () { return this.mY; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "hasWumpus", {
        get: function () { return this.mWumpus; },
        set: function (wumpus) { this.mWumpus = wumpus; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "hasPit", {
        get: function () { return this.mPit; },
        set: function (pit) { this.mPit = pit; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "hasGold", {
        get: function () { return this.mGold; },
        set: function (gold) { this.mGold = gold; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "measurement", {
        get: function () {
            return this.mMeasurement;
        },
        set: function (measurement) {
            this.mMeasurement = measurement;
            this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "measured", {
        get: function () {
            return this.mMeasured;
        },
        set: function (measured) {
            this.mMeasured = measured;
            this.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "hasBreeze", {
        get: function () {
            return this.mMeasurement === Measurement.Breeze
                || this.mMeasurement === Measurement.StenchyBreeze;
        },
        set: function (breeze) {
            if (breeze && this.mMeasurement === Measurement.Stench) {
                this.mMeasurement = Measurement.StenchyBreeze;
            }
            else if (breeze && this.mMeasurement === Measurement.Safe) {
                this.mMeasurement = Measurement.Breeze;
            }
            else if (!breeze && this.mMeasurement === Measurement.StenchyBreeze) {
                this.mMeasurement = Measurement.Stench;
            }
            else if (!breeze && this.mMeasurement === Measurement.Breeze) {
                this.mMeasurement = Measurement.Safe;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "hasStench", {
        get: function () {
            return this.mMeasurement === Measurement.Stench
                || this.mMeasurement === Measurement.StenchyBreeze;
        },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.reset = function () {
        this.measured = false;
    };
    Tile.prototype.render = function () {
        var rOut = this.mCanvas.rect(this.BLOCK_SIZE * 0.98, this.BLOCK_SIZE * 0.98);
        var rInn = this.mCanvas.rect(this.BLOCK_SIZE * 0.75, this.BLOCK_SIZE * 0.75);
        if (this.mMeasured) {
            rOut.fill({ color: this.mMeasurement });
        }
        else {
            rOut.fill({ color: "#ccc" });
        }
        rInn.fill({ color: "#ddd" });
        rOut.center(this.BLOCK_SIZE / 2, this.BLOCK_SIZE / 2);
        rInn.center(this.BLOCK_SIZE / 2, this.BLOCK_SIZE / 2);
    };
    return Tile;
}());
exports.Tile = Tile;
var Measurement;
(function (Measurement) {
    Measurement["Stench"] = "#ff0000";
    Measurement["Breeze"] = "#000000";
    Measurement["StenchyBreeze"] = "#660000";
    Measurement["Safe"] = "#55ff66";
})(Measurement = exports.Measurement || (exports.Measurement = {}));

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhZ2VudC50cyIsImZpbHRlcmluZy50cyIsImdvZC50cyIsImdyaWQudHMiLCJtYWluLnRzIiwidGlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFRRSxlQUFZLElBQVU7UUFGZCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBR2hDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxzQkFBSSxvQkFBQzthQUFMLGNBQWtCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ25DLHNCQUFJLG9CQUFDO2FBQUwsY0FBa0IsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7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QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO29CQUM5QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUMzRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNyRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3RDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ3JFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO29CQUM5QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUMzRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNyRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3RDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ3JFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO29CQUM1QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUMzRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNyRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ3JFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO29CQUMzQixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUMzRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO29CQUNyRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ25DLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ3JFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxP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R0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFcEQsNkJBQTZCO0FBQzdCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBTTtJQUM3QixJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUMzQjtTQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzNCO1NBQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDM0I7U0FBTSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFD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TUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDSCxXQUFDO0FBQUQsQ0E5RkEsQUE4RkMsSUFBQTtBQTlGWSxvQkFBSTtBQWdHakIsSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3JCLGlDQUFrQixDQUFBO0lBQ2xCLGlDQUFrQixDQUFBO0lBQ2xCLHdDQUF5QixDQUFBO0lBQ3pCLCtCQUFnQixDQUFBO0FBQ2xCLENBQUMsRUFMVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUt0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IEdyaWQgfSBmcm9tIFwiLi9ncmlkXCI7XG5pbXBvcnQgeyBNZWFzdXJlbWVudCB9IGZyb20gXCIuL3RpbGVcIjtcblxuZXhwb3J0IGNsYXNzIEFnZW50IHtcblxuICBwcm90ZWN0ZWQgbVg6IG51bWJlcjtcbiAgcHJvdGVjdGVkIG1ZOiBudW1iZXI7XG4gIHByaXZhdGUgbUdhbWU6IEdyaWQ7XG4gIHByaXZhdGUgdXg6IGFueTtcbiAgcHJpdmF0ZSBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGdyaWQ6IEdyaWQpIHtcbiAgICB0aGlzLm1YID0gMTtcbiAgICB0aGlzLm1ZID0gMTtcbiAgICB0aGlzLm1HYW1lID0gZ3JpZDtcbiAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy51eCA9IHRoaXMubUdhbWUuY2FudmFzLmNpcmNsZSgyMCk7XG4gICAgdGhpcy51eC5maWxsKFwiI2YwNlwiKTtcbiAgICB0aGlzLnV4LmNlbnRlcih0aGlzLm1HYW1lLlVYX1NJWkUgLyAoMiAqIHRoaXMubUdhbWUuR1JJRF9TSVpFKSxcbiAgICAgIHRoaXMubUdhbWUuVVhfU0laRSAtICh0aGlzLm1HYW1lLlVYX1NJWkUgLyAoMiAqIHRoaXMubUdhbWUuR1JJRF9TSVpFKSkpO1xuICB9XG5cbiAgZ2V0IHgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMubVg7IH1cbiAgZ2V0IHkoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMubVk7IH1cblxuICBwdWJsaWMgbW92ZShtb3ZlOiBNb3ZlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG1vdmUgPT09IE1vdmUuVXAgJiYgdGhpcy5tWSA8IHRoaXMubUdhbWUuR1JJRF9TSVpFKSB7XG4gICAgICB0aGlzLm1ZICs9IDE7XG4gICAgfSBlbHNlIGlmIChtb3ZlID09PSBNb3ZlLkRvd24gJiYgdGhpcy5tWSA+IDEpIHtcbiAgICAgIHRoaXMubVkgLT0gMTtcbiAgICB9IGVsc2UgaWYgKG1vdmUgPT09IE1vdmUuUmlnaHQgJiYgdGhpcy5tWCA8IHRoaXMubUdhbWUuR1JJRF9TSVpFKSB7XG4gICAgICB0aGlzLm1YICs9IDE7XG4gICAgfSBlbHNlIGlmIChtb3ZlID09PSBNb3ZlLkxlZnQgJiYgdGhpcy5tWCA+IDEpIHtcbiAgICAgIHRoaXMubVggLT0gMTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm1lYXN1cmUoKTtcbiAgICB0aGlzLnNjb3JlKCk7XG4gIH1cblxuICBwdWJsaWMgbWVhc3VyZSgpOiBNZWFzdXJlbWVudCB7XG4gICAgdGhpcy5tR2FtZS5nZXRUaWxlKHRoaXMueCwgdGhpcy55KS5tZWFzdXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMubUdhbWUuZ2V0VGlsZSh0aGlzLngsIHRoaXMueSkubWVhc3VyZW1lbnQ7XG4gIH1cblxuICBwdWJsaWMgc2NvcmUoKTogdm9pZCB7XG4gICAgY29uc3QgdGlsZSA9IHRoaXMubUdhbWUuZ2V0VGlsZSh0aGlzLm1YLCB0aGlzLm1ZKTtcbiAgICBpZiAodGlsZS5oYXNXdW1wdXMpIHtcbiAgICAgIC8vIEFkZCB0ZXh0IGFuZCBhIFJlY3RhbmdsZSBiZWhpbmQgaXRcbiAgICAgIHRoaXMudXguYW5pbWF0ZSgpLmZpbGwoXCIjMDAwMDAwXCIpLnJhZGl1cyg1KTtcbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLm1HYW1lLmNhbnZhc1xuICAgICAgICAucmVjdCh0aGlzLm1HYW1lLlVYX1NJWkUsIHRoaXMubUdhbWUuVVhfU0laRSAvIHRoaXMubUdhbWUuR1JJRF9TSVpFKVxuICAgICAgICAuY2VudGVyKHRoaXMubUdhbWUuVVhfU0laRSAvIDIsIHRoaXMubUdhbWUuVVhfU0laRSAvIDIpLmZpbGwoXCIjMDAwMDAwXCIpO1xuICAgICAgY29uc3QgdGV4dCA9IHRoaXMubUdhbWUuY2FudmFzLnRleHQoXCJXdW1wdXMgYXRlIHlvdS5cIilcbiAgICAgICAgLmZvbnQoeyBmYW1pbHk6IFwiSGVsdmV0aWNhXCIsIHNpemU6IDYwLCBmaWxsOiBcIndoaXRlXCIgfSlcbiAgICAgICAgLmNlbnRlcih0aGlzLm1HYW1lLlVYX1NJWkUgLyAyLCB0aGlzLm1HYW1lLlVYX1NJWkUgLyAyKTtcbiAgICAgIC8vIFJlc2V0IHRoZSBnYW1lIDIgc2Vjb25kcyBsYXRlclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMubUdhbWUucmVzZXQoKTtcbiAgICAgICAgcmVjdC5yZW1vdmUoKTtcbiAgICAgICAgdGV4dC5yZW1vdmUoKTtcbiAgICAgIH0sIDI1MDApO1xuICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aWxlLmhhc1BpdCkge1xuICAgICAgdGhpcy51eC5hbmltYXRlKCkuZmlsbChcIiMwMDAwMDBcIikucmFkaXVzKDUpO1xuICAgICAgLy8gQWRkIHRleHQgYW5kIGEgUmVjdGFuZ2xlIGJlaGluZCBpdFxuICAgICAgY29uc3QgcmVjdCA9IHRoaXMubUdhbWUuY2FudmFzXG4gICAgICAgIC5yZWN0KHRoaXMubUdhbWUuVVhfU0laRSwgdGhpcy5tR2FtZS5VWF9TSVpFIC8gdGhpcy5tR2FtZS5HUklEX1NJWkUpXG4gICAgICAgIC5jZW50ZXIodGhpcy5tR2FtZS5VWF9TSVpFIC8gMiwgdGhpcy5tR2FtZS5VWF9TSVpFIC8gMikuZmlsbChcIiMwMDAwMDBcIik7XG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy5tR2FtZS5jYW52YXMudGV4dChcIk9vcHMsIHlvdSBmZWxsIGluIGEgUGl0LlwiKVxuICAgICAgICAuZm9udCh7IGZhbWlseTogXCJIZWx2ZXRpY2FcIiwgc2l6ZTogNjAsIGZpbGw6IFwid2hpdGVcIiB9KVxuICAgICAgICAuY2VudGVyKHRoaXMubUdhbWUuVVhfU0laRSAvIDIsIHRoaXMubUdhbWUuVVhfU0laRSAvIDIpO1xuICAgICAgLy8gUmVzZXQgdGhlIGdhbWUgMiBzZWNvbmRzIGxhdGVyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5tR2FtZS5yZXNldCgpO1xuICAgICAgICByZWN0LnJlbW92ZSgpO1xuICAgICAgICB0ZXh0LnJlbW92ZSgpO1xuICAgICAgfSwgMjUwMCk7XG4gICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRpbGUuaGFzR29sZCkge1xuICAgICAgdGhpcy51eC5hbmltYXRlKCkuZmlsbChcIiNGRkQwMDBcIikucmFkaXVzKDI1KTtcbiAgICAgIC8vIEFkZCB0ZXh0IGFuZCBhIFJlY3RhbmdsZSBiZWhpbmQgaXRcbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLm1HYW1lLmNhbnZhc1xuICAgICAgICAucmVjdCh0aGlzLm1HYW1lLlVYX1NJWkUsIHRoaXMubUdhbWUuVVhfU0laRSAvIHRoaXMubUdhbWUuR1JJRF9TSVpFKVxuICAgICAgICAuY2VudGVyKHRoaXMubUdhbWUuVVhfU0laRSAvIDIsIHRoaXMubUdhbWUuVVhfU0laRSAvIDIpLmZpbGwoXCIjRkZEMDAwXCIpO1xuICAgICAgY29uc3QgdGV4dCA9IHRoaXMubUdhbWUuY2FudmFzLnRleHQoXCJZb3UgV29uIEdPTEQhLlwiKVxuICAgICAgICAuZm9udCh7IGZhbWlseTogXCJIZWx2ZXRpY2FcIiwgc2l6ZTogNjAsIGZpbGw6IFwiYmxhY2tcIiB9KVxuICAgICAgICAuY2VudGVyKHRoaXMubUdhbWUuVVhfU0laRSAvIDIsIHRoaXMubUdhbWUuVVhfU0laRSAvIDIpO1xuICAgICAgLy8gUmVzZXQgdGhlIGdhbWUgMiBzZWNvbmRzIGxhdGVyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5tR2FtZS5yZXNldCgpO1xuICAgICAgICByZWN0LnJlbW92ZSgpO1xuICAgICAgICB0ZXh0LnJlbW92ZSgpO1xuICAgICAgfSwgMjUwMCk7XG4gICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5tWCA9IDE7XG4gICAgdGhpcy5tWSA9IDE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLnV4LmZpbmlzaCgpO1xuICAgIHRoaXMudXguZmlsbChcIiNmMDZcIik7XG4gICAgdGhpcy51eC5yYWRpdXMoMTApO1xuICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgdGhpcy51eC5maW5pc2goKTtcbiAgICBjb25zdCBCTE9DS19TSVpFID0gdGhpcy5tR2FtZS5VWF9TSVpFIC8gdGhpcy5tR2FtZS5HUklEX1NJWkU7XG4gICAgdGhpcy51eC5hbmltYXRlKCkuY2VudGVyKEJMT0NLX1NJWkUgKiB0aGlzLm1YIC0gQkxPQ0tfU0laRSAvIDIsXG4gICAgICB0aGlzLm1HYW1lLlVYX1NJWkUgLSBCTE9DS19TSVpFICogdGhpcy5tWSArIEJMT0NLX1NJWkUgLyAyKTtcbiAgICB0aGlzLmNvbnNvbGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc29sZSgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLm1HYW1lLmdldFRpbGUodGhpcy5tWCwgdGhpcy5tWSk7XG4gICAgaWYgKHBvcy5oYXNHb2xkKSB7XG4gICAgICAkKFwiI2FnZW50LWNvbnNvbGVcIikuaHRtbChcIlRoYW5rIHlvdSBmb3IgaGVscGluZyBtZSBmaW5kIGFsbCB0aGlzIGdvbGRcIik7XG4gICAgfSBlbHNlIGlmIChwb3MuaGFzUGl0IHx8IHBvcy5oYXNXdW1wdXMpIHtcbiAgICAgICQoXCIjYWdlbnQtY29uc29sZVwiKS5odG1sKFwiWW91IHdlcmUgc3VwcG9zZWQgdG8gaGVscCBtZSwgSSBhbSBkZWFkIG5vdy5cIik7XG4gICAgfSBlbHNlIGlmIChwb3MuaGFzU3RlbmNoICYmIHBvcy5oYXNCcmVlemUpIHtcbiAgICAgICQoXCIjYWdlbnQtY29uc29sZVwiKS5odG1sKFwiVGhlcmUgaXMgYSA8c3Ryb25nPnN0ZW5jaDwvc3Ryb25nPiBhbmQgdGhlcmUgaXMgYSA8c3Ryb25nPmJyZWV6ZTwvc3Ryb25nPiEhIVwiKTtcbiAgICB9IGVsc2UgaWYgKHBvcy5oYXNTdGVuY2gpIHtcbiAgICAgICQoXCIjYWdlbnQtY29uc29sZVwiKS5odG1sKFwiV2hhdCdzIHRoYXQgPHN0cm9uZz5zdGVuY2g/PC9zdHJvbmc+IFd1bXB1cyBtdXN0IGJlIGFyb3VuZC5cIik7XG4gICAgfSBlbHNlIGlmIChwb3MuaGFzQnJlZXplKSB7XG4gICAgICAkKFwiI2FnZW50LWNvbnNvbGVcIikuaHRtbChcIlRoZXJlIGlzIGEgPHN0cm9uZz5icmVlemU8L3N0cm9uZz4uIENhcmVmdWwgbm90IHRvIGZhbGwgaW4gYSBwaXQuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKFwiI2FnZW50LWNvbnNvbGVcIikuaHRtbChcIkkgZmVlbCA8c3Ryb25nPnNhZmU8L3N0cm9uZz4gaGVyZSwgbm90aGluZyBhcm91bmQuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZW51bSBNb3ZlIHtcbiAgTGVmdCwgUmlnaHQsIFVwLCBEb3duLFxufVxuIiwiaW1wb3J0IHsgR3JpZCB9IGZyb20gXCIuL2dyaWRcIjtcblxuZGVjbGFyZSB2YXIgU1ZHOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJpbmcge1xuXG4gIHByb3RlY3RlZCBjYW52YXM6IGFueVtdID0gW107XG4gIHByb3RlY3RlZCBnYW1lOiBHcmlkO1xuICBwcml2YXRlIGNhbnZhc1BhcmVudDogYW55O1xuICBwcml2YXRlIHJlYWRvbmx5IEVMRU1FTlQgPSBcImRyYXdpbmctbW9kZWxzXCI7XG4gIHByaXZhdGUgcmVhZG9ubHkgVVhfU0laRSA9IDI1MDtcblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgbmV3IGFuYWx5c2lzIHNwYWNlLCBtYWtlcyA4IGJvYXJkcywgYW5kIDIgdGV4dC1vdXRwdXRzXG4gICAqIGFuZCBzdG9yZXMgdGhlbSBhcyBuZXN0ZWQgU1ZHIGluIHRoaXMuY2FudmFzW10uXG4gICAqXG4gICAqIEBwYXJhbSBnYW1lXG4gICAqXG4gICAqIEBub3Rlc1xuICAgKlxuICAgKiBUaGUgc3BhY2Ugb24gdGhlIFgtYXhpcyBvZiBjYW52YXMgaXMgYWxsb3R0ZWQgYXMgZm9sbG93czpcbiAgICogIDEuMDAgKiBVWF9TSVpFICogNDogTW9kZWxzIGZvciBFYWNoIHBvc3NpYmxlIG1vdmVcbiAgICogIDAuMDEgKiBVWF9TSVpFICogNDogc2VwYXJhdG9yIHNwYWNlXG4gICAqICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAqICBUT1RBTDogNC4wNCAqIFVYX1NJWkUgb24gdGhlIFkgQXhpc1xuICAgKlxuICAgKiBUaGUgc3BhY2Ugb24gdGhlIFktYXhpcyBvZiBjYW52YXMgaXMgYWxsb3R0ZWQgYXMgZm9sbG93czpcbiAgICogIDAuMjUgKiBVWF9TSVpFOiBCYW5uZXIgb2Ygd2hhdCBtb3ZlIGl0IGlzXG4gICAqICAxLjAwICogVVhfU0laRTogTW9kZWxzIGZvciBXdW1wdXNcbiAgICogIDAuMDEgKiBVWF9TSVpFOiBzZXBhcmF0b3Igc3BhY2VcbiAgICogIDAuMjUgKiBVWF9TSVpFOiBCYW5uZXIgb2Ygd2hhdCBtb3ZlIGl0IGlzXG4gICAqICAxLjAwICogVVhfU0laRTogTW9kZWxzIGZvciBQaXRcbiAgICogIDAuMDQgKiBVWF9TSVpFOiBzZXBhcmF0b3Igc3BhY2VcbiAgICogIDAuMjUgKiBVWF9TSVpFOiBDb25jbHVzaW9ucyBmb3IgdGhlIG1vdmVcbiAgICogID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICogIFRPVEFMOiAyLjgwICogVVhfU0laRSBvbiB0aGUgWSBBeGlzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnYW1lOiBHcmlkKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAvLyBJbml0aWFsaXppbmcgdGhlIDggbmVzdGVkIFNWRyBjYW52YXNlcyBmb3IgZWFjaCBmdXR1cmUgbW92ZVxuICAgIHRoaXMuY2FudmFzUGFyZW50ID0gU1ZHKHRoaXMuRUxFTUVOVCkuc2l6ZSh0aGlzLlVYX1NJWkUgKiA0LjA0LCB0aGlzLlVYX1NJWkUgKiAyLjc3KTtcbiAgICBjb25zdCBtb3ZlVGV4dHMgPSBbXCJSaWdodFwiLCBcIlVwXCIsIFwiTGVmdFwiLCBcIkRvd25cIl07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgIC8vIEdlbmVyYXRlIHRoZSBCYW5uZXIgZm9yIFd1bXB1c1xuICAgICAgdGhpcy5jYW52YXNQYXJlbnQucmVjdCh0aGlzLlVYX1NJWkUsIHRoaXMuVVhfU0laRSAqIDAuMjUpXG4gICAgICAgIC5jZW50ZXIoKGkgKiAxLjAxICsgMC41KSAqIHRoaXMuVVhfU0laRSwgMC4xMjUgKiB0aGlzLlVYX1NJWkUpXG4gICAgICAgIC5maWxsKHsgY29sb3I6IFwiIzAwMDAwMFwiIH0pO1xuICAgICAgdGhpcy5jYW52YXNQYXJlbnQudGV4dChcIk1vdmUgXCIgKyBtb3ZlVGV4dHNbaV0gKyBcIiwgQ2hlY2sgV3VtcHVzXCIpXG4gICAgICAgIC5jZW50ZXIoKGkgKiAxLjAxICsgMC41KSAqIHRoaXMuVVhfU0laRSwgMC4xMjUgKiB0aGlzLlVYX1NJWkUpXG4gICAgICAgIC5mb250KHsgZmlsbDogXCIjZmZmZmZmXCIgfSk7XG4gICAgICAvLyBHZW5lcmF0ZSBNb2RlbHMgZm9yIFd1bXB1c1xuICAgICAgdGhpcy5jYW52YXNbaV0gPSB0aGlzLmNhbnZhc1BhcmVudC5uZXN0ZWQoKS5zaXplKHRoaXMuVVhfU0laRSwgdGhpcy5VWF9TSVpFKTtcbiAgICAgIHRoaXMuY2FudmFzW2ldLmNlbnRlcigoaSAqIDEuMDEgKyAwLjUpICogdGhpcy5VWF9TSVpFLCAwLjc1ICogdGhpcy5VWF9TSVpFKTtcbiAgICAgIC8vIEdlbmVyYXRlIHRoZSBCYW5uZXIgZm9yIFBpdHNcbiAgICAgIHRoaXMuY2FudmFzUGFyZW50LnJlY3QodGhpcy5VWF9TSVpFLCB0aGlzLlVYX1NJWkUgKiAwLjI1KVxuICAgICAgICAuY2VudGVyKChpICogMS4wMSArIDAuNSkgKiB0aGlzLlVYX1NJWkUsIDEuMzg1ICogdGhpcy5VWF9TSVpFKVxuICAgICAgICAuZmlsbCh7IGNvbG9yOiBcIiMwMDAwMDBcIiB9KTtcbiAgICAgIHRoaXMuY2FudmFzUGFyZW50LnRleHQoXCJNb3ZlIFwiICsgbW92ZVRleHRzW2ldICsgXCIsIENoZWNrIFBpdFwiKVxuICAgICAgICAuY2VudGVyKChpICogMS4wMSArIDAuNSkgKiB0aGlzLlVYX1NJWkUsIDEuMzg1ICogdGhpcy5VWF9TSVpFKVxuICAgICAgICAuZm9udCh7IGZpbGw6IFwiI2ZmZmZmZlwiIH0pO1xuICAgICAgLy8gR2VuZXJhdGUgTW9kZWxzIGZvciBQaXRzXG4gICAgICB0aGlzLmNhbnZhc1tpICsgNF0gPSB0aGlzLmNhbnZhc1BhcmVudC5uZXN0ZWQoKS5zaXplKHRoaXMuVVhfU0laRSwgdGhpcy5VWF9TSVpFKTtcbiAgICAgIHRoaXMuY2FudmFzW2kgKyA0XS5jZW50ZXIoKGkgKiAxLjAxICsgMC41KSAqIHRoaXMuVVhfU0laRSwgMi4wMSAqIHRoaXMuVVhfU0laRSk7XG4gICAgICAvLyBHZW5lcmF0ZSB0aGUgUmVzdWx0c1xuICAgICAgdGhpcy5jYW52YXNbaSArIDhdID0gdGhpcy5jYW52YXNQYXJlbnQubmVzdGVkKCkuc2l6ZSh0aGlzLlVYX1NJWkUsIHRoaXMuVVhfU0laRSAqIDAuMjUpO1xuICAgICAgdGhpcy5jYW52YXNbaSArIDhdLmNlbnRlcigoaSAqIDEuMDEgKyAwLjUpICogdGhpcy5VWF9TSVpFLCAyLjY3NSAqIHRoaXMuVVhfU0laRSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVycyBhbGwgcG9zc2libGUgbW9kZWxzIG9mIHRoZSBmdXR1cmUgYW5kIHdoeSB0aGV5IGhvbGQgdHJ1ZSBvciBmYWxzZS5cbiAgICogQ3VycmVudGx5IHRyaWVzIHRvIGZpbHRlciB1dGlsaXppbmcgdGhlIGZlYXR1cmVzIG9mIHRoaXMgc3BhY2UuXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGN1clggPSB0aGlzLmdhbWUuYWdlbnQueDtcbiAgICBjb25zdCBjdXJZID0gdGhpcy5nYW1lLmFnZW50Lnk7XG4gICAgY29uc3QgdmFsaWQ6IGJvb2xlYW5bXSA9IFtdO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgODsgeCsrKSB7XG4gICAgICAvLyBkZWxldGUgdGhlIG9sZCBncmlkIGFuZCBhc3N1bWUgbW9kZWwgaXMgdmFsaWRcbiAgICAgIHRoaXMuY2FudmFzW3hdLmNsZWFyKCk7XG4gICAgICB2YWxpZFt4XSA9IHRydWU7XG4gICAgICAvLyBnZW5lcmF0aW5nIHRoZSBpbmRleCBvZiB0aGUgbmV4dCB0aWxlXG4gICAgICBsZXQgcG9zWCA9IGN1clg7XG4gICAgICBsZXQgcG9zWSA9IGN1clk7XG4gICAgICBpZiAoKHggPT09IDAgfHwgeCA9PT0gNCkgJiYgKGN1clggPCB0aGlzLmdhbWUuR1JJRF9TSVpFKSkge1xuICAgICAgICBwb3NYKys7XG4gICAgICB9IGVsc2UgaWYgKCh4ID09PSAxIHx8IHggPT09IDUpICYmIChjdXJZIDwgdGhpcy5nYW1lLkdSSURfU0laRSkpIHtcbiAgICAgICAgcG9zWSsrO1xuICAgICAgfSBlbHNlIGlmICgoeCA9PT0gMiB8fCB4ID09PSA2KSAmJiAoY3VyWCA+IDEpKSB7XG4gICAgICAgIHBvc1gtLTtcbiAgICAgIH0gZWxzZSBpZiAoKHggPT09IDMgfHwgeCA9PT0gNykgJiYgKGN1clkgPiAxKSkge1xuICAgICAgICBwb3NZLS07XG4gICAgICB9XG4gICAgICAvLyBRdWl0IGlmIHRoZXJlIGFyZSBubyB2YWxpZCBtb3Zlc1xuICAgICAgaWYgKGN1clggPT09IHBvc1ggJiYgY3VyWSA9PT0gcG9zWSkge1xuICAgICAgICB0aGlzLmNhbnZhc1t4XS5yZWN0KHRoaXMuVVhfU0laRSwgdGhpcy5VWF9TSVpFKVxuICAgICAgICAgIC5maWxsKHsgY29sb3I6IFwiI2RkZFwiLCBvcGFjaXR5OiBcIjAuNVwiIH0pO1xuICAgICAgICB0aGlzLmNhbnZhc1t4XS5yZWN0KHRoaXMuVVhfU0laRSwgdGhpcy5VWF9TSVpFICogMC4yKVxuICAgICAgICAgIC5maWxsKHsgY29sb3I6IFwiI2YwMFwiLCBvcGFjaXR5OiBcIjAuMlwiIH0pXG4gICAgICAgICAgLmNlbnRlcih0aGlzLlVYX1NJWkUgLyAyLCB0aGlzLlVYX1NJWkUgLyAyKTtcbiAgICAgICAgdGhpcy5jYW52YXNbeF0udGV4dChcIkludmFsaWQgTW92ZVwiKVxuICAgICAgICAgIC5mb250KHsgd2VpZ2h0OiBcImJvbGRcIiB9KVxuICAgICAgICAgIC5jZW50ZXIodGhpcy5VWF9TSVpFIC8gMiwgdGhpcy5VWF9TSVpFIC8gMik7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgLy8gY2hlY2sgaWYgbW9kZWwgY29udHJhZGljdHMgdGhlIGN1cnJlbnQga25vd2xlZGdlIGJhc2VcbiAgICAgIGlmICh0aGlzLmdhbWUuZ2V0VGlsZShwb3NYLCBwb3NZKS5tZWFzdXJlZCkge1xuICAgICAgICB2YWxpZFt4XSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gZmluZGluZyB0aGUgbmVpZ2hib3JzIGFmdGVyIHRoZSBtb3ZlXG4gICAgICBjb25zdCBsaXN0OiBib29sZWFuW10gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLkdSSURfU0laRSAqIHRoaXMuZ2FtZS5HUklEX1NJWkU7IGkrKykge1xuICAgICAgICBsaXN0W2ldID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IHRpbGUgb2YgdGhpcy5nYW1lLmdldE5laWdoYm9ycyh0aGlzLmdhbWUuZ2V0VGlsZShwb3NYLCBwb3NZKSkpIHtcbiAgICAgICAgbGlzdFt0aGlzLmdhbWUuR1JJRF9TSVpFICogKHRpbGUueCAtIDEpICsgKHRpbGUueSAtIDEpXSA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBjcmVhdGluZyB0aGUgZnVsbCBncmlkXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gNDsgaisrKSB7XG4gICAgICAgICAgLy8gR2VuZXJhdGUgdGhlIHRpbGVcbiAgICAgICAgICBjb25zdCByID0gdGhpcy5jYW52YXNbeF1cbiAgICAgICAgICAgIC5yZWN0KCgwLjI1KSAqIHRoaXMuVVhfU0laRSwgKDAuMjUpICogdGhpcy5VWF9TSVpFIClcbiAgICAgICAgICAgIC5jZW50ZXIoKGkgLSAwLjUpICogdGhpcy5VWF9TSVpFIC8gNCwgKDQuNSAtIGopICogdGhpcy5VWF9TSVpFIC8gNCk7XG4gICAgICAgICAgY29uc3QgcyA9IHRoaXMuY2FudmFzW3hdXG4gICAgICAgICAgICAucmVjdCgoMC4xNSkgKiB0aGlzLlVYX1NJWkUsICgwLjE1KSAqIHRoaXMuVVhfU0laRSApXG4gICAgICAgICAgICAuY2VudGVyKChpIC0gMC41KSAqIHRoaXMuVVhfU0laRSAvIDQsICg0LjUgLSBqKSAqIHRoaXMuVVhfU0laRSAvIDQpO1xuICAgICAgICAgIC8vIENvcHlpbmcgdGhlIG1lYXN1cmVtZW50IGNvbG9yc1xuICAgICAgICAgIGlmICh0aGlzLmdhbWUuZ2V0VGlsZShpLCBqKS5tZWFzdXJlZCkge1xuICAgICAgICAgICAgci5maWxsKHsgY29sb3I6IHRoaXMuZ2FtZS5nZXRUaWxlKGksIGopLm1lYXN1cmVtZW50IH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByLmZpbGwoeyBjb2xvcjogXCIjZGRkZGRkXCIgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4IDwgNCkge1xuICAgICAgICAgICAgLy8gRGVhbGluZyB3aXRoIFd1bXB1cyBoZXJlXG4gICAgICAgICAgICBpZiAobGlzdFt0aGlzLmdhbWUuR1JJRF9TSVpFICogKGkgLSAxKSArIChqIC0gMSldKSB7XG4gICAgICAgICAgICAgIHMuZmlsbCh7IGNvbG9yOiBcIiNmZjM4MzdcIiB9KTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5nZXRUaWxlKGksIGopLm1lYXN1cmVkICYmICF0aGlzLmdhbWUuZ2V0VGlsZShpLCBqKS5oYXNTdGVuY2gpIHtcbiAgICAgICAgICAgICAgICB2YWxpZFt4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzW3hdLnRleHQoXCJ4XCIpLmZvbnQoeyBmaWxsOiBcIiNmZmZmZmZcIiwgd2VpZ2h0OiBcImJvbGRcIiwgc2l6ZTogXCJsYXJnZVwiIH0pXG4gICAgICAgICAgICAgICAgICAuY2VudGVyKChpIC0gMC41KSAqIHRoaXMuVVhfU0laRSAvIDQsICg0LjUgLSBqKSAqIHRoaXMuVVhfU0laRSAvIDQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzLmZpbGwoeyBjb2xvcjogXCIjNGU5ZDM2XCIgfSk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUuZ2V0VGlsZShpLCBqKS5tZWFzdXJlZCAmJiB0aGlzLmdhbWUuZ2V0VGlsZShpLCBqKS5oYXNTdGVuY2gpIHtcbiAgICAgICAgICAgICAgICB2YWxpZFt4XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzW3hdLnRleHQoXCJ4XCIpLmZvbnQoeyBmaWxsOiBcIiNmZmZmZmZcIiwgd2VpZ2h0OiBcImJvbGRcIiwgc2l6ZTogXCJsYXJnZVwiIH0pXG4gICAgICAgICAgICAgICAgICAuY2VudGVyKChpIC0gMC41KSAqIHRoaXMuVVhfU0laRSAvIDQsICg0LjUgLSBqKSAqIHRoaXMuVVhfU0laRSAvIDQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh4IDwgOCkge1xuICAgICAgICAgICAgLy8gRGVhbGluZyB3aXRoIFBpdHMgaGVyZVxuICAgICAgICAgICAgaWYgKGxpc3RbdGhpcy5nYW1lLkdSSURfU0laRSAqIChpIC0gMSkgKyAoaiAtIDEpXSkge1xuICAgICAgICAgICAgICBzLmZpbGwoeyBjb2xvcjogXCIjNjQ2NDY0XCIgfSk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUuZ2V0VGlsZShpLCBqKS5tZWFzdXJlZCAmJiAhdGhpcy5nYW1lLmdldFRpbGUoaSwgaikuaGFzQnJlZXplKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRbeF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhc1t4XS50ZXh0KFwieFwiKS5mb250KHsgZmlsbDogXCIjZmZmZmZmXCIsIHdlaWdodDogXCJib2xkXCIsIHNpemU6IFwibGFyZ2VcIiB9KVxuICAgICAgICAgICAgICAgICAgLmNlbnRlcigoaSAtIDAuNSkgKiB0aGlzLlVYX1NJWkUgLyA0LCAoNC41IC0gaikgKiB0aGlzLlVYX1NJWkUgLyA0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcy5maWxsKHsgY29sb3I6IFwiI2ZmZmZmZlwiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBSZW5kZXIgdGhlIGFnZW50IGl0c2VsZlxuICAgICAgICAgIGlmIChwb3NYID09PSBpICYmIHBvc1kgPT09IGopIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzW3hdLmNpcmNsZSgxMCkuZmlsbCh7IGNvbG9yOiBcIiNmZjAwNjZcIiB9KVxuICAgICAgICAgICAgICAuY2VudGVyKChpIC0gMC41KSAqIHRoaXMuVVhfU0laRSAvIDQsICg0LjUgLSBqKSAqIHRoaXMuVVhfU0laRSAvIDQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ2hlY2sgYW5kIGxhYmVsIGlmIHRoZSBtb2RlbCB3YXMgdmFsaWQgb3Igbm90XG4gICAgICBpZiAoIXZhbGlkW3hdKSB7XG4gICAgICAgIHRoaXMuY2FudmFzW3hdLnJlY3QodGhpcy5VWF9TSVpFLCB0aGlzLlVYX1NJWkUgKiAwLjIpXG4gICAgICAgICAgLmZpbGwoeyBjb2xvcjogXCIjZjAwXCIsIG9wYWNpdHk6IFwiMC4yXCIgfSlcbiAgICAgICAgICAuY2VudGVyKHRoaXMuVVhfU0laRSAvIDIsIHRoaXMuVVhfU0laRSAvIDIpO1xuICAgICAgICB0aGlzLmNhbnZhc1t4XS50ZXh0KFwiTW9kZWwgSW52YWxpZCwgU3F1YXJlIFNhZmVcIilcbiAgICAgICAgICAuZm9udCh7IHdlaWdodDogXCJib2xkXCIgfSlcbiAgICAgICAgICAuY2VudGVyKHRoaXMuVVhfU0laRSAvIDIsIHRoaXMuVVhfU0laRSAvIDIpO1xuICAgICAgfSBlbHNlIGlmICh2YWxpZFt4XSkge1xuICAgICAgICB0aGlzLmNhbnZhc1t4XS5yZWN0KHRoaXMuVVhfU0laRSwgdGhpcy5VWF9TSVpFICogMC4yKVxuICAgICAgICAgIC5maWxsKHsgY29sb3I6IFwiIzAwZmYwMFwiLCBvcGFjaXR5OiBcIjAuMlwiIH0pXG4gICAgICAgICAgLmNlbnRlcih0aGlzLlVYX1NJWkUgLyAyLCB0aGlzLlVYX1NJWkUgLyAyKTtcbiAgICAgICAgdGhpcy5jYW52YXNbeF0udGV4dChcIk1vZGVsIGlzIENvcnJlY3QsIE1vdmUgaXMgUmlza3kuXCIpXG4gICAgICAgICAgLmZvbnQoeyB3ZWlnaHQ6IFwiYm9sZFwiIH0pXG4gICAgICAgICAgLmNlbnRlcih0aGlzLlVYX1NJWkUgLyAyLCB0aGlzLlVYX1NJWkUgLyAyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gTGFiZWwgZm9yIGVhY2ggbW92ZSB3aGV0aGVyIGl0IHNob3VsZCBiZSBwbGF5ZWQgb3Igbm90XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgIHRoaXMuY2FudmFzW2kgKyA4XS5jbGVhcigpO1xuICAgICAgaWYgKHZhbGlkW2ldIHx8IHZhbGlkW2kgKyA0XSkge1xuICAgICAgICB0aGlzLmNhbnZhc1tpICsgOF0ucmVjdCh0aGlzLlVYX1NJWkUsIHRoaXMuVVhfU0laRSAqIDAuMjUpXG4gICAgICAgICAgLmZpbGwoeyBjb2xvcjogXCIjZmY3YjY5XCIgfSk7XG4gICAgICAgIHRoaXMuY2FudmFzW2kgKyA4XS50ZXh0KFwiV2UgYWluJ3QgZG9pbmcgdGhpcy5cIilcbiAgICAgICAgICAuY2VudGVyKHRoaXMuVVhfU0laRSAqIDAuNSwgdGhpcy5VWF9TSVpFICogMC4xMjUpXG4gICAgICAgICAgLmZvbnQoeyB3ZWlnaHQ6IFwiYm9sZFwiIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYW52YXNbaSArIDhdLnJlY3QodGhpcy5VWF9TSVpFLCB0aGlzLlVYX1NJWkUgKiAwLjI1KVxuICAgICAgICAgIC5maWxsKHsgY29sb3I6IFwiIzg5ZmY0ZlwiIH0pO1xuICAgICAgICB0aGlzLmNhbnZhc1tpICsgOF0udGV4dChcIlRoaXMgaXMgU2FmZSwgR29vZCB0byBHby5cIilcbiAgICAgICAgICAuY2VudGVyKHRoaXMuVVhfU0laRSAqIDAuNSwgdGhpcy5VWF9TSVpFICogMC4xMjUpXG4gICAgICAgICAgLmZvbnQoeyB3ZWlnaHQ6IFwiYm9sZFwiIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgR3JpZCB9IGZyb20gXCIuL2dyaWRcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBHb2RTaWdodCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzOiBhbnk7XG4gIHByaXZhdGUgcmVhZG9ubHkgQ0VOVEVSUzogbnVtYmVyW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBCTE9DS19TSVpFOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgR1JJRF9TSVpFOiBudW1iZXI7XG4gIHByaXZhdGUgdGlsZXM6IFRpbGVbXVtdID0gW107XG4gIHByaXZhdGUgZGlzcGxheWVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZ2FtZTogR3JpZCkge1xuICAgIHRoaXMuY2FudmFzID0gZ2FtZS5jYW52YXMubmVzdGVkKCk7XG4gICAgdGhpcy5CTE9DS19TSVpFID0gZ2FtZS5VWF9TSVpFIC8gZ2FtZS5HUklEX1NJWkU7XG4gICAgdGhpcy5HUklEX1NJWkUgPSBnYW1lLkdSSURfU0laRTtcbiAgICB0aGlzLnRpbGVzID0gZ2FtZS50aWxlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR1JJRF9TSVpFOyBpKyspIHtcbiAgICAgIHRoaXMuQ0VOVEVSU1tpXSA9IHRoaXMuQkxPQ0tfU0laRSAqIGkgKyB0aGlzLkJMT0NLX1NJWkUgLyAyO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzcGxheWVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5HUklEX1NJWkU7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLkdSSURfU0laRTsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW2ldW2pdLmhhc1N0ZW5jaCkge1xuICAgICAgICAgIGNvbnN0IHMxID0gdGhpcy5jYW52YXMucmVjdCh0aGlzLkJMT0NLX1NJWkUgKiAwLjYsIHRoaXMuQkxPQ0tfU0laRSAqIDAuMTUpO1xuICAgICAgICAgIHMxLmNlbnRlcih0aGlzLkNFTlRFUlNbaV0sIHRoaXMuQ0VOVEVSU1tqXSAtIHRoaXMuQkxPQ0tfU0laRSAqIDAuMjUpO1xuICAgICAgICAgIHMxLmZpbGwoeyBjb2xvcjogXCIjZmYwMDAwXCIsIG9wYWNpdHk6IDAuMyB9KTtcbiAgICAgICAgICBjb25zdCB0MSA9IHRoaXMuY2FudmFzLnRleHQoXCJTdGVuY2hcIik7XG4gICAgICAgICAgdDEuY2VudGVyKHRoaXMuQ0VOVEVSU1tpXSwgdGhpcy5DRU5URVJTW2pdIC0gdGhpcy5CTE9DS19TSVpFICogMC4yNSk7XG4gICAgICAgICAgdDEuZm9udCh7IHdlaWdodDogXCJib2xkXCIsIGZpbGw6IFwiYmxhY2tcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50aWxlc1tpXVtqXS5oYXNXdW1wdXMpIHtcbiAgICAgICAgICBjb25zdCBzMiA9IHRoaXMuY2FudmFzLnJlY3QodGhpcy5CTE9DS19TSVpFICogMC42LCB0aGlzLkJMT0NLX1NJWkUgKiAwLjE1KTtcbiAgICAgICAgICBzMi5jZW50ZXIodGhpcy5DRU5URVJTW2ldLCB0aGlzLkNFTlRFUlNbal0gLSB0aGlzLkJMT0NLX1NJWkUgKiAwLjEwKTtcbiAgICAgICAgICBzMi5maWxsKHsgY29sb3I6IFwiI2ZmMDAwMFwiLCBvcGFjaXR5OiAxLjAgfSk7XG4gICAgICAgICAgY29uc3QgdDIgPSB0aGlzLmNhbnZhcy50ZXh0KFwiV3VtcHVzXCIpO1xuICAgICAgICAgIHQyLmNlbnRlcih0aGlzLkNFTlRFUlNbaV0sIHRoaXMuQ0VOVEVSU1tqXSAtIHRoaXMuQkxPQ0tfU0laRSAqIDAuMTApO1xuICAgICAgICAgIHQyLmZvbnQoeyB3ZWlnaHQ6IFwiYm9sZFwiLCBmaWxsOiBcIndoaXRlXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGlsZXNbaV1bal0uaGFzR29sZCkge1xuICAgICAgICAgIGNvbnN0IHM1ID0gdGhpcy5jYW52YXMucmVjdCh0aGlzLkJMT0NLX1NJWkUgKiAwLjYsIHRoaXMuQkxPQ0tfU0laRSAqIDAuMTUpO1xuICAgICAgICAgIHM1LmNlbnRlcih0aGlzLkNFTlRFUlNbaV0sIHRoaXMuQ0VOVEVSU1tqXSArIHRoaXMuQkxPQ0tfU0laRSAqIDAuMDApO1xuICAgICAgICAgIHM1LmZpbGwoeyBjb2xvcjogXCIjZmZmZjAwXCIsIG9wYWNpdHk6IDEuMCB9KTtcbiAgICAgICAgICBjb25zdCB0NSA9IHRoaXMuY2FudmFzLnRleHQoXCJHb2xkXCIpO1xuICAgICAgICAgIHQ1LmNlbnRlcih0aGlzLkNFTlRFUlNbaV0sIHRoaXMuQ0VOVEVSU1tqXSArIHRoaXMuQkxPQ0tfU0laRSAqIDAuMDApO1xuICAgICAgICAgIHQ1LmZvbnQoeyB3ZWlnaHQ6IFwiYm9sZFwiLCBmaWxsOiBcImJsYWNrXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGlsZXNbaV1bal0uaGFzUGl0KSB7XG4gICAgICAgICAgY29uc3QgczMgPSB0aGlzLmNhbnZhcy5yZWN0KHRoaXMuQkxPQ0tfU0laRSAqIDAuNiwgdGhpcy5CTE9DS19TSVpFICogMC4xNSk7XG4gICAgICAgICAgczMuY2VudGVyKHRoaXMuQ0VOVEVSU1tpXSwgdGhpcy5DRU5URVJTW2pdICsgdGhpcy5CTE9DS19TSVpFICogMC4xMCk7XG4gICAgICAgICAgczMuZmlsbCh7IGNvbG9yOiBcIiMwMDAwMDBcIiwgb3BhY2l0eTogMS4wIH0pO1xuICAgICAgICAgIGNvbnN0IHQzID0gdGhpcy5jYW52YXMudGV4dChcIlBpdFwiKTtcbiAgICAgICAgICB0My5jZW50ZXIodGhpcy5DRU5URVJTW2ldLCB0aGlzLkNFTlRFUlNbal0gKyB0aGlzLkJMT0NLX1NJWkUgKiAwLjEwKTtcbiAgICAgICAgICB0My5mb250KHsgd2VpZ2h0OiBcImJvbGRcIiwgZmlsbDogXCJ3aGl0ZVwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW2ldW2pdLmhhc0JyZWV6ZSkge1xuICAgICAgICAgIGNvbnN0IHM0ID0gdGhpcy5jYW52YXMucmVjdCh0aGlzLkJMT0NLX1NJWkUgKiAwLjYsIHRoaXMuQkxPQ0tfU0laRSAqIDAuMTUpO1xuICAgICAgICAgIHM0LmNlbnRlcih0aGlzLkNFTlRFUlNbaV0sIHRoaXMuQ0VOVEVSU1tqXSArIHRoaXMuQkxPQ0tfU0laRSAqIDAuMjUpO1xuICAgICAgICAgIHM0LmZpbGwoeyBjb2xvcjogXCIjMDAwMDAwXCIsIG9wYWNpdHk6IDAuMyB9KTtcbiAgICAgICAgICBjb25zdCB0NCA9IHRoaXMuY2FudmFzLnRleHQoXCJCcmVlemVcIik7XG4gICAgICAgICAgdDQuY2VudGVyKHRoaXMuQ0VOVEVSU1tpXSwgdGhpcy5DRU5URVJTW2pdICsgdGhpcy5CTE9DS19TSVpFICogMC4yNSk7XG4gICAgICAgICAgdDQuZm9udCh7IHdlaWdodDogXCJib2xkXCIsIGZpbGw6IFwiYmxhY2tcIiB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRpc3BsYXllZCA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xuICAgIHRoaXMuZGlzcGxheWVkID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFnZW50LCBNb3ZlIH0gZnJvbSBcIi4vYWdlbnRcIjtcbmltcG9ydCB7IE1lYXN1cmVtZW50LCBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuaW1wb3J0IHsgRmlsdGVyaW5nIH0gZnJvbSBcIi4vZmlsdGVyaW5nXCI7XG5cbmRlY2xhcmUgdmFyICQ6IGFueTtcbmRlY2xhcmUgdmFyIFNWRzogYW55O1xuXG5leHBvcnQgY2xhc3MgR3JpZCB7XG5cbiAgcHVibGljIHJlYWRvbmx5IEdSSURfU0laRTogbnVtYmVyID0gNDtcbiAgcHVibGljIHJlYWRvbmx5IFVYX1NJWkU6IG51bWJlciA9IDYwMDtcbiAgcHVibGljIHJlYWRvbmx5IEVMRU1FTlQ6IHN0cmluZyA9IFwiZHJhd2luZ1wiO1xuICBwdWJsaWMgY2FudmFzOiBhbnk7XG4gIHB1YmxpYyBhZ2VudDogQWdlbnQ7XG4gIHB1YmxpYyBtb2RlbEZpbHRlcjogRmlsdGVyaW5nO1xuICBwdWJsaWMgdGlsZXM6IFRpbGVbXVtdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdSSURfU0laRTsgaSsrKSB7XG4gICAgICB0aGlzLnRpbGVzW2ldID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuR1JJRF9TSVpFOyBqKyspIHtcbiAgICAgICAgdGhpcy50aWxlc1tpXVtqXSA9IG5ldyBUaWxlKGkgKyAxLCB0aGlzLkdSSURfU0laRSAtIGosXG4gICAgICAgICAgdGhpcy5VWF9TSVpFIC8gdGhpcy5HUklEX1NJWkUpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMuYWdlbnQgPSBuZXcgQWdlbnQodGhpcyk7XG4gICAgdGhpcy5tb2RlbEZpbHRlciA9IG5ldyBGaWx0ZXJpbmcodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGlsZShpOiBudW1iZXIsIGo6IG51bWJlcik6IFRpbGUge1xuICAgIGkgPSBpIC0gMTtcbiAgICBqID0gdGhpcy5HUklEX1NJWkUgLSBqO1xuICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBpID49IHRoaXMuR1JJRF9TSVpFIHx8IGogPj0gdGhpcy5HUklEX1NJWkUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY2Vzc2luZyBpbnZhbGlkIHRpbGUgaW5kZXggKFwiICsgaSArIFwiLFwiICsgaiArIFwiKVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGlsZXNbaV1bal07XG4gIH1cblxuICBwdWJsaWMgZ2V0TmVpZ2hib3JzKHRpbGU6IFRpbGUpOiBUaWxlW10ge1xuICAgIGNvbnN0IHJlc3VsdDogVGlsZVtdID0gW107XG4gICAgaWYgKHRpbGUueCA+IDEpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5nZXRUaWxlKHRpbGUueCAtIDEsIHRpbGUueSkpO1xuICAgIH1cbiAgICBpZiAodGlsZS54IDwgdGhpcy5HUklEX1NJWkUpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZ2V0VGlsZSh0aWxlLnggKyAxLCB0aWxlLnkpKTtcbiAgICB9XG4gICAgaWYgKHRpbGUueSA+IDEpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRoaXMuZ2V0VGlsZSh0aWxlLngsIHRpbGUueSAtIDEpKTtcbiAgICB9XG4gICAgaWYgKHRpbGUueSA8IHRoaXMuR1JJRF9TSVpFKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLmdldFRpbGUodGlsZS54LCB0aWxlLnkgKyAxKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgc2Vuc29yVXBkYXRlKCkge1xuICAgIC8vIExvb3Agb3ZlciBhbGwgdGlsZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR1JJRF9TSVpFOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5HUklEX1NJWkU7IGorKykge1xuICAgICAgICAvLyBDaGVjayBpZiB0aWxlW2ldW2pdIGhhcyBhIGJyZWV6ZS9zdGVuY2ggZHVlIHRvIGEgbmVpZ2hib3JzLlxuICAgICAgICBsZXQgc3RlbmNoOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGxldCBicmVlemU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBuZWlnaGJvciBvZiB0aGlzLmdldE5laWdoYm9ycyh0aGlzLnRpbGVzW2ldW2pdKSkge1xuICAgICAgICAgIHN0ZW5jaCA9IG5laWdoYm9yLmhhc1d1bXB1cyB8fCBzdGVuY2g7XG4gICAgICAgICAgYnJlZXplID0gbmVpZ2hib3IuaGFzUGl0IHx8IGJyZWV6ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgdGhlIG1lYXN1cmVtZW50IG9mIHRoZSB0aWxlIGJhc2VkIG9uIGl0J3MgbmVpZ2hib3JzIGFuZCByZW5kZXIuXG4gICAgICAgIHRoaXMudGlsZXNbaV1bal0ubWVhc3VyZW1lbnQgPSBicmVlemVcbiAgICAgICAgICA/IChzdGVuY2ggPyBNZWFzdXJlbWVudC5TdGVuY2h5QnJlZXplIDogTWVhc3VyZW1lbnQuQnJlZXplKVxuICAgICAgICAgIDogKHN0ZW5jaCA/IE1lYXN1cmVtZW50LlN0ZW5jaCA6IE1lYXN1cmVtZW50LlNhZmUpO1xuICAgICAgICB0aGlzLnRpbGVzW2ldW2pdLnJlbmRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR1JJRF9TSVpFOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5HUklEX1NJWkU7IGorKykge1xuICAgICAgICB0aGlzLnRpbGVzW2ldW2pdLnJlc2V0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ2V0VGlsZSgxLCAxKS5tZWFzdXJlZCA9IHRydWU7XG4gICAgdGhpcy5hZ2VudC5yZXNldCgpO1xuICAgIHRoaXMubW9kZWxGaWx0ZXIucmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCkge1xuICAgIHRoaXMuY2FudmFzID0gU1ZHKHRoaXMuRUxFTUVOVCkuc2l6ZSh0aGlzLlVYX1NJWkUsIHRoaXMuVVhfU0laRSk7XG4gICAgY29uc3QgQkxPQ0tfU0laRTogbnVtYmVyID0gdGhpcy5VWF9TSVpFIC8gdGhpcy5HUklEX1NJWkU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdSSURfU0laRTsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuR1JJRF9TSVpFOyBqKyspIHtcbiAgICAgICAgdGhpcy50aWxlc1tpXVtqXS5jYW52YXMgPSB0aGlzLmNhbnZhcy5uZXN0ZWQoKVxuICAgICAgICAgIC5hdHRyKHsgeDogQkxPQ0tfU0laRSAqIGksIHk6IEJMT0NLX1NJWkUgKiBqIH0pO1xuICAgICAgICB0aGlzLnRpbGVzW2ldW2pdLnJlbmRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuL2FnZW50XCI7XG5pbXBvcnQgeyBGaWx0ZXJpbmcgfSBmcm9tIFwiLi9maWx0ZXJpbmdcIjtcbmltcG9ydCB7IEdvZFNpZ2h0IH0gZnJvbSBcIi4vZ29kXCI7XG5pbXBvcnQgeyBHcmlkIH0gZnJvbSBcIi4vZ3JpZFwiO1xuXG5kZWNsYXJlIHZhciAkOiBhbnk7XG5cbmNvbnN0IGdhbWU6IEdyaWQgPSBuZXcgR3JpZCgpO1xuZ2FtZS5nZXRUaWxlKDMsIDEpLmhhc1BpdCA9IHRydWU7XG5nYW1lLmdldFRpbGUoMywgMykuaGFzUGl0ID0gdHJ1ZTtcbmdhbWUuZ2V0VGlsZSg0LCA0KS5oYXNQaXQgPSB0cnVlO1xuZ2FtZS5nZXRUaWxlKDEsIDMpLmhhc1d1bXB1cyA9IHRydWU7XG5nYW1lLmdldFRpbGUoMiwgMykuaGFzR29sZCA9IHRydWU7XG5nYW1lLnNlbnNvclVwZGF0ZSgpO1xuXG5jb25zdCBnb2Q6IEdvZFNpZ2h0ID0gbmV3IEdvZFNpZ2h0KGdhbWUpO1xuJChcIiNtb2RlLWdhbWVcIikub24oXCJjbGlja1wiLCAoKSA9PiB7IGdvZC5oaWRlKCk7IH0pO1xuJChcIiNtb2RlLWdvZFwiKS5vbihcImNsaWNrXCIsICgpID0+IHsgZ29kLnJlbmRlcigpOyB9KTtcblxuLy8gQmluZGluZyB0aGUgS2V5cHJlc3MgRXZlbnRcbiQoXCJodG1sXCIpLm9uKFwia2V5ZG93blwiLCAoZTogYW55KSA9PiB7XG4gIGlmIChlLndoaWNoID09PSAzNyB8fCBlLndoaWNoID09PSBcIkFcIi5jaGFyQ29kZUF0KDApKSB7XG4gICAgZ2FtZS5hZ2VudC5tb3ZlKE1vdmUuTGVmdCk7XG4gICAgZ2FtZS5tb2RlbEZpbHRlci5yZW5kZXIoKTtcbiAgfSBlbHNlIGlmIChlLndoaWNoID09PSAzOCB8fCBlLndoaWNoID09PSBcIldcIi5jaGFyQ29kZUF0KDApKSB7XG4gICAgZ2FtZS5hZ2VudC5tb3ZlKE1vdmUuVXApO1xuICAgIGdhbWUubW9kZWxGaWx0ZXIucmVuZGVyKCk7XG4gIH0gZWxzZSBpZiAoZS53aGljaCA9PT0gMzkgfHwgZS53aGljaCA9PT0gXCJEXCIuY2hhckNvZGVBdCgwKSkge1xuICAgIGdhbWUuYWdlbnQubW92ZShNb3ZlLlJpZ2h0KTtcbiAgICBnYW1lLm1vZGVsRmlsdGVyLnJlbmRlcigpO1xuICB9IGVsc2UgaWYgKGUud2hpY2ggPT09IDQwIHx8IGUud2hpY2ggPT09IFwiU1wiLmNoYXJDb2RlQXQoMCkpIHtcbiAgICBnYW1lLmFnZW50Lm1vdmUoTW92ZS5Eb3duKTtcbiAgICBnYW1lLm1vZGVsRmlsdGVyLnJlbmRlcigpO1xuICB9XG59KTtcbiIsImV4cG9ydCBjbGFzcyBUaWxlIHtcblxuICBwcm90ZWN0ZWQgbVd1bXB1czogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIG1QaXQ6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBtR29sZDogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIG1DYW52YXM6IGFueTtcbiAgcHJpdmF0ZSByZWFkb25seSBCTE9DS19TSVpFOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgbVg6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBtWTogbnVtYmVyO1xuICBwcml2YXRlIG1NZWFzdXJlbWVudDogTWVhc3VyZW1lbnQ7XG4gIHByaXZhdGUgbU1lYXN1cmVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBibG9ja1NpemU6IG51bWJlciA9IDEwMCkge1xuICAgIHRoaXMubVggPSB4O1xuICAgIHRoaXMubVkgPSB5O1xuICAgIHRoaXMubVd1bXB1cyA9IGZhbHNlO1xuICAgIHRoaXMubVBpdCA9IGZhbHNlO1xuICAgIHRoaXMubUdvbGQgPSBmYWxzZTtcbiAgICB0aGlzLkJMT0NLX1NJWkUgPSBibG9ja1NpemU7XG4gICAgdGhpcy5tTWVhc3VyZW1lbnQgPSBNZWFzdXJlbWVudC5TYWZlO1xuICAgIHRoaXMubU1lYXN1cmVkID0gZmFsc2U7XG4gIH1cblxuICBzZXQgY2FudmFzKGNhbnZhczogYW55KSB7IHRoaXMubUNhbnZhcyA9IGNhbnZhczsgfVxuICBnZXQgeCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5tWDsgfVxuICBnZXQgeSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5tWTsgfVxuICBzZXQgaGFzV3VtcHVzKHd1bXB1czogYm9vbGVhbikgeyB0aGlzLm1XdW1wdXMgPSB3dW1wdXM7IH1cbiAgZ2V0IGhhc1d1bXB1cygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubVd1bXB1czsgfVxuICBzZXQgaGFzUGl0KHBpdDogYm9vbGVhbikgeyB0aGlzLm1QaXQgPSBwaXQ7IH1cbiAgZ2V0IGhhc1BpdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubVBpdDsgfVxuICBzZXQgaGFzR29sZChnb2xkOiBib29sZWFuKSB7IHRoaXMubUdvbGQgPSBnb2xkOyB9XG4gIGdldCBoYXNHb2xkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tR29sZDsgfVxuXG4gIHNldCBtZWFzdXJlbWVudChtZWFzdXJlbWVudDogTWVhc3VyZW1lbnQpIHtcbiAgICB0aGlzLm1NZWFzdXJlbWVudCA9IG1lYXN1cmVtZW50O1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbiAgZ2V0IG1lYXN1cmVtZW50KCk6IE1lYXN1cmVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5tTWVhc3VyZW1lbnQ7XG4gIH1cbiAgc2V0IG1lYXN1cmVkKG1lYXN1cmVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5tTWVhc3VyZWQgPSBtZWFzdXJlZDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG4gIGdldCBtZWFzdXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tTWVhc3VyZWQ7XG4gIH1cbiAgc2V0IGhhc0JyZWV6ZShicmVlemU6IGJvb2xlYW4pIHtcbiAgICBpZiAoYnJlZXplICYmIHRoaXMubU1lYXN1cmVtZW50ID09PSBNZWFzdXJlbWVudC5TdGVuY2gpIHtcbiAgICAgIHRoaXMubU1lYXN1cmVtZW50ID0gTWVhc3VyZW1lbnQuU3RlbmNoeUJyZWV6ZTtcbiAgICB9IGVsc2UgaWYgKGJyZWV6ZSAmJiB0aGlzLm1NZWFzdXJlbWVudCA9PT0gTWVhc3VyZW1lbnQuU2FmZSkge1xuICAgICAgdGhpcy5tTWVhc3VyZW1lbnQgPSBNZWFzdXJlbWVudC5CcmVlemU7XG4gICAgfSBlbHNlIGlmICghYnJlZXplICYmIHRoaXMubU1lYXN1cmVtZW50ID09PSBNZWFzdXJlbWVudC5TdGVuY2h5QnJlZXplKSB7XG4gICAgICB0aGlzLm1NZWFzdXJlbWVudCA9IE1lYXN1cmVtZW50LlN0ZW5jaDtcbiAgICB9IGVsc2UgaWYgKCFicmVlemUgJiYgdGhpcy5tTWVhc3VyZW1lbnQgPT09IE1lYXN1cmVtZW50LkJyZWV6ZSkge1xuICAgICAgdGhpcy5tTWVhc3VyZW1lbnQgPSBNZWFzdXJlbWVudC5TYWZlO1xuICAgIH1cbiAgfVxuICBnZXQgaGFzQnJlZXplKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1NZWFzdXJlbWVudCA9PT0gTWVhc3VyZW1lbnQuQnJlZXplXG4gICAgICB8fCB0aGlzLm1NZWFzdXJlbWVudCA9PT0gTWVhc3VyZW1lbnQuU3RlbmNoeUJyZWV6ZTtcbiAgfVxuICBzZXQgaGFzQnJlZXplKHN0ZW5jaDogYm9vbGVhbikge1xuICAgIGlmIChzdGVuY2ggJiYgdGhpcy5tTWVhc3VyZW1lbnQgPT09IE1lYXN1cmVtZW50LkJyZWV6ZSkge1xuICAgICAgdGhpcy5tTWVhc3VyZW1lbnQgPSBNZWFzdXJlbWVudC5TdGVuY2h5QnJlZXplO1xuICAgIH0gZWxzZSBpZiAoc3RlbmNoICYmIHRoaXMubU1lYXN1cmVtZW50ID09PSBNZWFzdXJlbWVudC5TYWZlKSB7XG4gICAgICB0aGlzLm1NZWFzdXJlbWVudCA9IE1lYXN1cmVtZW50LlN0ZW5jaDtcbiAgICB9IGVsc2UgaWYgKCFzdGVuY2ggJiYgdGhpcy5tTWVhc3VyZW1lbnQgPT09IE1lYXN1cmVtZW50LlN0ZW5jaHlCcmVlemUpIHtcbiAgICAgIHRoaXMubU1lYXN1cmVtZW50ID0gTWVhc3VyZW1lbnQuU3RlbmNoO1xuICAgIH0gZWxzZSBpZiAoIXN0ZW5jaCAmJiB0aGlzLm1NZWFzdXJlbWVudCA9PT0gTWVhc3VyZW1lbnQuU3RlbmNoKSB7XG4gICAgICB0aGlzLm1NZWFzdXJlbWVudCA9IE1lYXN1cmVtZW50LlNhZmU7XG4gICAgfVxuICB9XG4gIGdldCBoYXNTdGVuY2goKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubU1lYXN1cmVtZW50ID09PSBNZWFzdXJlbWVudC5TdGVuY2hcbiAgICAgIHx8IHRoaXMubU1lYXN1cmVtZW50ID09PSBNZWFzdXJlbWVudC5TdGVuY2h5QnJlZXplO1xuICB9XG5cbiAgcHVibGljIHJlc2V0KCkge1xuICAgIHRoaXMubWVhc3VyZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgY29uc3Qgck91dCA9IHRoaXMubUNhbnZhcy5yZWN0KHRoaXMuQkxPQ0tfU0laRSAqIDAuOTgsIHRoaXMuQkxPQ0tfU0laRSAqIDAuOTgpO1xuICAgIGNvbnN0IHJJbm4gPSB0aGlzLm1DYW52YXMucmVjdCh0aGlzLkJMT0NLX1NJWkUgKiAwLjc1LCB0aGlzLkJMT0NLX1NJWkUgKiAwLjc1KTtcbiAgICBpZiAodGhpcy5tTWVhc3VyZWQpIHtcbiAgICAgIHJPdXQuZmlsbCh7IGNvbG9yOiB0aGlzLm1NZWFzdXJlbWVudCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgck91dC5maWxsKHsgY29sb3I6IFwiI2NjY1wiIH0pO1xuICAgIH1cbiAgICBySW5uLmZpbGwoeyBjb2xvcjogXCIjZGRkXCIgfSk7XG4gICAgck91dC5jZW50ZXIodGhpcy5CTE9DS19TSVpFIC8gMiwgdGhpcy5CTE9DS19TSVpFIC8gMik7XG4gICAgcklubi5jZW50ZXIodGhpcy5CTE9DS19TSVpFIC8gMiwgdGhpcy5CTE9DS19TSVpFIC8gMik7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gTWVhc3VyZW1lbnQge1xuICBTdGVuY2ggPSBcIiNmZjAwMDBcIixcbiAgQnJlZXplID0gXCIjMDAwMDAwXCIsXG4gIFN0ZW5jaHlCcmVlemUgPSBcIiM2NjAwMDBcIixcbiAgU2FmZSA9IFwiIzU1ZmY2NlwiLFxufVxuIl19
