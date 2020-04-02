pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => House) public houses;

    struct House {
        uint id;
        string name;
        uint price;
        string bhk;
        string location;
        address payable owner;
        address payable rentee;
        bool purchased;
    }

    event HouseCreated(
        uint id,
        string name,
        uint price,
        string bhk,
        string location,
        address payable owner,
        address payable rentee,
        bool purchased
    );

    event HouseRented(
        uint id,
        string name,
        uint price,
        string bhk,
        string location,
        address payable owner,
        address payable rentee,
        bool purchased
    );

    event HouseReturned(
        uint id,
        string name,
        uint price,
        string bhk,
        string location,
        address payable owner,
        address payable rentee,
        bool purchased
    );

    constructor() public {
        name = "Mahanthesh Marketplace";
    }

    function createHouse(string memory _name, uint _price, string memory _bhk, string memory _location) public {
        //Require a valid name
        require(bytes(_name).length > 0);
        require(_price > 0);

        //Require a valid price 

        //Make sure param are correct
        //Increment product count
        productCount ++;
        //Create the product
        houses[productCount] = House(productCount, _name, _price, _bhk, _location, msg.sender, address(0x0),false);
        //Trigger event
        emit HouseCreated(productCount, _name, _price, _bhk, _location, msg.sender, address(0x0),false);

    }

    function rentHouse(uint _id) public payable{
        //Fetch the product
        House memory _house = houses[_id];
        //Fetch Owner
        address payable _seller = _house.owner;
        //Make sure the product is valid with valid id
        require(_house.id > 0 && _house.id <= productCount);
        //Require that there is enough ether
        require(msg.value >= _house.price);
        //Require that house has not been rented already
        require(!_house.purchased);
        //Require that the buyer is not the seller
        require(_seller != msg.sender);
        //Transfer ownership to rantee
       // _house.owner = msg.sender;
       _house.rentee = msg.sender;
        //Mark as purchased
        _house.purchased = true;
        //update the product
        houses[_id] = _house;
        //Pay the seller by sending them ether
        address(_seller).transfer(msg.value);
        //Trigger Event
       //  emit HouseRented(productCount, _house.name, _house.price, _house.bhk, _house.location, msg.sender,_house.rentee, true);
       emit HouseRented(productCount, _house.name, _house.price, _house.bhk, _house.location, _house.owner, _house.rentee, true);


    }

    //allow house owner to mark house as returned.
    function returnHouse(uint _id) public{
         //Fetch the product
        House memory _house = houses[_id];
        require(_house.owner == msg.sender);
        //Make House available again
        _house.purchased = false;
        //Remove Previous rentee
        _house.rentee = address(0x0);
        //update product
        houses[_id] = _house;
        //Trigger an Event
        emit HouseReturned(productCount, _house.name, _house.price, _house.bhk, _house.location, _house.owner, _house.rentee, false);
    }

    // function verifyOwnership(uint _id, address _rentee) public view returns(bool){
    //     //Fetch the product 
    //     House memory _house = houses[_id];
    //     require(_house.rentee == _rentee);
    //     //check if the house is purchased and the _rentee is same as the _house.rentee
    //     if(_house.purchased == true && _house.rentee == _rentee){
    //         return true;
    //     }else {
    //         return false;
    //     }
    // }

}