'use client';

import { useState } from 'react';
import { useAccount, useClient, useConnectorClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { config as wagmiConfig } from '@/app/providers';

// This is needed because we're using a direct import of the ABI
const DAPPGovernorABI = [
  // Core governance functions
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "targets",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "calldatas",
        "type": "bytes[]"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "propose",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

interface CreateGovernanceProposalProps {
  governorAddress: `0x${string}`;
  onProposalCreated: () => void;
}

interface CreateProposalArgs {
  targets: `0x${string}`[];
  values: bigint[];
  calldatas: `0x${string}`[];
  description: string;
}

export default function CreateGovernanceProposal({ 
  governorAddress, 
  onProposalCreated 
}: CreateGovernanceProposalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [functionSignature, setFunctionSignature] = useState('');
  const [functionParams, setFunctionParams] = useState('');
  const [etherValue, setEtherValue] = useState('0');
  const [error, setError] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { address } = useAccount();
  const publicClient = useClient({
    config: wagmiConfig
  });
  const {data: walletClient} = useConnectorClient({
    config: wagmiConfig
  })

  const { 
    data: hash,
    error: writeEror,   
    isPending, 
    writeContract 
  } = useWriteContract()

  async function submitProposal(args: CreateProposalArgs) {
    // Simulating contract interaction
    console.log('args:', args);
    writeContract({
      account: address,
      address: governorAddress,
      abi: DAPPGovernorABI,
      functionName: 'propose',
      args: [args.targets, args.values, args.calldatas, args.description],
    })
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  // Encode function call for the proposal
  const encodeFunction = () => {
    try {
      if (!functionSignature) return '0x';
      
      // Extract function name and parameter types
      const match = functionSignature.match(/^([\w]+)\((.*)\)$/);
      if (!match) throw new Error('Invalid function signature format');
      
      const [, functionName, paramTypesStr] = match;
      const paramTypes = paramTypesStr.split(',').filter(p => p.trim());
      
      // Parse function parameters
      let params: any[] = [];
      if (functionParams.trim()) {
        try {
          params = JSON.parse(`[${functionParams}]`);
        } catch (e) {
          throw new Error('Invalid function parameters format. Use comma-separated JSON format.');
        }
      }
      
      // Check if param count matches
      if (params.length !== paramTypes.length) {
        throw new Error(`Parameter count mismatch: expected ${paramTypes.length}, got ${params.length}`);
      }
      
      // Simplified encoding logic for demonstration
      // In a real app, you would use publicClient.encodeFunctionData properly
      return '0x';
    } catch (error) {
      console.error('Error encoding function call:', error);
      setError(`Error encoding function call: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return '0x';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!address) {
      setError('Please connect your wallet to create a proposal');
      return;
    }
    
    if (!title || !description) {
      setError('Title and description are required');
      return;
    }
    
    if (isAdvancedMode) {
      if (!targetAddress) {
        setError('Target contract address is required');
        return;
      }
      
      if (!functionSignature) {
        setError('Function signature is required');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      // For simple text proposals, we can set a dummy target and data
      let targets: `0x${string}`[] = [];
      let values: bigint[] = [];
      let calldatas: `0x${string}`[] = [];
      
      if (isAdvancedMode) {
        const encodedCalldata = encodeFunction() as `0x${string}`;
        targets = [targetAddress as `0x${string}`];
        values = [parseEther(etherValue)];
        calldatas = [encodedCalldata];
      } else {
        // For text proposals, use a zero address and empty calldata
        targets = ['0x0000000000000000000000000000000000000000' as `0x${string}`];
        values = [BigInt(0)];
        calldatas = ['0x' as `0x${string}`];
      }
      
      // Full description includes title
      const fullDescription = `# ${title}\n\n${description}`;
      
      const proposalArgs: CreateProposalArgs = {
        targets,
        values,
        calldatas,
        description: fullDescription
      }
      // Create proposal
      await submitProposal(proposalArgs);
      
      // Reset form
      setTitle('');
      setDescription('');
      setTargetAddress('');
      setFunctionSignature('');
      setFunctionParams('');
      setEtherValue('0');
      
      // Notify parent
      onProposalCreated();
      
    } catch (err: unknown) {
      setError(`Error creating proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Governance Proposal</h2>
      
      <div className="mb-4">
        <div className="flex items-center">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              className="form-radio"
              checked={!isAdvancedMode}
              onChange={() => setIsAdvancedMode(false)}
            />
            <span className="ml-2">Text Proposal</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              checked={isAdvancedMode}
              onChange={() => setIsAdvancedMode(true)}
            />
            <span className="ml-2">Advanced</span>
          </label>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter proposal title"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter proposal description"
            rows={4}
            disabled={isSubmitting}
          />
        </div>
        
        {isAdvancedMode && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Target Contract Address
              </label>
              <input
                type="text"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0x..."
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Function Signature
              </label>
              <input
                type="text"
                value={functionSignature}
                onChange={(e) => setFunctionSignature(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="transfer(address,uint256)"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Function Parameters (comma-separated)
              </label>
              <input
                type="text"
                value={functionParams}
                onChange={(e) => setFunctionParams(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='"0x123...", 1000'
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                ETH Value (in ETH)
              </label>
              <input
                type="text"
                value={etherValue}
                onChange={(e) => setEtherValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          {isSubmitting ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>
    </div>
  );
}