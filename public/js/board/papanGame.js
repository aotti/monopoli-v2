function createBoard() {
    // get mods data from database
    fetcher(`/mods`, 'GET', null)
    .then(data => data.json())
    .then(result => {
        if(result.status != 200)
            return errorCapsule(result, anErrorOccured)
        // get empty board
        const papanGame = qS('#papan_game')
        // set mods values
        mods = [result.data[0].board_shape, result.data[0].money_start, 
                result.data[0].money_lose, result.data[0].curse_min, 
                result.data[0].curse_max, result.data[0].branch]
        // set board shape
        if(mods[0] == 'persegiPanjangV1')
            persegiPanjangV1();
        else if(mods[0] == 'persegiPanjangV2')
            persegiPanjangV2();
        else if(mods[0] == 'anggapSegitiga') {
            qS('.feedback_box').style.top = '63px';
            qS('.feedback_box').style.right = '340px';
            qS('.feedback_box').style.height = '200px';
            qS('.feedback_box').style.width = '300px';
            anggapSegitiga();
        }
        else {
            qS('.feedback_box').style.top = '170px';
            // qS('.feedback_box').style.right = '340px';
            bercabangDua();
        }
        // append shape to empty board
        papanGame.appendChild(docFrag)
        // insert images to board
        insertLandsToBoard()
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}

function insertImage(allLands, i, imgEl, src) {
    imgEl.src = src;
    imgEl.style.position = 'absolute';
    imgEl.style.opacity = '.7';
    imgEl.style.width = '100px';
    docFrag.appendChild(imgEl);
    allLands[i].parentElement.insertBefore(docFrag, allLands[i].parentElement.children[0]);
}

function insertLandsToBoard() {
    // set random percent for price on kotaTerkutuk
    const randKutukan = Math.floor(Math.random() * ((+mods[4] + 1) - +mods[3])) + +mods[3]
    // set the price for kotaTerkutuk
    const rumusKutukan1 = (4e3 * (playersTurn != null ? playersTurn.length : 1) * (laps != null ? laps : 1))
    const rumusKutukan2 = (1e4 * (laps != null ? laps : 1) * (randKutukan / 100))
    const hargaKutukan = Math.floor(rumusKutukan1 + rumusKutukan2)
    // set the price for kotaKhusus
    const hargaKhusus = (laps != null && laps > 6 ? 12_000 : 0)
    // land numbers
    const np = [
                2, 5, 6,
                11, 12, 13,
                18, 19, 21,
                25, 26, 1,
                10, 24, 4, 9,
                16, 17, 22, 28,
                7, 15, 20,
                8, 27,
                3, 14, 23,
                mods[0] == 'bercabangDua' ? '14a' : null,
                mods[0] == 'bercabangDua' ? '15a' : null,
                mods[0] == 'bercabangDua' ? '16a' : null,
                mods[0] == 'bercabangDua' ? '28a' : null,
                mods[0] == 'bercabangDua' ? '1a' : null,
                mods[0] == 'bercabangDua' ? '2a' : null
                ]
    // image for each land
    const landImages = [
                        {[np[0]]:'img/padang'}, {[np[1]]:'img/bengkulu'}, {[np[2]]:'img/pontianak'},
                        {[np[3]]:'img/jakarta'}, {[np[4]]:'img/bekasi'}, {[np[5]]:'img/bandung'},
                        {[np[6]]:'img/ciamis'}, {[np[7]]:'img/jokja'}, {[np[8]]:'img/semarang'},
                        {[np[9]]:'img/maumere'}, {[np[10]]:'img/merauke'}, {[np[11]]:'img/start'},
                        {[np[12]]:'img/penjara'}, {[np[13]]:'img/parkir'}, {[np[14]]:'img/danaUmum'}, {[np[15]]:'img/kesempatan'},
                        {[np[16]]:'img/danaUmum'}, {[np[17]]:'img/kesempatan'}, {[np[18]]:'img/danaUmum'}, {[np[19]]:'img/kesempatan'},
                        {[np[20]]:'img/khusus1'}, {[np[21]]:'img/khusus2'}, {[np[22]]:'img/khusus3'},
                        {[np[23]]:'img/terkutuk1'}, {[np[24]]:'img/terkutuk2'},
                        {[np[29]]:'img/kesempatan'}, {[np[30]]:'img/danaUmum'}, {[np[31]]:'img/kesempatan'}, {[np[32]]:'img/danaUmum'}
                        ]
    // classList.add for each land
    const landClasses =[
                        {[np[0]]:'kota_padang_tanah_48000'}, {[np[1]]:'kota_bengkulu_tanah_50000'}, {[np[2]]:'kota_pontianak_tanah_62000'},
                        {[np[3]]:'kota_jakarta_tanah_69000'}, {[np[4]]:'kota_bekasi_tanah_71000'}, {[np[5]]:'kota_bandung_tanah_73500'},
                        {[np[6]]:'kota_ciamis_tanah_76000'}, {[np[7]]:'kota_jokja_tanah_83000'}, {[np[8]]:'kota_semarang_tanah_87000'},
                        {[np[9]]:'kota_maumere_tanah_90000'}, {[np[10]]:'kota_merauke_tanah_94000'}, {[np[11]]:'lewat_start_25000'},
                        {[np[12]]:'area_penjara'}, {[np[13]]:'area_parkir'}, {[np[14]]:'kartu_danaUmum'}, {[np[15]]:'kartu_kesempatan'},
                        {[np[16]]:'kartu_danaUmum'}, {[np[17]]:'kartu_kesempatan'}, {[np[18]]:'kartu_danaUmum'}, {[np[19]]:'kartu_kesempatan'},
                        {[np[20]]:`area_khusus1_special_${15000 + hargaKhusus}`}, {[np[21]]:`area_khusus2_special_${25000 + hargaKhusus}`}, {[np[22]]:`area_khusus3_special_${35000 + hargaKhusus}`},
                        {[np[23]]:`area_terkutuk1_cursed_${hargaKutukan}`}, {[np[24]]:`area_terkutuk2_cursed_${hargaKutukan}`},
                        {[np[25]]:'area_normal'}, {[np[26]]:'area_normal'}, {[np[27]]:'area_normal'},
                        {[np[28]]:'area_buff'}, {[np[29]]:'kartu_kesempatan'}, {[np[30]]:'kartu_danaUmum'},
                        {[np[31]]:'kartu_kesempatan'}, {[np[32]]:'kartu_danaUmum'}, {[np[33]]:'area_buff'}
                        ]
    // get all lands
    const getLands = qSA('[class^=petak]');
    // insert class to each lands
    for(let i=0; i<landClasses.length; i++) {
        const landCls = cE('span');
        for(let j=0; j<getLands.length; j++) {
            if(Object.keys(landClasses[i])[0] == getLands[j].title) {
                landCls.classList.add(Object.values(landClasses[i])[0]);
                getLands[j].appendChild(landCls);
                break;
            }
        }
    }
    // get all lands element
    const allLands = qSA('[class^=kota], [class^=kartu], [class^=area], [class^=lewat]')
    // price for kotaKhusus
    const kotaKhususPrices = [
                                currencyComma(15000 + hargaKhusus),
                                currencyComma(25000 + hargaKhusus),
                                currencyComma(35000 + hargaKhusus)
                             ]
    // price for kotaTerkutuk
    const kotaTerkutukPrices = currencyComma(hargaKutukan)
    // name and price for each land
    const landNames = [
                        {[np[0]]:'Kota Padang Rp 48.000'}, {[np[1]]:'Kota Bengkulus Rp 50.000'}, {[np[2]]:'Kota Pontianac Rp 62.000'},
                        {[np[3]]:'Kota Jakarta Rp 69.000'}, {[np[4]]:'Kota Bekasih Rp 71.000'}, {[np[5]]:'Kota Bandung Rp 73.500'},
                        {[np[6]]:'Kota Ciamis Rp 76.000'}, {[np[7]]:'Kota Jokjakarta Rp 83.000'}, {[np[8]]:'Kota Semarang Rp 87.000'},
                        {[np[9]]:'Kota Maumere Rp 90.000'}, {[np[10]]:'Kota Merauke Rp 94.000'}, {[np[11]]:'Imagine lewat start..'},
                        {[np[12]]:'Masuk Penjara Bos!'}, {[np[13]]:'Imagine bebas parkir..'}, {[np[14]]:'Kartu Dana Umum'}, {[np[15]]:'Kartu Kesempatan'},
                        {[np[16]]:'Kartu Dana Umum'}, {[np[17]]:'Kartu Kesempatan'}, {[np[18]]:'Kartu Dana Umum'}, {[np[19]]:'Kartu Kesempatan'},
                        {[np[20]]:`Kota khusus-1 Rp ${kotaKhususPrices[0]}`}, {[np[21]]:`Kota khusus-2 Rp ${kotaKhususPrices[1]}`}, {[np[22]]:`Kota khusus-3 Rp ${kotaKhususPrices[2]}`},
                        {[np[23]]:`Kota terkutuk-1 Rp ${kotaTerkutukPrices}`}, {[np[24]]:`Kota terkutuk-2 Rp ${kotaTerkutukPrices}`},
                        {[np[29]]:'Kartu Kesempatan'}, {[np[30]]:'Kartu Dana Umum'}, {[np[31]]:'Kartu Kesempatan'}, {[np[32]]:'Kartu Dana Umum'}
                        ]
    
    for(let i=0; i<allLands.length; i++) {
        // insert city/land name to each land
        for(let x in landNames) {
            if(allLands[i].parentElement.title == Object.keys(landNames[x])[0])
                allLands[i].innerText = Object.values(landNames[x])[0];
        }
        // insert city/land image to each land
        for(let y in landImages) {
            if(allLands[i].parentElement.title == Object.keys(landImages[y])[0])
                insertImage(allLands, i, cE('img'), `${Object.values(landImages[y])[0]}.jpg`);
        }
    }
}