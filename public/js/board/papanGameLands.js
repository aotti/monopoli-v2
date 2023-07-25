function pricesForSpecialAndCursed(playerDadu, mods) {
    const specialAndCursedLands = qSA('[class*=cursed], [class*=special]') 
    // get player laps
    const getPlayerLaps = +qS('.putaranTeks').innerText.match(/\d+/)
    // set the price for kotaTerkutuk
    // set random percent for price on kotaTerkutuk
    const randKutukan = Math.floor(Math.random() * ((mods[0].curse_max + 1) - mods[0].curse_min)) + mods[0].curse_min
    // 4000 * jumlah player * jumlah laps
    const rumusKutukan1 = 4000 * playersTurn.length * getPlayerLaps
    // playerDadu * jumlah  laps * rand
    const rumusKutukan2 = (playerDadu * 1000) * getPlayerLaps * (randKutukan / 100)
    // add player dadu to formula
    const rumusKutukan3 = rumusKutukan1 * (randKutukan / 100)
    const hargaKutukan = Math.floor(rumusKutukan1 + rumusKutukan2 + rumusKutukan3)
    // set the price for kotaKhusus
    // laps > 6 == 12_000
    const hargaKhusus = (getPlayerLaps > 6 ? 4000 * playerDadu : 2000 * playerDadu)
    for(let land of specialAndCursedLands) {
        // check if any special area is already bought
        const specialOwner = land.classList[0].split('_')[4]
        // ### REGEX UNTUK AMBIL HARGA CLASS = classList.toString().match(/\d{2,}/)
        // get class text without price
        const getClassPrice = land.classList.toString().match(/\d{2,}/)
        const classTextRegex = new RegExp(`.*(?=${getClassPrice})`)
        const getClassText = land.classList.toString().match(classTextRegex)
        // ### REGEX UNTUK AMBIL HARGA TEXT = innerText.match(/Rp \d.\d{2,}/)
        // get innertext without price
        const getContentPrice = land.innerText.match(/Rp \d+.\d+/)
        const contentTextRegex = specialOwner ? new RegExp(`.*(?=\\s\\W)`) : new RegExp(`.*(?=${getContentPrice})`)
        const getContentText = land.innerText.match(contentTextRegex)
        // rewrite class and innertext
        // cursed land
        if(land.classList.toString().match(/cursed/)) {
            land.classList.remove(land.classList[0])
            land.classList.add(`${getClassText}${hargaKutukan}`)
            land.innerText = `${getContentText} Rp ${currencyComma(hargaKutukan)}`
        }
        // special land
        else if(specialOwner && land.classList.toString().match(/special/)) {
            const specialPrice = +land.classList[0].split('_')[3]
            land.classList.remove(land.classList[0])
            land.classList.add(`${getClassText}${specialPrice + hargaKhusus}_${specialOwner}`)
        }
    }
}

function findOneRowCity(allPlayersCities) {
    // regex to check if player cities are one row or not
    const oneRowGroup = [
        {count: 3, cities: new RegExp('Padang|Bengkulus|Pontianac', 'g')}, 
        {count: 3, cities: new RegExp('Jakarta|Bekasih|Bandung', 'g')}, 
        {count: 3, cities: new RegExp('Ciamis|Jokjakarta|Semarang', 'g')}, 
        {count: 2, cities: new RegExp('Maumere|Merauke', 'g')}
    ]
    const citiesThatAreOneRow = (()=>{
        // array to store city names
        const tempcitiesThatAreOneRow = []
        // loop all player cities to find out if someone have 1 row city
        allPlayersCities.forEach(v => {
            for(let group of oneRowGroup) {
                // if the player have 1 row city
                if(v.harta_kota.match(group.cities) && v.harta_kota.match(group.cities).length === group.count) {
                    // push the city name to tempcitiesThatAreOneRow
                    const tempCities = v.harta_kota.match(group.cities)
                    for(let city of tempCities)
                        tempcitiesThatAreOneRow.push(city)
                }
            }
        })
        return tempcitiesThatAreOneRow.filter(i=>i)
    })()
    return citiesThatAreOneRow
}

