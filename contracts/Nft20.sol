// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;


import "./Erc20.sol";
import "./Erc721.sol";

contract NFTstaker{
    erc20 token;
    Erc721 nft;
    constructor(erc20  _addressERC20,Erc721  _addressERC721){
        token = _addressERC20;
        nft = _addressERC721;
    }
    uint public itemId=1;
    struct item{
        string itemName;
        string itemDescription;
        address itemOwner;
        address recipient;
        uint price;
        bool approvalByOwner ;
        bool approvalBySeller;
        uint NFTcreated;

        }
    mapping (uint => item) public Item;
    

    function ItemReg(string memory _itemName,string memory _itemDes,uint Price) public returns(uint id)
    {
        Item[itemId] = item({
                itemName : _itemName,
                itemDescription : _itemDes,
                itemOwner : msg.sender,
                recipient : address(0),
                price : Price,
                approvalByOwner : false,
                approvalBySeller : false,
                NFTcreated : 0
                });
        itemId++;
        return itemId-1;
    }
    function BuyItem(uint Id) public returns(uint nftId)  {
        require(Id < itemId,"item doesn't Exists");
        require(Item[Id].itemOwner != msg.sender,"owner can't buy");
        require(Item[Id].recipient == address(0),"there is already a seller");
        token.mint(Item[Id].price);
        token.transfer(address(this),Item[Id].price);
        uint nftID = nft.publicMint(msg.sender);
        Item[Id].recipient = msg.sender;
        Item[Id].NFTcreated = nftID;
        return nftID;
        }

    function approveItem(uint Id , bool Approval) public returns(string memory){
        require(Id < itemId,"item doesn't Exists");
        if(msg.sender == Item[Id].itemOwner){
            Item[Id].approvalByOwner = Approval;
            return "owner had approved the item";
        }
        else if(msg.sender == Item[Id].recipient){
            Item[Id].approvalBySeller = Approval;
            return "seller had approved the item";
        }
        else{
            return "you are not a seller or buyer so can't approve this id";
        }
    }

    function transferOwnership(uint Id) public returns(string memory){
        require(Item[Id].approvalByOwner == true && Item[Id].approvalBySeller == true,"firstly get approval");
        require(msg.sender == Item[Id].itemOwner,"only owner can transfer ownership");
        token.approve(address(this),address(this),Item[Id].price);
        token.approve(address(this),Item[Id].itemOwner,Item[Id].price);
        token.approve(address(this),Item[Id].recipient,Item[Id].price);
        
        token.transferFrom(address(this),Item[Id].itemOwner,Item[Id].price);
        Item[Id].itemOwner = Item[Id].recipient;
        Item[Id].recipient = address(0);
        Item[Id].price = 0;
        Item[Id].approvalByOwner = false;
        Item[Id].approvalBySeller = false;
        nft.burnNft(Item[Id].NFTcreated);
        Item[Id].NFTcreated = 0;
        return "ownership transfer successfully";


    }
    
    function cancelItemOrder(uint Id) public returns(string memory){
        require(msg.sender == Item[Id].itemOwner || msg.sender == Item[Id].recipient,"only buyer or seller can cancel the the item");
        token.approve(address(this),address(this),Item[Id].price);
        token.approve(address(this),Item[Id].itemOwner,Item[Id].price);
        token.approve(address(this),Item[Id].recipient,Item[Id].price);
        token.transferFrom(address(this),Item[Id].recipient,Item[Id].price);
        Item[Id].recipient = address(0);
        
        Item[Id].price = 0;
        Item[Id].approvalByOwner = false;
        Item[Id].approvalBySeller = false;
        nft.burnNft(Item[Id].NFTcreated);
        Item[Id].NFTcreated = 0;
        return "item canceled";

    }
    


}