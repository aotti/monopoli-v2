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