
// Puzzle parçaları için bağlı liste düğümünü tanımla
class PuzzlePiece {
	constructor(id, imageSrc) {
		this.id = id;
		this.imageSrc = imageSrc;
		this.next = null;
	}
	getData(position) {
		if (position < 0) {
			return null;
		} else {
			let current = this.head;
			for (let i = 0; i < position; i++) {
				if (current === null || current === undefined) {
					return null;
				}
				current = current.next;
			}
			return current.id;
		}
	}
}

// Puzzle parçalarını bağlı listeye ekle
let head = null;
let tail = null;
let head1 = null;
let tail1 = null;
for (let i = 0; i < 16; i++) {
	let piece = new PuzzlePiece(i, "parcalar/part_" + i + ".png");
	if (!head) {
		head = piece;
		tail = piece;
	} else {
		tail.next = piece;
		tail = piece;
	}
}
for (let i = 0; i < 16; i++) {
	let origi = new PuzzlePiece(i, "parcalar/part_" + i + ".png");
	if (!head1) {
		head1 = origi;
		tail1 = origi;
	} else {
		tail1.next = origi;
		tail1 = origi;
	}
}



// Rastgele karıştırma işlemini gerçekleştir
function ShufflePuzzle() {
	let current = head;
	let piecesArray = [];
	for (let i = 0; i < 16; i++) {
		piecesArray.push(current);
		current = current.next;
	}
	piecesArray.sort(() => Math.random() - 0.5);
	head = piecesArray[0];
	tail = head;
	for (let i = 1; i < 16; i++) {
		tail.next = piecesArray[i];
		tail = piecesArray[i];
	}
	tail.next = null;
	UpdateButtonOrder();
	let shuffleButton = document.getElementById("shuffle");
	shuffleButton.disabled = true;
	shuffleCheck();
}

function shuffleCheck() {
	let current = head;
	let ata = head1;
	var bitis = 0;
	for (let i = 0; i < 16; i++) {
		if (current.id == ata.id) {
			var buton = document.getElementById("piece" + i);
			buton.disabled = true;
			bitis++;
		}
		current = current.next;
		ata = ata.next;
	}
	if (bitis!=0)
	{
		return
	}
	else
	{
		ShufflePuzzle();
	}
	console.log(bitis);
}

// Karıştırma butonuna tıklanınca rastgele karıştırma işlemini çağır
let shuffleButton = document.getElementById("shuffle");
shuffleButton.addEventListener("click", () => {
	ShufflePuzzle();
});

// Butonları seç
let pieces = [];
for (let i = 0; i < 16; i++) {
	let piece = document.getElementById("piece" + i);
	pieces.push(piece);
}


// Butonların tıklanma işlemini işle
let clickedButtonIndexes = [];
let moveCount = 0;
let skor = 0;
let correctMoves = 0;
let wrongMoves = 0;
pieces.forEach((piece, index) => {
	piece.addEventListener("click", () => {
		clickedButtonIndexes.push(index);
		if (clickedButtonIndexes.length === 2) {
			let firstIndex = clickedButtonIndexes[0];
			let secondIndex = clickedButtonIndexes[1];
			clickedButtonIndexes = [];
			if (IsValidSwap(firstIndex, secondIndex)) {
				Swap(firstIndex, secondIndex);
				updateScore(firstIndex, secondIndex);
				UpdateButtonOrder();
				shuffleCheck();
				CheckPuzzleSolved();
			}
		}
	});
});


function IsValidSwap(index1, index2) {
	return true;
}
function printList(head) {
	let current = head;
	while (current !== null) {
		console.log("Puzzle parçası ID: " + current.id + ", resim kaynağı: " + current.imageSrc);
		current = current.next;
	}
}



// İki butonun yerlerini değiştir
function Swap(index1, index2) {
	let current = head;
	let piece1, piece2;
	for (var i = 0; i < 16; i++) {
		if (i === index1) {
			piece1 = current;
		} else if (i === index2) {
			piece2 = current;
		}
		current = current.next;
	}
	let temp = piece1.imageSrc;
	piece1.imageSrc = piece2.imageSrc;
	piece2.imageSrc = temp;
	let ozi = piece1.id;
	piece1.id = piece2.id;
	piece2.id = ozi;
	moveCount++;
	UpdateMoveCount(moveCount);
	UpdateButtonOrder();
}

