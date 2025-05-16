"use client";

import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { formatEther } from "viem";
import DAPPGovernanceTokenABI from "../contracts/DAPPGovernanceToken";
import { useUser } from "@civic/auth-web3/react";
import { getUser } from "@civic/auth-web3/nextjs";

interface TokenStatsProps {
  tokenAddress: `0x${string}`;
}

export default function TokenStats({ tokenAddress }: TokenStatsProps) {
  const { user } = useUser();
  const { address: userAddress, isConnected } = useAccount();
  const [formattedBalance, setFormattedBalance] = useState("0");
  const [formattedVotingPower, setFormattedVotingPower] = useState("0");

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: tokenAddress,
    abi: DAPPGovernanceTokenABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  });

  // Read voting power
  const { data: votingPower, refetch: refetchVotingPower } = useContractRead({
    address: tokenAddress,
    abi: DAPPGovernanceTokenABI,
    functionName: "getVotes",
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  });

  // Format values whenever they change
  useEffect(() => {
    if (balance) {
      setFormattedBalance(formatEther(balance as bigint));
    }

    if (votingPower) {
      setFormattedVotingPower(formatEther(votingPower as bigint));
    }
  }, [balance, votingPower]);

  // Refresh data periodically or on account change
  useEffect(() => {
    if (userAddress) {
      refetchBalance();
      refetchVotingPower();

      const interval = setInterval(() => {
        refetchBalance();
        refetchVotingPower();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [userAddress, refetchBalance, refetchVotingPower]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-700 mb-1">Token Balance</div>
          <div className="text-2xl font-bold">
            {parseFloat(formattedBalance).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-700 mb-1">Voting Power</div>
          <div className="text-2xl font-bold">
            {parseFloat(formattedVotingPower).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {parseFloat(formattedBalance) > 0 &&
        parseFloat(formattedVotingPower) === 0 && (
          <div className="mt-4 bg-yellow-50 p-3 rounded-md text-sm text-yellow-700">
            You have tokens but no voting power. Please delegate your votes to
            activate your voting power.
          </div>
        )}
    </div>
  );
}
