// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Prize is ERC721, Ownable {
    /// @dev Total supply of NFT that can be minted for this smart contract
    uint256 public constant MAX_SUPPLY = 10000;

    /// @dev Limit for maximum NFTs can be airdropped in a single transaction.
    uint256 public MAX_AIRDROP_LIMIT = 100;

    /// @dev Count for NFTs which has already been minted.
    uint256 public current_minted = 0;

    /// @dev Base URI for NFT metadata.
    string private baseURI = "";

    /// @dev This emits when airdrop is completed.
    event Airdropped(address receiver, uint256 count);

    /// @dev This emits when _baseURI is reset.
    event SetBaseURI(string _baseURI);

    /// @dev constractor for Prize. During the contract creation set the tokenName and tokenSymbol.
    constructor() ERC721("prize", "PRIZE") {}

    /// @notice Only Owner of this smart contract is allowed to call this function.
    /// @dev public function to set the maximum limit for NFTs to be airdropped in a single transaction.
    function setMaxAirdropLimit(uint256 _airdropLimit) external onlyOwner {
        /// @dev Throws if airdropLimit is less than 1.
        require(_airdropLimit >= 1, "Can not set airdropLimit less than 1.");

        /// @dev Throws if airdropLimit is more than total supply.
        require(
            _airdropLimit + current_minted <= MAX_SUPPLY,
            "Can not set airdropLimit more than the total supply."
        );
        MAX_AIRDROP_LIMIT = _airdropLimit;
    }

    /// @notice The caller (contract owner) is responsible for providing '_receiver' address and '_nftCount'.
    /// @dev Airdrop a requested number of NFT to the reveiver address. Validate the requested number of airdrop is greater than max suppy or not.
    /// @param _receiver receiver wallet address.
    /// @param _nftCount number of NFT need to airdrop.
    function airdrop(address _receiver, uint256 _nftCount) external onlyOwner {
        require(
            _nftCount <= MAX_AIRDROP_LIMIT,
            "Cannot airdrop more than airdropLimit."
        );
        require(
            _nftCount + current_minted <= MAX_SUPPLY,
            "Cannot airdrop more than the total supply."
        );
        for (uint256 i = 0; i < _nftCount; i++) {
            current_minted++;
            super._mint(_receiver, current_minted);
        }
        emit Airdropped(_receiver, _nftCount);
    }

    /// @notice This is an public function the call should be the owner of the NFT to be burned.
    /// @dev Burns a NFT. Validate if the sender is the owner of the token.
    /// @param _tokenId ID of the NFT to be burned.
    function burn(uint256 _tokenId) external {
        address tokenIdOwner = this.ownerOf(_tokenId);
        require(
            msg.sender == tokenIdOwner,
            "Sender is not the owner of the token."
        );
        super._burn(_tokenId);
    }

    /// @notice Set base URI for tokens metadata
    /// @param _baseTokenURI base URI to metadata
    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseURI = _baseTokenURI;

        emit SetBaseURI(_baseTokenURI);
    }

    /// @dev Get how many nfts are minted right now.
    function totalSupply() external view returns (uint256) {
        return current_minted;
    }

    /// @dev Get how many nfts can be minted.
    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /// @dev Overrides same function from OpenZeppelin ERC721, used in tokenURI function
    /// @return token base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}
