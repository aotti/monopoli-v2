// 3d dice
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
 * @param {Boolean} allowAppendToBoard - the container will append to board, put 'false' if you dont need (boolean)
 * @param {Boolean} secondContainer - second container existence (boolean)
 * @param {Array<string>} elTypes - element types: div/span/button/text/pass (array)
 * @param {Array<HTMLElement>} elements - html elements (array)
 * @param {Array<string>} attrTypes - attribute types: class/id/text/none (array)
 * @param {Array<string>} attrs - attribute values (array)
 * @param {Array<string>} textValues - html text (array)
 */
function appendGameDialogBoxesOrButtonsToBoard(allowAppendToBoard, secondContainer, elTypes, elements, attrTypes, attrs, textValues) {
    const papanGame = qS('#papan_game')
    // run gameDialogBoxesAndButtons
    gameDialogBoxesAndButtons(secondContainer, elTypes, elements, attrTypes, attrs, textValues)
    // append dialog to  papangame
    if(allowAppendToBoard)
        papanGame.appendChild(elements[0])
}

function insertAttributeAndValue(element, attrType, attr, textValue) {
    switch(attrType) {
        case 'class-only':
            element.classList.add(attr)
            break
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
            case 'password':
                elements[i].type = 'password'
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'combox':
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'range':
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
        }
        // append elements to 2nd container
        // elements[1] must be container
        if(secondContainer && i > 1) {
            elements[1].appendChild(elements[i])
        }
        // append elements to container
        // elements[0] must be container
        else if(i > 0) {
            elements[0].appendChild(elements[i])
        }
    }
}

function dialogBoxSpanChild(mainDialog, container, classContainer, spanTitle, spanValue, textTitle, textValue) {
    appendGameDialogBoxesOrButtonsToBoard(
        false, true,
        ['div', 'div', 'span', 'span'],
        [mainDialog, container, spanTitle, spanValue],
        [null, 'class', 'none', 'none'],
        [null, classContainer, null, null],
        [null, null, textTitle, textValue]
    )
}

function dialogBoxTitle(dialogInfo, titleText) {
    const titleDiv = cE('div')
    const titleSpan = cE('h3')
    appendGameDialogBoxesOrButtonsToBoard(
        false, true,
        ['div', 'div', 'span'],
        [dialogInfo, titleDiv, titleSpan],
        [null, 'class', 'none'],
        [null, 'dialogTitle', null],
        [null, null, titleText]
    )
}