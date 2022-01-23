// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

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