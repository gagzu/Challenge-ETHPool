import { ETHPool } from '../build/types';
import { expect } from './utils/chaiSetup';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { setupUser } from '../helpers/ethers';
import { Accounts } from '../typescript/hardhat';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

async function setup () {
  await deployments.fixture(["ETHPool"]);

  const contracts = {
    ETHPool: (await ethers.getContract('ETHPool')) as ETHPool
  };

  const accounts = (await getNamedAccounts()) as Accounts;

  const deployer = await setupUser(accounts.deployer, contracts);

  return {
    deployer,
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
  });

  it('Should fail if trying to add a member with an invalid address', async () => {
    const { contracts } = await setup();

    await expect(
      contracts.ETHPool.setTeamMember(ethers.constants.AddressZero)
    ).to.be.revertedWith('Invalid address');
  });

  it('Only the owner can assign new team members', async () => {
    const { contracts, accounts } = await setup();
    const contractsSigned = await setupUser(accounts.user1, contracts);

    await expect(
      contractsSigned.ETHPool.setTeamMember(accounts.user2)
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should fail if member is already registered', async () => {
    const { contracts, accounts } = await setup();

    await contracts.ETHPool.setTeamMember(accounts.user1);

    await expect(
      contracts.ETHPool.setTeamMember(accounts.user1)
    ).to.be.revertedWith('Member already registered');
  })

  it('Assign a new memmber to the team', async () => {
    const { contracts, accounts } = await setup();

    await expect(contracts.ETHPool.setTeamMember(accounts.user1)).to.not.reverted;
  });

  describe('Evaluating stake logic', () => {
    it('The amount must be > 0', async () => {
      const { contracts } = await setup();

      await expect(contracts.ETHPool.stake(0)).to.be.revertedWith('The amount must be > 0');
    });

    it('should fail if the amount does not match the sent balance', async () => {
      const { contracts } = await setup();

      await expect(
        contracts.ETHPool.stake(10, { value: 100 })
      ).to.be.revertedWith('The amount does not match the balance sent');
    });

    it('Contract balance correctly increases after staking', async () => {
      const { contracts, accounts } = await setup();

      const userConnectedContract = await setupUser(accounts.user1, contracts);

      const balanceBeforeStaking = await ethers.provider.getBalance(contracts.ETHPool.address);

      const { ETHPool } = userConnectedContract;

      const balanceToStaking = parseEther('100');

      await expect(() => {
        return ETHPool.stake(balanceToStaking, {
          value: balanceToStaking
        })
      }).to.be.changeEtherBalance(ETHPool, balanceToStaking)

      const balanceAfterStaking = await ethers.provider.getBalance(contracts.ETHPool.address);

      expect(balanceAfterStaking).to.equal(balanceBeforeStaking.add(balanceToStaking))
    });

    it('Users and pool balance should increment correctly', async () => {
      // TODO: staking balance with users A and B and verify that the balances are increased correctly
      throw new Error('not implemented');
    });
  });

})