// run this ONLY on playerEndTurnHandler and gameResume
function placeHomeAndHotelOnCity(allPlayersCities) { 
    const allLands = qSA('[class^=kota], [class*=special]')
    // base prices for all cities
    const baseCityPrices = [
        {city: 'khusus1', price: 15_000}, {city: 'khusus2', price: 25_000}, {city: 'khusus3', price: 35_000},
        {city: 'padang', price: 48_000}, {city: 'bengkulus', price: 50_000}, {city: 'pontianac', price: 62_000},
        {city: 'jakarta', price: 69_000}, {city: 'bekasih', price: 71_000}, {city: 'bandung', price: 73_000},
        {city: 'ciamis', price: 76_000}, {city: 'jokjakarta', price: 83_000}, {city: 'semarang', price: 87_000},
        {city: 'maumere', price: 90_000}, {city: 'merauke', price: 94_000}
    ]
    // cities that are one row
    const citiesWithOneRowTax = findOneRowCity(allPlayersCities)
    // start loop allLands
    for(let land of allLands) {
        // land name that we lookin for 
        const landName = land.classList[0].split('_')[1]
        // looking for all lands that have been bought by players
            const doubleCheckOwner = []
        allPlayersCities.forEach(v => {
            // turn string (data from db) into array
            const splitPerCity = v.harta_kota.split(';')
            for(let splitCity of splitPerCity) {
                // if city exist in database
                if(splitCity.split('-')[0] === landName) {
                    const cityExistObj = {
                        citiesWithOneRowTax: citiesWithOneRowTax, 
                        land: land,
                        landName: landName, 
                        splitCity: splitCity, 
                        vUsername: v.user_id.username, 
                        baseCityPrices: baseCityPrices
                    }
                    setHousesAndHotels(cityExistObj)
                }
                else if(splitCity.split('-')[0] !== landName) {
                    // to check if any city classlist owner removed
                    doubleCheckOwner.push(landName)
                    // check land type
                    const landType = (()=>{
                        if(land.classList[0].match('area'))
                            return 'special'
                        else if(land.classList[0].match('kota'))
                            return 'kota'
                    })()
                    // get land base price
                    const landBasePrice = (()=>{
                        for(let land of baseCityPrices) {
                            if(land.city === landName)
                                return land.price
                        }
                    })()
                    // remove current classList and add the new one
                    land.classList.remove(land.classList[0])
                    // for special area
                    if(landType === 'special') 
                        land.classList.add(`area_${landName}_special_${landBasePrice}`)
                    // for normal city
                    else if(landType === 'kota') 
                        land.classList.add(`kota_${landName}_tanah_${landBasePrice}`)
                    land.removeAttribute('data-owner')
                    land.innerText = `Kota ${cityNameFirstLetter(landName)} Rp ${currencyComma(+landBasePrice)}` 
                }
            }
        })
        if(doubleCheckOwner.length === 1) {
            // get username and harta_kota
            const myHartaKota = getMyHartaKota(allPlayersCities, doubleCheckOwner[0])
            // if myHartaKota is undefined, stop
            if(myHartaKota == null) return
            // data required to rebuild the lost city
            const cityExistObj = {
                citiesWithOneRowTax: citiesWithOneRowTax, 
                land: playerCityList(null, doubleCheckOwner[0]),
                landName: doubleCheckOwner[0], 
                splitCity: myHartaKota.splitCity, 
                vUsername: myHartaKota.username, 
                baseCityPrices: baseCityPrices
            }
            // rebuild the lost city
            setHousesAndHotels(cityExistObj)
        }
    }
}

function setHousesAndHotels(cityExistObj) {
    const { citiesWithOneRowTax, land, landName, splitCity, vUsername, baseCityPrices } = cityExistObj
    // place home or hotel on city
    // add more price if the player have all the houses from the same row
    const oneRowTax = citiesWithOneRowTax.map(v => {return v == landName ? .25 : 0}).filter(i=>i)
    // get the lastest city property, ex: tanah,1rumah,2rumah => 2rumah is the lastest property
    const propLength = splitCity.split('-')[1].split(',').length
    const lastProp = splitCity.split('-')[1].split(',')[propLength-1]
    // set innerText on the city, if player have house, then fill this with house emoji
    let propText = null
    // prepare new classList for each land
    const nextPropType = (()=>{
        switch(lastProp) {
            // if player only buy the land
            case 'special':
                propText = `(${vUsername})`
                return 'special'
            case 'tanah':
                propText = `(${vUsername})`
                return '1rumah'
            // if player bought 1 house
            case '1rumah':
                propText = `${emoji.house}`;
                return '2rumah';
            // if player bought 2 house
            case '2rumah':
                propText = `${emoji.house} ${emoji.house}`;
                return '2rumah1hotel';
            // if player bought 2 house and 1 hotel
            case '2rumah1hotel':
                propText = `${emoji.house} ${emoji.house} ${emoji.hotel}`;
                return 'komplek';
        }
    })()
    // prepare new price for each land
    const nextPropPrice = (()=>{
        // filter used to remove undefined values in array after map
        const baseLandPrice = baseCityPrices.map(v => { if(v.city == landName) return v.price }).filter(i=>i)[0]
        // set the price based on city property
        switch(lastProp) {
            case 'special':
                return (baseLandPrice + 10_000);
            case 'tanah':
                return (baseLandPrice + (baseLandPrice * .10) + (baseLandPrice * oneRowTax));
            // if player bought 1 house
            case '1rumah':
                return (baseLandPrice + (baseLandPrice * .20) + (baseLandPrice * oneRowTax));
            // if player bought 2 house
            case '2rumah':
                return (baseLandPrice + (baseLandPrice * .30) + (baseLandPrice * oneRowTax));
            // if player bought 2 house and 1 hotel
            case '2rumah1hotel':
                return (baseLandPrice + (baseLandPrice * .40) + (baseLandPrice * oneRowTax));
        }
    })()
    // remove current classList and add the new one
    land.classList.remove(land.classList[0])
    // for special area
    if(nextPropType === 'special') 
        land.classList.add(`area_${landName}_${nextPropType}_${nextPropPrice}_${vUsername}`)
    // for normal city
    else 
        land.classList.add(`kota_${landName}_${nextPropType}_${nextPropPrice}_${vUsername}`)
    // ### ATTR data-owner MUNGKIN KEPAKE NANTI BUAT JUAL KOTA
    land.setAttribute('data-owner', `${vUsername} - Rp ${nextPropPrice}`)
    land.innerText = `Kota ${cityNameFirstLetter(landName)} \n${propText}` 
}

function getMyHartaKota(allPlayersCities, theLostCity) {
    for(let player of allPlayersCities) {
        // find spcific player
        if(player.user_id.username === myGameData.username) {
            // get the harta kota
            const splitPerCity = player.harta_kota.split(';')
            for(let splitCity of splitPerCity) {
                // get the lost city
                if(splitCity.split('-')[0] === theLostCity) {
                    // return the username and the lost city
                    return {username: player.user_id.username, splitCity: splitCity}
                }
            }
        }
    }
}