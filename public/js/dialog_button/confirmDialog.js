// confirm dialog when player step on land to  
// buy house || get cards || going to jail  || free parking
function confirmDialog(dialogText, elementTypes, htmlElements, classAttributes, classValues, textValues) {
    // create dialog box
    const dialogConfirmBox = cE('div')
    const dialogTextBox = cE('div')
    const dialogArray = [dialogTextBox, dialogConfirmBox]
    const dialogAttributes = ['none', 'class']
    const dialogClasses = [null, 'confirm_box']
    const dialogTextValues = [dialogText, null]
    for(let i in dialogArray) {
        elementTypes.unshift('div')
        htmlElements.unshift(dialogArray[i])
        classAttributes.unshift(dialogAttributes[i])
        classValues.unshift(dialogClasses[i])
        textValues.unshift(dialogTextValues[i])
    }
    // create and append dialog
    appendGameDialogBoxesOrButtonsToBoard(
        // allow append to board, 2nd container
        true, false, 
        // element types
        elementTypes,
        // elements (the first element must be a container)
        htmlElements,
        // attribute types
        classAttributes,
        // attribute values
        classValues,
        // innerText
        textValues
    )
}