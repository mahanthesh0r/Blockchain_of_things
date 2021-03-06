pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    uint public ipfsCount = 0;
    string public ipfsHash;
   // uint public index = 0;
    mapping(uint => House) public houses;
    mapping(uint => Ipfs) public ipfs;

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
    struct Ipfs {
        uint ipfs_id;
        uint house_id;
        string IPFS_Hash;
        address payable rentee;
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
         //Require a valid price
        require(_price > 0);
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
        //Add the rentee address to allRentee Array
       // _house.allRentee[index] = _house.rentee;
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


    function sendHash(uint _id,string memory x) public {
        ipfsHash = x;
        //Fetch the product
        House memory _house = houses[_id];
        //Make sure the product is valid with valid id
        require(_house.id > 0 && _house.id <= productCount, "Product invalid");
        //Require that house has  been rented
        require(_house.purchased, "House has not been rented");
        //Require that the buyer is not the seller
        address payable _seller = _house.owner;
        require(_seller != msg.sender, "Buyer cannot be the owner");
        //Fetch the rentee
        address payable rentee = _house.rentee;
        //Increment ipfs count
        ipfsCount ++;
        //Fetch the IPFS struct
        ipfs[ipfsCount] = Ipfs(ipfsCount,_id,x,rentee);
    }

    function getHash(uint _id) public view returns (string memory x) {
        //Fetch ipfs value
        for (uint i = 1; i<=ipfsCount; i++){
             Ipfs memory _ipfs = ipfs[i];
             if(_ipfs.house_id == _id){
                  return _ipfs.IPFS_Hash;
             }
        }
    }

    function verifyQR(uint _id, address verifyRentee) public view returns (bool ){
        //fetch House details
        House memory _house = houses[_id];
        //Verify the rentee
        if(_house.purchased){
            if(verifyRentee == _house.rentee){
                //Verified
                return true;
            } else{
                //Not Verified
                return false;
            }
        }else {
            //Not Verified
            return false;
        }
    }



}