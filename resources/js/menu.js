import {Pane} from './lib/tweakpane.js';

export const pane = new Pane();

export const PARAMS = {
    selectState: "none",
    imgRatio: 0,
    Point11 : {x: 0, y: 0},
    Point12 : {x: 0, y: 0},
    Point21 : {x: 0, y: 0},
    Point22 : {x: 0, y: 0},
    vanishingPoint: {x: 0, y: 0},
    tireContactPoint: {x: 0, y: 0},
    overlayP1: {x: 0, y: 0},
    overlayP2: {x: 0, y: 0},
    overlayP3: {x: 0, y: 0},
    overlayP4: {x: 0, y: 0},
    helpLineP1: {x: 0, y: 0},
    helpLineP2: {x: 0, y: 0}
};


export const SETTINGS = {
    linewidth : 3,
    line1color : '#ed7d31',
    line2color : '#ed7d31'
}

export const TABS = pane.addTab({
    pages: [
        {title: 'General'},
        {title: 'Lines'},
        {title: 'Settings'}
    ]
});

let loadButton = TABS.pages[0].addButton({
    title: 'Load Image'
});

loadButton.on('click', () => {
    $('#file_input').click();
})

export const clearButton = TABS.pages[0].addButton({
    title: 'Clear Image'
})

let uploadXML = TABS.pages[0].addButton({
    title: 'Load XML'
});

uploadXML.on('click', () => {
    $('#xml_input').click();
    /*
    const parser = new fxparser.XMLParser();
    let parsedXML = parser.parse(XML);

    */

});



TABS.pages[1].addBinding(PARAMS, 'selectState', {
    label: 'Select State',
    disabled: true
});

TABS.pages[1].addBinding(PARAMS, 'imgRatio', {
    label: 'Image Ratio',
    disabled: true
})

const line1 = TABS.pages[1].addFolder({
    title: 'Line 1',
    expanded: true,
});

TABS.pages[1].addBlade({
    view: 'separator',
});

const line2 = TABS.pages[1].addFolder({
    title: 'Line 2',
    expanded: true,
});

line1.addBinding(PARAMS, 'Point11', {
    format: (v) => v.toFixed(3),
    label: 'Point 1',
    x: {step: 1},
    y: {step: 1}
});

line1.addBinding(PARAMS, 'Point12',{
    format: (v) => v.toFixed(3),
    label: 'Point 2',
    x: {step: 1},
    y: {step: 1}
});

const selectLine1 = line1.addButton({
    title: 'Create Line'
  });

selectLine1.on('click', () => {
   $('#select-state').text("L1P1");
   $('#container').css('cursor', 'crosshair');
   PARAMS.selectState = "L1P1";
   pane.refresh();
});

line2.addBinding(PARAMS, 'Point21',{
    format: (v) => v.toFixed(3),
    label: 'Point 1',
    x: {step: 1},
    y: {step: 1}
});

line2.addBinding(PARAMS, 'Point22',{
    format: (v) => v.toFixed(3),
    label: 'Point 2',
    x: {step: 1},
    y: {step: 1}
});


const selectLine2 = line2.addButton({
    title: 'Create Line'
  });

selectLine2.on('click', () => {
    $('#select-state').text("L2P1");
    $('#container').css('cursor', 'crosshair');
    PARAMS.selectState = "L2P1";
    pane.refresh();
 });

const vanishingPoint = TABS.pages[1].addBinding(PARAMS, 'vanishingPoint', {
    format: (v) => v.toFixed(3),
    label: 'Vanishing Point',
    x: {step: 1},
    y: {step: 1}
 });

export const vanPointButton = TABS.pages[1].addButton({
    title: 'Calculate Vanishing Point'
});

const tireContact = TABS.pages[1].addBinding(PARAMS, 'tireContactPoint', {
    format: (v) => v.toFixed(3),
    label: 'Tire Contact',
    x: {step: 1},
    y: {step: 1}
});

const tireContactButton = TABS.pages[1].addButton({
    title: 'Set Tire Contact Point'
})

tireContactButton.on('click', () => {
    $('#select-state').text("TCP");
    $('#container').css('cursor', 'crosshair');
    PARAMS.selectState = "TCP";
    pane.refresh();
});

TABS.pages[1].addBlade({
    view: 'separator',
});

const overlayFolder = TABS.pages[1].addFolder({
    title: "Overlay Points",
    expanded: true
});

overlayFolder.addBinding(PARAMS, 'overlayP1', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Point 1',
    x: {step: 1},
    y: {step: 1}
});

overlayFolder.addBinding(PARAMS, 'overlayP2', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Point 2',
    x: {step: 1},
    y: {step: 1}
});

overlayFolder.addBinding(PARAMS, 'overlayP3', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Point 3',
    x: {step: 1},
    y: {step: 1}
});

overlayFolder.addBinding(PARAMS, 'overlayP4', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Point 4',
    x: {step: 1},
    y: {step: 1}
});

const helpLineFolder = TABS.pages[1].addFolder({
    title: "Helping Line Points",
    expanded: true
});

helpLineFolder.addBinding(PARAMS, 'helpLineP1', {
    format: (v) => v.toFixed(3),
    label: 'Help Line Point 1',
    x: {step: 1},
    y: {step: 1}
});

helpLineFolder.addBinding(PARAMS, 'helpLineP2', {
    format: (v) => v.toFixed(3),
    label: 'Help Line Point 2',
    x: {step: 1},
    y: {step: 1}
});



// Settings Tab

 let linewidth = TABS.pages[2].addBinding(SETTINGS, 'linewidth', {
    label: 'Line Width',
    min: 1,
    max: 10,
    step: 1
 });

let line1color = TABS.pages[2].addBinding(SETTINGS, 'line1color', {
    label: 'Line 1 Color',
    view: 'color'
 });

 let line2color = TABS.pages[2].addBinding(SETTINGS, 'line2color', {
    label: 'Line 2 Color',
    view: 'color'
 });


 linewidth.on('change', (e) => {
    // Rebuild Image
 });

 line1color.on('change', (e) => {
    // Rebuild Image
 });

 line2color.on('change', (e) => {
    // Rebuild Image
 });


