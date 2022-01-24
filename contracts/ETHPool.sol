// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Challenge ETHPool
/// @author Gallbers Gallardo @gagzu
/// @dev ETHPool provider a service where people can deposit ETH and they will receive weekly rewards
/// @custom:challenge This is a smart contract challenge
contract ETHPool is Ownable {
	/// @dev General information of a user
	struct User {
		uint balanceDeposited;
		uint initialdepositDate;
		address payable beneficiary;
	}

	/// @dev Pool management team
	mapping (address => bool) private _teamMembers;

	/*
	 * Mapping para los usuarios
	 * mapping (address => User) public users;
	*/

	constructor() {
		_teamMembers[msg.sender] = true;
	}

	/// @dev Add a member to the ETHPool team
	function setTeamMember(address member) public onlyOwner {
		require(member != address(0), "Invalid address");
		require(!_teamMembers[member], "Member already registered");
		_teamMembers[member] = true;
	}

	/**
	 * @dev Check if the member is already registered
	 * @param member Address of the new team member
	*/
	function checkMember(address member) public view returns(bool) {
		return _teamMembers[member];
	}

	/**
	 * @notice Allow users to deposit their ETH to receive rewards
	*/
	function stake() public payable {}

	/**
	 * @notice Allow users to withdraw their deposit and reward if applicable
	*/
	function unstake() public {}

	/*
	 * Depositar recompensa
	 * function depositReward() public payable onlyTeam {}
	*/

	/*
	 * Modificador donde solo el equipo puede llamar a la fn
	 * moifier onlyTeam { _; }
	*/

	receive() external payable {}

}