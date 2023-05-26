// SPDX-License-Identifier: UNLICENCED

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract Erc721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string uri;

    constructor() ERC721("MyToken", "MTK") {}

    function publicMint(address recipient ) public returns (uint256) {
        uri = "https://gateway.pinata.cloud/ipfs/QmeYJGC16JBj79B8PLCsHHJxhpsj8zQuzKKcq9VRq8eELa/";

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(
            newItemId,
            string(abi.encodePacked(uri, Strings.toString(newItemId), ".json"))
        );
        return newItemId;
    }

    function burnNft(uint Id) public {
        _burn(Id); 
    }
    
}