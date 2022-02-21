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

const gameText = document.getElementById("game-text");

let player = undefined;
const playerSprite = document.getElementById("spriteOne");
const playerHealth = document.getElementById("healthbarOne");
const playerName = document.getElementById("nameOne");

let enemy = characters.tifa;
const enemySprite = document.getElementById("spriteTwo")
const enemyHealth = document.getElementById("healthbarTwo");
const enemyName = document.getElementById("nameTwo");


let isAttacking = false;

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
        player = JSON.parse(JSON.stringify(characters.tifa));
    } else if (url.includes(characters.aerith.query)) {
        player = JSON.parse(JSON.stringify(characters.aerith));
    } else if (url.includes(characters.red.query)) {
        player = JSON.parse(JSON.stringify(characters.red));
    } else if (url.includes(characters.cloud.query)) {
        player = JSON.parse(JSON.stringify(characters.cloud));
    } else {
        // something broke, select my favorite
        player = JSON.parse(JSON.stringify(characters.aerith));
    }
}

selectRandomEnemy = () => {
    let keys = Object.keys(characters);
    let i = Math.floor(Math.random() * keys.length);
    enemy = JSON.parse(JSON.stringify(characters[keys[i]]));
}

renderCharacter = (character, healthView, nameView, spriteView) => {
    character.elements.health = healthView;
    healthView.innerHTML = character.health;
    nameView.innerHTML = character.name;
    spriteView.src = character.sprite;
}

renderPlayerControls = (character) => {
    physical.innerHTML = character.physical;
    heal.innerHTML = `Heal x${character.healCount}`;
    special.innerHTML = `${character.special} x${character.specialCount}`;
}

//phAttack(character) (deals flat damage)
phAttack = async (character, opponent) => {
    if (!isAttacking) {
        isAttacking = true;

        // reset character defence because this is a new turn for the character
        character.defenceMultiplier = 1; // This belongs to character

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
        character.defenceMultiplier = 1;
        isAttacking = true;

        let damage = Math.ceil((15 + Math.floor(Math.random() * 21)) * opponent.defenceMultiplier);
        opponent.health = opponent.health - damage;
        gameText.innerHTML = `${character.name} uses ${character.special}, deals ${damage} damage!`;
        opponent.elements.health.innerHTML = opponent.health;

        const response = await axios.get(`https://g.tenor.com/v1/search?q=${special.innerHTML}&key=J46MWLRVZYC3&limit=30`);
        console.log(response);
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
        character.defenceMultiplier = 1;

        //heal to full HP, core action of method
        character.health = character.ogHealth;
        gameText.innerHTML = `${character.name} heals to full health!`;
        character.elements.health.innerHTML = character.health;

        // Load animation
        const response = await axios.get(`https://g.tenor.com/v1/search?q=heal&key=J46MWLRVZYC3&limit=30`);
        console.log(response);
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

        character.defenceMultiplier = 0.5;
        gameText.innerHTML = `${character.name} braces themselves for an attack , receives half the damage.`

        const response = await axios.get(`https://g.tenor.com/v1/search?q=defend&key=J46MWLRVZYC3&limit=30`);
        console.log(response);
        loadAnimation(response);
    }
};


//loadAnimation(searchTerm) (it's the API call)



heal.addEventListener('click', async () => {
    await healing(player);
    if (player.healCount == 0) {
        heal.disabled = true;
    }
    heal.innerHTML = `Heal x${player.healCount}`;
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, 4000);
});
physical.addEventListener('click', async () => {
    await phAttack(player, enemy);
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, 4000);
});
special.addEventListener('click', async () => {
    await spAttack(player, enemy);
    if (player.specialCount == 0) {
        special.disabled = true;
    }
    special.innerHTML = `${player.special} x${player.specialCount}`;
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, 4000);
});
defend.addEventListener('click', async () => {
    await defending(player);
    clearTimeout(cpuBrain);
    setTimeout(cpuBrain, 4000);
});

hideImg = () => {
    animationImg.classList.remove("visible");
    animationImg.classList.add("hidden");
    gameText.classList.remove("visible");
    gameText.classList.add("hidden");
    isAttacking = false;
    gameEnd();
}

loadAnimation = (response) => {
    // set the image src to empty and show image
    clearTimeout(hideImg);
    animationImg.classList.remove("hidden");
    animationImg.classList.add("visible");
    gameText.classList.remove("hidden");
    gameText.classList.add("visible");
    // load animation from axios response into img tag and then hide the image.
    let options = response.data.results;
    let i = Math.floor(Math.random() * options.length);
    // loopedmp4
    let duration = options[i].media[0].mp4.duration;
    let animation = options[i].media[0].gif.url;
    animationImg.src = animation;

    let minDuration = 2.5;
    let maxDuration = 4;
    if (duration > maxDuration) {
        duration = maxDuration;
    }
    if (duration < minDuration) {
        duration = minDuration;
    }
    console.log(duration);
    setTimeout(hideImg, duration * 1000);
};







cpuBrain = () => {
    // random > number > needs to select of method or method name
    if (enemy.health <= 0) {
        return;
    }
    let random = Math.ceil(Math.random() * 4)
    if (random == 1) {
        phAttack(enemy, player);
    }
    if (random == 2) {
        if (enemy.specialCount <= 0) {
            cpuBrain();
        } else {
            spAttack(enemy, player);
        }
    }
    if (random == 3) {
        defending(enemy);
    }
    if (random == 4) {
        if (enemy.healCount <= 0) {
            cpuBrain();
        } else {
            healing(enemy);
        }
    }
}

//hasGameEnded()
gameEnd = () => {
    if (player.health <= 0 || enemy.health <= 0) {
        if (player.health <= 0) {
            if (confirm("Oh no , you died , rematch?")) {
                window.location.href = "/TripleF/characterSelect.html"
            } else {
                // disable buttons
                heal.disabled = true;
                physical.disabled = true;
                special.disabled = true;
                defend.disabled = true;
            }
        }
        else {
            clearTimeout(cpuBrain);
            if (confirm(`Congrats!! you beat ${enemy.name} , rematch?`)) {
                window.location.href = "/TripleF/characterSelect.html"
            } else {
                // disable buttons
                heal.disabled = true;
                physical.disabled = true;
                special.disabled = true;
                defend.disabled = true;
            }
        }
    }
}


