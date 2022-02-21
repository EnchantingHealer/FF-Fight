
const image = document.getElementById("preview");
const charName = document.getElementById("name");
const link = document.getElementById("continueButton");
const baseURL = "./battleScreen.html?"
onCharacterSelect = (event) => {
    console.log(event);
    image.src=event.sprite;
    charName.innerHTML=event.name;
    link.href=baseURL+event.query;
}
