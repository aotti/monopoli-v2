function confirmDialog() {
    // create dialog box
    const dialogBox = cE('div')
    const textBox = cE('div')
    const buttonAgree = cE('input')
    const buttonDisagree = cE('input')
    const textBoxInnerText = 'Apakah anda mau beli tanah di kota Jakarta dengan harga Rp 50.000, atau langsung beli rumah dengan harga Rp 100.000?'
    // create and append dialog
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        false,
        // element types
        ['div', 'div', 'button', 'button'],
        // elements (the first element must be a container)
        [dialogBox, textBox, buttonAgree, buttonDisagree],
        // attribute types
        ['class', 'none', 'id', 'id'],
        // attribute values
        ['confirm_box', null, 'buyAgree', 'buyDisagree'],
        // innerText
        [null, textBoxInnerText, 'Beli', 'Males']
    )
}

function gameButtons() {
    // container
    const infoArea = cE('div')
    infoArea.classList.add('infoArea')
    // putaran 
    const putaranTeks = cE('span')
    const putaranBuff = cE('span')
    putaranBuff.dataset.buff = `[Bonus Uang Kalo Lewat Start] putaran > 6 = uang +40% putaran > 14 = uang +80%`;
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span', 'span'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, putaranTeks, putaranBuff],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'putaranTeks', 'putaranBuff'],
        // innerText
        // ### putaranTeks perlu localStorage
        [null, 'Putaran ', '\u{2615}']
    )
    // paksa start
    const paksaMulaiSpan = cE('span')
    const paksaMulaiButton = cE('input')
    paksaMulaiButton.disabled = true
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span', 'button'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, paksaMulaiSpan, paksaMulaiButton],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'paksaMulaiSpan', 'paksaMulai'],
        // innerText
        [null, null, 'Paksa Mulai']
    )
    // username
    const userNameSpan = cE('span')
    const userName = cE('input')
    userName.placeholder = 'Username';
    userName.maxLength = '8';
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span', 'text'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, userNameSpan, userName],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'userNameSpan', 'userName'],
        // innerText
        [null, null, null]
    )
    // mulai button
    const tombolMulaiSpan = cE('span')
    const tombolMulaiButton = cE('input')
    tombolMulaiButton.disabled = true
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span', 'button'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, tombolMulaiSpan, tombolMulaiButton],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'tombolMulaiSpan', 'tombolMulai'],
        // innerText
        [null, null, 'Mulai']
    )
    // acak dadu
    const acakDaduSpan = cE('span')
    const acakDaduButton = cE('input')
    const acakDaduTeks = cE('div')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span', 'button', 'div', 'div'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, acakDaduSpan, acakDaduButton, acakDaduTeks, dadu3D(cE('div'), cE('div'), cE('div'))],
        // attribute types
        [null, 'class', 'class', 'class', null],
        // attribute values
        [null, 'acakDaduSpan', 'acakDadu', 'acakDaduTeks', null],
        // innerText
        [null, null, 'Kocok Dadu', null, null]
    )
    // acak giliran
    const acakGiliranSpan = cE('span')
    const acakGiliranButton = cE('input')
    const acakGiliranTeks = cE('div')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span', 'button', 'div'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, acakGiliranSpan, acakGiliranButton, acakGiliranTeks],
        // attribute types
        [null, 'class', 'class', 'class'],
        // attribute values
        [null, 'acakGiliranSpan', 'acakGiliran', 'acakGiliranTeks'],
        // innerText
        [null, null, 'Kocok Giliran', null]
    )
    // info giliran
    const urutanGiliran = cE('span')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true,
        // element types
        ['div', 'span'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, urutanGiliran],
        // attribute types
        [null, 'class'],
        // attribute values
        [null, 'urutanGiliran'],
        // innerText
        [null, 'urutan']
    )
}

function infoButtons() {
    qS('#cekPlayer').onclick = ()=>{
        alert('player')
    }
    
    qS('#cekMods').onclick = ()=>{
        alert('mods')
    }
}

function dadu3D(divGame, divCont, divDice) {
    for(let i=0; i<6; i++) {
      let diceSide = cE('div')
      for(let j=0; j<6; j++) {
        let diceDot = cE('div')
        if(i == 0 && j < 1) {
          diceSide.id = 'dice-one-side-one';
          diceSide.classList.add('side', 'one');
          diceDot.classList.add(`dot`, `one-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 1 && j < 2) {
          diceSide.id = 'dice-one-side-two';
          diceSide.classList.add('side', 'two');
          diceDot.classList.add(`dot`, `two-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 2 && j < 3) {
          diceSide.id = 'dice-one-side-three';
          diceSide.classList.add('side', 'three');
          diceDot.classList.add(`dot`, `three-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 3 && j < 4) {
          diceSide.id = 'dice-one-side-four';
          diceSide.classList.add('side', 'four');
          diceDot.classList.add(`dot`, `four-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 4 && j < 5) {
          diceSide.id = 'dice-one-side-five';
          diceSide.classList.add('side', 'five');
          diceDot.classList.add(`dot`, `five-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 5 && j < 6) {
          diceSide.id = 'dice-one-side-six';
          diceSide.classList.add('side', 'six');
          diceDot.classList.add(`dot`, `six-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
      }
      docFrag.appendChild(diceSide);
      diceSide = null;
    }
    divDice.id = 'dice1';
    divDice.classList.add('dice', 'dice-one');
    divCont.classList.add('container');
    divGame.classList.add('game');
    divDice.appendChild(docFrag);
    divCont.appendChild(divDice);
    divGame.appendChild(divCont);
    return divGame;
}

/**
 * @param {Boolean} secondContainer - secondary container existence (boolean)
 * @param {Array<HTMLElement>} elements - html elements (array)
 * @param {Array<string>} elTypes - element types: div/span/button (array)
 * @param {Array<string>} attrTypes - attribute types: class/id/text (array)
 * @param {Array<string>} attrs - attribute values (array)
 * @param {Array<string>} textValues - html text (array)
 */

function appendGameDialogBoxesOrButtonsToBoard(secondContainer, elTypes, elements, attrTypes, attrs, textValues) {
    const papanGame = qS('#papan_game')
    // run gameDialogBoxesAndButtons
    gameDialogBoxesAndButtons(secondContainer, elTypes, elements, attrTypes, attrs, textValues)
    // append dialog to  papangame
    papanGame.appendChild(elements[0])
}

function insertAttributeAndValue(element, attrType, attr, textValue) {
    switch(attrType) {
        case 'class':
            element.classList.add(attr)
            element.innerText = textValue
            element.value = textValue
            break
        case 'id':
            element.id = attr
            element.innerText = textValue
            element.value = textValue
            break
        case 'none':
            element.innerText = textValue
            element.value = textValue
            break
        case null:
            break
    }
}

function gameDialogBoxesAndButtons(secondContainer, elTypes, elements, attrTypes, attrs, textValues) {
    for(let i in elements) {
        // check attrTypes
        switch(elTypes[i]) {
            case 'div':
                // insert attributes and content
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'span':
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'button':
                elements[i].type = 'button'
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'text':
                elements[i].type = 'text'
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
        }
        // append elements to container
        // elements[0] must be container
        if(i > 0) {
            elements[0].appendChild(elements[i])
        }
        // append elements to 2nd container
        // elements[1] must be container
        if(secondContainer && i > 1) {
            elements[1].appendChild(elements[i])
        }
    }
}