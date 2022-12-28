//change names according to character on screen
//make sure it's selected character from before
//abilities show
//ability strings will go inside API
//a health bar function
//Game text
//Game numbers (healing (full HP), defending (0.5x damage taken), attacking damage, special attack damage)
//randomizer for crits 
//randomizer for enemy attack
//randomizer for enemy unit
//make enemy animation (wait for your turn?)

//onload()

const url = window.location.search;
const animationImg = document.getElementById("animation");
// buttons
const physical = document.getElementById("physicalAttack");
const special = document.getElementById("specialAttack");
const defend = document.getElementById("defend");
const heal = document.getElementById("heal");
const returnButton = document.getElementById("returnButton");
const refreshButton = document.getElementById("refreshButton");
const popUp = document.getElementById("modal");


const popText = document.getElementById("modalText");
const gameText = document.getElementById("game-text");


let player = undefined;
const playerSprite = document.getElementById("spriteOne");
const playerHealth = document.getElementById("healthbarOne");
const playerName = document.getElementById("nameOne");

let enemy = undefined;
const enemySprite = document.getElementById("spriteTwo")
const enemyHealth = document.getElementById("healthbarTwo");
const enemyName = document.getElementById("nameTwo");


let isAttacking = false;
const MAX_ANIMATION_DURATION_MS = 4000;


const makeCopy = (o) => {
    return JSON.parse(JSON.stringify(o));
}

onload = () => {
    // select player
    selectPlayer();

    // select random enemy
    selectRandomEnemy();

    // Render data
    renderCharacter(enemy, enemyHealth, enemyName, enemySprite);
    renderCharacter(player, playerHealth, playerName, playerSprite);

    renderPlayerControls(player);
};

selectPlayer = () => {
    if (url.includes(characters.tifa.query)) {
        player = makeCopy(characters.tifa);
    } else if (url.includes(characters.aerith.query)) {
        player = makeCopy(characters.aerith);
    } else if (url.includes(characters.red.query)) {
        player = makeCopy(characters.red);
    } else if (url.includes(characters.cloud.query)) {
        player = makeCopy(characters.cloud);
    } else {
        // something broke, select default
        player = makeCopy(characters.red);
    }
}

selectRandomEnemy = () => {
    let keys = Object.keys(characters);
    let i = Math.floor(Math.random() * keys.length);
    enemy = makeCopy(characters[keys[i]]);
}

renderCharacter = (character, healthView, nameView, spriteView) => {
    // give character their own UI elements so we can change them later
    character.elements.sprite = spriteView;
    character.elements.health = healthView;
    character.elements.name = nameView;
    // load character data into views
    healthView.innerHTML = character.health;
    nameView.innerHTML = character.name;
    spriteView.src = character.sprite;

}

renderPlayerControls = (character) => {
    physical.innerHTML = character.physical;
    heal.innerHTML = `Heal x${character.healCount}`;
    special.innerHTML = `${character.special} x${character.specialCount}`;
}

disableAllButtons = () => {
    heal.disabled = true;
    physical.disabled = true;
    special.disabled = true;
    defend.disabled = true;
}

enableAllButtons = () => {
    heal.disabled = player.healCount <= 0;
    physical.disabled = false;
    special.disabled = player.specialCount <= 0;
    defend.disabled = false;
}

heal.addEventListener('click', async () => {
    disableAllButtons();
    await healing(player);
    if (player.healCount == 0) {
        heal.disabled = true;
    }
    heal.innerHTML = `Heal x${player.healCount}`;
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, MAX_ANIMATION_DURATION_MS);
});
physical.addEventListener('click', async () => {
    disableAllButtons();
    await phAttack(player, enemy);
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, MAX_ANIMATION_DURATION_MS);
});
special.addEventListener('click', async () => {
    disableAllButtons();
    await spAttack(player, enemy);
    if (player.specialCount == 0) {
        special.disabled = true;
    }
    special.innerHTML = `${player.special} x${player.specialCount}`;
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, MAX_ANIMATION_DURATION_MS);
});
defend.addEventListener('click', async () => {
    disableAllButtons();
    await defending(player);
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, MAX_ANIMATION_DURATION_MS);
});


