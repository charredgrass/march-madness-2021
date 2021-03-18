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
    constructor(p : Matchup) {
        this.left = null;
        this.right = null;
        this.childLeft = null;
        this.childRight = null;
        this.parent = p;
        this.winner = null;
    }
    toString() {
        return (this.left ? this.left.toString() : "not populated(-)") 
            + " vs " +
            (this.right ? this.right.toString() : "not populated(-)");
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
    let regfinal : Matchup = new Matchup(null);
    let lowestLevel : Array<Matchup> = [regfinal];
    while (lowestLevel.length < (REG_SIZE / 2)) {
        let temp : Array<Matchup> = [];
        for (let m of lowestLevel) {
            let left = new Matchup(m);
            let right = new Matchup(m);
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
    console.log(regfinal.stringAll());
    break;
}

//true = left win
function whoWins(seedL, seedR) : boolean {
    let s = Math.random() * 100 ;
    return true;
}