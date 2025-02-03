import {Pane} from './lib/tweakpane.js';

// Create Pane, Instantiate Parameters and Create Menu Structure
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
    overlayTopLeft: {x: 0, y: 0},
    overlayBottomLeft: {x: 0, y: 0},
    overlayBottomRight: {x: 0, y: 0},
    overlayTopRight: {x: 0, y: 0},
    helpLineP1: {x: 0, y: 0},
    helpLineP2: {x: 0, y: 0},
    licensePlateLeft: {x: 0, y: 0},
    licensePlateRight: {x:0, y: 0}
};

export const inputFiles = {
    image: "",
    xml: ""
}

export const SETTINGS = {
    linewidth : 3,
    line1color : '#ed7d31',
    line2color : '#ed7d31'
}

// Tabs
export const TABS = pane.addTab({
    pages: [
        {title: 'General'},
        {title: 'Edit'},
        //{title: 'Settings'}
    ]
});

// Load Image Button
let loadButton = TABS.pages[0].addButton({
    title: 'Load Image'
});

loadButton.on('click', () => {
    $('#file_input').click();
})




//Upload XML Button
export let uploadXML = TABS.pages[0].addButton({
    title: 'Load XML',
    disabled: true
});

uploadXML.on('click', () => {
    $('#xml_input').click();
});

// Clear Page Button
export const clearButton = TABS.pages[0].addButton({
    title: 'Clear Image',
    disabled: true
})


// Show Select State and Image Ratio
TABS.pages[1].addBinding(PARAMS, 'selectState', {
    label: 'Select State',
    disabled: true
});

TABS.pages[1].addBinding(PARAMS, 'imgRatio', {
    label: 'Image Ratio',
    disabled: true
})

// Folder to create Line 1
const line1 = TABS.pages[1].addFolder({
    title: 'Line 1',
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

TABS.pages[1].addBlade({
    view: 'separator',
});

// Folder to create Line 2
const line2 = TABS.pages[1].addFolder({
    title: 'Line 2',
    expanded: true,
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

export const tireContactButton = TABS.pages[1].addButton({
    title: 'Set Tire Contact Point',
    disabled: true
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
    expanded: false
});

overlayFolder.addBinding(PARAMS, 'overlayTopLeft', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Top Left',
    x: {step: 1},
    y: {step: 1}
});

overlayFolder.addBinding(PARAMS, 'overlayBottomLeft', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Bottom Left',
    x: {step: 1},
    y: {step: 1}
});

overlayFolder.addBinding(PARAMS, 'overlayBottomRight', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Bottom Right',
    x: {step: 1},
    y: {step: 1}
});

overlayFolder.addBinding(PARAMS, 'overlayTopRight', {
    format: (v) => v.toFixed(3),
    label: 'Overlay Top Right',
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

export let helpLineButton = helpLineFolder.addButton({
    title: "Show Help Line Length",
    disabled: true
});

let selectLicensePlate = TABS.pages[1].addButton({
    title: "Select License Plate",
});


selectLicensePlate.on('click', () => {
    $('#select-state').text("LP1");
    $('#container').css('cursor', 'crosshair');
    PARAMS.selectState = "LP1";
    pane.refresh();
});

export let exportImageBtn = TABS.pages[0].addButton({
    title: 'Export Image'
});





// Settings Tab
/*
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
*/

