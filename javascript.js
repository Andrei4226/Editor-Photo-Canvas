let initialX, initialY;
let offsetX = 0;
let offsetY = 0;
let miscare = false;

let selectArea = document.getElementById("selectZone");
let imageContainer = document.getElementById("containerImage");
let image = document.getElementById("photo");
let canvasElement = document.getElementById("canvas1");
let options = document.getElementById("spinner");

//'change'= atunci cand selectam un fisier folosind un element de tip file
image.addEventListener('change', function (event) {
    //extragem primul fisier din lista de fisiere selectatate, daca e cazul
    const fisier = event.target.files[0];

    //daca a fost selectat un fisier
    if (fisier) {
        //cream un obj de tip imagine
        var img = new Image();
        //cand imaginea s-a incarcat, se declanseaza functia
        img.onload = function () {
            //elementul canvas preia latimea
            canvasElement.width = img.width;
            //elementul canvas preia inaltimea
            canvasElement.height = img.height;
            //cream contextul
            const ctx = canvasElement.getContext('2d');
            //desenam pe canvas imaginea selectata 
            //(0,0)= coordonatele sursei 
            ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
        };
        //setam sursa obiectului imagine la un URL ce reprezinta fisierul selectat
        img.src = URL.createObjectURL(fisier);
    }
});
//apelam functia de start(prin apasarea de buton al mouse ului)
imageContainer.addEventListener('mousedown', start);

function start(event) {
    //obtinem dimensiunea si pozitia elementului
    const containerRect = imageContainer.getBoundingClientRect();
    //facem dif dintre pozitia cursorului si coltul din stanga
    //deci stabilim pozitia zonei selectate
    offsetX = event.clientX - containerRect.left;
    offsetY = event.clientY - containerRect.top;

    //setam stilurile CSS pentru elementul selectat pentru a vedea zona de selectie
    selectArea.style.left = `${offsetX}px`;
    selectArea.style.top = `${offsetY}px`;
    //selectia incepe din punctul '0' si '0' apoi tragem cu mouse ul
    selectArea.style.width = '0';
    selectArea.style.height = '0';
    //facem zona selectata vizibila
    selectArea.style.display = 'block';

    //actualizam zona de selectie cu ajutorul mouse ului tot timpul
    function actualizare(event) {
        //obtinem dimensiunea si pozitia elementului
        const currentContainerRect = imageContainer.getBoundingClientRect();
        //facem actualizarea pozitiilor in functie de cum miscam mouse ul
        const W = event.clientX - currentContainerRect.left - offsetX;
        const H = event.clientY - currentContainerRect.top - offsetY;

        //selectia din laterale
        if (W >= 0) {
            selectArea.style.width = `${W}px`;
            selectArea.style.left = `${offsetX}px`;
        } else {
            selectArea.style.width = `${Math.abs(W)}px`;
            selectArea.style.left = `${event.clientX - containerRect.left}px`;
        }
        // selectia de sus
        if (H >= 0) {
            selectArea.style.height = `${H}px`;
            selectArea.style.top = `${offsetY}px`;
        } else {
            selectArea.style.height = `${Math.abs(H)}px`;
            selectArea.style.top = `${event.clientY - containerRect.top}px`;
        }
    }
    
    //facem functia ca atunci cand lasam mouse-ul, zona selectata sa ramana vizibila urmand a fi mutata cu SHIFT
    function mutare(event) {
        if (miscare!=false) {
            //calculam diferenta intre pozitia curenta si cea initiala a mouse ului
            //orizontal
            const diferentaX = event.clientX - initialX;
            //vertical
            const diferentaY = event.clientY - initialY;

            //actualizam left si top adaugand diferenta de mai sus
            //folosim parsarea pentru ca ne referim la valori numerice altfel nu merge
            selectArea.style.left = `${parseFloat(selectArea.style.left) + diferentaX}px`;
            selectArea.style.top = `${parseFloat(selectArea.style.top) + diferentaY}px`;

            //actualizam valorile initiale cu pozitia curenta a mouse ului
            initialX = event.clientX;
            initialY = event.clientY;
        }
    }

    function final() {
        //oprim actualizarea atunci cand eliberam butonul mouse ului
        //eliminam practic evenimentul de miscare ca sa oprim actualizarea atunci cand eliberam cursorul
        imageContainer.removeEventListener('mousemove', actualizare);
    }

    //facem actualizare la fiecare miscare a mouse ului
    imageContainer.addEventListener('mousemove', actualizare);
    //apelam metoda  pentru a actualiza pozitia selectiei atunci cand urmeaza sa apasam SHIFT
    imageContainer.addEventListener('mousemove', mutare);
    //oprim actualizarea selectiei cand eliberam cursorul
    imageContainer.addEventListener('mouseup', final);
}

