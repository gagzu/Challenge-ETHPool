import { ETHPool } from '../build/types';
import { expect } from './utils/chaiSetup';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { getEventArgs, setupUser } from '../helpers/ethers';
import { Accounts } from '../typescript/hardhat';
import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { BigNumber } from 'ethers';

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
      const { contracts, accounts } = await setup();
      const { user1, user2 } = accounts;

      const [
        user1ConnectedContrat,
        user2ConnectedContrat,
        balanceBeforeStake,
      ] = await Promise.all([
        setupUser(user1, contracts),
        setupUser(user2, contracts),
        ethers.provider.getBalance(contracts.ETHPool.address),
      ]);

      const balanceToSend = parseEther('10');

      // Hacemos staking con ambos usuarios pero la info de uno solo es suficiente para el resto del test
      const users = await Promise.all([
        user1ConnectedContrat.ETHPool.stake(balanceToSend, { value: balanceToSend }),
        user2ConnectedContrat.ETHPool.stake(balanceToSend, { value: balanceToSend }),
      ]);

      const balanceAfterStake = await ethers.provider.getBalance(contracts.ETHPool.address);

      const [ user1Tx ] = users;

      const user1EventStaked = await getEventArgs(user1Tx, 'staked', contracts.ETHPool);
      const user1PolId: BigNumber = user1EventStaked.poolId;

      const [
        user1Balance,
        user2Balance
      ] = await Promise.all([
        await contracts.ETHPool.getUserBalanceByPoolId(user1, user1PolId),
        await contracts.ETHPool.getUserBalanceByPoolId(user2, user1PolId),
      ])

      const user1PoolData = await contracts.ETHPool.pools(user1PolId);

      expect(user1Balance).to.equal(balanceToSend);
      expect(user2Balance).to.equal(balanceToSend);
      expect(user1PoolData.balance).to.equal(balanceToSend.mul(users.length));
      expect(balanceAfterStake).to.equal(balanceBeforeStake.add(balanceToSend.mul(users.length)));
    });
  });

  describe('Evaluating claimReward logic', () => {
    it('It should fail if the user has no rewards to claim', async () => {
      const { contracts, accounts } = await setup();

      const signedContracts = await setupUser(accounts.user1, contracts);

      await expect(
        signedContracts.ETHPool.claimReward()
      ).to.be.revertedWith('You have no rewards to claim');
    });
  })

  describe('Evaluating depositReward logic', () => {
    it('The amount must be > 0', async () => {
      const { contracts } = await setup();

      await expect(
        contracts.ETHPool.depositReward(0)
      ).to.be.revertedWith('The amount must be > 0');
    });

    it('Should fail if the one depositing a reward is not a team member', async () => {
      throw new Error('Not implemented');
    })

    it('should fail if the amount does not match the sent balance', async () => {
      const { contracts } = await setup();

      await expect(
        contracts.ETHPool.depositReward(10, { value: 100 })
      ).to.be.revertedWith('The amount does not match the balance sent');
    });

    it('Contract and pool balance correctly increase after depositing a reward', async () => {
      throw new Error('not implemented');
    })
  })

})
