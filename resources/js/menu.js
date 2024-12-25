import {Pane} from './lib/tweakpane.js';

export const pane = new Pane();

export const PARAMS = {
    selectState: "none",
    Point11 : {x: 0, y: 0},
    Point12 : {x: 0, y: 0},
    Point21 : {x: 0, y: 0},
    Point22 : {x: 0, y: 0},
    vanishingPoint: {x: 0, y: 0}
};


export const SETTINGS = {
    linewidth : 3,
    line1color : '#ff0000',
    line2color : '#0000ff'
}

const TABS = pane.addTab({
    pages: [
        {title: 'General'},
        {title: 'Lines'},
        {title: 'Settings'}
    ]
});


let loadButton = TABS.pages[0].addButton( {
    title: 'Load Image'
});

loadButton.on('click', () => {
    $('#file_input').click();
})

export const clearButton = TABS.pages[0].addButton({
    title: 'Clear Image'
})



TABS.pages[1].addBinding(PARAMS, 'selectState', {
    label: 'Select State',
    disabled: true

});
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


