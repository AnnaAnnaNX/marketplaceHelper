const { objOzonWeight } = require('../ozonReferenceData/delevery');

const fixPersent = (val) => {
    if (val >= 1) val /= 100;
    if ((val < 1) && (val >= 0)) {
        return val;
    }
    throw new Error(`invalid persent ${val}`);
}

const fixMinMax = (val, minim, maxim) => {
    if (val < minim) return minim;
    if (val > maxim) return maxim;
    return val;
}

const ymEffByPrice = (
    price,
    purchase, // закупка
    persentCommission, // витрина
    persentAcceptance, // прием товара
    persentAdv,
    mgOrKg, // 'МГ', 'КГ'
) => {
    persentCommission = fixPersent(persentCommission);
    persentAcceptance = fixPersent(persentAcceptance);
    persentAdv = fixPersent(persentAdv);

    let delivery = null;
    if (mgOrKg === 'МГ') {
        delivery = fixMinMax(price * 0.05, 60, 350);
    } else {
        delivery = 400;
    }
    // console.log('delivery');
    // console.log(delivery);
    const commission = price * (persentCommission + persentAcceptance) + delivery + 45;
    const eff = (price - purchase - commission - persentAdv*price) / purchase;
    return {
        eff,
        commission
    };
};

const ymPriceByEff = (
    eff,
    purchase, // закупка
    persentCommission, // комиссия маркетплейса (витрина)
    persentAcceptance, // прием товара
    persentAdv,
    mgOrKg, // 'МГ', 'КГ'
) => {
    persentCommission = fixPersent(persentCommission);
    persentAcceptance = fixPersent(persentAcceptance);
    persentAdv = fixPersent(persentAdv);

    let price = null;
    const val = purchase * eff + purchase;
    if (mgOrKg === 'КГ') {
        price = (val + 45 + 400)/(1 - persentCommission - persentAcceptance - persentAdv);
    } else {
        priceMin = (val + 45 + 60)/(1 - persentCommission - persentAcceptance - persentAdv);
        priceMax = (val + 45 + 350)/(1 - persentCommission - persentAcceptance - persentAdv);
        pricePercent = (val + 45)/(1 - persentCommission - persentAcceptance - persentAdv - 0.05);

        const checkDelivery = pricePercent * 0.05;
        if (checkDelivery < 60) price = priceMin
            else if (checkDelivery > 350) price = priceMax
            else price = pricePercent;
    }
    return price;
};

const ozonEffByPrice = (
    price,
    purchase, // закупка
    persentCommission, // комиссия маркетплейса
    persentAdv,
    weight,
    mgOrKg, // 'МГ', 'КГ'
) => {
    persentCommission = fixPersent(persentCommission);
    persentAdv = fixPersent(persentAdv);

    let delivery = null;

    if (mgOrKg === 'КГ') {
        delivery = fixMinMax(price * 0.08, 1000, 1400); // + 11 * weight;
    } else {
        const transformWeight = weight.toString().replace('.', ',');
        if (!objOzonWeight[transformWeight]) throw new Error(`not data for weight ${weight}`);
        const persent = parseFloat(objOzonWeight[transformWeight].persent) / 100;
        const minim = parseFloat(objOzonWeight[transformWeight].minim);
        const maxim = parseFloat(objOzonWeight[transformWeight].maxim);
        delivery = fixMinMax(price * persent, minim, maxim) + fixMinMax(price * 0.05, 60, 350);
    }
    
    const eff = (price - purchase - persentCommission * price - delivery - persentAdv * price)/purchase;
    return {
        eff,
        commission: persentCommission * price + delivery
    };
};

const checkOzonVal = (
    price,
    name,
    persent1,
    min1,
    max1,
    persent2,
    min2,
    max2
) => {
    const val1 = price * persent1;
    if (/^Min/.test(name)) {
        if (val1 > min1) return false;
    }
    if (/^Max/.test(name)) {
        if (val1 < max1) return false;
    }
    if (/^Persent/.test(name)) {
        if (!((val1 >= min1) && (val1 <= max1))) return false;
    }
    
    const val2 = price * persent2;
    if (/Min$/.test(name)) {
        if (val2 > min2) return false;
    }
    if (/Max$/.test(name)) {
        if (val2 < max2) return false;
    }
    if (/Persent$/.test(name)) {
        if (!((val2 >= min2) && (val1 <= max2))) return false;
    }
    return true;
}

