pragma solidity ^0.4.0;

contract ethLottery{


    address public owner;
    mapping (uint256 => uint256) public winnerHistory;
    uint period = 1;
    uint currentNum = 0;
    uint256[] lotteryArrays ;
    uint16 index = 0;
   //uint16 numTemp = 0;

    event MessageLottery(
      address indexed _from,
      uint _lottery,
      uint _period
     // string _m
    );

    function ethgLottery() public payable{
        owner = msg.sender;
    }

    function () public payable{
        if(msg.value < 1000000000000000) return;
        currentNum += msg.value/(1000000000000000);
        if(currentNum>1000){

            msg.sender.transfer((currentNum-1000)*1000000000000000);
            currentNum = 1000;
        }

        msg.sender.transfer(currentNum*10+1);
        MessageLottery(msg.sender, currentNum*10+1, period);

        uint256 lottery = 0;
        lottery |= currentNum << 240;
        lottery |= uint(msg.sender);
        if(index == lotteryArrays.length) {
            lotteryArrays.push(lottery);
        }else{
            lotteryArrays[index] = lottery;
        }
        index++;

        if(currentNum >= 1000){

            uint256 number = 0 ;
            uint256 random = uint16(randomNum()%1000+1);
            number |= random <<240;

            number = lotteryArrays[pickWinner(number)];

            number = number & (1766847064778384329583297500742918515827483896875618958121606201292619775);
            address winnerAddr = address(number);

            currentNum = 0 ;

            index = 0;

            uint256 winner = 0;
            winner |= random <<168;
            winner |= block.number << 184;
            winner |= uint(winnerAddr);

            winnerHistory[period] = winner;

            period++;
            if(this.balance >= 999000000000000000){
                winnerAddr.transfer(990000000000000000);
                msg.sender.transfer(4000000000000000);
            }else{
                winnerAddr.transfer(this.balance*99/100);
            }
        }
    }

    function pickWinner(uint num) internal returns (uint){
        if(index==1) return 0;
        if(num < lotteryArrays[0]) return 0;

        uint low = 0;
        uint high = index-1;
        while(low < high ){
            uint middle = (low+high)/2;
            if(low+1 == high){
                return high;
            }
            if(num > lotteryArrays[middle]){
                low = middle;
            }else{
                high = middle;
            }
        }
        return 0;
    }

    function randomNum() view internal returns (uint) {
        uint bhash = uint(block.blockhash(block.number));
        uint num = bhash + (block.timestamp * (block.difficulty + period));
        num = uint(keccak256(num));
        return num;
    }

    function getWinner(uint pd) view public returns(address,uint, uint ){
        uint winner = winnerHistory[pd];
        uint blockNo = winner >>184;
        uint prizeNo = (winner << 72) >>240 ;
        uint addressNo = (winner << 88) >> 88;
        return (address(addressNo),prizeNo,blockNo);
    }

    function getEthers(address addr ,uint amount) public payable{
        if(msg.sender != owner) return;
        addr.transfer(amount);
    }

    function getBalance() view public returns(uint){
        return this.balance;
    }

    function getCurrentPeriod() view public returns(uint){
        return period;
    }

    //  function sendEther() payable{
    //   bool result = this.send(msg.value);
    // }

    function getCurrentNumber()view public returns(uint){
        return currentNum;
    }


}
