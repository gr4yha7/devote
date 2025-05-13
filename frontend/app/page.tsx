"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useBalance,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DAOVotingABI from "../contracts/DAOVoting";
import GovernanceTokenABI from "../contracts/GovernanceToken";
import ConnectWallet from "../components/ConnectWallet";
import ProposalList from "../components/ProposalList";
import CreateProposal from "../components/CreateProposal";
import VotingStats from "../components/VotingStats";
import DelegateVotes from "../components/DelegateVotes";

interface Proposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  startTime: Date;
  endTime: Date;
  executed: boolean;
  hasVoted: boolean;
  userVote: number;
  userWeight: number;
}

interface VotingStats {
  totalVotesFor: number;
  totalVotesAgainst: number;
  totalVotesAbstain: number;
  totalProposals: number;
  activeVoters: number;
}

interface ProposalResponse {
  title: string;
  description: string;
  votesFor: bigint;
  votesAgainst: bigint;
  votesAbstain: bigint;
  startTime: bigint;
  endTime: bigint;
  executed: boolean;
}

interface VoteReceiptResponse {
  hasVoted: boolean;
  voteType: number;
  weight: bigint;
}

export default function Home() {
  const [voteType, setVoteType] = useState(1); // 1: For, 2: Against, 3: Abstain
  const queryClient = useQueryClient();

  // Contract addresses from environment variables
  const votingContractAddress =
    process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS ||
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const tokenContractAddress =
    process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS ||
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // Using wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Get token balance
  const { data: tokenBalance } = useBalance({
    address,
    token: tokenContractAddress,
  });

  // Get proposal count
  const { data: proposalCount } = useReadContract({
    
    address: votingContractAddress,
    abi: DAOVotingABI,
    functionName: "getProposalCount",
  });

  // Query for fetching all proposals
  const { data: proposals = [], isLoading: isLoadingProposals } = useQuery({
    queryKey: ["proposals", address, proposalCount],
    queryFn: async () => {
      if (!isConnected || !address || !publicClient || !proposalCount)
        return [];

      const fetchedProposals: Proposal[] = [];
      let totalVotesFor = 0;
      let totalVotesAgainst = 0;
      let totalVotesAbstain = 0;
      let uniqueVoters = new Set<string>();

      for (let i = 0; i < Number(proposalCount); i++) {
        // Get proposal details
        const proposal = (await publicClient.readContract({
          address: votingContractAddress,
          abi: DAOVotingABI,
          functionName: "getProposal",
          args: [i],
        })) as ProposalResponse;

        // Check if user has voted
        const hasVoted = (await publicClient.readContract({
          address: votingContractAddress,
          abi: DAOVotingABI,
          functionName: "hasVoted",
          args: [i, address],
        })) as boolean;

        // If user has voted, get their vote receipt
        let userVote = 0;
        let userWeight = 0;

        if (hasVoted) {
          const receipt = (await publicClient.readContract({
            address: votingContractAddress,
            abi: DAOVotingABI,
            functionName: "getVoteReceipt",
            args: [i, address],
          })) as VoteReceiptResponse;

          userVote = receipt.voteType;
          userWeight = Number(receipt.weight);
        }

        // Format the proposal data
        fetchedProposals.push({
          id: i,
          title: proposal.title,
          description: proposal.description,
          votesFor: Number(proposal.votesFor),
          votesAgainst: Number(proposal.votesAgainst),
          votesAbstain: Number(proposal.votesAbstain),
          startTime: new Date(Number(proposal.startTime) * 1000),
          endTime: new Date(Number(proposal.endTime) * 1000),
          executed: proposal.executed,
          hasVoted,
          userVote,
          userWeight,
        });

        // Track total votes
        totalVotesFor += Number(proposal.votesFor);
        totalVotesAgainst += Number(proposal.votesAgainst);
        totalVotesAbstain += Number(proposal.votesAbstain);

        // Add voters to the set
        if (hasVoted) {
          uniqueVoters.add(address);
        }
      }

      // Update voting stats
      setVotingStats({
        totalVotesFor,
        totalVotesAgainst,
        totalVotesAbstain,
        totalProposals: Number(proposalCount),
        activeVoters: uniqueVoters.size,
      });

      return fetchedProposals;
    },
    enabled: isConnected && !!address && !!publicClient && !!proposalCount,
  });

  const [votingStats, setVotingStats] = useState<VotingStats>({
    totalVotesFor: 0,
    totalVotesAgainst: 0,
    totalVotesAbstain: 0,
    totalProposals: 0,
    activeVoters: 0,
  });

  // Mutation for creating a proposal
  const createProposalMutation = useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => {
      if (!walletClient || !isConnected || !publicClient || !address)
        throw new Error("Wallet not connected");

      const { request } = await publicClient.simulateContract({
        address: votingContractAddress,
        abi: DAOVotingABI,
        functionName: "createProposal",
        args: [title, description],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });

  // Mutation for casting a vote
  const castVoteMutation = useMutation({
    mutationFn: async (proposalId: number) => {
      if (!walletClient || !isConnected || !publicClient || !address)
        throw new Error("Wallet not connected");

      const { request } = await publicClient.simulateContract({
        address: votingContractAddress,
        abi: DAOVotingABI,
        functionName: "castVote",
        args: [proposalId, voteType],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });

  // Mutation for delegating votes
  const delegateVotesMutation = useMutation({
    mutationFn: async (delegateeAddress: string) => {
      if (!walletClient || !isConnected || !publicClient || !address)
        throw new Error("Wallet not connected");

      const { request } = await publicClient.simulateContract({
        address: votingContractAddress,
        abi: DAOVotingABI,
        functionName: "delegate",
        args: [delegateeAddress],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });

  const createNewProposal = async (title: string, description: string) => {
    try {
      await createProposalMutation.mutateAsync({ title, description });
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    }
  };

  const castVote = async (proposalId: string | number) => {
    try {
      await castVoteMutation.mutateAsync(Number(proposalId));
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  };

  const delegateVotes = async (delegateeAddress: string) => {
    try {
      await delegateVotesMutation.mutateAsync(delegateeAddress);
    } catch (error) {
      console.error("Error delegating votes:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>DAO Voting App</title>
        <meta
          name="description"
          content="A decentralized DAO voting application built on Ethereum"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="text-center py-16 px-4 bg-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Decentralized Voting for the Future
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Secure, transparent, and tamper-proof blockchain-based voting
            platform for organizations, communities, and governments.
          </p>
        </section>

        {isConnected ? (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProposalList
                  proposals={proposals}
                  castVote={castVote}
                  loading={isLoadingProposals}
                  setVoteType={setVoteType}
                  currentVoteType={voteType}
                />
              </div>
              <div className="space-y-8">
                <VotingStats stats={votingStats} tokenBalance={tokenBalance} />
                <DelegateVotes
                  delegateVotes={delegateVotes}
                  loading={isLoadingProposals}
                />
                <CreateProposal
                  createProposal={createNewProposal}
                  loading={isLoadingProposals}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Features Section */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                  Why Choose DeVote?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Feature 1 */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Secure & Transparent
                    </h3>
                    <p className="text-gray-600">
                      All votes are recorded on the blockchain, making them
                      immutable, verifiable, and resistant to tampering or
                      manipulation.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Fast & Efficient
                    </h3>
                    <p className="text-gray-600">
                      Vote from anywhere, anytime using just your wallet. No
                      need for physical polling stations or complex
                      identification processes.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-purple-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Community Governed
                    </h3>
                    <p className="text-gray-600">
                      The platform itself is governed by its users, ensuring
                      that protocol upgrades and changes reflect the will of the
                      community.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                  How It Works
                </h2>

                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Connect Your Wallet
                      </h3>
                      <p className="text-gray-600">
                        Connect your Ethereum wallet to the platform. DeVote
                        supports MetaMask, WalletConnect, and other popular
                        wallet providers.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Browse Active Polls
                      </h3>
                      <p className="text-gray-600">
                        Explore the list of active polls and proposals. Read
                        descriptions, view options, and check voting deadlines.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Cast Your Vote
                      </h3>
                      <p className="text-gray-600">
                        Select your preferred option and confirm your vote. The
                        transaction will be signed by your wallet and recorded
                        on the blockchain.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Verify Results
                      </h3>
                      <p className="text-gray-600">
                        Once the voting period ends, results are automatically
                        tallied and published. You can verify all votes on the
                        blockchain explorer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Make Your Voice Heard?
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already voting securely on the
                  blockchain.
                </p>
                <div className="mt-8">
                  <p className="text-xl text-gray-600">
                    Connect your wallet to start voting
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
