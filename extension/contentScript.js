let position = [];
let status = [];

window.setTimeout(function(){
  scrollBottomTradeContainer()
  $('#tv-toasts').css('display', 'none');
}, 5000)

window.setInterval(function(){
  var d = new Date();
  position.push($("div > div > div > table > tbody:nth-child(7) > tr:nth-child(2) > td.trade-x-type").text());
  status.push($("div > div > div > table > tbody:nth-child(7) > tr:nth-child(2) > td.trade-x-comment.comment").text());

  // console.log($("div > div > div > table > tbody:nth-child(7) > tr:nth-child(2) > td.trade-x-type").text());

  // console.log($("div > div > div > table > tbody:nth-child(7) > tr:nth-child(2) > td.trade-x-comment.comment").text());

  if (position[0] === 'Exit Short' && (status[0] === 'Open' && (position[1] === 'Exit Short' && status[1] === 'RSI_BB_L'))) {
    scrollBottomTradeContainer()
    console.log('Buy', d);
    callNodeServer('buy')
    console.log(position, status);
  } else if (position[0] === 'Exit Long' && (status[0] === 'Open' && (position[1] === 'Exit Long' && status[1] === 'RSI_BB_S'))) {
    scrollBottomTradeContainer()
    console.log('Sell', d);
    callNodeServer('sell')
    console.log(position, status);
  }

  if (position.length > 2) {
    position.shift();
    status.shift();
  }

  // console.log(position, status);
  
}, 60000)

function callNodeServer(action) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://localhost:3000/action', true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({action: action}));
}

function scrollBottomTradeContainer() {
  // get height of container
  let height = $('#bottom-area > div.bottom-widgetbar-content.backtesting > div.backtesting-content-wrapper > div > div > div').outerHeight();
  // set scroll to height of container
  $('#bottom-area > div.bottom-widgetbar-content.backtesting > div.backtesting-content-wrapper > div > div').scrollTop(height);
}