//atunci cand tasta SHIFT este apasata
document.addEventListener('keydown', function (e) {
    //primim ca parametru un eveniment
    if (e.key === 'Shift') {
        //e mutabil
        miscare = true;
        //salvam coord orizonatala a cursorului atunci cand apasam SHIFT
        initialX = e.clientX;
        //salvam coord verticala a cursorului atunci cand apasam SHIFT
        initialY = e.clientY;
    }
});

//atunci cand tasta este eliberata
document.addEventListener('keyup', function (e) {
    if (e.key === 'Shift') {
        //este imutabil
        miscare = false;
    }
});

function crop() {
    //folosim parsari pentru ca lucram cu valori numerice
    //poz orizontala
    var x = parseFloat(selectArea.style.left);
    //poz verticala
    var y = parseFloat(selectArea.style.top);
    //latime
    var w = parseFloat(selectArea.style.width);
    //inaltime
    var h = parseFloat(selectArea.style.height);

    //obtinem contextul 2D
    var ctx = canvasElement.getContext('2d');
    //obtinem obiectul care contine practic zona selectata
    var photoD = ctx.getImageData(x, y, w, h);

    //actualizam latimea si inaltimea canvasului in functie de zona selectata
    canvasElement.width = w;
    canvasElement.height = h;
    //plasam noul context
    ctx.putImageData(photoD, 0, 0);
    //facem vizibila zona selectata vizibila, nu folosim hidden
    //facem elem invizibil 
    selectArea.style.display = 'none';
}

function applyEffect() {
    //extragem optiunea selectata
    var selectedE = options.value;
    //obtinem pozitiile
    var x = parseFloat(selectArea.style.left);
    var y = parseFloat(selectArea.style.top);
    var w = parseFloat(selectArea.style.width);
    var h = parseFloat(selectArea.style.height);
    const ctx = canvasElement.getContext('2d');
    //obtinem obiectul cu zona selectata
    var photoD = ctx.getImageData(x, y, w, h);

    if (selectedE === 'colorBlackWhite') {
        //rosu,verse si albastru si alfa (RGBA)
        //alfa = pt transparenta pixelilor(0 = complet transparent, 255 = complet opac)
        //fiecare pixel e format din 4 canale: rosu,verde,albastru si alfa
        //o componenta ocupa 8 biti deci mergem din 32 in 32 biti
        for (let i = 0; i < photoD.data.length; i =i+ 4) {
            //facem media
            const medie = (photoD.data[i] + photoD.data[i + 1] + photoD.data[i + 2]) / 3;
            //setam noile valori RGBA cu media calculata
            photoD.data[i] = medie;
            photoD.data[i + 1] = medie;
            photoD.data[i + 2] = medie;
        }
    }
    //inversare culori pixeli
    else if(selectedE === 'colorInversion')
    {
         for (let i = 0; i < photoD.data.length; i += 4) {
            // inversarea canalului rosu
            photoD.data[i] = 255 - photoD.data[i]; 
            // inversarea canalului verde
            photoD.data[i + 1] = 255 - photoD.data[i + 1]; 
            // inversarea canalului albastru
            photoD.data[i + 2] = 255 - photoD.data[i + 2]; 
        }
    }
    //fixam noile modificari pe canvas
    ctx.putImageData(photoD, x, y);
    selectArea.style.display = 'none';
}

function save() {
    //facem un URL pentru imaginea creata pe canvas
    var url = canvasElement.toDataURL();
    //creare element de tip ancora in DOM
    var link = document.createElement('a');
    //setam url ul la element
    link.href = url;
    //setam atributul download
    link.download = 'photo_edited.png';
    //initializam procesul de descarcare
    link.click();
}

function addText() {
    //prealuam textul scris de utilizator
    var text = document.getElementById("addText").value;
    //preluam marimea prin parsare
    var size = parseFloat(document.getElementById("sizeText").value);
    //preluam culoarea
    var color = document.getElementById("colorText").value;
    //preluam pozitia la care se afla cursorul in canvas
    var pozX = parseFloat(selectArea.style.left);
    var pozY = parseFloat(selectArea.style.top);
    if (text != null && size > 0) {
        const ctx = canvasElement.getContext('2d');
        //fixam fontul
        ctx.font = `${size}px Impact`;
        //selectam culoarea pentru umplere
        ctx.fillStyle = color;
        //realizam adaugarea textului in pozitia selectata de utilizator
        ctx.fillText(text, pozX, pozY);
        //ascundem acel punct albastru unde indicam pozitionarea textului si dupa ce adaugam textul
        selectArea.style.display = 'none';
    }
}

function deleteSection() {
    //obtinem coordonatele
    const x = parseFloat(selectArea.style.left);
    const y = parseFloat(selectArea.style.top);
    const w = parseFloat(selectArea.style.width);
    const h = parseFloat(selectArea.style.height);
    //cream contextul
    const ctx = canvasElement.getContext('2d');
    //alegem culoare de umplere 
    ctx.fillStyle = 'white';
    //realizam umplerea
    ctx.fillRect(x, y, w, h);
    //ascundem zona albastra punctata ce arata selectarea propriu-zisa
    selectArea.style.display = 'none';
}

