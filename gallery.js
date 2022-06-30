var Scenery = ["BlissPicnic.gif", "prairie.gif", "SkeleFish.gif","transform.gif"];
var Loaded = false;
var galleryPiecePopout = document.getElementById("galleryPiecePopout");
var popoutPiece = document.getElementById("popoutPiece");

loadGallery();

if (getUrlVars().piece != null) {
    ExpandGalleryPiece(getUrlVars().piece);
}

function loadGallery() {
    if (Loaded) return;
    Loaded = true;
    for (var i = 0; i < Scenery.length; i++) {
        loadGalleryPiece(Scenery[i]);
    }
}

function loadGalleryPiece(url) {
    var galleryPiece = document.createElement("div");
    galleryPiece.setAttribute("class", "galleryPiece");
    galleryPiece.addEventListener("click", function () {
        ExpandGalleryPiece(url);
    });

    var Image = document.createElement("img");
    Image.src = "Gallery/" + url;
    Image.style.height = "285px";
    galleryPiece.appendChild(Image);

    var Name = document.createElement("p");
    var text = document.createTextNode(url);
    Name.appendChild(text);
    galleryPiece.appendChild(Name);
    
    document.getElementById("GalleryContent").appendChild(galleryPiece);
}

function ExpandGalleryPiece(url) {
    galleryPiecePopout.style.display = "block";
    popoutPiece.src = "Gallery/" + url;
}

function CloseGalleryPiece() {
    galleryPiecePopout.style.display = "none";
}