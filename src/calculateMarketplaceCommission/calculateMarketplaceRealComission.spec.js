const {
  ymEffByPrice,
  ozonEffByPrice,
} = require('./index');

describe.skip('ym test', () => {
  test('ymEffByPrice 118406', () => {
    // console.log('118406d');
    expect(ymEffByPrice(
      3990,
      2500,
      0.07,
      0.01,
      0,
      'МГ'
    ).commission).toBeCloseTo(563.7, 0);

    // todo: тест для КГ
  });

  test('ymEffByPrice', () => {
    // console.log('ymEffByPrice 114929');
    expect(ymEffByPrice(
      3800,
      2500,
      0.07,
      0.01,
      0,
      'МГ'
    ).commission).toBeCloseTo(539, 0);

    // todo: тест для КГ
  });

  test('ymEffByPrice', () => {
    // console.log('ymEffByPrice 19172');
    expect(ymEffByPrice(
      5278,
      4000,
      0.07,
      0.01,
      0,
      'КГ'
    ).commission).toBeCloseTo(867.24, 0);

    // todo: тест для КГ
  });

  test('ymEffByPrice', () => {
    // console.log('ymEffByPrice 19167');
    expect(ymEffByPrice(
      2062,
      1500,
      0.07,
      0.01,
      0,
      'КГ'
    ).commission).toBeCloseTo(609.96, 0);

    // todo: тест для КГ
  });
});

describe('ozon test', () => {
  test('ozonEffByPrice 100788', () => {
    console.log('ozonEffByPrice 100788');
    expect(ozonEffByPrice(
      1090,
      800,
      0.08,
      0,
      1.4,
      'МГ'
    ).commission).toBeCloseTo(214, -1);

    // todo: тест для КГ
  });
  
  test('ozonEffByPrice 101870', () => {
    console.log('ozonEffByPrice 101870');
    expect(ozonEffByPrice(
      3130,
      2000,
      0.05,
      0,
      3.4,
      'МГ'
    ).commission).toBeCloseTo(485, -1);

    // todo: тест для КГ
  });
  
  test('ozonEffByPrice 118044', () => {
    console.log('ozonEffByPrice 118044');
    expect(ozonEffByPrice(
      550,
      480,
      0.08,
      0,
      0.1,
      'МГ'
    ).commission).toBeCloseTo(145, -1);

    // todo: тест для КГ
  });

  test('ozonEffByPrice 110904', () => {
    console.log('ozonEffByPrice 110904в');
    expect(ozonEffByPrice(
      49500,
      48000,
      0.1,
      0,
      68.3,
      'КГ'
    ).commission).toBeCloseTo(6350, -1);

    // todo: тест для КГ
  });
  
  // test('ozonEffByPrice 113314', () => {
  //   console.log('ozonEffByPrice 113314');
  //   expect(ozonEffByPrice(
  //     4990,
  //     4000,
  //     0.05,
  //     0,
  //     55.2,
  //     'КГ'
  //   ).commission).toBeCloseTo(1149, -1);

  //   // todo: тест для КГ
  // });
  
  // test('ozonEffByPrice', () => {
  //   console.log('ozonEffByPrice 104828');
  //   expect(ozonEffByPrice(
  //     4550,
  //     4000,
  //     0.05,
  //     0,
  //     59.6,
  //     'КГ'
  //   ).commission).toBeCloseTo(1105, -1);

  //   // todo: тест для КГ
  // });
});