let randNumOld: number | null = null;

const getRandomInt = (min: number, max: number) => {
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randNum === randNumOld) {
        getRandomInt(min, max);
    }
    randNumOld = randNum;
    return randNum;
};

export const getRandomRgbaColor = (alpha: number) => {
    const r = getRandomInt(0, 254);
    const g = getRandomInt(0, 254);
    const b = getRandomInt(0, 254);
    return 'rgba(' + r + ', ' + g + ', ' + b + ',' + alpha + ')';
};
export const getRandomHexColor = () => {
    let r = getRandomInt(0, 254).toString(16);
    let g = getRandomInt(0, 254).toString(16);
    let b = getRandomInt(0, 254).toString(16);
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
};