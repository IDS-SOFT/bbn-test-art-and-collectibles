// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArtCollectibleContract {
    address owner;

    string public itemName;
    string public itemDescription;
    uint256 public itemPrice;
    address public i_am_owner;
    bool public isListedForSale;

    event ItemListed(uint256 price);
    event ItemSold(address indexed buyer, uint256 price);
    event ItemUnlisted();
    event CheckBalance(uint amount);

    constructor(
        string memory _name,
        string memory _description,
        uint256 _price
    ) {
        itemName = _name;
        itemDescription = _description;
        itemPrice = _price;
        i_am_owner = msg.sender;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function listForSale(uint256 price) external onlyOwner {
        require(!isListedForSale, "Item is already listed for sale");

        itemPrice = price;
        isListedForSale = true;
        emit ItemListed(price);
    }

    function unlistForSale() external onlyOwner {
        require(isListedForSale, "Item is not listed for sale");

        isListedForSale = false;
        emit ItemUnlisted();
    }

    function purchaseItem() external payable {
        require(isListedForSale, "Item is not listed for sale");
        require(msg.value >= itemPrice, "Insufficient funds");

        address previousOwner = i_am_owner;
        i_am_owner = msg.sender;
        isListedForSale = false;
        payable(previousOwner).transfer(msg.value);
        emit ItemSold(msg.sender, msg.value);
    }
    
    function getBalance(address user_account) external returns (uint){
       uint user_bal = user_account.balance;
       emit CheckBalance(user_bal);
       return (user_bal);
    }
}
