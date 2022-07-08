// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// Following required for : Required interface of an ERC721 compliant contract.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Now our contract inherits from ERC721 contract.
contract Land is ERC721{

    uint public cost = 0.01 ether;
    uint public maxSupply = 5;
    uint public totalSupply = 0;

    struct Building{
        string name;
        address owner;
        int posX;
        int posY;
        int posZ;
        uint sizeX;
        uint sizeY;
        uint sizeZ;
    }

    Building[] public buildings;

    // In solidity we have two type of strings : 1) memory : temporary storage, 2) storage : permanent storage

    constructor(string memory _name,string memory _symbol,uint _cost) ERC721(_name,_symbol){
        cost=_cost;
        buildings.push(
            Building("City Hall", address(0x0), 0, 0, 0, 10, 10, 10)
        );
        buildings.push(
            Building("Stadium", address(0x0), 0, 10, 0, 10, 5, 3)
        );
        buildings.push(
            Building("University", address(0x0), 0, -10, 0, 10, 5, 3)
        );
        buildings.push(
            Building("Shopping Plaza 1", address(0x0), 10, 0, 0, 5, 25, 5)
        );
        buildings.push(
            Building("Shopping Plaza 2", address(0x0), -10, 0, 0, 5, 25, 5)
        );
    }

    function mint(uint _id) public payable{
        uint supply = totalSupply;

        require(supply<=maxSupply,"Supply exceeds max supply");

        require(buildings[_id-1].owner==address(0x0),"Building already has a owner");

        require(msg.value>=cost,"Too less ether provided");

        buildings[_id-1].owner=msg.sender;
        totalSupply=totalSupply+1;
        _safeMint(msg.sender, _id);
    }

    // We overide the transfer from function to transfer the nft.
    function transferFrom(address from,address to,uint tokenId) public override{
        // To approve the transaction
        require(_isApprovedOrOwner(_msgSender(), tokenId),"ERC721: transfer caller is not owner nor approved");

        buildings[tokenId-1].owner=to;
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from,address to,uint tokenId,bytes memory _data) public override{
        // To approve the transaction
        require(_isApprovedOrOwner(_msgSender(), tokenId),"ERC721: transfer caller is not owner nor approved");

        buildings[tokenId-1].owner=to;
        _safeTransfer(from, to, tokenId,_data);
    }

    function getBuildings() public view returns(Building[] memory){
        return buildings;
    }

    function getBuilding(uint _id) public view returns(Building memory){
        return buildings[_id-1];
    }

}