const ozonPriceByEff = (
    eff,
    purchase, // закупка
    persentCommission, // комиссия маркетплейса
    persentAdv,
    weight,
    mgOrKg, // 'МГ', 'КГ'
) => {
    persentCommission = fixPersent(persentCommission);
    persentAdv = fixPersent(persentAdv);
    
    let price = null;
    const val = purchase * eff + purchase;
    if (mgOrKg === 'МГ') {
        const transformWeight = weight.toString().replace('.', ',');
        if (!objOzonWeight[transformWeight]) throw new Error(`not data for weight ${weight}`);
        const persent = parseFloat(objOzonWeight[transformWeight].persent) / 100;
        const minim = parseFloat(objOzonWeight[transformWeight].minim);
        const maxim = parseFloat(objOzonWeight[transformWeight].maxim);

        // todo simplify check
        const prices = {};
        prices['MinMin'] = (val + minim + 60)/(1 - persentCommission - persentAdv);
        prices['MinPersent'] = (val + minim)/(1 - persentCommission - persentAdv - price * 0.05);
        prices['MinMax'] = (val + minim + 350)/(1 - persentCommission - persentAdv);
        
        prices['PersentMin'] = (val + 60)/(1 - persentCommission - persentAdv - price * persent);
        prices['PersentPersent'] = (val)/(1 - persentCommission - persentAdv - price * persent - price * 0.05);
        prices['PersentMax'] = (val + 350)/(1 - persentCommission - persentAdv - price * persent);
        
        prices['MaxMin'] = (val + maxim + 60)/(1 - persentCommission - persentAdv);
        prices['MaxPersent'] = (val + maxim)/(1 - persentCommission - persentAdv - price * 0.05);
        prices['MaxMax'] = (val + maxim + 350)/(1 - persentCommission - persentAdv);

        const avaluableValues = Object.keys(prices).filter((name) => (checkOzonVal(
            prices[name],
            name,
            persent,
            minim,
            maxim,
            0.05,
            60,
            350
        )));

        // const check1 = [
        //     prices['PersentMin'] * persent,
        //     prices['PersentPersent'] * persent,
        //     prices['PersentMax'] * persent
        // ];
        // const check2 = [
        //     prices['MinPersent'] * 0.05,
        //     prices['PersentPersent'] * 0.05,
        //     prices['MaxPersent'] * 0.05
        // ];

        // let zn1IsMin = 0;
        // if (check1[0] < minim) zn1IsMin++;
        // if (check1[1] < minim) zn1IsMin++;
        // if (check1[2] < minim) zn1IsMin++;
        // let zn1IsMax = 0;
        // if (check1[0] > maxim) zn1IsMax++;
        // if (check1[1] > maxim) zn1IsMax++;
        // if (check1[2] > maxim) zn1IsMax++;

        // let zn2IsMin = 0;
        // if (check2[0] < minim) zn2IsMin++;
        // if (check2[1] < minim) zn2IsMin++;
        // if (check2[2] < minim) zn2IsMin++;
        // let zn2IsMax = 0;
        // if (check2[0] > maxim) zn2IsMax++;
        // if (check2[1] > maxim) zn2IsMax++;
        // if (check2[2] > maxim) zn2IsMax++;

        // let key = '';
        // if (zn1IsMin >= 2) key = 'Min'
        //     else if (zn1IsMax >= 2) key = 'Max'
        //     else key = 'Persent';
        // if (zn2IsMin >= 2) key += 'Min'
        // else if (zn2IsMax >= 2) key += 'Max'
        // else key += 'Persent';

        if (avaluableValues) {
            price = prices[avaluableValues[0]];
        } else price='-';
    } else {
        const priceMin = (val + 11 * weight)/(1 - persentCommission - persentAdv - 1000);
        const priceMax = (val + 11 * weight)/(1 - persentCommission - persentAdv - 1400);
        const pricePersent = (val + 11 * weight)/(1 - persentCommission - persentAdv - price * 0.08);

        const checkDelivery = pricePersent * 0.08;
        if (checkDelivery < 1000) price = priceMin
            else if (checkDelivery < 1400) price = priceMax
            else price = pricePersent;
    }

    return price;
};

module.exports = {
    ymEffByPrice,
    ymPriceByEff,
    ozonEffByPrice,
    ozonPriceByEff,
}