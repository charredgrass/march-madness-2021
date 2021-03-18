let bdata = require('bracket-data')({
    year: '2021',
    sport: 'ncaam'
});

const ORDER : Array<number> = bdata.order;
const REG_SIZE : number = 16;
const LAYERS : number = 4;

class Team {
    name: String;
    seed: Number;
    constructor(n : String, s : Number) {
        this.name = n;
        this.seed = s;
    }
    toString() {
        return this.name + "(" + this.seed + ")"
    }
}

class Matchup {
    left: Team;
    right: Team;
    childLeft: Matchup | null;
    childRight: Matchup | null;
    parent: Matchup;
    winner: boolean;
    isLeft: boolean;
    constructor(p : Matchup, isL : boolean) {
        this.left = null;
        this.right = null;
        this.childLeft = null;
        this.childRight = null;
        this.parent = p;
        this.winner = null;
        this.isLeft = isL;
    }
    toString() {
        return (this.left ? this.left.toString() : "not populated(-)") 
            + " vs " +
            (this.right ? this.right.toString() : "not populated(-)")
            + " | W: " + (this.winner === true ? this.left.toString() : this.right.toString());
    }

    stringAll() {
        //this is flawed
        //should be a level order traversal but this is inorder tree traversal
        //which is way easier
        return (this.childLeft ? this.childLeft.stringAll() : "") + "\n" +
            this.toString() + 
            (this.childRight ? this.childRight.stringAll() : "");
    }
}

for (let r of bdata.constants.REGION_IDS) {
    let cregion = bdata.bracket.regions[r].teams;
    let regfinal : Matchup = new Matchup(null, true);
    let lowestLevel : Array<Matchup> = [regfinal];
    while (lowestLevel.length < (REG_SIZE / 2)) {
        let temp : Array<Matchup> = [];
        for (let m of lowestLevel) {
            let left = new Matchup(m, true);
            let right = new Matchup(m, false);
            temp.push(left);
            temp.push(right);
            m.childLeft = left;
            m.childRight = right;
        }
        lowestLevel = temp;
    }
    //populate the first matchups
    let count = 0;
    for (let m of lowestLevel) {
        m.left = new Team(cregion[ORDER[count] - 1], ORDER[count]);
        m.right = new Team(cregion[ORDER[count + 1] - 1], ORDER[count + 1]);
        count += 2;
    }
    // console.log(cregion);
    // for (let m of lowestLevel) {
    //     console.log(m.toString());
    // }

    let currLevel : Array<Matchup> = lowestLevel;
    while (currLevel.length > 1) {
        let nextLevel : Array<Matchup> = [];
        let toggle = true;
        for (let m of currLevel) {
            let w = whoWins(m.left.seed, m.right.seed);
            let winner : Team = (w === true ? m.left : m.right);
            if (m.isLeft === true) {
                m.parent.left = winner;
            } else {
                m.parent.right = winner;
            }
            m.winner = w;
            if (toggle) {
                nextLevel.push(m.parent);
            }
            toggle = !toggle;
        }
        currLevel = nextLevel;
    }

    console.log("region = " + r);
    console.log(regfinal.stringAll());
    
    console.log("-------------------------------------");
}

//true = left win
function whoWins(seedL, seedR) {
    let s = Math.random() * 100;
    let seedDiff = seedR - seedL; //how much more likely L is to win
    //this is y = 0.21777777777x^2 + 50
    //parabola vertex (0, 50) - seedDiff = 0 -> 50% chance L wins 
    //passes through (15, 99) - seedDiff = 15 ->99% chance L wins
    //forgot this needs to be cubic halfway through but we're rolling with it
    let probabiltyLeftWins = 0.21777777777 * (seedDiff * Math.abs(seedDiff)) + 50
    return (s < probabiltyLeftWins);
}