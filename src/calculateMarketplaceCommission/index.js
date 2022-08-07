const fixPersent = (val) => {
    if (val > 1) val /= 100;
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
    const commission = price * (persentCommission + persentAcceptance) + delivery + 45;
    const eff = (price - purchase - commission) / purchase;
    return eff;
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
) => {};

const ozonPriceByEff = (
    eff,
    purchase, // закупка
    persentCommission, // комиссия маркетплейса
    persentAdv,
    weight,
    mgOrKg, // 'МГ', 'КГ'
) => {};

module.exports = {
    ymEffByPrice,
    ymPriceByEff,
    ozonEffByPrice,
    ozonPriceByEff,
}