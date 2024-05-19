const gameEvents = document.getElementById("gameEvents");
const gameScore = document.getElementById("gameScore");
const gameGuns = document.getElementById("gameGuns");
const gunAmmo = document.getElementById("gunAmmo");

// Enemy class to indicate all enemies
class Enemy {
    constructor({ height = 1200, hp = 1, points = 50 } = {}) {
        // Creates enemy sprite in the game area
        let enemy = document.createElement("img");
        enemy.classList.add("enemy");
        enemy.style.height = height + "px";
        enemy.style.zIndex = "0";
        this.height = height;
        gameEvents.appendChild(enemy);
        
        // Enemy variables
        this.points = points;
        this.hp = hp;
        this.sprite = enemy;
        this.start = (new Date()).getTime();

        // Removes image dragability function
        this.sprite.ondragstart = function() { return false; };

        // Adding enemy on click damage event
        this.sprite.addEventListener('click', () => {
            this.hp -= Game.selectedWeapon.damageModifier(this);
            if (this.hp <= 0) {
                Game.score += this.points;
                gameScore.innerHTML = Game.score;
                this.death();
            }
        });

        // Adding enemies to the active enemy list
        Game.enemies.push(this);
    };
    // Updates enemy position on game screen
    update() {
        var alive = 1;
        let time = (new Date()).getTime() - this.start;
        if (time > this.path[0]["time"]) {
            this.current = this.path.shift();
            this.sprite.src = this.current["sprite"];
        }
        if (this.path.length == 0) {
            alive = this.death();
            Game.endGameMenu();
            return 9999;
        }
        let progress = (time - this.current["time"]) / (this.path[0]["time"] - this.current["time"]);
        let depth = this.current["depth"] + ((this.path[0]["depth"] - this.current["depth"]) * progress);
        let angle = this.current["angle"] + ((this.path[0]["angle"] - this.current["angle"]) * progress);
        let altitude = this.current["altitude"] + ((this.path[0]["altitude"] - this.current["altitude"]) * progress);

        let size = 2 * (Math.atan(0.5 * 1/depth) * 180 / Math.PI);

        this.sprite.style.marginLeft = (angle * (size / 52.78837903603946) * 10) + "px";
        this.sprite.style.marginTop = (altitude * (size / 52.78837903603946) * 10) + "px";
        this.sprite.style.height = (this.height * (size / 52.78837903603946)) + "px";
        this.sprite.style.zIndex = (1000 - Math.floor(depth * 100));
        return alive;
    }
    // Removes enemy from game on death
    death() {
        Game.enemies.splice(Game.enemies.indexOf(this), 1);
        this.sprite.remove();
        delete this;
        return 0;
    }
}

// Crates enemy types
// Enemy type that floats directly to the camera
class Floater extends Enemy {
    constructor({ height = 1200, hp = 1, points = 50, algorithm = 1 } = {}) {
        super({height: height, hp:hp, points:points, algorithm:algorithm});
        this.generatePath(algorithm);
        this.current = this.path.shift();
        this.sprite.src = this.current["sprite"];
    };
    // Generates paths for enemies to follow
    generatePath(algorithm = 1) {
        switch (algorithm) {
            // Default path for the enemy with slow aproach
            case 1:
                var distance = Math.floor(Math.random() * 2000) - 1000;
                var height = Math.floor(Math.random() * 400) - 450;
                var path = [{
                    "time": 0,
                    "depth": 8,
                    "altitude": height - 500,
                    "angle": distance,
                    "sprite": "/media/headpopper/head1.png",
                }, {
                    "time": 500,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/head1.png",
                }, {
                    "time": 800,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/head1.png",
                }, {
                    "time": 6800,
                    "depth": 1,
                    "altitude": height/20,
                    "angle": distance/20,
                    "sprite": "/media/headpopper/head1.png",
                }]
                break;
            // It almost stands there, menacingly
            case 2:
                var distance = Math.floor(Math.random() * 2000) - 1000;
                var height = Math.floor(Math.random() * 400) - 450;
                var path = [{
                    "time": 0,
                    "depth": 8,
                    "altitude": height - 500,
                    "angle": distance,
                    "sprite": "/media/headpopper/head1.png",
                }, {
                    "time": 500,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/head1.png",
                }, {
                    "time": 800,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/head1.png",
                }, {
                    "time": 10000000,
                    "depth": 1,
                    "altitude": height/20,
                    "angle": distance/20,
                    "sprite": "/media/headpopper/head1.png",
                }]
                break;
        }
        this.path = path;
    }
}