returnButton.addEventListener('click', () => {
    window.location.href = "/index.html";
});
refreshButton.addEventListener('click', () => {
    fullyRestore(player);
    fullyRestore(enemy);
    popUp.classList.add("hidden");
    renderPlayerControls(player);
    enableAllButtons();
});

// Cheat codes
let cheatString = "";
const cheatBuffer = 50;
const instaKillCheat = "ArrowUpArrowDownArrowLeftArrowRight";
const tifaCheat = "tifapls";
const thePower = "ihavethepower";
document.addEventListener('keyup', (e) => {
    if (cheatString.length > cheatBuffer) {
        cheatString = cheatString.substring(cheatString.length - cheatBuffer, cheatString.length);
    }
    cheatString = cheatString + e.key;

    // string cheats
    if (cheatString.endsWith(instaKillCheat)) {
        enemy.health = 0;
        phAttack(player, enemy);
    }
    else if (cheatString.endsWith(tifaCheat)) {
        enemy = makeCopy(characters.tifa);
        renderCharacter(enemy, enemyHealth, enemyName, enemySprite);
    }
    else if (cheatString.endsWith(thePower)) {
        player.specialCount = 100;
        enemy.ogDefenceMultiplier = 4;
        enemy.defenceMultiplier = 4;
        renderPlayerControls(player);
    }
    // simple cheats
    if (e.key == "Q") {
        enemy.health = 0;
        phAttack(player, enemy);
    }

    // Have a global string/array, that we cut off the first keys and then check if the string ends with cheat
});


//phAttack(character) (deals flat damage)
phAttack = async (character, opponent) => {
    if (!isAttacking) {
        isAttacking = true;

        // reset character defence because this is a new turn for the character
        character.defenceMultiplier = character.ogDefenceMultiplier; // This belongs to character

        // change character sprite to do attack Animation
        character.elements.sprite.src = character.attackAnimation;
        setTimeout(spriteIdle.bind(null, character), MAX_ANIMATION_DURATION_MS - 1000);
        // deal damage game logic
        let damage = Math.ceil(10 * opponent.defenceMultiplier);
        opponent.health = opponent.health - damage;

        // rendering
        gameText.innerHTML = `${character.name} uses ${character.physical}. Deals ${damage} damage!`;
        opponent.elements.health.innerHTML = opponent.health;

        // get animation

        const response = await axios.get(`https://g.tenor.com/v1/search?q=${character.physical}&key=J46MWLRVZYC3&limit=30`);

        loadAnimation(response);


    }
};


//spAttack(character) (high number but usable once or twice)
spAttack = async (character, opponent) => {

    if (!isAttacking) {
        if (character.specialCount == 0) {
            return;
        }
        character.defenceMultiplier = character.ogDefenceMultiplier;
        isAttacking = true;

        character.elements.sprite.src = character.specialAnimation;
        setTimeout(spriteIdle.bind(null, character), MAX_ANIMATION_DURATION_MS - 1000);

        let damage = Math.ceil((15 + Math.floor(Math.random() * 21)) * opponent.defenceMultiplier);
        opponent.health = opponent.health - damage;
        gameText.innerHTML = `${character.name} uses ${character.special}, deals ${damage} damage!`;
        opponent.elements.health.innerHTML = opponent.health;

        const response = await axios.get(`https://g.tenor.com/v1/search?q=${special.innerHTML}&key=J46MWLRVZYC3&limit=30`);

        loadAnimation(response);
        // decrement character heal count
        character.specialCount = character.specialCount - 1;
    }
    //deal between 15 to 35 damage

};
//heal(character)
healing = async (character) => {

    // don't spam attacks, only attack if one is not in progress
    if (!isAttacking) {
        if (character.healCount == 0) {
            return;
        }
        // block future attacks
        isAttacking = true;
        // reset defence multiplier for attacking user, their turn was used for something other than defence
        character.defenceMultiplier = character.ogDefenceMultiplier;

        //heal to full HP, core action of method
        character.elements.sprite.src = character.healAnimation;
        setTimeout(spriteIdle.bind(null, character), MAX_ANIMATION_DURATION_MS - 1000);

        character.health = character.ogHealth;
        gameText.innerHTML = `${character.name} heals to full health!`;
        character.elements.health.innerHTML = character.health;

        // Load animation
        const response = await axios.get(`https://g.tenor.com/v1/search?q=heal&key=J46MWLRVZYC3&limit=30`);
        loadAnimation(response);

        // decrement character heal count
        character.healCount = character.healCount - 1;
    }
};
//defend(character)
defending = async (character) => {

    //recieve 0.5x damage
    if (!isAttacking) {
        isAttacking = true;

        character.defenceMultiplier = character.ogDefenceMultiplier * 0.5;
        gameText.innerHTML = `${character.name} braces themselves for an attack , receives half the damage.`

        const response = await axios.get(`https://g.tenor.com/v1/search?q=defend&key=J46MWLRVZYC3&limit=30`);

        loadAnimation(response);
    }
};

