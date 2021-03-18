let bdata = require('bracket-data')({
    year: '2021',
    sport: 'ncaam'
});

const ORDER : Array<Number> = bdata.order;
const REG_SIZE : Number = 16;
const LAYERS : Number = 4;

class Team {
    name: String;
    seed: Number;
    constructor(n : String, s : Number) {
        this.name = n;
        this.seed = s;
    }
}

class Matchup {
    left: Team;
    right: Team;
    childLeft: Matchup | null;
    childRight: Matchup | null;
    constructor() {
        this.left = null;
        this.right = null;
        this.childLeft = null;
        this.childRight = null;
    }
}

for (let r of bdata.constants.REGION_IDS) {
    let cregion = bdata.bracket.regions[r];
    let regfinal : Matchup = {
        left: null,
        right: null,
        childLeft: null,
        childRight: null
    };
}
