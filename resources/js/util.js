import {PARAMS, SETTINGS} from './menu.js';
import {lines, layer} from './img.js';

function add_text(group, text, coordinates ){
    const textObj = new Konva.Text({
        x: coordinates[0],
        y: coordinates[1],
        text: text,
        fontFamily: 'Roboto',
        fontSize: 50,
        fill: '#ff0000',
        draggable: true
    });

    group.add(textObj);
    layer.draw();

    return textObj;
}

function drawLine(lineNr, group, color, x1, y1, x2, y2) {
    var line = new Konva.Line({
        points: [x1, y1, x2, y2],
        stroke: lineNr == 1? SETTINGS.line1color : lineNr == 2 ? SETTINGS.line2color : 'red',
        strokeWidth: SETTINGS.linewidth
    });
    
    if (lineNr == 1){
        if(lines.line1 != null)lines.line1.destroy();
        lines.line1 = line;
    }
    else if(lineNr == 2){
        if(lines.line2 != null)lines.line2.destroy();
        lines.line2 = line;
    }
    else{console.log("Invalid line number");}
    
    group.add(line);
    layer.draw();
}

function calcLineIntersection(x1,y1,x2,y2,x3,y3,x4,y4){
    const DETER = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        
    if( DETER == 0){
        console.log("Lines are parallel");
        return;
    }

    // Calc Linear Factor
    const m = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / DETER;   

    // Get Intersection
    const intersectionX = x1 + m * (x2 - x1);
    const intersectionY = y1 + m * (y2 - y1);

    return {x: intersectionX, y: intersectionY}
}

function freeDrawLine(group, color, points) {
    var line = new Konva.Line({
        points: points,
        stroke: color,
        strokeWidth: SETTINGS.linewidth
    });

    //console.log("Free Draw Line");

    group.add(line);
    layer.draw();

    return line;
}

function drawVanPoint(group, x, y){
    var circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 20,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 5
    });

    group.add(circle);
    layer.draw();

    return circle;

    //Find closer Points
}

function calculateAreaPoints(){
    const VP = [PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y];
    const TCP = [PARAMS.tireContactPoint.x, PARAMS.tireContactPoint.y];

    //Find closer line and get intersection type [{}{}]
    let VP_TCP_intersection = {};
    let finalPoint = {};
    if (Math.abs(PARAMS.vanishingPoint.x - PARAMS.overlayTopLeft.x)
        < Math.abs(PARAMS.vanishingPoint.x - PARAMS.overlayTopRight.x)){
        VP_TCP_intersection = calcLineIntersection(VP[0], VP[1], TCP[0], TCP[1], PARAMS.overlayTopLeft.x, PARAMS.overlayTopLeft.y, PARAMS.overlayBottomLeft.x, PARAMS.overlayBottomLeft.y);
        finalPoint = calcLineIntersection(VP_TCP_intersection.x, VP_TCP_intersection.y,VP_TCP_intersection.x +1,VP_TCP_intersection.y, PARAMS.overlayTopRight.x, PARAMS.overlayTopRight.y, PARAMS.overlayBottomRight.x, PARAMS.overlayBottomRight.y);
    }
    else{
        VP_TCP_intersection = calcLineIntersection(VP[0], VP[1], TCP[0], TCP[1], PARAMS.overlayTopRight.x, PARAMS.overlayTopRight.y, PARAMS.overlayBottomRight.x, PARAMS.overlayBottomRight.y);
        finalPoint = calcLineIntersection(VP_TCP_intersection.x, VP_TCP_intersection.y,VP_TCP_intersection.x +1,VP_TCP_intersection.y, PARAMS.overlayTopLeft.x, PARAMS.overlayTopLeft.y, PARAMS.overlayBottomLeft.x, PARAMS.overlayBottomLeft.y);
    }

    return [VP[0], VP[1], VP_TCP_intersection.x, VP_TCP_intersection.y, finalPoint.x, finalPoint.y];
}


function drawTCPArea(group){
    var points = calculateAreaPoints();
    //console.log(points);
    const triangle = new Konva.Line({
        points: points,
        fill: 'rgba(255,217,102,40)',
        closed: true,
        stroke: 'rgba(255,217,102,40)',
        strokeWidth: 3,
        opacity: 0.5
    });

    group.add(triangle);
    layer.draw();

    return triangle;
}

function drawArrow(group, points){
    const arrow = new Konva.Arrow({
        points: points,
        stroke: '#5b9bd5',
        pointerAtEnding: true,
        pointerAtBeginning: true,
        strokeWidth: 3,
        draggable: true
    });

    //console.log("Drew Arrow");
    group.add(arrow);
    layer.draw();

    return arrow;
}


function drawArrowRed(group, points){
    const arrow = new Konva.Arrow({
        points: points,
        stroke: '#ff0000',
        pointerAtEnding: true,
        pointerAtBeginning: true,
        strokeWidth: 3,
        draggable: true
    });

    //console.log("Drew Arrow");
    group.add(arrow);
    layer.draw();

    return arrow;
}

function orderPoints(points){
    //Sort by y to get top and bottom
    points.sort((a, b) => {
        if (a[1] === b[1]) {
            return a[0] - b[0]; // Sort by x if y is the same
        }
        return a[1] - b[1]; // Sort by y
    });

    // Assign top and bottom points (Image 0,0 is at top left so y is reversed)
    const topPoints = points.slice(2);
    const bottomPoints =  points.slice(0, 2);

    // Determine left and right in top points
    const topLeft = topPoints[0][0] < topPoints[1][0] ? topPoints[0] : topPoints[1];
    const topRight = topPoints[0][0] >= topPoints[1][0] ? topPoints[0] : topPoints[1];

    // Determine left and right in bottom points
    const bottomLeft = bottomPoints[0][0] < bottomPoints[1][0] ? bottomPoints[0] : bottomPoints[1];
    const bottomRight = bottomPoints[0][0] >= bottomPoints[1][0] ? bottomPoints[0] : bottomPoints[1];

    // Return labeled corners
    return {
        "tl": topLeft,
        "tr": topRight,
        "bl": bottomLeft,
        "br": bottomRight,
    };
}

function getCloserPoint(targetx, targety, line){
    //Line is float [[2],[2]]
    let distance1 = Math.sqrt(Math.pow(line[0][0] - targetx, 2) + Math.pow(line[0][1] - targety, 2));
    let distance2 = Math.sqrt(Math.pow(line[1][0] - targetx, 2) + Math.pow(line[1][1] - targety, 2));
    console.log("Distance 1: " + distance1);
    if (distance1 < distance2) {
        return 1;
    } else {
        return 2;
    }
}


function getVP_TCP_intersection(tcpArea){
    return [tcpArea.points()[2], tcpArea.points()[3]];
}


export {drawArrowRed, getVP_TCP_intersection, getCloserPoint, add_text, drawLine, drawArrow, calcLineIntersection, freeDrawLine, drawVanPoint, calculateAreaPoints, drawTCPArea, orderPoints};