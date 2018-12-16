/* global Grid */

window.onload = function() {
    var grid = new Grid(3, 4),
        $container = document.querySelector("div.container");
    grid.renderGridDOM($container);
    // you can pass integer codes or names of the things
    // for setInference there's an optional argument of the certainty (defaults to 1)
    grid.grid[1][1].setMeasurement(2);
    grid.grid[1][0].setInference("wumpus", 1);
};
