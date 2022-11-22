var theDojo = [ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ];
var dojoDiv = document.querySelector("#the-dojo");

var ninjas = [ "BlueNinja.png", "GreenNinja.png", "PurpleNinja.png", "RedNinja.png" ];

var tilesLeft = (theDojo.length * theDojo[0].length);
var ninjaCount = 10;

// Creates the rows of buttons for this game
function render(theDojo) {
    document.querySelector('.message1').innerText = "";
    document.querySelector('.message2').innerText = "";
    document.querySelector('.message3').innerText = "";
    var result = "";
    for(var i=0; i<theDojo.length; i++) {
        for(var j=0; j<theDojo[i].length; j++) {
            theDojo[i][j] = 0;
            result += `<button class="tatami" id="row${i}col${j}" oncontextmenu="block(${i}, ${j}, this)" onclick="howMany(${i}, ${j}, this)"></button>`;
        }
    }
    placeNinjas(theDojo);
    tilesLeft = (theDojo.length * theDojo[0].length);

    return result;
}

// places a specified number of ninjas on the board
function placeNinjas(theDojo) {
    var ninjasPlaced = 0;
    while (ninjasPlaced < ninjaCount) {
        var row = Math.floor(Math.random()*10);
        var col = Math.floor(Math.random()*10);
        if (theDojo[row][col] != 1) {
            theDojo[row][col] = 1;
            ninjasPlaced++;
        }
    }
    document.querySelector('.ninjasLeft .count').innerText = ninjaCount;
    document.querySelector('.ninjasFound .count').innerText = 0; 
    // Leaving these out doesn't reset the counts
}

//  As n increases chances of runnign into a ninja is n/100
    
// TODO - Make this function tell us how many ninjas are hiding 
//        under the adjacent (all sides and corners) squares.
//        Use i and j as the indexes to check theDojo.

function howMany(i, j, element) {
    // Prevent any action if the tile was pressed or marked with a ninja. 
    if (element.className == "pressed" || element.className == "blocked") {
        return;
    }

    // Mark the tile with a ninja with a red border and reveal other ninjas if the tile contained a ninja.
    if (theDojo[i][j] == 1) {
        element.innerHTML = `<img src="${ninjas[Math.floor(Math.random()*4)]}">`;
        element.style.borderColor = "rgb(194, 0, 0)";
        revealNinjas(theDojo, element);
        document.querySelector('.message1').innerText = "Oh No!";
        document.querySelector('.message2').innerText = "One of the Ninjas Found You First!";
        document.querySelector('.message3').innerText = "Click the ninja at the top to restart.";
        return;
    }
    // I want to take the 3 by 3 grid given and find the total amount of ninjas in all by the middle square
    // Need to make sure not checking squares that are out of bounds.
    var totalNinjas = 0;
    for (var row = i - 1; row <= i + 1 && row < theDojo.length; row++) {
        if (row < 0) {
            row++;
        }
        for (var col = j - 1; col <= j + 1 && col < theDojo[i].length; col++) {
            if (col >= 0 && !(row == i && col == j)) {
                totalNinjas += theDojo[row][col];
            }
        }
    }
    // If the square has no ninjas around, reveal all the squares around as well. 
    // This will recur for any surrounding squares that also have no ninjas around.
    element.className = "pressed";
    element.removeAttribute("onclick");
    element.removeAttribute("oncontextmenu");
    tilesLeft--;
    if (tilesLeft == ninjaCount) {
        revealNinjas(theDojo, element);
        document.querySelector('.message1').innerText = "Congratulations!";
        document.querySelector('.message2').innerText = "You Found All The Ninjas!";
        document.querySelector('.message3').innerText = "Click the ninja at the top to restart.";
    }
    if (totalNinjas == 0) {
        element.innerText = "";
        for (var row = i - 1; row <= i + 1 && row < theDojo.length; row++) {
            if (row < 0) {
                row++;
            }
            for (var col = j - 1; col <= j + 1 && col < theDojo[i].length; col++) {
                if (col >= 0 && !(row == i && col == j)) {
                    howMany(row, col, document.getElementById('row'+row+'col'+col));
                }
            }
        }
    }
    else {
        element.innerText = totalNinjas;
    }
}

// If a ninja is clicked, reveal all of the other ninjas and remove functions from all tiles.
function revealNinjas(theDojo, element) {
    for (var row = 0; row < theDojo.length; row++) {
        for (var col = 0; col < theDojo[row].length; col++) {
            document.getElementById('row'+row+'col'+col).setAttribute("onclick", "");
            document.getElementById('row'+row+'col'+col).setAttribute("oncontextmenu", "");
            if (theDojo[row][col] == 1 && element.getAttribute("id") != 'row'+row+'col'+col) {
                document.getElementById('row'+row+'col'+col).innerHTML = `<img src="${ninjas[Math.floor(Math.random()*4)]}">`;
            }
        }
    }
}

// Marks the tile with a ninja if player right clicks on a tile.
function block(i, j, element) {
    // Prevents adding more ninja markers if all ninjas are accounted for.
    if (document.querySelector('.ninjasLeft .count').innerText == 0 && element.className != "blocked") {return;}
    
    // Changes the tile back to original setup if a ninja marker was already present. 
    // Otherwise, a ninja marker is placed, up to a total of the amount of ninjas present.
    if (element.className == "blocked") {
        element.setAttribute("class", "tatami");
        element.innerHTML = ``;
        document.querySelector('.ninjasLeft .count').innerText++;
        document.querySelector('.ninjasFound .count').innerText--;
    }
    else {
        element.setAttribute("class", "blocked");
        element.innerHTML = `<img src="${ninjas[Math.floor(Math.random()*4)]}">`;
        document.querySelector('.ninjasLeft .count').innerText--;
        document.querySelector('.ninjasFound .count').innerText++;
    }
}

// Resets the board if the player clicks on the ninja button at the top.
function restart(theDojo) {
    dojoDiv.innerHTML = render(theDojo);
}

// BONUS CHALLENGES
// 1. draw the number onto the button instead of alerting it
// 2. at the start randomly place 10 ninjas into theDojo with at most 1 on each spot
// 3. if you click on a ninja you must restart the game 
//    dojoDiv.innerHTML = `<button onclick="location.reload()">restart</button>`;
    
// start the game
// message to greet a user of the game
var style="color:cyan;font-size:1.5rem;font-weight:bold;";
console.log("%c" + "IF YOU ARE A DOJO STUDENT...", style);
console.log("%c" + "GOOD LUCK THIS IS A CHALLENGE!", style);
// shows the dojo for debugging purposes
console.table(theDojo);
// adds the rows of buttons into <div id="the-dojo"></div> 
dojoDiv.innerHTML = render(theDojo);


document.querySelector('body').addEventListener("contextmenu", function(event) {
    event.preventDefault()
});