// Enemy type that walks to the camera in a zigzag pattern
class Spider extends Enemy {
    constructor({ height = 1200, hp = 1, points = 50, algorithm = 1 } = {}) {
        super({height: height, hp:hp, points:points, algorithm:algorithm});
        this.generatePath(algorithm);
        this.current = this.path.shift();
        this.sprite.src = this.current["sprite"];
    };
    generatePath(algorithm = 1) {
        // Default path for the enemy with zig-zag pattern
        switch (algorithm) {
            case 1:
                const distance = Math.floor(Math.random() * 2000) - 1000;
                const height = Math.floor(Math.random() * 400) - 450;
                var path = [{
                    "time": 0,
                    "depth": 8,
                    "altitude": 100,
                    "angle": Math.floor(Math.random() * 1600) -800,
                    "sprite": "/media/headpopper/thisthing.gif",
                }];
                var newAngle = path[path.length-1]["angle"] + (Math.floor(Math.random() * 600) -300);
                newAngle = (newAngle < -800) ? -800 : newAngle;
                newAngle = (newAngle > 800) ? 800 : newAngle;
                path.push({
                    "time": 2000,
                    "depth": 5,
                    "altitude": 170,
                    "angle": newAngle,
                    "sprite": "/media/headpopper/thisthing.gif",
                });
                newAngle = path[path.length-1]["angle"] + (Math.floor(Math.random() * 300) -150);
                newAngle = (newAngle < -400) ? -400 : newAngle;
                newAngle = (newAngle > 400) ? 400 : newAngle;
                path.push({
                    "time": 4000,
                    "depth": 3,
                    "altitude": 210,
                    "angle": newAngle,
                    "sprite": "/media/headpopper/thisthing.gif",
                });
                path.push({
                    "time": 6000,
                    "depth": 1,
                    "altitude": 250,
                    "angle": 0,
                    "sprite": "/media/headpopper/thisthing.gif",
                });
                path.push({
                    "time": 6100,
                    "depth": 0.8,
                    "altitude": 0,
                    "angle": 0,
                    "sprite": "/media/headpopper/thisthing.gif",
                });
                path.push({
                        "time": 7100,
                        "depth": 0.8,
                        "altitude": 0,
                        "angle": 0,
                        "sprite": "/media/headpopper/thisthing.gif",
                });
                break;
        }
        this.path = path;
    }
}

