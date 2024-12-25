import {PARAMS, SETTINGS, pane, clearButton, vanPointButton} from './menu.js';

//Konva
var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    draggable: true
});


var lines = {
    line1: null,
    line2: null
}

const layer = new Konva.Layer();
stage.add(layer);
stage.draw();

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

function drawVanPoint(group, x, y){
    var circle = new Konva.Circle({
        x: x,
        y: y,
        radius: 5,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1
    });

    group.add(circle);
    layer.draw();

    //Find closer Points
    var line1points = lines.line1.points;
    var line2points = lines.line2.points;

    for (let i = 0; i < line1points.length; i+=2){
        var distance = Math.sqrt(Math.pow(line1points[0] - x, 2) + Math.pow(line1points[1] - y, 2));
        console.log(distance);
    }
}

clearButton.on('click', () => {
    currentImg.destroy();
    if (currentImg != null) currentImg = null;
});

var currentImg = null;
$("#file_input").change(function(e){
    if (currentImg != null) currentImg.destroy();
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    img.src = url;


    img.onload = function() {

        var img_width = img.width;
        var img_height = img.height;

        // calculate dimensions to get max 300px
        var max = 600;
        var ratio = (img_width > img_height ? (img_width / max) : (img_height / max))

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
                    drawLine(1, group, 'red', PARAMS.Point11.x, PARAMS.Point11.y, PARAMS.Point12.x, PARAMS.Point12.y);
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
                    drawLine(2, group, 'blue', PARAMS.Point21.x, PARAMS.Point21.y, PARAMS.Point22.x, PARAMS.Point22.y);
                    $('#container').css('cursor', 'default');
                    break;
                case 'none':
                    break;
                default:
                    break;
            }

            //console.log(`Pixel Color: R=${red}, G=${green}, B=${blue}, A=${alpha}`);
        });

        //Vanishing Point
        vanPointButton.on('click', () =>{
            let [x1, y1] = [PARAMS.Point11.x , PARAMS.Point11.y];
            let [x2, y2] = [PARAMS.Point12.x, PARAMS.Point12.y];
            let [x3, y3] = [PARAMS.Point21.x, PARAMS.Point21.y];
            let [x4, y4] = [PARAMS.Point22.x, PARAMS.Point22.y];
        
            // Calc Matrix Determinant
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
        
            PARAMS.vanishingPoint = {x: intersectionX, y: intersectionY};
            pane.refresh();
            
            drawVanPoint(group, PARAMS.vanishingPoint.x, PARAMS.vanishingPoint.y);
        
        });

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
    }

    function drawGrid(scale) {
        /*gridLayer.destroyChildren(); // Clear previous grid
  
        const pixelSize = 1 * scale; // Each pixel corresponds to 1x1 unit in the image
        const stageBounds = stage.getClientRect();
        const { x, y, width, height } = stageBounds;
  
        const startX = Math.floor(x / pixelSize) * pixelSize;
        const startY = Math.floor(y / pixelSize) * pixelSize;
  
        for (let i = startX; i < x + width; i += pixelSize) {
          for (let j = startY; j < y + height; j += pixelSize) {
            gridLayer.add(
              new Konva.Rect({
                x: i,
                y: j,
                width: pixelSize,
                height: pixelSize,
                stroke: 'rgba(0, 0, 0, 0.2)', // Light grid lines
              })
            );
          }
        }
        gridLayer.batchDraw();
        */
      }

    
    e.target.value = '';

});
