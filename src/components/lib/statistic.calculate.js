const statisticCaculate = (data) => {
  let sum = 0;
  let result = {};
  let dateMin = 15805152000000;
  for (let item of data) {
    if (item.symbol.substr(item.symbol.length - 4) !== 'USDT') continue;
    let date = new Date(parseInt(item.closeDate));
    if (date.getTime() < 1580515200000) continue;
    if (date.getTime() < dateMin) dateMin = date.getTime();

    let year = date.getFullYear();
    let month = date.getMonth();
    if (result[year] === undefined) {
      result[year] = {};
    }
    if (result[year][month] === undefined) {
      result[year][month] = 0;
    }

    if (item.profit) {
      result[year][month] +=
          item.profit.tp0 + item.profit.tp1 + item.profit.tp2 + item.profit.tp3;
      sum +=
          item.profit.tp0 + item.profit.tp1 + item.profit.tp2 + item.profit.tp3;
    }
  }
  return {sum, result, dateMin};
};

export default statisticCaculate;
