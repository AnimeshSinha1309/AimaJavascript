/**
 *
 * @param {Number} rows
 * @param {Number} cols
 */
function generate2DGrid(rows, cols) {
    var count = 0;
    return [...new Array(rows)].map(x => [...new Array(cols)].map(y => new Square(count++)));
}

/**
 * a single square object in the grid
 */
class Square {
    /** @param {Number} number positional count of the square object on the grid */
    constructor(number) {
        this.number = number || 0;
        /** assumes measurement can't be fractional
         * string/number
         * A - type of thing (string name or numeric code)
         */
        this.measurement = Square.MEASUREMENTS.safe;
        /**
         * assumes inferences can be fractional
         * A(string/number) + " " + B (number)
         * A - type of thing (string name or numeric code)
         * B - value to assign to that thing (defaults to 1)
         */
        this.inference = [Square.INFERENCES.none, 1];

        this.$td = document.createElement("td");
        this.$td.classList.add("grid-square");
    }

    /**
     * @param {Number|String} newVal string, it must be a valid key in Square.MEASUREMENTS
     * else if number, it must be a valid value in Square.MEASUREMENTS
     * @throws Error if anything else
     */
    setMeasurement(newVal) {
        if (typeof newVal === "string" && Object.keys(Square.MEASUREMENTS).includes(newVal)) {
            this.measurement = Square.MEASUREMENTS[newVal];
        } else if (typeof newVal === "number" && Object.values(Square.MEASUREMENTS).includes(newVal)) {
            this.measurement = newVal;
        } else {
            throw new Error("Attempt to set invalid value to measurement of square number " + this.number);
        }
        this.updateDOMElement();
    }

    /**
     * @param {String} newVal if string, it must be (a valid key in Square.INFERENCES) + " " + (value for that key (defaults to 1))
     *     example "wumpus 1" or "pit", or "3" (=="both 1")
     * OR it must be (a valid value in Square.INFERENCES) + " " + (value for that key (defaults to 1))
     *     example "1 1" (corresponds to "wumpus 1")
     * @throws Error if anything else
     */
    setInference(newVal, certainty) {
        if (typeof newVal !== "string") {
            throw new Error("New value must be string/number");
        }
        if (typeof certainty != "undefined" && typeof certainty != "number") {
            throw new Error("Optional argument certainty must be a number");
        }

        if (Object.keys(Square.INFERENCES).includes(newVal)) {
            this.inference = [Square.INFERENCES[newVal], typeof certainty == "undefined" ? "1" : certainty];
        } else if (Object.values(Square.INFERENCES).includes(+type)) {
            this.inference = [newVal, certainty];
        } else {
            throw new Error(`Attempt to set invalid value to inference of square number: ${newVal} and ${certainty}`);
        }
        this.updateDOMElement();
    }

    updateDOMElement() {
        this.$td.innerText = this.inference;
        this.$td.style.border = `1px solid ${Square.getColorBasedOnMeasurement(this.measurement)}`;
    }

    getDOMElement() {
        this.updateDOMElement();
        return this.$td;
    }

    static getColorBasedOnMeasurement(measurement) {
        var colorValue = 40 * measurement; // random number for testing
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }
}

// assign integer codes to each type
// of thing
// for easy extensibility later
Square.INFERENCES = {
    wumpus: 1,
    pit: 2,
    both: 3,
    none: 4
};
Square.MEASUREMENTS = {
    stinch: 1,
    breeze: 2,
    both: 3,
    safe: 4
};

/**
 * constructs a Grid object
 * @param {Number} rows
 * @param {Number} cols
 * @param {Array.<Array.<Number>} arr grid of rowsXcols if passed will be used
 */
class Grid {
    constructor(rows, cols, arr) {
        this.rows = rows;
        this.cols = cols;
        this.grid = arr ? arr : generate2DGrid(rows, cols);
    }

    getDOMElement() {
        var $table = document.createElement("table");

        for (let i = 0; i < this.rows; i++) {
            let $row = document.createElement("tr");
            for (let j = 0; j < this.cols; j++) {
                $row.appendChild(this.grid[i][j].getDOMElement());
            }
            $row.classList.add("grid-row");
            $table.appendChild($row);
        }
        $table.classList.add("grid-container");

        return $table;
    }

    /**
     * @param {Element} $container the container in which grid must be put.
     * @param {Boolean} appendToContainer when true, $container is not reset to empty before being used, and new grid is simply
     * appended to $container.
     */
    renderGridDOM($container, appendToContainer) {
        if (!appendToContainer) {
            while ($container.firstChild) $container.removeChild($container.firstChild);
        }
        $container.appendChild(this.getDOMElement());
    }
}
