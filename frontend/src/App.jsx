import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import TestDopeABI from './abis/TestDope.json';
import StakingABI from './abis/Staking.json';

const TOKEN_ADDRESS = "0x31452ee9ae03C13553884aB50a1AA67B70288503";
const STAKING_ADDRESS = "0x13DbfD80f518038d7175F2aa14Bf6e04731D98BA";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);

  const [balance, setBalance] = useState("0");
  const [stakedAmount, setStakedAmount] = useState("0");
  const [rewardAmount, setRewardAmount] = useState("0");

  const [stakeInput, setStakeInput] = useState("");
  const [withdrawInput, setWithdrawInput] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
        const tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        const token = new ethers.Contract(TOKEN_ADDRESS, TestDopeABI, tempSigner);
        const staking = new ethers.Contract(STAKING_ADDRESS, StakingABI, tempSigner);

        setTokenContract(token);
        setStakingContract(staking);

        toast.success("Wallet Connected!");
      } catch (error) {
        toast.error("Connection Failed: " + error.message);
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  const updateData = async () => {
    if (account && tokenContract && stakingContract) {
      try {
        const bal = await tokenContract.balanceOf(account);
        setBalance(ethers.utils.formatUnits(bal, 18));

        const staked = await stakingContract.stakedBalance(account);
        setStakedAmount(ethers.utils.formatUnits(staked, 18));

        const reward = await stakingContract.pendingReward(account); // Using pendingReward view
        setRewardAmount(ethers.utils.formatUnits(reward, 18));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [account, tokenContract, stakingContract]);

  const handleStake = async () => {
    if (!stakeInput || !stakingContract || !tokenContract) return;
    try {
      const amount = ethers.utils.parseUnits(stakeInput, 18);

      // Approve functionality
      const txApprove = await tokenContract.approve(STAKING_ADDRESS, amount);
      toast.info("Approving tokens... Please wait.");
      await txApprove.wait();

      const txStake = await stakingContract.stake(amount);
      toast.info("Staking... Please wait.");
      await txStake.wait();

      toast.success("Staked Successfully!");
      setStakeInput("");
      updateData();
    } catch (error) {
      console.error(error);
      toast.error("Staking Failed: " + (error.reason || error.message));
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawInput || !stakingContract) return;
    try {
      const amount = ethers.utils.parseUnits(withdrawInput, 18);
      const tx = await stakingContract.withdraw(amount);
      toast.info("Withdrawing... Please wait.");
      await tx.wait();

      toast.success("Withdrawn Successfully!");
      setWithdrawInput("");
      updateData();
    } catch (error) {
      console.error(error);
      toast.error("Withdraw Failed: " + (error.reason || error.message));
    }
  };

  const handleClaim = async () => {
    if (!stakingContract) return;
    try {
      const tx = await stakingContract.getReward();
      toast.info("Claiming Rewards... Please wait.");
      await tx.wait();

      toast.success("Rewards Claimed!");
      updateData();
    } catch (error) {
      console.error(error);
      toast.error("Claim Failed: " + (error.reason || error.message));
    }
  };

  return (
    <div className="App">
      <ToastContainer theme="dark" />
      <div className="container">
        <header>
          <h1>🚀 Staking DApp</h1>
          {!account ? (
            <button className="connect-btn" onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <span className="address">{account.substring(0, 6)}...{account.substring(38)}</span>
          )}
        </header>

        {account && (
          <main>
            <div className="stats-grid">
              <div className="card">
                <h3>Wallet Balance</h3>
                <p>{parseFloat(balance).toFixed(2)} THOPE</p>
              </div>
              <div className="card">
                <h3>Staked Amount</h3>
                <p>{parseFloat(stakedAmount).toFixed(2)} THOPE</p>
              </div>
              <div className="card">
                <h3>Pending Rewards</h3>
                <p>{parseFloat(rewardAmount).toFixed(4)} THOPE</p>
                <button className="action-btn claim-btn" onClick={handleClaim}>Claim Reward</button>
              </div>
            </div>

            <div className="actions-grid">
              <div className="card action-card">
                <h3>Stake Tokens</h3>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Amount to Stake"
                    value={stakeInput}
                    onChange={(e) => setStakeInput(e.target.value)}
                  />
                  <button className="action-btn" onClick={handleStake}>Stake</button>
                </div>
              </div>

              <div className="card action-card">
                <h3>Withdraw Tokens</h3>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Amount to Withdraw"
                    value={withdrawInput}
                    onChange={(e) => setWithdrawInput(e.target.value)}
                  />
                  <button className="action-btn withdraw-btn" onClick={handleWithdraw}>Withdraw</button>
                </div>
              </div>
            </div>
          </main>
        )}

        {!account && <div className="welcome"><h2>Connect your wallet to start staking!</h2></div>}
      </div>
    </div>
  );
}

export default App;