loadAnimation = (response) => {
    // set the image src to empty and show image
    clearTimeout(hideImg);
    animationImg.classList.remove("hidden");
    // animationImg.classList.add("visible");
    gameText.classList.remove("hidden");
    // gameText.classList.add("visible");
    // load animation from axios response into img tag and then hide the image.
    let options = response.data.results;
    let i = Math.floor(Math.random() * options.length);
    // loopedmp4?
    let duration = options[i].media[0].mp4.duration * 1000;
    let animation = options[i].media[0].gif.url;
    animationImg.src = animation;

    let minDuration = 2500;
    if (duration > MAX_ANIMATION_DURATION_MS) {
        duration = MAX_ANIMATION_DURATION_MS;
    }
    if (duration < minDuration) {
        duration = minDuration;
    }
    clearTimeout(hideImg);
    setTimeout(hideImg, MAX_ANIMATION_DURATION_MS - 500);
};

hideImg = () => {
    // animationImg.classList.remove("visible");
    animationImg.classList.add("hidden");
    // gameText.classList.remove("visible");
    gameText.classList.add("hidden");
    isAttacking = false;
    gameEnd();
}

spriteIdle = (character) => {
    character.elements.sprite.src = character.sprite;
}
spriteWin = (character) => {
    character.elements.sprite.src = character.winAnimation;
}
spriteLose = (character) => {
    character.elements.sprite.src = character.loseAnimation;
}

//loadAnimation(searchTerm) (it's the API call)
cpuBrain = () => {
    // random > number > needs to select of method or method name
    if (enemy.health <= 0) {
        return;
    }
    if (enemy.health <= 35 && enemy.healCount > 0) {
        healing(enemy);

    }
    else {
        let random = Math.ceil(Math.random() * 4);

        if (random == 1) {
            phAttack(enemy, player);
        }
        else if (random == 2) {
            if (enemy.specialCount <= 0) {
                return cpuBrain();
            } else {
                spAttack(enemy, player);
            }
        }
        else if (random == 3) {
            defending(enemy);
        }
        else if (random == 4) {
            if (enemy.healCount <= 0) {
                return cpuBrain();
            } else {
                healing(enemy);
            }
        }
    }
    clearTimeout(enableAllButtons);
    setTimeout(enableAllButtons, MAX_ANIMATION_DURATION_MS);
}
fullyRestore = (character) => {
    character.ogDefenceMultiplier = 1; // reset cheats
    character.health = character.ogHealth;
    character.specialCount = character.ogSpecialCount;
    character.healCount = character.ogHealCount;
    character.defenceMultiplier = character.ogDefenceMultiplier;
    renderCharacter(character, character.elements.health, character.elements.name, character.elements.sprite);
}
//hasGameEnded()
gameEnd = () => {
    if (player.health <= 0 || enemy.health <= 0) {

        popUp.classList.remove("hidden");

        if (player.health <= 0) {
            clearTimeout(cpuBrain);
            spriteLose(player);
            spriteWin(enemy);
            popText.innerHTML = "Oh no , you died!";
        }

        else {
            clearTimeout(cpuBrain);
            spriteWin(player);
            spriteLose(enemy);
            popText.innerHTML = `Congrats!! you beat ${enemy.name} `;

        }
    }
}


