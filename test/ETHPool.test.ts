import { ETHPool } from '../build/types';
import { expect } from './utils/chaiSetup';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

async function setup () {
  await deployments.fixture(["ETHPool"]);

  const contracts = {
    ETHPool: (await ethers.getContract('ETHPool')) as ETHPool
  };

  const accounts = await getNamedAccounts();

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
  })

})
