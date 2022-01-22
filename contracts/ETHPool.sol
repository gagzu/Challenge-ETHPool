// SPDX-Licence-Identifier: MIT

pragma solidity ^0.8.7;

/// @title Challenge ETHPool
/// @author Gallbers Gallardo @gagzu
/// @dev ETHPool provider a service where people can deposit ETH and they will receive weekly rewards
/// @custom:challenge This is a smart contract challenge  
contract ETHPool {

  /*
   * Struct para identificar a un usuario
   * struct User {
     uint deposit;
     uint initialdepositDate;
     address payable beneficiary;
   }
  */
  
  /*
   * Mapping para los usuarios
   * mapping (address => User) public users;
  */
  
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