// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    IERC20 public rewardsToken;

    // Reward Rate: 100 tokens per day per staked token (normalized to 1e18)
    // 100 * 1e18 / 1 days = 100 tokens per day expressed in wei per second per unit staked?
    // User asked for "100 tokens per day per user" or "simple percentage".
    // Let's implement: Reward = Staked * (Time * Rate)
    // If Rate = 100 tokens / day / 1 token staked. That's 10000% daily interest.
    // Let's assume user meant "If you stake, you get rewards".
    // Let's implement a fixed rate of 1 token per second for simplification if not specified,
    // OR: 100 tokens per day total? No "per user".
    // Let's go with: 1 Reward Token per second per 1 Staked Token (for testing speed).
    // Actually, let's look at the "100 tokens per day" request.
    // Rate = 100 * 1e18 / 86400 (seconds in a day).
    
    // 100 tokens per day = roughly 0.001157 tokens per second
    // We pre-calculate this to avoid the "rational_const" error
    uint256 public constant REWARD_RATE = 1157407407407407; // (100 * 1e18) / 86400 

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdateTime;

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

    modifier updateReward(address account) {
        uint256 earned = 0;
        if (lastUpdateTime[account] > 0) {
            uint256 timeDelta = block.timestamp - lastUpdateTime[account];
            // Reward = Staked * Time * Rate / 1e18
            earned = (stakedBalance[account] * timeDelta * REWARD_RATE) / 1e18;
        }
        rewards[account] += earned;
        lastUpdateTime[account] = block.timestamp;
        _;
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient balance");
        stakedBalance[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
    }

    function getReward() external updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
        }
    }
    
    // View function to see pending rewards without transaction
    function pendingReward(address account) external view returns (uint256) {
        uint256 earned = 0;
        if (lastUpdateTime[account] > 0) {
            uint256 timeDelta = block.timestamp - lastUpdateTime[account];
            earned = (stakedBalance[account] * timeDelta * REWARD_RATE) / 1e18;
        }
        return rewards[account] + earned;
    }
}
