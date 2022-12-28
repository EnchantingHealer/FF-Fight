
const image = document.getElementById("preview");
const charName = document.getElementById("name");
const link = document.getElementById("continueButton");
const baseURL = "./battleScreen.html?"
const aerith = document.getElementById("aerith");
const red = document.getElementById("redThirteen");
const tifa = document.getElementById("tifa");
const cloud = document.getElementById("cloud");
onCharacterSelect = (event) => {
    image.src = event.sprite;
    charName.innerHTML = event.name;
    link.href = baseURL + event.query;
    if (event == characters.red) {
        aerith.style.border = "4px solid";
        tifa.style.border = "4px solid";
        cloud.style.border = "4px solid";
        red.style.border = "5px solid yellow";
    } else if (event == characters.aerith) {
        red.style.border = "4px solid";
        tifa.style.border = "4px solid";
        cloud.style.border = "4px solid";
        aerith.style.border = "5px solid yellow";
    } else if (event == characters.tifa) {
        red.style.border = "4px solid";
        aerith.style.border = "4px solid";
        cloud.style.border = "4px solid";
        tifa.style.border = "5px solid yellow";
    } else if (event == characters.cloud) {
        red.style.border = "4px solid";
        tifa.style.border = "4px solid";
        aerith.style.border = "4px solid";
        cloud.style.border = "5px solid yellow";
    }

}
