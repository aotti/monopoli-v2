function pricesForSpecialAndCursed(playerDadu, mods) {
    const specialAndCursedLands = qSA('[class*=cursed], [class*=special]') 
    // set the price for kotaTerkutuk
    // set random percent for price on kotaTerkutuk
    const randKutukan = Math.floor(Math.random() * ((mods[0].curse_max + 1) - mods[0].curse_min)) + mods[0].curse_min
    // 4k * jumlah player * jumlah laps
    const rumusKutukan1 = 4e3 * playersTurn.length * playerDadu
    // 10k * jumlah  laps * rand
    const rumusKutukan2 = 1e4 * playerDadu * (randKutukan / 100)
    const hargaKutukan = Math.floor(rumusKutukan1 + rumusKutukan2)
    // set the price for kotaKhusus
    // laps > 6 == 12_000
    const hargaKhusus = (playerDadu > 1 ? playerDadu * 4000 : 0)
    for(let land of specialAndCursedLands) {
        // ### REGEX UNTUK AMBIL HARGA CLASS = classList.toString().match(/\d{2,}/)
        // get class text without price
        const getClassPrice = land.classList.toString().match(/\d{2,}/)
        const classTextRegex = new RegExp(`.*(?=${getClassPrice})`)
        const getClassText = land.classList.toString().match(classTextRegex)
        // ### REGEX UNTUK AMBIL HARGA TEXT = innerText.match(/Rp \d.\d{2,}/)
        // get innertext without price
        const getContentPrice = land.innerText.match(/Rp \d+.\d+/)
        const contentTextRegex = new RegExp(`.*(?=${getContentPrice})`)
        const getContentText = land.innerText.match(contentTextRegex)
        // rewrite class and innertext
        if(land.classList.toString().match(/cursed/)) {
            land.classList.remove(land.classList[0])
            land.classList.add(`${getClassText}${hargaKutukan}`)
            land.innerText = `${getContentText} Rp ${currencyComma(hargaKutukan)}`
        }
        else if(land.classList.toString().match(/special/)) {
            let specialPrice = null
            if(land.classList.toString().match(/\d/) == 1)
                specialPrice = 15000
            else if(land.classList.toString().match(/\d/) == 2)
                specialPrice = 25000
            else if(land.classList.toString().match(/\d/) == 3)
                specialPrice = 35000
            land.classList.remove(land.classList[0])
            land.classList.add(`${getClassText}${specialPrice + hargaKhusus}`)
            land.innerText = `${getContentText} Rp ${currencyComma(specialPrice + hargaKhusus)}`
        }
    }
}

// run this ONLY on playerEndTurnHandler and gameResume
function placeHomeAndHotelOnCity(allPlayersCities) { 
    const allLands = qSA('[class^=kota], [class*=special]')
    for(let land of allLands) {
        // land name that we lookin for 
        const landName = land.innerText.split(/\W/)[1]
        // looking for all lands that have been bought by players
        allPlayersCities.forEach(v => {
            // turn string into array
            const splitPerCity = v.harta_kota.split(';')
            for(let splitCity of splitPerCity) {
                // if city exist in database
                if(splitCity.match(landName)) {
                    // place home or hotel on city
                    // add more price if the player have all the houses from the same row
                    // ### PAJAK SEBARIS KERJAIN NANTI
                    const oneRowTax = 0
                    // prepare new classList for each land
                    const propLength = splitCity.split('-')[1].split(',').length
                    const lastProp = splitCity.split('-')[1].split(',')[propLength-1]
                    let propText = null
                    const nextClassList = (()=>{
                        switch(lastProp) {
                            // if player only buy the land
                            case 'tanah':
                                propText = `(${v.user_id.username})`
                                return '1rumah'
                            // if player bought 1 house
                            case '1rumah':
                                propText = '\u{1F3E0}';
                                return '2rumah';
                            // if player bought 2 house
                            case '2rumah':
                                propText = '\u{1F3E0} \u{1F3E0}';
                                return '2rumah1hotel';
                            // if player bought 2 house and 1 hotel
                            case '2rumah1hotel':
                                propText = '\u{1F3E0} \u{1F3E0} \u{1F3E8}';
                                return 'komplek';
                        }
                    })()
                    // prepare new price for each land
                    const nextPropPrice = (()=>{
                        const currentLandPrice = +land.classList[0].split('_')[3]
                        switch(lastProp) {
                            case 'tanah':
                                return (currentLandPrice + (currentLandPrice * .10) + (currentLandPrice * oneRowTax));
                            // if player bought 1 house
                            case '1rumah':
                                return (currentLandPrice + (currentLandPrice * .20) + (currentLandPrice * oneRowTax));
                            // if player bought 2 house
                            case '2rumah':
                                return (currentLandPrice + (currentLandPrice * .30) + (currentLandPrice * oneRowTax));
                            // if player bought 2 house and 1 hotel
                            case '2rumah1hotel':
                                return (currentLandPrice + (currentLandPrice * .40) + (currentLandPrice * oneRowTax));
                        }
                    })()
                    // remove current classList and add the new one
                    land.classList.remove(land.classList[0])
                    land.classList.add(`kota_${landName.toLowerCase()}_${nextClassList}_${nextPropPrice}_${v.user_id.username}`)
                    land.setAttribute('data-owner', `${v.user_id.username} - Rp ${nextPropPrice}`)
                    land.innerText = `Kota ${landName} \n${propText}` 
                }
            }
        })
    }
}