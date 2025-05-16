'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import CreateGovernanceProposal from '../../components/CreateGovernanceProposal';
import GovernanceProposalList from '../../components/GovernanceProposalList';
import DelegateVotes from '../../components/DelegateVotes';
import TokenStats from '../../components/TokenStats';

// Contract addresses would normally be imported from a config file
const GOVERNOR_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;
const TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

export default function GovernancePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isConnected } = useAccount();

  const handleRefresh = () => {
    // Increment to trigger a refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">DAO Governance</h1>
        <p className="text-gray-600">
          Participate in decentralized governance by creating proposals, voting on issues, and delegating your voting power.
        </p>
      </div>

      {!isConnected ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-8 text-center">
          Please connect your wallet to participate in governance.
        </div>
      ) : (
        <>
          {/* User's token stats */}
          <div className="mb-8">
            <TokenStats tokenAddress={TOKEN_ADDRESS} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GovernanceProposalList 
                governorAddress={GOVERNOR_ADDRESS}
                tokenAddress={TOKEN_ADDRESS}
                onRefreshNeeded={handleRefresh}
              />
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              <CreateGovernanceProposal 
                governorAddress={GOVERNOR_ADDRESS} 
                onProposalCreated={handleRefresh}
              />
              
              <DelegateVotes 
                tokenAddress={TOKEN_ADDRESS}
                onDelegated={handleRefresh}
              />
            </div>
          </div>
        </>
      )}
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Governance Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Proposal</h3>
            <p className="text-gray-600">
              Anyone with enough voting power can create a governance proposal for the community to vote on.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Vote</h3>
            <p className="text-gray-600">
              Token holders can vote for, against, or abstain on active proposals based on their voting power.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Execute</h3>
            <p className="text-gray-600">
              Successful proposals are queued through a timelock and then can be executed on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}