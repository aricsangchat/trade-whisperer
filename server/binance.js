const config = require('./config.json');
const binance = require('node-binance-api')().options({
  APIKEY: config.BINANCE_APIKEY,
  APISECRET: config.BINANCE_APISECRET,
  useServerTime: true,
  test: false
});

module.exports = {
  sellAtProfit: function(ticker, interval, quantity, price) {
    binance.websockets.chart(ticker, interval, (symbol, interval, chart) => {
      let tick = binance.last(chart);
      const last = parseFloat(chart[tick].close);
      // console.log(chart);
      // Optionally convert 'chart' object to array:
      // let ohlc = binance.ohlc(chart);
      // console.log(symbol, ohlc);
      if (last.toFixed(4) >= price) {
        module.exports.sell(ticker, quantity, price);
        console.log('sold at ' + last.toFixed(4));
      }
      console.log(symbol + " last price: " + last.toFixed(4))
    });
  },
  marketBuy: function(ticker) {
    binance.marketBuy(ticker, quantity);

  },
  marketSell: function(ticker) {
    binance.marketSell(ticker, quantity);

  },
  getMarketDepth: function(ticker) {
    return new Promise(resolve => {
      binance.depth(ticker, (error, depth, symbol) => {
        //console.log(symbol+" market depth", depth);
        let bids = Object.keys(depth.bids).map(function(key) {
          return parseFloat(key).toFixed(4);
        });
        let asks = Object.keys(depth.asks).map(function(key) {
          return parseFloat(key).toFixed(4);
        });
        //console.log(asks)
        let results = {
          'bids': bids,
          'asks': asks
        }
        resolve(results);
      })
    })
  },
  asyncGetMarketDepth: async function(cb, ticker) {
    let depth =  await module.exports.getMarketDepth(ticker);
    cb(depth)
  },
  buy: function(ticker, quantity, price) {
    binance.buy(ticker, quantity, price);
  },
  sell: function(ticker, quantity, price) {
    binance.sell(ticker, quantity, price);
  }
}