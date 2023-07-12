function cardsEvent(mods, giliran, tempPlayerPosNow, endTurnMoney, data) {
    if(data.cardType == 'kartu_danaUmum') {
        danaUmumCards(mods, giliran, tempPlayerPosNow, endTurnMoney)
    }
    else if(data.cardType == 'kartu_kesempatan') {

    }
}

function danaUmumCards(mods, giliran, tempPlayerPosNow, endTurnMoney) {
    qS('#pDanaUmum').play();
    // random number to pick cards
    const chances = Math.random() * 100
    // cards container
    let cardList = null
    // pick cards and put into container
    if(chances < 9) {
        cardList = {
            cards: ['Gaji bulanan sudah cair, Anda mendapatkan 160.000',
                    'Bayar tagihan listrik & air 100.000',
                    'Menjual 1 kota yang Anda miliki (acak)'
                    ],
            types: ['gainMoney', 'loseMoney', 'sellCity'],
            effects: [160_000, 100_000, null]
        }
    }
    // chances >= 9 && chances < 25
    else if(chances >= 9 && chances < 25) {
    cardList = ['Bayar rumah sakit 50.000',
                'Debt collector datang ke rumah, bayar hutang 60.000',
                'Gilang si baik hati memberi anda uang 5.000',
                'Kartu anti pajak \u{1F60E}',
                'Pilih kota anda yang ingin dituju'
                ];
    }
    // chances >= 25 && chances < 51
    else if(chances >= 25 && chances < 51) {
    cardList = ['Gilang sang hecker meretas akun bank anda dan kehilangan uang 20.000',
                'Kartu penghambat rezeki \u{1F5FF}',
                'Mobil anda rusak, bayar biaya perbaikan 35.000',
                'Kartu nerf pajak 35%',
                'Anda mendapat uang 20.000 dikali jumlah angka pada koin yang dipilih'
                ];
    }
    // chances >= 51 && chances < 95
    else if(chances >= 51 && chances < 95) {
    cardList = ['Hadiah dari bank, anda mendapatkan 40.000',
                'Anda mendapat warisan 65.000',
                'Anda ulang tahun hari ini, dapat 15.000 dari tiap player'
                ];
    }
    else if(chances >= 95 && chances < 100)
    cardList = ['Kartu upgrade kota'];
}