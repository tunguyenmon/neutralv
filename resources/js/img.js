import {PARAMS, SETTINGS, pane, clearButton, vanPointButton, inputFiles, helpLineButton, uploadXML, tireContactButton, exportImageBtn} from './menu.js';
import * as util from './util.js';
//Konva
var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    draggable: true
});


export var lines = {
    line1: null,
    line2: null
}

var pixelRatio = 0.00454;

export const layer = new Konva.Layer();
stage.add(layer);
stage.draw();

function loadXMLData(e){
    if (currentXML != null) currentXML.destroy();
    inputFiles.xml = e.target.files[0].name;
    pane.refresh();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e){
        const xml = e.target.result;

        const parser = new DOMParser();
        const parsedXML = parser.parseFromString(xml, "text/xml");
        const points = parsedXML.getElementsByTagName("line");

        var allPoints = [];
        for (var i = 0; i<4; i++){
            const x0 =  Number(points[i].getAttribute("x0"));
            const y0 =  Number(points[i].getAttribute("y0"));
            allPoints.push([x0, y0]);
        }
        allPoints = util.orderPoints(allPoints);

        const helpLineX0 =  Number(points[4].getAttribute("x0"));
        const helpLineY0 =  Number(points[4].getAttribute("y0"));
        const helpLineX1 =  Number(points[4].getAttribute("x1"));
        const helpLineY1 =  Number(points[4].getAttribute("y1"));

        allPoints.hl0 = [helpLineX0, helpLineY0]
        allPoints.hl1 = [helpLineX1, helpLineY1]

        console.log("All XML Points: ");
        console.log(allPoints);

        //Try to remove as soon as possible
        [PARAMS.overlayTopLeft.x, PARAMS.overlayTopLeft.y] = allPoints.tl; //Top Left
        [PARAMS.overlayBottomLeft.x, PARAMS.overlayBottomLeft.y] = allPoints.bl; //Bottom Left
        [PARAMS.overlayBottomRight.x, PARAMS.overlayBottomRight.y] = allPoints.br; //Bottom Right
        [PARAMS.overlayTopRight.x, PARAMS.overlayTopRight.y] = allPoints.tr; //Top Right
        [PARAMS.helpLineP1.x, PARAMS.helpLineP1.y] = allPoints.hl0;
        [PARAMS.helpLineP2.x, PARAMS.helpLineP2.y] = allPoints.hl1;
        pane.refresh();
        //tireContactButton.disabled = false;
        helpLineButton.disabled = false;
    }

    // Handle file read errors
    reader.onerror = () => {
        output.textContent = "Error reading the file.";
    };

    reader.readAsText(file);
}

clearButton.on('click', () => {
    currentImg.destroy();
    if (currentImg != null) currentImg = null;
});

var currentXML = null;
var currentImg = null;
var helpLine = null;
var helpLineText = null;
var tcpArea = null;
var vp = null;
var vpLine = null;
var vpArrow = null;
var vpText = null;

