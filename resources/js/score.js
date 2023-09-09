function verileriTabloyaEkle(veriler) {
    const tabloGovdesi = document.getElementById("score-table-body");
    tabloGovdesi.innerHTML = "";
  
    if (veriler.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = "4";
      td.innerText = "Veri Yok.";
      tr.appendChild(td);
      tabloGovdesi.appendChild(tr);
    } else {
      for (let i = 0; i < veriler.length; i++) {
        const tr = document.createElement("tr");
  
        const td1 = document.createElement("td");
        td1.innerText = i + 1;
        tr.appendChild(td1);
  
        const td2 = document.createElement("td");
        td2.innerText = veriler[i];
        tr.appendChild(td2);
  
        const td3 = document.createElement("td");
        td3.innerText = 0;  //?*************
        tr.appendChild(td3);
  
        const td4 = document.createElement("td");
        td4.innerText = 0; // burada skor olarak 0 değeri atanmış
        tr.appendChild(td4);
  
        tabloGovdesi.appendChild(tr);
      }
    }
  }
  
  fetch("/kullanicilar")
  .then(function (cevap) {
    if (!cevap.ok) {
      throw new Error("Dosya okunamadı.");
    }
    return cevap.text();
  })
  .then(function (veriler) {
    const veriDizisi = veriler.trim().split("\n");
    verileriTabloyaEkle(veriDizisi);
  })
  .catch(function (hata) {
    console.error(hata);
    const tabloGovdesi = document.getElementById("score-table-body");
    tabloGovdesi.innerHTML = "<tr><td colspan='4'>Dosya okunamadı.</td></tr>";
  });


  //**************************** */
  