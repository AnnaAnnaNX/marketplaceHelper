const {
  ymEffByPrice,
  ymPriceByEff,
  ozonEffByPrice,
  ozonPriceByEff,
} = require('./index');

describe.skip('old test', () => {
  test('ymEffByPrice', () => {
    console.log('ymEffByPrice');
    expect(ymEffByPrice(
      3990,
      0,
      0.07,
      0.01,
      0,
      'МГ'
    ).eff).toBeCloseTo(0.29, 2);

    // todo: тест для КГ
  });

  test('ymPriceByEff', () => {
      console.log('ymPriceByEff');
      expect(ymPriceByEff(
        0.29,
        122.2,
        0.05,
        0.013,
        0,
        'МГ'
      )).toBeCloseTo(280, 0);

      // todo: тест для КГ
    });

    test('ozonEffByPrice', () => {
      console.log('ozonEffByPrice');
      expect(ozonEffByPrice(
        281.6,
        120.84,
        0.08,
        0,
        0.2,
        'МГ'
      ).eff).toBeCloseTo(0.3, 2);

      // todo: тест для КГ
    });

    test('ozonPriceByEff', () => {
      console.log('ozonPriceByEff');
      expect(ozonPriceByEff(
        0.3,
        120.84,
        0.08,
        0,
        0.2,
        'МГ'
      )).toBeCloseTo(281.6, 1);
      
      // todo: тест для КГ
    });
});