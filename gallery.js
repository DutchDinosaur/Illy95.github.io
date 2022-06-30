var Scenery = ["BlissPicnic.gif", "prairie.gif", "SkeleFish.gif"];
var Animations = ["arisukiTransform.gif", "Ghosties.gif", "Skate.gif","archit.gif"];

var galleryPiecePopout = document.getElementById("galleryPiecePopout");
var popoutPiece = document.getElementById("popoutPiece");

loadGallery(Scenery);

if (getUrlVars().piece != null) {
    ExpandGalleryPiece(getUrlVars().piece);
}

function clearGallery() {
    document.getElementById("GalleryContent").innerHTML = '';
}

function loadGallery(pieces) {
    clearGallery()
    if (pieces != Animations) addGalleryFolders("Interactive");

    if (pieces != Scenery) addGalleryFolders("Scenery");

    for (var i = 0; i < pieces.length; i++) {
        loadGalleryPiece(pieces[i]);
    }

    if (pieces != Animations) addGalleryFolders("Animations");

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

function addGalleryFolders(type) {
    var folder = document.createElement("div");
    folder.setAttribute("class", "galleryPiece");
    folder.addEventListener("click", function () {

        switch (type) {
            case "Interactive":
                SwitchFullscreenApp('Works', true);
                break;
            case "Animations":
                loadGallery(Animations);
                break;
            case "Scenery":
                loadGallery(Scenery);
                break;
            default:
        }

    });

    var Image = document.createElement("img");
    Image.src = "UITextures/FolderWithFiles.png";
    Image.style.height = "285px";
    folder.appendChild(Image);

    var Name = document.createElement("p");
    var text = document.createTextNode(type);
    Name.appendChild(text);
    folder.appendChild(Name);

    document.getElementById("GalleryContent").appendChild(folder);
}