const obj = {
    name: "李傲松",
    age: 18,
    sex: true,
    get gf() {
        return null;
    },
    subObj: {
        name: "塔菲",
        sex: false,
    },
    fuck() {
        console.log("打搅");
    },
};
console.log(JSON.stringify(obj));
console.log(JSON.stringify(obj, null, "--"));
console.log(JSON.stringify(obj, ["name", "fuck"]));
console.log(
    JSON.stringify(obj, (key, value) => {
        console.log(key);
        if (typeof value == "object") return value;
        else return value + "...";
    })
);
const objWithToJSON = {
    toJSON() {
        return {
            name: "toJSON",
        };
    },
};
console.log(JSON.stringify(objWithToJSON));
const objWithDate = {
    dt: new Date(),
};
const jD = JSON.stringify(objWithDate, function (k, v) {
    if (typeof v === "object") return v;
    else if (v instanceof Date) return v.getMilliseconds();
    return v;
});
console.log(jD);
console.log(
    JSON.parse(jD, (k, v) => {
        if (k === "dt") {
            return new Date(v);
        }
        return v
    })
);

console.log(JSON.stringify([function (params) {

}, undefined, , 1, 3, new Map([[1, 2]]), new Set([1, 2, 3])]))
// '[null,null,null,1,3,[[1,2]],[1,2,3]]'
let m = new Map();
m.set(1, 3)
JSON.stringify(m)//[[1,2]]
let s = new Set()
s.add(3)
JSON.stringify(m)//[3]