// Enemy moves spiradicly around a static line to the camera
class Balooner extends Enemy {
    constructor({ height = 1200, hp = 1, points = 50, algorithm = 1 } = {}) {
        super({height: height, hp:hp, points:points, algorithm:algorithm});
        this.generatePath(algorithm);
        this.current = this.path.shift();
        this.sprite.src = this.current["sprite"];
    };
    // Generates paths for enemies to follow
    generatePath(algorithm = 1) {
        switch (algorithm) {
            // Random movement around a predetermined line
            case 1:
                var distance = Math.floor(Math.random() * 2000) - 1000;
                var height = Math.floor(Math.random() * 400) - 450;
                var path = [{
                    "time": 0,
                    "depth": 8,
                    "altitude": height - 400,
                    "angle": distance,
                    "sprite": "/media/headpopper/Balooner.png",
                }, {
                    "time": 500,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/Balooner.png",
                }, {
                    "time": 800,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/Balooner.png",
                }]
                var end = {
                    "time": 6800,
                    "depth": 1,
                    "altitude": height/20,
                    "angle": distance/20,
                    "sprite": "/media/headpopper/Balooner.png",
                }
                for (var x = 100; x < 6800; x += Math.floor(Math.random() * 100 ) + 150) {
                    let progress = x / end["time"];
                    let depth = path[2]["depth"] + ((end["depth"] - path[2]["depth"]) * progress);
                    let angle = path[2]["angle"] + ((end["angle"] - path[2]["angle"]) * progress) + Math.floor(Math.random() * 150 - 75);
                    let altitude = path[2]["altitude"] + ((end["altitude"] - path[2]["altitude"]) * progress) + Math.floor(Math.random() * 40 -20);

                    var temp = {
                        "time": x,
                        "depth": depth,
                        "altitude": altitude,
                        "angle": angle,
                        "sprite": "/media/headpopper/Balooner.png",
                    }
                    path.push(temp);
                }
                path.push(end);
                break;
            // Sprints at high speed to the camera, backs of and then sprints again
            case 2:
                var distance = Math.floor(Math.random() * 2000) - 1000;
                var height = Math.floor(Math.random() * 400) - 450;
                var path = [{
                    "time": 0,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/Balooner.png",
                }]
                var end = {
                    "time": 6000,
                    "depth": 1,
                    "altitude": height/20,
                    "angle": distance/20,
                    "sprite": "/media/headpopper/Balooner.png",
                }
                for (var x = 100; x < 6000; x += Math.floor(Math.random() * 100 ) + 100) {
                    let progress = x / end["time"];
                    let depth = end["depth"] + ((path[0]["depth"] - end["depth"]) * progress);
                    let angle = end["angle"] + ((path[0]["angle"] - end["angle"]) * progress);
                    let altitude = end["altitude"] + ((path[0]["altitude"] - end["altitude"]) * progress);

                    var temp = {
                        "time": x,
                        "depth": depth,
                        "altitude": altitude,
                        "angle": angle,
                        "sprite": "/media/headpopper/Balooner.png",
                    }
                    path.push(temp);
                }
                path.push(end);
                break;
        }
        this.path = path;
    }
}

// Boss
class Boss extends Enemy {
    constructor({ height = 1200, hp = 1, points = 50, algorithm = 1 } = {}) {
        super({height: height, hp:hp, points:points, algorithm:algorithm});
        this.generatePath(algorithm);
        this.current = this.path.shift();
        this.sprite.src = this.current["sprite"];
    };
    // Generates paths for enemies to follow
    generatePath(algorithm = 1) {
        switch (algorithm) {
            // Default path for the enemy with slow aproach
            case 1:
                var distance = Math.floor(Math.random() * 2000) - 1000;
                var height = Math.floor(Math.random() * 400) - 450;
                
                var path = [{
                    "time": 0,
                    "depth": 8,
                    "altitude": height - 500,
                    "angle": distance,
                    "sprite": "/media/headpopper/head boss.png",
                }, {
                    "time": 500,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/head boss.png",
                }, {
                    "time": 800,
                    "depth": 8,
                    "altitude": height,
                    "angle": distance,
                    "sprite": "/media/headpopper/head boss.png",
                }]
                var end = {
                    "time": 15000,
                    "depth": 1,
                    "altitude": 0,
                    "angle": distance/20,
                    "sprite": "/media/headpopper/head boss.png",
                }

                for (var x = 1500; x < 15000; x += Math.floor(Math.random() * 500 ) + 3000) {
                    let progress = (x) / end["time"];
                    let depth = path[2]["depth"] + ((end["depth"] - path[2]["depth"]) * progress);
                    let angle = path[2]["angle"] + ((end["angle"] - path[2]["angle"]) * progress);
                    let altitude = path[2]["altitude"] + ((end["altitude"] - path[2]["altitude"]) * progress);

                    let maxAngle = 400 + (600 * ((end["time"] - x) / end["time"]));
                    let minAngle = -400 - (600 * ((end["time"] - x) / end["time"]));

                    path.push({
                        "time": x,
                        "depth": depth,
                        "altitude": altitude,
                        "angle": angle,
                        "sprite": "/media/headpopper/head boss.png",
                    });

                    let pattern = 1;
                    switch (pattern) {
                        case 1:
                            path.push({
                                "time": x + 300,
                                "depth": depth,
                                "altitude": altitude,
                                "angle": minAngle,
                                "sprite": "/media/headpopper/head boss.png",
                            });
                            path.push({
                                "time": x + 600,
                                "depth": depth,
                                "altitude": altitude,
                                "angle": maxAngle,
                                "sprite": "/media/headpopper/head boss.png",
                            });
                            path.push({
                                "time": x + 900,
                                "depth": depth,
                                "altitude": altitude,
                                "angle": minAngle,
                                "sprite": "/media/headpopper/head boss.png",
                            });
                            path.push({
                                "time": x + 1200,
                                "depth": depth,
                                "altitude": altitude,
                                "angle": maxAngle,
                                "sprite": "/media/headpopper/head boss.png",
                            });
                            break;
                    }
                    path.push({
                        "time": x + 1500,
                        "depth": depth,
                        "altitude": altitude,
                        "angle": angle,
                        "sprite": "/media/headpopper/head boss.png",
                    });
                }

                path.push(end);

                break;
        }
        this.path = path;
    }
}

