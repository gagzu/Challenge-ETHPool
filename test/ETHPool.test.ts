import { ETHPool } from '../build/types';
import { expect } from './utils/chaiSetup';
import { parseEther } from 'ethers/lib/utils';
import { Accounts } from '../typescript/hardhat';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

async function setup () {
  await deployments.fixture(["ETHPool"]);

  const contracts = {
    ETHPool: (await ethers.getContract('ETHPool')) as ETHPool
  };

  const accounts = (await getNamedAccounts()) as Accounts;

  return {
    accounts,
    contracts,
  }
}

describe('ETHPool', () => {
  it('Should set the right owner', async () => {
    const { contracts, accounts } = await setup();
    const { ETHPool } = contracts;

    expect(await ETHPool.owner()).to.equal(accounts.deployer);
  });

  it('The contract should be able to receive ETH', async () => {
    const { accounts, contracts } = await setup();

    const balanceToSend = parseEther('20');
    const signer = await ethers.getSigner(accounts.deployer);

    await expect(() => {
      return signer.sendTransaction({
        value: balanceToSend,
        to: contracts.ETHPool.address,
      })
    })
    .to.changeEtherBalance(contracts.ETHPool, balanceToSend);
  })

})
