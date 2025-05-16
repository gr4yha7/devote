'use client';

import { useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import DAPPGovernanceTokenABI from '../contracts/DAPPGovernanceToken';

interface DelegateVotesProps {
  tokenAddress: `0x${string}`;
  onDelegated: () => void;
}

export default function DelegateVotes({ tokenAddress, onDelegated }: DelegateVotesProps) {
  const [delegateeAddress, setDelegateeAddress] = useState('');
  const [selfDelegate, setSelfDelegate] = useState(true);
  const [error, setError] = useState('');
  
  const { address: userAddress } = useAccount();
  
  const { write: delegateVotes, isPending } = useContractWrite({
    address: tokenAddress,
    abi: DAPPGovernanceTokenABI,
    functionName: 'delegate',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!userAddress) {
      setError('Please connect your wallet to delegate votes');
      return;
    }
    
    let addressToDelegate = userAddress;
    if (!selfDelegate) {
      if (!delegateeAddress) {
        setError('Please enter a delegatee address');
        return;
      }
      
      if (!/^0x[a-fA-F0-9]{40}$/.test(delegateeAddress)) {
        setError('Please enter a valid Ethereum address');
        return;
      }
      
      addressToDelegate = delegateeAddress as `0x${string}`;
    }
    
    try {
      delegateVotes({
        args: [addressToDelegate],
        onSuccess: () => {
          setDelegateeAddress('');
          onDelegated();
        },
        onError: (err) => {
          setError(`Failed to delegate votes: ${err instanceof Error ? err.message : 'Unknown error'}`);
        },
      });
    } catch (err) {
      setError(`Error delegating votes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Delegate Voting Power</h2>
      
      <p className="text-gray-600 mb-4">
        Delegation allows you to assign your voting power to another address without transferring tokens.
        Self-delegation activates your voting power.
      </p>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex items-center">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                className="form-radio"
                checked={selfDelegate}
                onChange={() => setSelfDelegate(true)}
              />
              <span className="ml-2">Delegate to myself</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                checked={!selfDelegate}
                onChange={() => setSelfDelegate(false)}
              />
              <span className="ml-2">Delegate to other address</span>
            </label>
          </div>
        </div>
        
        {!selfDelegate && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Delegatee Address
            </label>
            <input
              type="text"
              value={delegateeAddress}
              onChange={(e) => setDelegateeAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
              disabled={isPending}
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          {isPending ? 'Delegating...' : 'Delegate Votes'}
        </button>
      </form>
    </div>
  );
}