$("#file_input").change(function(e){
    if (currentImg != null) currentImg.destroy();
    
    clearButton.disabled = false;
    uploadXML.disabled = false;
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    img.src = url;

    inputFiles.image = e.target.files[0].name;
    pane.refresh();

    img.onload = function() {

        var img_width = img.width;
        var img_height = img.height;

        // calculate dimensions to get max 300px
        var max = 600;
        var ratio = 1//(img_width > img_height ? (img_width / max) : (img_height / max))
        PARAMS.imgRatio = ratio;
        pane.refresh();
        // now load the Konva image
        var konvaImg = new Konva.Image({
            image: img,
            x: 0,
            y: 0,
            width: img_width/ratio,
            height: img_height/ratio,
            rotation: 0
        });

        const group = new Konva.Group({
            draggable: true,
        });

        currentImg = group;

        group.add(konvaImg);

        layer.add(group);
        layer.draw();

        //Draw Middle Line
        util.freeDrawLine(group, '#5b9bd5', [img_width/2,0,img_width/2,img_height]);
        
        //TEST LINE
        //freeDrawLine(group, '#5b9bd5', 1704, 1508, 1709, 1134);
        //drawArrow(group, [1704, 1508, 1709, 1134]);

        exportImageBtn.on('click', () =>{
            console.log("Exporting Images");
            exportImages(stage);
        });

        konvaImg.on('click', function(e){
            const pointerPosition = group.getRelativePointerPosition();

            // Calculate coordinates relative to the image
            const imageX = pointerPosition.x - konvaImg.x();
            const imageY = pointerPosition.y - konvaImg.y();

            console.log(`Clicked Pixel Coordinates: (${imageX}, ${imageY})`);
            console.log($('#select-state').text());
            switch(PARAMS.selectState){
                case 'L1P1':
                    $('#select-state').text("L1P2");
                    PARAMS.selectState = "L1P2";
                    PARAMS.Point11.x = imageX;
                    PARAMS.Point11.y = imageY;
                    pane.refresh();
                    break;
                case 'L1P2':
                    $('#select-state').text("none");
                    PARAMS.selectState = "none";
                    PARAMS.Point12.x = imageX;
                    PARAMS.Point12.y = imageY;
                    pane.refresh();
                    util.drawLine(1, group, '#ed7d31', PARAMS.Point11.x, PARAMS.Point11.y, PARAMS.Point12.x, PARAMS.Point12.y);
                    $('#container').css('cursor', 'default');
                    break;
                case 'L2P1':
                    $('#select-state').text("L2P2");
                    PARAMS.selectState = "L2P2";
                    PARAMS.Point21.x = imageX;
                    PARAMS.Point21.y = imageY;
                    pane.refresh();
                    break;
                case 'L2P2':
                    $('#select-state').text("none");
                    PARAMS.selectState = "none";
                    PARAMS.Point22.x = imageX;
                    PARAMS.Point22.y = imageY;
                    pane.refresh();
                    util.drawLine(2, group, '#ed7d31', PARAMS.Point21.x, PARAMS.Point21.y, PARAMS.Point22.x, PARAMS.Point22.y);
                    $('#container').css('cursor', 'default');
                    break;
                case 'TCP':
                    $('#select-state').text("none");
                    if(tcpArea!=null) tcpArea.destroy();
                    PARAMS.selectState = "none";
                    PARAMS.tireContactPoint.x = imageX;
                    PARAMS.tireContactPoint.y = imageY;
                    pane.refresh();
                    drawTCPLinesAndArrows();
                    $('#container').css('cursor', 'default');
                    break;
                case 'none':
                    break;
                case 'LP1':
                    $('#select-state').text("LP2");
                    PARAMS.selectState = "LP2";
                    PARAMS.licensePlateLeft.x = imageX;
                    PARAMS.licensePlateLeft.y = imageY;
                    pane.refresh();
                    
                    break;
                case 'LP2':
                    $('#select-state').text("none");
                    PARAMS.selectState = "none";
                    PARAMS.licensePlateRight.x = imageX;
                    PARAMS.licensePlateRight.y = imageY;
                    pane.refresh();
                    $('#container').css('cursor', 'default');
                    drawLicensePlate();
                    break;
                default:
                    break;
            }

            //console.log(`Pixel Color: R=${red}, G=${green}, B=${blue}, A=${alpha}`);
        });

        function drawLicensePlate(){
            util.drawArrow(group, [PARAMS.licensePlateLeft.x +10, PARAMS.licensePlateLeft.y + 60, PARAMS.licensePlateRight.x -10, PARAMS.licensePlateRight.y + 60]);
            util.freeDrawLine(group, '#ff0000', [PARAMS.licensePlateLeft.x, PARAMS.licensePlateLeft.y - 10, PARAMS.licensePlateLeft.x, PARAMS.licensePlateLeft.y + 140]);
            util.freeDrawLine(group, '#ff0000', [PARAMS.licensePlateRight.x, PARAMS.licensePlateRight.y - 10, PARAMS.licensePlateRight.x, PARAMS.licensePlateRight.y + 140]);
            util.add_text(group, (PARAMS.licensePlateRight.x - PARAMS.licensePlateLeft.x).toFixed(0) + "px", [PARAMS.licensePlateLeft.x + 30, PARAMS.licensePlateLeft.y  + 100] );
            util.add_text(group, "Yk1\n" + PARAMS.licensePlateLeft.x.toFixed(0) + "px", [PARAMS.licensePlateLeft.x, PARAMS.licensePlateLeft.y + 160]);
            util.add_text(group, "Yk2\n" + PARAMS.licensePlateRight.x.toFixed(0) + "px", [PARAMS.licensePlateRight.x, PARAMS.licensePlateRight.y + 160]);
        }

        function drawTCPLinesAndArrows(){
            tcpArea = util.drawTCPArea(group);
            var intersection = util.getVP_TCP_intersection(tcpArea);
            util.freeDrawLine(group, '#ff0000', [intersection[0] - 300, intersection[1], intersection[0] + 50, intersection[1]]);
            console.log(PARAMS.vanishingPoint.x);
            if(PARAMS.vanishingPoint.x < 0){
                util.freeDrawLine(group, '#ff0000', [intersection[0] - 300, PARAMS.overlayTopLeft.y, intersection[0] + 50, PARAMS.overlayTopLeft.y]);
                util.freeDrawLine(group, '#ff0000', [intersection[0] -300, PARAMS.overlayBottomLeft.y, intersection[0] + 50 , PARAMS.overlayBottomLeft.y]);
                util.drawArrowRed(group, [intersection[0] - 280, PARAMS.overlayTopLeft.y -10, intersection[0] -280, intersection[1]+10]);
                util.drawArrowRed(group, [intersection[0] - 280, PARAMS.overlayBottomLeft.y +10, intersection[0] - 280, intersection[1]-10]);
                var topLength = - intersection[1] + PARAMS.overlayTopLeft.y;
                var bottomLength = intersection[1] - PARAMS.overlayBottomLeft.y;
                var length = (topLength + bottomLength);
                util.add_text(group, topLength.toFixed(0) + "px", [intersection[0] - 500, (intersection[1] + PARAMS.overlayTopLeft.y)/2 -30 ] );
                util.add_text(group, bottomLength.toFixed(0) + "px", [intersection[0] - 500, (intersection[1] + PARAMS.overlayBottomLeft.y)/2 - 30]);
                util.add_text(group, (topLength/length*100).toFixed(2) + "%", [intersection[0] - 500, (intersection[1] + PARAMS.overlayTopLeft.y)/2 +30] );
                util.add_text(group, (bottomLength/length*100).toFixed(2) + "%", [intersection[0] - 500, (intersection[1] + PARAMS.overlayBottomLeft.y)/2 + 30]);
            }
            else{
                util.freeDrawLine(group, '#ff0000', [intersection[0] + 300, PARAMS.overlayTopRight.y, intersection[0] - 100, PARAMS.overlayTopRight.y]);
                util.freeDrawLine(group, '#ff0000', [intersection[0] +300, PARAMS.overlayBottomRight.y, intersection[0] - 100, PARAMS.overlayBottomRight.y]);
                util.drawArrowRed(group, [intersection[0] + 280, PARAMS.overlayTopLeft.y -10, intersection[0] +280, intersection[1]+10]);
                util.drawArrowRed(group, [intersection[0] + 280, PARAMS.overlayBottomLeft.y +10, intersection[0] + 280, intersection[1]-10]);
                var topLength = - intersection[1] + PARAMS.overlayTopRight.y;
                var bottomLength = intersection[1] - PARAMS.overlayBottomRight.y;
                var length = (topLength + bottomLength);
                util.add_text(group, topLength.toFixed(2) + "px", [intersection[0] + 500, (intersection[1] + PARAMS.overlayTopLeft.y)/2] );
                util.add_text(group, bottomLength.toFixed(2) + "px", [intersection[0] + 500, (intersection[1] + PARAMS.overlayBottomLeft.y)/2]);
            }


        }



        //Vanishing Point
        vanPointButton.on('click', () =>{
            if (vp != null) vp.destroy();
            if (vpLine != null) vpLine.destroy();
            if (vpText != null) vpText.destroy();
            if (vpArrow != null) vpArrow.destroy();
            let [x1, y1] = [PARAMS.Point11.x , PARAMS.Point11.y];
            let [x2, y2] = [PARAMS.Point12.x, PARAMS.Point12.y];
            let [x3, y3] = [PARAMS.Point21.x, PARAMS.Point21.y];
            let [x4, y4] = [PARAMS.Point22.x, PARAMS.Point22.y];

            tireContactButton.disabled = false;
        
            const intersectionPoint = util.calcLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4);
            PARAMS.vanishingPoint = {x: intersectionPoint.x, y: intersectionPoint.y};
            pane.refresh();
            
            vp = util.drawVanPoint(group, PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y);
            //Redraw Lines to go to vanishing point
            redrawLines();

            vpLine = util.freeDrawLine(group, '#5b9bd5', [PARAMS.vanishingPoint.x, 0, PARAMS.vanishingPoint.x, img_height]);
            vpArrow = util.drawArrow(group, [PARAMS.vanishingPoint.x, 170, img_width/2, 170]);
            const VPDistance = (Math.abs(PARAMS.vanishingPoint.x - img_width/2)).toFixed(0).toString() + "px";
            //console.log(VPDistance);
            vpText = util.add_text(group, VPDistance, [550, 125]);
        });


        function redrawLines(){
            var point11 = [PARAMS.Point11.x, PARAMS.Point11.y];
            var point12 = [PARAMS.Point12.x, PARAMS.Point12.y];
            var point21 = [PARAMS.Point21.x, PARAMS.Point21.y];
            var point22 = [PARAMS.Point22.x, PARAMS.Point22.y];

            lines.line1.destroy();
            lines.line2.destroy();

            var closerPoint1 = util.getCloserPoint(PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y, [point11, point12]);
            var closerPoint2 = util.getCloserPoint(PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y, [point21, point22]);

            if(closerPoint1 == 1){
                lines.line1 = util.freeDrawLine(group, '#ed7d31', [PARAMS.Point12.x, PARAMS.Point12.y, PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y]);
            }
            else if(closerPoint1 == 2){
                lines.line1 = util.freeDrawLine(group, '#ed7d31', [PARAMS.Point11.x, PARAMS.Point11.y, PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y]);
            }

            if(closerPoint2 == 1){
                lines.line2 = util.freeDrawLine(group, '#ed7d31', [PARAMS.Point22.x, PARAMS.Point22.y, PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y]);
            }
            else if (closerPoint2 == 2){
                lines.line2 = util.freeDrawLine(group, '#ed7d31', [PARAMS.Point21.x, PARAMS.Point21.y, PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y]);
            }
        }

        // Rescaling
        var scaleBy = 1.10;
        konvaImg.on('wheel', (e) => {
            // stop default scrolling
            e.evt.preventDefault();
    
            var oldScale = stage.scaleX();
            var pointer = stage.getPointerPosition();
    
            var mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };
    
            // how to scale? Zoom in? Or zoom out?
            let direction = e.evt.deltaY < 0 ? 1 : -1;
    
            // when we zoom on trackpad, e.evt.ctrlKey is true
            // in that case lets revert direction
            if (e.evt.ctrlKey) {
                direction = direction;
            }
    
            var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            stage.scale({ x: newScale, y: newScale });
    
            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
            if(newScale > 60){
                drawGrid(newScale);
                stage.batchDraw();
            }


        });

        $('#xml_input').change(async function(e){
             // Read the file as text
            loadXMLData(e);
        });

        helpLineButton.on('click', () => {
            if (helpLine != null) helpLine.destroy();
            //if (helpLineText != null) helpLineText.destroy();
            helpLine = util.drawArrow(group, [PARAMS.helpLineP1.x, PARAMS.helpLineP1.y - 50, PARAMS.helpLineP2.x, PARAMS.helpLineP2.y -50])
            helpLineText = (Math.abs(PARAMS.helpLineP1.x - PARAMS.helpLineP2.x)).toFixed(0).toString() + "px";
            let leftPoint = PARAMS.helpLineP1.x < PARAMS.helpLineP2.x ? PARAMS.helpLineP1 : PARAMS.helpLineP2;
            util.add_text(group, helpLineText, [leftPoint.x +10, leftPoint.y - 90]);
        });
    }


    

    
    e.target.value = '';

});


function downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportImages(stage){
    // Get the data URL of the entire stage (PNG format by default)
    const dataURL = stage.toDataURL();
    downloadURI(dataURL, 'img.png');
}


