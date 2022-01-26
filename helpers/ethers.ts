import { ethers } from 'hardhat';
import { Contract } from 'ethers';

export async function setupUser<T extends {[contractName: string]: Contract}>(
  address: string,
  contracts: T
): Promise<{address: string} & T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = {address};
  for (const key of Object.keys(contracts)) {
    user[key] = contracts[key].connect(await ethers.getSigner(address));
  }
  return user as {address: string} & T;
}

export async function getEventArgs(tx: any, eventName: string, contract: Contract) {
  let receipt = await tx?.wait();
  let args: any;
  for (const index in receipt?.logs) {
    try {
      let event = contract.interface.parseLog(receipt.logs[index]);
      let currentName = event.name;
      if (eventName == currentName) {
        args = event.args;
        break;
      }
    } catch (error) {}
  }

  return args;
}