// Puzzle'ın çözülüp çözülmediğini kontrol et
function CheckPuzzleSolved() {
	let current = head;
	let ata = head1;
	var bitis = 0;
	for (let i = 0; i < 16; i++) {
		if (bitis != 15) {
			if (current.id == ata.id) {
				var buton = document.getElementById("piece" + i);
				buton.disabled = true;
				bitis++;
			}
			current = current.next;
			ata = ata.next;
		}
		else {
			//POP-UP

			document.getElementById("myModal").style.display = "block";
		}
	}
}

let moveCountDisplay = document.getElementById("moveCountDisplay");
function UpdateMoveCount(count) {
	moveCountDisplay.textContent = count.toString();
}

let scoreDisplay = document.getElementById("scoreDisplay");

// Butonların sıralamasını güncelle
function UpdateButtonOrder() {
	let current = head;
	for (let i = 0; i < 16; i++) {
		let piece = pieces[i];
		piece.style.backgroundImage = "url('" + current.imageSrc + "')";
		current = current.next;

	}
	moveCountDisplay.textContent = moveCount.toString();
	scoreDisplay.textContent = skor.toString();
}





//Yükle aktif-inaktif
const imageInput = document.getElementById('image_input');
const submitButton = document.getElementById('submit_button');

imageInput.addEventListener('change', function () {
	if (imageInput.value !== '') {
		submitButton.disabled = false;
	} else {
		submitButton.disabled = true;
	}
});

//POP-UP kapa
function hidePopup() {
	document.getElementById("myModal").style.display = "none";
	window.location = "http://localhost:5000/skor"
}


// Puzzle içindeki butonları etkisiz hale getir
var puzzleButtons = document.querySelectorAll("#puzzle button");
for (var i = 0; i < puzzleButtons.length; i++) {
  puzzleButtons[i].disabled = true;
}

// Karıştırma butonuna tıklandığında butonları etkinleştir
document.getElementById("shuffle").addEventListener("click", function(){
  for (var i = 0; i < puzzleButtons.length; i++) {
    puzzleButtons[i].disabled = false;
  }
});

function updateScore(index1, index2) {
	const dogrusira = [
		"parcalar/part_0.png",
		"parcalar/part_1.png",
		"parcalar/part_2.png",
		"parcalar/part_3.png",
		"parcalar/part_4.png",
		"parcalar/part_5.png",
		"parcalar/part_6.png",
		"parcalar/part_7.png",
		"parcalar/part_8.png",
		"parcalar/part_9.png",
		"parcalar/part_10.png",
		"parcalar/part_11.png",
		"parcalar/part_12.png",
		"parcalar/part_13.png",
		"parcalar/part_14.png",
		"parcalar/part_15.png"
	];
	let guncel = [];
	let current = head;
	while (current !== null) {
		guncel.push(current.imageSrc);
		current = current.next;
	};

	if (guncel[index1] == dogrusira[index1] || guncel[index2] == dogrusira[index2]) {
		skor = skor + 5;
		return
	}
	else {
		skor = skor - 10;
		return
	}
}

// Karıştırma butonuna tıklandığında butonları etkinleştir
document.getElementById("shuffle").addEventListener("click", function(){
  for (var i = 0; i < puzzleButtons.length; i++) {
    puzzleButtons[i].disabled = false;
  }
});


//kullanıcı adını txt dosyasına kaydetme
function kaydetCallback(error) {
	if (error) {
	  console.error('Kullanıcı adı kaydedilemedi:', error);
	} else {
	  console.log('Kullanıcı adı başarıyla kaydedildi!');
	}
  }

let kullaniciAdi = document.getElementsByName('kullanici_adi')[0].value;
kullaniciAdiKaydet(kullaniciAdi, kaydetCallback);

let kullaniciAdiInput = document.getElementById('kullanici_adi');
// input alanını değişkene atadık





