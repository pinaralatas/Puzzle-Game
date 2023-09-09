
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const app = new express();
const port = process.env.PORT || 5000;
const path = require('path');



const bodyParser = require('body-parser');

const fs = require('fs');



app.use(express.static(__dirname + '/resources'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/oyun', (req, res) => {
  res.sendFile(__dirname + '/oyun.html');
});

app.get('/skor', (req, res) => {
  res.sendFile(__dirname + '/score.html');
});




const upload = multer({
  limits: {
    fileSize: 5000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Lütfen uygun dosya yükleyin'));
    }
    cb(undefined, true);
  }
});

const folderName = 'resources/parcalar';
const folderPath = path.join(__dirname, folderName);

if (fs.existsSync(folderPath)) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    fs.unlinkSync(path.join(folderPath, file));
  }
}
const folderName1 = 'resources/puzzleimg';
const folderPath1 = path.join(__dirname, folderName1);
if (fs.existsSync(folderPath1)) {
  const files = fs.readdirSync(folderPath1);
  for (const file of files) {
    fs.unlinkSync(path.join(folderPath1, file));
  }
}

app.post('/image', upload.single('upload'), async (req, res) => {
  try {
    const targetFolder = 'resources/puzzleimg';
    const filePath = path.join(targetFolder, 'puzzleimg.png');

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }



    await sharp(req.file.buffer)
      .resize({ width: 320, height: 320 })
      .png()
      .toFile(filePath);

    const folderName = 'resources/parcalar';
    const folderPath = path.join(__dirname, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const imageBuffer = await sharp(filePath).toBuffer();

    for (let i = 0; i < 16; i++) {
      const x = i % 4;
      const y = Math.floor(i / 4);
      await sharp(imageBuffer)
        .extract({
          left: x * 80,
          top: y * 80,
          width: 80,
          height: 80
        })
        .toFile(path.join(folderPath, `part_${i}.png`));
    }

    res.redirect('/oyun');
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.use(bodyParser.urlencoded({ extended: true }));



//KULLANICI ADI TXT KAYDET
if (!fs.existsSync('kullanicilar.txt')) {
  // Dosya yoksa oluşturuyoruz
  fs.writeFileSync('kullanicilar.txt', '');
  console.log('Dosya başarıyla oluşturuldu.');
} else {
  console.log('Dosya zaten var, üzerine yazılıyor...');
}

function kullaniciAdiKaydet(req, res) {
  const kullaniciAdi = req.body.kullanici_adi;
  fs.appendFile('kullanicilar.txt', kullaniciAdi + '\n', function (err) {
    if (err) {
      console.error('Kullanıcı adı kaydedilemedi:', err);
      res.status(500).send('Kullanıcı adı kaydedilemedi.');
    } else {
      console.log('Kullanıcı adı başarıyla kaydedildi!');
      res.sendFile(__dirname + '/score.html');
    }
  });
}

app.post('/kullanici-adi-kaydet', kullaniciAdiKaydet);

app.listen(3000, function () {
  console.log('Sunucu çalışıyor...');
});


/* function kullaniciAdiKaydet(req, res) {
  const kullaniciAdi = req.body.kullanici_adi;
  fs.appendFile('kullanicilar.txt', kullaniciAdi + ',', function (err) {
    if (err) {
      console.error('Kullanıcı adı kaydedilemedi:', err);
      res.status(500).send('Kullanıcı adı kaydedilemedi.');
    } else {
      console.log('Kullanıcı adı başarıyla kaydedildi!');
      res.sendFile(__dirname + '/score.html');
    }
  });
} */

app.get('/kullanicilar', function(req, res) {
  fs.readFile('kullanicilar.txt', function (err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('Dosya okunamadı.');
    } else {
      res.send(data);
    }
  });
});




