// confirm dialog when player step on land to  
// buy house || get cards || going to jail  || free parking
function confirmDialog() {
    // create dialog box
    const dialogConfirmBox = cE('div')
    const textBox = cE('div')
    const buttonAgree = cE('input')
    const buttonDisagree = cE('input')
    const textBoxInnerText = 'Apakah anda mau beli tanah di kota Jakarta dengan harga Rp 50.000, atau langsung beli rumah dengan harga Rp 100.000?'
    // create and append dialog
    appendGameDialogBoxesOrButtonsToBoard(
        // allow append to board, 2nd container
        true, false, 
        // element types
        ['div', 'div', 'button', 'button'],
        // elements (the first element must be a container)
        [dialogConfirmBox, textBox, buttonAgree, buttonDisagree],
        // attribute types
        ['class', 'none', 'id', 'id'],
        // attribute values
        ['confirm_box', null, 'buyAgree', 'buyDisagree'],
        // innerText
        [null, textBoxInnerText, 'Beli', 'Males']
    )
}