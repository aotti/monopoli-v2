function persegiPanjangV1() {
  for(let i=0; i<6; i++) {
    let baris = cE('tr'),
        u;
    for(let j=0; j<10; j++) {
      let kolom = cE('td'),
          petak = cE('div');
      if( (i > 0 && i < 5) && (j > 0 && j < 9) ) {
        kolom.appendChild(petak);
        baris.appendChild(kolom);
      }
      else {
        // BARIS 1
        if(i == 0) {
          u = 15 + j;
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 2
        else if(i == 1) {
          u = ((14 + j) == 23 ? 25 : 14 + j);
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 3
        else if(i == 2) {
          u = ((13 + j) == 22 ? 26 : 13 + j);
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 4
        else if(i == 3) {
          u = ((12 + j) == 21 ? 27 : 12 + j);
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 5
        else if(i == 4) {
          u = ((11 + j) == 20 ? 28 : 11 + j);
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 5
        else if(i == 5) {
          u = 10 - j;
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
      }
      kolom = null;
      petak = null;
    }
    docFrag.appendChild(baris);
    baris = null;
    u = null;
  }
}

function persegiPanjangV2() {
  for(let i=0; i<6; i++) {
    let baris = cE('tr'),
        u;
    for(let j=0; j<10; j++) {
      let kolom = cE('td'),
          petak = cE('div');
      if( (i > 1 && i < 4) && (j > 0 && j < 9) ) {
        kolom.appendChild(petak);
        baris.appendChild(kolom);
      }
      else {
        // BARIS 1
        if(i == 0) {
          u = 15 + j;
          if(u == 15 || u == 24) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 2
        else if(i == 1) {
          u = ((14 + j) == 23 ? 25 : 14 + j);
          if(u > 15 && u < 22) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 22) {
            u = 24;
            urutanPetak(baris, kolom, petak, i, j, u, null);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 3
        else if(i == 2) {
          u = ((13 + j) == 22 ? 26 : 13 + j);
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 4
        else if(i == 3) {
          u = ((12 + j) == 21 ? 27 : 12 + j);
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 5
        else if(i == 4) {
          u = ((11 + j) == 20 ? 28 : 11 + j);
          if(u > 12 && u < 19) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 12 || u == 19) {
            (u == 12 ? u = 10 : u = 1);
            urutanPetak(baris, kolom, petak, i, j, u, null);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 6
        else if(i == 5) {
          u = 10 - j;
          if(u == 10 || u == 1) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
      }
      kolom = null;
      petak = null;
    }
    docFrag.appendChild(baris);
    baris = null;
    u = null;
  }
}

function anggapSegitiga() {
  for(let i=0; i<6; i++) {
    let baris = cE('tr'),
        u;
    for(let j=0; j<10; j++) {
      let kolom = cE('td'),
          petak = cE('div');
      if( (i > 0 && i < 1) && (j > 0 && j < 9) ) {
        kolom.appendChild(petak);
        baris.appendChild(kolom);
      }
      else {
        // BARIS 1
        if(i == 0) {
          u = 15 + j;
          if(u == 19 || u == 20)
            urutanPetak(baris, kolom, petak, i, j, u, null);
          else {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
        }
        // BARIS 2
        else if(i == 1) {
          u = ((14 + j) == 23 ? 25 : 14 + j);
          if(u < 17 || u > 20) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 19 || u == 20) {
            (u == 19 ? u = 21 : u = 22);
            urutanPetak(baris, kolom, petak, i, j, u, null);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 3
        else if(i == 2) {
          u = ((13 + j) == 22 ? 26 : 13 + j);
          if((u < 15 || u > 20) || (u == 17 || u == 18)) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 19 || u == 20) {
            (u == 19 ? u = 23 : u = 24);
            urutanPetak(baris, kolom, petak, i, j, u, null);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 4
        else if(i == 3) {
          u = ((12 + j) == 21 ? 27 : 12 + j);
          if((u == 12 || u == 27) || (u > 14 && u < 19)) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 19 || u == 20) {
            (u == 19 ? u = 25 : u = 26);
            urutanPetak(baris, kolom, petak, i, j, u, null);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 5
        else if(i == 4) {
          u = ((11 + j) == 20 ? 28 : 11 + j);
          if(u > 12 && u < 19) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 12 || u == 19) {
            (u == 12 ? u = 12 : u = 27);
            urutanPetak(baris, kolom, petak, i, j, u, null);
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 6
        else if(i == 5) {
          u = 10 - j;
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
      }
      kolom = null;
      petak = null;
    }
    docFrag.appendChild(baris);
    baris = null;
    u = null;
  }
}

function bercabangDua() {
  for(let i=0; i<6; i++) {
    let baris = cE('tr'),
        u;
    for(let j=0; j<10; j++) {
      let kolom = cE('td'),
          petak = cE('div');
      if( ((i > 0 && i < 1) || (i > 4 && i < 5)) && (j > 0 && j < 9) ) {
        kolom.appendChild(petak);
        baris.appendChild(kolom);
      }
      else {
        // BARIS 1
        if(i == 0) {
          u = 15 + j;
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 2
        else if(i == 1) {
          u = ((14 + j) == 23 ? 25 : 14 + j);
          if(u == 15 || u > 16 && u < 25) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 14 || u == 25)
            urutanPetak(baris, kolom, petak, i, j, u, null);
          else
            urutanPetak(baris, kolom, petak, i, j, u, 'a');
        }
        // BARIS 3
        else if(i == 2) {
          u = ((13 + j) == 22 ? 26 : 13 + j);
          if(u > 15 && u < 26) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 13 || u == 26)
            urutanPetak(baris, kolom, petak, i, j, u, null);
          else
            urutanPetak(baris, kolom, petak, i, j, u, 'a');
        }
        // BARIS 4
        else if(i == 3) {
          u = ((12 + j) == 21 ? 27 : 12 + j);
          if(u > 12 && u < 19) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 19 || u == 20) {
            (u == 19 ? u = 1 : u = 28);
            urutanPetak(baris, kolom, petak, i, j, u, 'a');
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 5
        else if(i == 4) {
          u = ((11 + j) == 20 ? 28 : 11 + j);
          if(u == 19 || u > 11 && u < 18) {
            kolom.appendChild(petak);
            baris.appendChild(kolom);
          }
          else if(u == 18) {
            (u == 18 ? u = 2 : null);
            urutanPetak(baris, kolom, petak, i, j, u, 'a');
          }
          else
            urutanPetak(baris, kolom, petak, i, j, u, null);
        }
        // BARIS 6
        else if(i == 5) {
          u = 10 - j;
          urutanPetak(baris, kolom, petak, i, j, u, null);
        }
      }
      kolom = null;
      petak = null;
    }
    docFrag.appendChild(baris);
    baris = null;
    u = null;
  }
}
