function createDialogBox(type, elements, attrType, attrs, contentBox) {
    const papanGame = qS('#papan_game')
    // check dialog type
    if(type == 'confirmDialog') {
        for(let i in elements) {
            // check attrType 
            if(attrType[i] == 'class') {
                // insert attributes and content
                elements[i].classList.add(attrs[i])
                elements[i].innerText = contentBox[i]
            }
            else if(attrType[i] == 'id') {
                elements[i].id = attrs[i]
                elements[i].innerText = contentBox[i]
            }
            else if(attrType[i] == 'text') {
                elements[i].innerText = contentBox[i]
            }
            // append elements to container
            // elements[0] must be container
            if(i > 0) {
                elements[0].appendChild(elements[i])
            }
        }
        // append dialog to  papangame
        papanGame.appendChild(elements[0])
    }
}

function infoButtons() {
    qS('#cekPlayer').onclick = ()=>{
        alert('player')
    }
    
    qS('#cekMods').onclick = ()=>{
        alert('mods')
    }
}

function confirmDialog() {
    // create dialog box
    const dialogBox = cE('div')
    const textBox = cE('p')
    const buttonAgree = cE('button')
    const buttonDisagree = cE('button')
    const textBoxInnerText = 'Apakah anda mau beli tanah di kota Jakarta dengan harga Rp 50.000, atau langsung beli rumah dengan harga Rp 100.000?'
    // create dialog
    createDialogBox(
        // dialog type
        'confirmDialog',  
        // elements
        [dialogBox, textBox, buttonAgree, buttonDisagree],
        // attributes type
        ['class', 'text', 'id', 'id'],
        // attributes
        ['confirm_box', null, 'buyAgree', 'buyDisagree'],
        // innerText
        [null, textBoxInnerText, 'Beli', 'Males']
    )
}