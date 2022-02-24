const characters = {
    aerith: {
        query: "name=aerith",
        name: "Aerith",
        sprite: "aerithSprite.png",
        physical: "Hit with chair",
        special: "Geyser",
        health: 80,
        ogHealth: 80,
        healCount: 3,
        specialCount: 4,
        defenceMultiplier: 1,
        attackAnimation: "aerith/aerithPhysical.png",
        healAnimation: "aerith/aerithHeal.png",
        specialAnimation: "aerith/aerithSpecial.png",
        winAnimation: "aerith/aerithWin.png",
        loseAnimation:"aerith/aerithDead.png",
        elements: {
            health: undefined,
            sprite: undefined
        }
    },
    cloud: {
        query: "name=cloud",
        name: "Cloud",
        sprite: "cloudSprite.png",
        physical: "Sword slash",
        special: "Explosion",
        ogHealth: 100,
        health: 100,
        healCount: 2,
        specialCount: 4,
        defenceMultiplier: 1,
        attackAnimation: "cloud/cloudPhysical.png",
        healAnimation: "cloud/cloudHeal.png",
        specialAnimation: "cloud/cloudSpecial.png",
        winAnimation: "cloud/cloudWin.png",
        loseAnimation:"cloud/cloudDead.png",
        elements: {
            health: undefined,
            sprite: undefined
        }
    },
    tifa: {
        query: "name=tifa",
        name: "Tifa",
        sprite: "tifaSprite.png",
        physical: "Combo",
        special: "Supernova",
        ogHealth: 100,
        health: 100,
        healCount: 2,
        specialCount: 4,
        defenceMultiplier: 1,
        attackAnimation: "tifa/tifaPhysical.png",
        healAnimation: "tifa/tifaHeal.png",
        specialAnimation: "tifa/tifaSpecial.png",
        winAnimation: "tifa/tifaWin.png",
        loseAnimation:"tifa/tifaDead.png",
        elements: {
            health: undefined,
            sprite: undefined
        }
    },
    red: {
        query: "name=red",
        name: "RedXIII",
        sprite: "redSprite.png",
        physical: "Animal bite",
        special: "Fireball",
        health: 100,
        ogHealth: 100,
        healCount: 2,
        specialCount: 4,
        defenceMultiplier: 1,
        attackAnimation: "red/redPhysical.png",
        healAnimation: "red/redHeal.png",
        specialAnimation: "red/redSpecial.png",
        winAnimation: "red/redWin.png",
        loseAnimation:"red/redDead.png",
        elements: {
            health: undefined,
            sprite: undefined
        }
    }
}



