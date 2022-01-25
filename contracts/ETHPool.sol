// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Challenge ETHPool
/// @author Gallbers Gallardo @gagzu
/// @dev ETHPool provider a service where people can deposit ETH and they will receive weekly rewards
/// @custom:challenge This is a smart contract challenge
contract ETHPool is Ownable {
	enum UpdateBalanceMethod { STAKE, DEPOSIT_REWARD }
	UpdateBalanceMethod constant STAKE = UpdateBalanceMethod.STAKE;
	UpdateBalanceMethod constant DEPOSIT_REWARD = UpdateBalanceMethod.DEPOSIT_REWARD;

	using Counters for Counters.Counter;
	Counters.Counter private _poolIds;

	/// @dev General information of a user
	struct User {
		uint[] myPools;
		uint balanceDeposited;
		address payable beneficiary;
	}

	/// @dev Pool to store the information of a certain group of users
	struct Pool {
		uint balance;
		uint rewards;
		/// @dev user address => user data
		mapping (address => User) beneficiaries;
	}

	/// @dev pool id => pool data
	mapping (uint => Pool) private _pools;

	/// @dev any address => `true` if it belongs to the team
	mapping (address => bool) private _teamMembers;

	/// @dev user address => user data
	mapping (address => User) private _users;

	/// @dev Throws if you call by any account that is not a team member
	modifier onlyTeam {
		require(_teamMembers[msg.sender] == true, "Caller is not a member of the team");
		_;
	}

	/// @dev verify that the amount deposited is not 0 and matches the amount of ETH sent
	modifier validDeposit(uint amount) {
		require(msg.value > 0, "The amount must be > 0");
		require(amount == msg.value, "The amount does not match the balance sent");
		_;
	}

	constructor() {
		_teamMembers[msg.sender] = true;
	}

	receive() external payable {}

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

	/// @dev Determine if a pool has balance
	function _poolHasBalance(uint poolId) private view returns(bool) {
		return _pools[poolId].balance > 0;
	}

	/// @dev Determine if a pool has reward deposited
	function _poolHasReward(uint poolId) private view returns(bool) {
		return _pools[poolId].rewards > 0;
	}

	/**
	 * @param method Function name with which the pool balance must be updated
	**/
	function _updatebalancePools(UpdateBalanceMethod method) private {
		uint currentPoolId = _poolIds.current();

		/// @dev No pool created yet
		if(currentPoolId == 0) {
			_poolIds.increment();
			if(method == STAKE) _stake(_poolIds.current());
			if(method == DEPOSIT_REWARD) _depositReward(_poolIds.current());
		}

		/// @dev The pool does not yet have a reward and you can continue to accumulate balance
		if(
			currentPoolId > 0 &&
			( !_poolHasBalance(currentPoolId) || !_poolHasReward(currentPoolId))
		) {
			if(method == STAKE) _stake(currentPoolId);
			if(method == DEPOSIT_REWARD) _depositReward(currentPoolId);
		}

		/// @dev The pool has already received a reward and a new pool must be created
		if(
			currentPoolId > 0 &&
			(  _poolHasBalance(currentPoolId) && _poolHasReward(currentPoolId) )
		) {
			_poolIds.increment();
			if(method == STAKE) _stake(_poolIds.current());
			if(method == DEPOSIT_REWARD) _depositReward(_poolIds.current());
		}
	}

	/**
	 * @notice Allow users to deposit their ETH to receive rewards
	*/
	function stake(uint amount) public payable validDeposit(amount) {
		_updatebalancePools(STAKE);
	}

	function _stake(uint poolId) private {
		Pool storage p = _pools[poolId];

		p.balance += msg.value;

		if(p.beneficiaries[msg.sender].balanceDeposited == 0) {
			p.beneficiaries[msg.sender].myPools.push(poolId);
			p.beneficiaries[msg.sender].beneficiary = payable(msg.sender);
		}

		if(_users[msg.sender].beneficiary == address(0)) {
			_users[msg.sender] = p.beneficiaries[msg.sender];
		}

		p.beneficiaries[msg.sender].balanceDeposited += msg.value;
	}

	/**
	 * @notice Allow users to withdraw their deposit and reward if applicable
	**/
	function unstake() public {}

	/**
	 * @dev Deposit reward for the last open pool
	**/
	function depositReward(uint amount) public payable onlyTeam validDeposit(amount) {
		_updatebalancePools(DEPOSIT_REWARD);
	}

	function _depositReward(uint poolId) private {
		_pools[poolId].rewards += msg.value;
	}
}