// A class that is responsible for all the weapons in the game
class Weapon {
    /*
        Creates a weapon that does a ammount of famage
        
        Each modifer name has to be the same as the enemy name
    */ 
    constructor({damage = 1, key = 0, ammo = 1, rechargeTime = 0, modifiers = {Floater: 1, Spider: 1, Balooner: 1, Boss: 1}, icon = undefined, id = undefined} = {}) {
        this.damage = damage;
        this.modifiers = modifiers;
        this.ammo = ammo;
        this.maxAmmo = ammo;
        this.rechargeTime = rechargeTime;
        this.lastShot = (new Date()).getTime();
        this.key = key;

        this.gun = id;
        this.img = icon;

        Game.weapons.push(this);
    };
    // Determins how much damage a enemy will take based on the type of the enemy
    // Uses default damage, if enemy has no modifier 
    damageModifier(enemy) {
        if (this.ammo > 0) {
            this.ammo--;
            this.lastShot = (new Date()).getTime();
            const modifier = this.modifiers[enemy.constructor.name];
            if (modifier == undefined) {
                return this.damage;
            }
            return this.damage * modifier;
        }
        return 0;
    };
    updateAmmo() {
        if (this.maxAmmo == this.ammo) {
            return 0;
        }
        if (((new Date()).getTime() - this.lastShot) >= this.rechargeTime) {
            this.lastShot = (new Date()).getTime();
            this.ammo++;
        }
        if (this == Game.selectedWeapon) {
            gunAmmo.innerHTML = this.ammo;
        }
    };
    death() {
        Game.weapons.splice(Game.weapons.indexOf(this), 1);
        this.gun.remove();
        delete this;
        return 0;
    };
    selectGun() {
        gameGuns.getElementsByTagName("span")[0].style.backgroundImage = "url('" + this.img + "')";
        gameGuns.getElementsByTagName("span")[1].innerHTML = this.gun;
        gunAmmo.innerHTML = this.ammo;

        Game.selectedWeapon = this;
    };
}

