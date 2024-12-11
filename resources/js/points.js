const elements = [];

for (let i=0;i<4;i++){
    $('#drag-points').after($("<div id=point-" + i + " class='point' z-index: 2;><div/>"));
    elements.push({id: 'point-'+i});
}

svg = $('#svgCanvas');



const connections = [
    [0, 1],
    [2,3],
];

$(function() {
    connections.forEach((pair, index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', `line${index}`);
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', '2');
        svg.append(line);

        updateLine();
    });
});


let updateLine = function(){
    
    const svgWidth = svg.width();
    const svgHeight = svg.height();

    connections.forEach((pair, index) => {
        const el1 = $(`#${elements[pair[0]].id}`);
        const el2 = $(`#${elements[pair[1]].id}`);
        const pos1 = el1.offset();
        const pos2 = el2.offset();

        //Get Center of Element;
        const x1 = pos1.left + el1.outerWidth() / 2;
        const y1 = pos1.top + el1.outerHeight() / 2;
        const x2 = pos2.left + el2.outerWidth() / 2;
        const y2 = pos2.top + el2.outerHeight() / 2;

        const dx = x2 - x1;
        const dy = y2 - y1;

        let xStart, yStart, xEnd, yEnd;

        if (dx === 0) {
            // Vertical line
            xStart = xEnd = x1;
            yStart = 0;
            yEnd = svgHeight;
        } else if (dy === 0) {
            // Horizontal line
            yStart = yEnd = y1;
            xStart = 0;
            xEnd = svgWidth;
        } else {
            // Diagonal line
            const slope = dy / dx;

            // Intersection with the left edge (x = 0)
            const yAtLeft = y1 + slope * (-x1);
            // Intersection with the right edge (x = svgWidth)
            const yAtRight = y1 + slope * (svgWidth - x1);
            // Intersection with the top edge (y = 0)
            const xAtTop = x1 + (-y1) / slope;
            // Intersection with the bottom edge (y = svgHeight)
            const xAtBottom = x1 + (svgHeight - y1) / slope;

            // Choose valid points within the SVG bounds
            const points = [
                { x: 0, y: yAtLeft },
                { x: svgWidth, y: yAtRight },
                { x: xAtTop, y: 0 },
                { x: xAtBottom, y: svgHeight }
            ].filter(p => p.x >= 0 && p.x <= svgWidth && p.y >= 0 && p.y <= svgHeight);

            if (points.length === 2) {
                xStart = points[0].x;
                yStart = points[0].y;
                xEnd = points[1].x;
                yEnd = points[1].y;
            }
        }

        // Update the line's attributes

        $(`#line${index}`).attr({
            x1: xStart,
            y1: yStart,
            x2: xEnd,
            y2: yEnd
        });
        
    });
}



elements.forEach(el => {
    $(`#${el.id}`).draggable({
        drag: updateLine,
        stop: updateLine
    });
});



updateLine();
const svgCanvas = document.getElementById("svgCanvas");
const svgContainer = document.getElementById("svgContainer");

let viewBox = { x: 0, y: 0, width: 500, height: 500 };
const zoomFactor = 1.1;
function updateViewBox() {
    svgContainer.setAttribute(
        "viewBox",
        `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
    );
}

svgContainer.addEventListener("wheel", (event) => {
    event.preventDefault();
    console.log("I am groot");
    const { offsetX, offsetY, deltaY } = event;
    const zoomIn = deltaY < 0;

    // Mouse position relative to the SVG element
    const mouseX = (offsetX / svgContainer.offsetWidth) * viewBox.width + viewBox.x;
    const mouseY = (offsetY / svgContainer.offsetHeight) * viewBox.height + viewBox.y;

    // Scale the viewBox
    const scale = zoomIn ? 1 / zoomFactor : zoomFactor;
    const newWidth = viewBox.width * scale;
    const newHeight = viewBox.height * scale;

    // Adjust viewBox to zoom relative to mouse position
    viewBox.x = mouseX - (mouseX - viewBox.x) * scale;
    viewBox.y = mouseY - (mouseY - viewBox.y) * scale;
    viewBox.width = newWidth;
    viewBox.height = newHeight;

    updateViewBox();
});

updateViewBox();