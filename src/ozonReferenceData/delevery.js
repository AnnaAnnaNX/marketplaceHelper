const { text } = require('./deleveryData');

const rows = text.split('\n');
const mas = rows.map((el) => (el.split('\t')));
const obj = {};
mas.map(el => {
    const weight = el[0];
    obj[weight.toString()] = {
        persent: el[2],
        minim: el[3],
        maxim: el[4]
    }
});

module.exports = {
    objOzonWeight: obj
};