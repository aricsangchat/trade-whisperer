const express = require('express')
const app = express();
const emailAlert = require('./emailAlert');
const bodyParser = require('body-parser');
const binance = require('./binance');
const ticker = 'BNBUSDT';
const quantity = 75;
let boughtPrice = null;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

binance.asyncGetMarketDepth(depth => {
  console.log(depth.bids[0], depth.asks[0])
  const price = parseFloat(depth.bids[0]) + 0.005;
  console.log(price.toFixed(4))
}, ticker)

// test email
emailAlert.sendAlert('test');

app.get('/', (req, res) => res.send({test: 'Hello World!'}))
app.post('/action', (req, res) => {
  console.log(req.body);
  if (req.body.action === 'buy') {
    // Get latest bid & Buy
    binance.asyncGetMarketDepth(depth => {
      const price = parseFloat(depth.bids[0]) + 0.005;
      boughtPrice = price;
      binance.buy(ticker, quantity, price.toFixed(4));
      // binance.sellAtProfit(ticker, '1m', quantity, price.toFixed(4));
    }, ticker)
    // send alert email of purchase
    emailAlert.sendAlert(req.body.action);
  } else if (req.body.action === 'sell') {
    // Get latest ask & Sell
    binance.asyncGetMarketDepth(depth => {
      const price = parseFloat(depth.asks[0]) - 0.005;
      // if (price > boughtPrice && boughtPrice !== null) {
        binance.sell(ticker, quantity, price.toFixed(4));
        // boughtPrice = null;
      // } else {
      //   // send alert email of sell
      //   emailAlert.sendAlert('Losing Sale');
      // }
    }, ticker)
    // send alert email of sell
    emailAlert.sendAlert(req.body.action);
  }
  res.send(req.body)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))