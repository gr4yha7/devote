// components/DelegateVotes.tsx
import { useState, FormEvent } from 'react';
import { isAddress } from 'ethers';

interface DelegateVotesProps {
  delegateVotes: (address: string) => Promise<void>;
  loading: boolean;
}

export default function DelegateVotes({ delegateVotes, loading }: DelegateVotesProps) {
  const [delegateeAddress, setDelegateeAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate address
    if (!delegateeAddress.trim()) {
      setError('Address is required');
      return;
    }
    
    // Check if it's a valid Ethereum address
    if (!isAddress(delegateeAddress)) {
      setError('Invalid Ethereum address');
      return;
    }
    
    try {
      // Delegate votes
      await delegateVotes(delegateeAddress);
      setSuccess(`Successfully delegated votes to ${delegateeAddress.substring(0, 6)}...${delegateeAddress.substring(delegateeAddress.length - 4)}`);
      
      // Clear input
      setDelegateeAddress('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delegate votes';
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Delegate Voting Power</h2>
      
      <p className="text-gray-600 text-sm mb-4">
        You can delegate your voting power to another address. The delegatee will be able to vote with the weight of your tokens.
      </p>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Delegate Address
          </label>
          <input
            type="text"
            value={delegateeAddress}
            onChange={(e) => setDelegateeAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0x..."
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
        >
          {loading ? 'Processing...' : 'Delegate Votes'}
        </button>
      </form>
    </div>
  );
}