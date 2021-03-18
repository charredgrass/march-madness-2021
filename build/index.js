var bdata = require('bracket-data')({
    year: '2021',
    sport: 'ncaam'
});
var ORDER = bdata.order;
var REG_SIZE = 16;
var LAYERS = 4;
var Team = (function () {
    function Team(n, s) {
        this.name = n;
        this.seed = s;
    }
    Team.prototype.toString = function () {
        return this.name + "(" + this.seed + ")";
    };
    return Team;
}());
var Matchup = (function () {
    function Matchup(p) {
        this.left = null;
        this.right = null;
        this.childLeft = null;
        this.childRight = null;
        this.parent = p;
    }
    Matchup.prototype.toString = function () {
        return (this.left ? this.left.toString() : "not populated(-)")
            + " vs " +
            (this.right ? this.right.toString() : "not populated(-)");
    };
    Matchup.prototype.stringAll = function () {
        return (this.childLeft ? this.childLeft.stringAll() : "") + "\n" +
            this.toString() +
            (this.childRight ? this.childRight.stringAll() : "");
    };
    return Matchup;
}());
for (var _i = 0, _a = bdata.constants.REGION_IDS; _i < _a.length; _i++) {
    var r = _a[_i];
    var cregion = bdata.bracket.regions[r].teams;
    var regfinal = new Matchup(null);
    var lowestLevel = [regfinal];
    while (lowestLevel.length < (REG_SIZE / 2)) {
        var temp = [];
        for (var _b = 0, lowestLevel_1 = lowestLevel; _b < lowestLevel_1.length; _b++) {
            var m = lowestLevel_1[_b];
            var left = new Matchup(m);
            var right = new Matchup(m);
            temp.push(left);
            temp.push(right);
            m.childLeft = left;
            m.childRight = right;
        }
        lowestLevel = temp;
    }
    var count = 0;
    for (var _c = 0, lowestLevel_2 = lowestLevel; _c < lowestLevel_2.length; _c++) {
        var m = lowestLevel_2[_c];
        m.left = new Team(cregion[ORDER[count] - 1], ORDER[count]);
        m.right = new Team(cregion[ORDER[count + 1] - 1], ORDER[count + 1]);
        count += 2;
    }
    console.log(regfinal.stringAll());
    break;
}
