import { TABS } from "../menu.js";
let loadButton = TABS.pages[0].addButton( {
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
    
    const parser = new XMLParser();
    let parsedXML = parser.parse(XML);
    
});