// The main game engine
var Game = {
    // All the events that are ran once at the start of the game
    initialize: function () {
        this.timer = (new Date()).getTime();
        this.enemies = [];
        this.weapons = [];
        this.selectedWeapon = undefined;
        this.score = 0;
        this.maxSpawn = 8;
        this.over = false;

        this.pause = false;

        // new Weapon({damage: 25, modifiers: {Floater: 1, Spider: 0.5, Balooner: 2}});
        new Weapon({
            key: 122,
            damage: 1,
            ammo: 9999,
            rechargeTime: 0,
            modifiers: {Floater: 1, Spider: 1, Balooner: 1},
            icon: "/media/headpopper/hand gun.png",
            id: "Pistol",
        });

        Game.weapons[0].selectGun();

        // Possible list of spawnable enemies
        this.gameWaves = [
            {
                "action": "textScreen",
                "text": "<div class='gameInfoText'>Click anywhere to start the game, or wayit 99999999999 seconds</div>",
                "timeout": 99999999999,
                "function": "remove",
            }, {
                "background": "/media/headpopper/bg1.png",
                "waves": [
                    {
                        "count": 1,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1}
                        ],
                    }, {
                        "count": 5,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1}
                        ],
                    }, {
                        "count": 10,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1}
                        ],
                    }
                ]
            }, {
                "action": "textScreen",
                "text": "<div class='gameInfoText'><div>You have gotten a rifle: 3x damage, 1 shoot every 5 seconds</div><div>Use 'Z' and 'X' to swap between guns</div></div>",
                "timeout": 5000,
            }, {
                "action": "addWeapon",
                "weapon": {
                    key: 120,
                    damage: 3,
                    ammo: 3,
                    rechargeTime: 5000,
                    modifiers: {Floater: 1, Spider: 1, Balooner: 1},
                    icon: "/media/headpopper/WINchester.png",
                    id: "Rifle",
                }
            }, {
                "background": "/media/headpopper/bg2.png",
                "waves": [
                    {
                        "count": 1,
                        "spawnTable": [
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 4,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 6,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 8,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }
                ]
            }, {
                "background": "/media/headpopper/bg3.png",
                "waves": [
                    {
                        "count": 1,
                        "spawnTable": [
                            {"type": Spider, "hp": 3, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 4,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Spider, "hp": 3, "points": 50, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 6,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Spider, "hp": 3, "points": 50, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 8,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Spider, "hp": 3, "points": 50, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    }, {
                        "count": 10,
                        "spawnTable": [
                            {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                            {"type": Spider, "hp": 3, "points": 50, "algorithm": 1},
                            {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1}
                        ],
                    },
                    {
                        "count": 1,
                        "spawnTable": [
                            {"type": Boss, "hp": 20, "points": 500, "algorithm": 1}
                        ],
                    }
                ]
            }, {
                "action": "infinite",
                "spawnTable": [
                    {"type": Floater, "hp": 2, "points": 25, "algorithm": 1},
                    {"type": Spider, "hp": 3, "points": 50, "algorithm": 1},
                    {"type": Balooner, "hp": 1, "points": 50, "algorithm": 1},
                    {"type": Boss, "hp": 20, "points": 500, "algorithm": 1}
                ]
            }
        ]
        
        Game.listeners();
        Game.menu();
    },

    // Ends game
    endGameMenu: function (text) {
        Game.over = true;
        if ( confirm("Save score?") ) {
            window.location.href = "/headPopper/" + this.score;
        } else {
            setTimeout(function(){
                Game = Object.assign({}, Game);
                Game.initialize();
            }, 3000);
        }
        while (this.enemies.length > 0) {
            this.enemies[0].death();
        }
        while (this.weapons.length > 0) {
            this.weapons[0].death();
        }
        gameScore = 0;
    },

    // Creates the game start menu
    menu: function() {
        // startButton = document.createElement("img");
        // startButton.src = "Start.png";
        // startButton.classList.add("startButton");
        // gameEvents.appendChild(startButton);
        // startButton.addEventListener('click', function(){
        //     startButton.remove();
        //     gameEvents.setAttribute('value', 'true');
        //     Game.loop();
        // });
        Game.loop();
    },

    // Function used to add listeners to the game;
    listeners: function () {
        // Weapon selection scrolling
        document.body.addEventListener('keypress', () => {
            // This function will be called whenever the user scrolls
            for (var x = 0; x < Game.weapons.length; x++) {
                console.log(Game.weapons[x].key);
                if (event.keyCode == Game.weapons[x].key) {
                    Game.selectedWeapon = Game.weapons[x];
                    Game.selectedWeapon.selectGun();
                    break;
                }
            }
        });
        gameGuns.addEventListener("click", () => {
            var x = (Game.weapns.indexOf(Game.selectedWeapon) + 1) % Game.weapns;
            Game.selectedWeapon = Game.weapons[x];
            Game.selectedWeapon.selectGun();
        })
    },

    // Updates all the functions
    update: function () {
        // Updates all the game enemies
        var x = 0;
        while (x < Game.enemies.length) {
            x += Game.enemies[x].update();
        }
        if (x == 0) {
            Game.spawnEnemies();
        }

        // Updates gun ammo counter
        for (var x = 0; x < this.weapons.length; x++ ) {
            this.weapons[x].updateAmmo();
        }
    },
    
    // Spawns enemies
    spawnEnemies: function () {
        if ("action" in this.gameWaves[0]) {
            let action = this.gameWaves[0];
            if (action["action"] == "addWeapon") {
                this.gameWaves.shift();
                new Weapon(action["weapon"]);
            } else if (action["action"] == "infinite") {
                let spawns = this.gameWaves[0]["spawnTable"];
                var x = 0;
                while (x < this.maxSpawn) {
                    var enemy = spawns[Math.floor(Math.random()*spawns.length)];
                    
                    if (enemy["type"] == Boss) {
                        if (this.maxSpawn - x < 10) {
                            continue;
                        } else {
                            x += 4;
                        }
                    }

                    new enemy["type"]({hp: enemy["hp"], points: enemy["points"]});
                    
                    x += 1;
                }
                this.maxSpawn += 0.5;
            } else if (action["action"] == "textScreen") {
                this.gameWaves.shift();
                this.pause = true;

                var elements = document.createElement("div");
                elements.classList.add("gameInfoText");
                elements.innerHTML = action["text"];
                gameEvents.appendChild(elements);
                
                if ("function" in action) {
                    if (action["function"] == "remove") {
                        var text = setTimeout(() => {
                            this.pause = false;
                            elements.remove();
                        }, action["timeout"]);
                        elements.addEventListener("click", () => {
                            clearTimeout(text);
                            this.pause = false;
                            elements.remove();
                        });
                    } else {
                        setTimeout(() => {
                            this.pause = false;
                            elements.remove();
                        }, action["timeout"]);
                    }
                } else {
                    setTimeout(() => {
                        this.pause = false;
                        elements.remove();
                    }, action["timeout"]);
                }
            }
            return 0;
        } else {
            document.body.style.backgroundImage = "url('" + this.gameWaves[0]["background"] + "')";
            wave = this.gameWaves[0]["waves"].shift();
            if (this.gameWaves[0]["waves"].length == 0) {
                this.gameWaves.shift();
            }
            for (var x = 0; x < wave["count"]; x++) {
                var enemy = wave["spawnTable"][Math.floor(Math.random()*wave["spawnTable"].length)];
                new enemy["type"]({hp: enemy["hp"], points: enemy["points"]});
            }
        }
    },

    // The main game loop that handles all the game processes
    loop: function () {
        if (!Game.pause) {
            if (Game._turnDelayIsOver()) {
                this.timer = (new Date()).getTime();
                Game.update();
            }
        }
        if (!Game.over) requestAnimationFrame(Game.loop);
    },

    // Adds a dilay if needed to give player some breathing time
    _turnDelayIsOver: function() {
        result = ((new Date()).getTime() - this.timer >= 1000);
        return result;
    },
};

var Game = Object.assign({}, Game);
setTimeout(function(){
    Game.initialize();
}, 100);

setTimeout(function() {
    // for (var x = 100; x < 1000; x += 100) {
    //     setTimeout(floater, x);
    // }
    // new Floater({ algorithm: 1 });
    // new Floater({ algorithm: 2 });
    // spider = new Spider({ algorithm: 1 });
    // new Balooner({ algorithm: 1 });
    // new Balooner({ algorithm: 2 });
}, 1000)
