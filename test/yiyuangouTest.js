var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8546'))

console.log(web3.version.api)
console.log(web3.version.network)

var contractAddress = '0x40f8ffabe8c730e902d0d18c564291f546f4a9e7'

var finneyContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"getCurrentPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sendEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"winnersResult","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"amount","type":"uint256"}],"name":"getEthers","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pd","type":"uint256"}],"name":"getPrizeResult","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_period","type":"uint256"}],"name":"Messagea","type":"event"}])


  //var finney = finneyContract.at('0x57a5ee3983124cb4496b26a5927eac553f2e957d')
var finney = finneyContract.at(contractAddress)

console.log(finney.getBalance().toString())

web3.eth.sendTransaction({from:'0x66b427db5fe3574aa135c23d55b92814548d7541', to: contractAddress, value: web3.toWei(0.006), gas: 500000})

var balance = + finney.getBalance().toString()
console.log(balance/1000000000000000)

var winner;
var period = 1;
var currentPeriod = finney.getCurrentPeriod();
function refresh() {
  currentPeriod = finney.getCurrentPeriod();
  if(currentPeriod > period) {
    winner = finney.getPrizeResult(period);
    period = currentPeriod;
    console.log(winner);
    //console.log(typeof(winner))
    //console.log(typeof(winner[2].c[0]))
    console.log('prize: ' + winner[1].c[0])
    console.log('block: ' + winner[2].c[0])
  }
  setTimeout(refresh, 1000);
}
var timeTic = setTimeout(refresh, 1000);
var stop = setTimeout(function(){
  clearTimeout(timeTic);
}, 300000);




var event = finney.Messagea({_from:'0x66b427db5fe3574aa135c23d55b92814548d7541'})

event.watch(function(error, result){
  if(!error) {
    console.log(result)
    console.log(result.args._value.c[0])
    console.log(result.args._period.c[0])
    //event.stopWatching();
  }
})

// event.watch(function(error, result){
//   if(!error){
//     console.log(result);
//     console.log(result.args._value.c[0])
//   }
// });
