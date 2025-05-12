// lib/dummyData.ts

export interface Poll {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  options: PollOption[];
  isActive: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Vote {
  pollId: string;
  optionId: string;
  timestamp: string;
  voter: string;
  transactionHash: string;
}

export interface User {
  address: string;
  votes: Vote[];
}

// Sample active polls
export const activePolls: Poll[] = [
  {
    id: 'poll-1',
    title: 'Community Treasury Allocation',
    description: 'How should we allocate the community treasury funds for Q3 2025?',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-05-15T23:59:59Z',
    options: [
      { id: 'option-1-1', text: 'Protocol Development', votes: 1245 },
      { id: 'option-1-2', text: 'Marketing and Growth', votes: 879 },
      { id: 'option-1-3', text: 'Security Audits', votes: 1542 },
      { id: 'option-1-4', text: 'Community Events', votes: 654 }
    ],
    isActive: true
  },
  {
    id: 'poll-2',
    title: 'Protocol Upgrade Proposal',
    description: 'Vote on the upcoming protocol upgrade to enhance transaction speeds and reduce gas fees.',
    startDate: '2025-05-03T00:00:00Z',
    endDate: '2025-05-18T23:59:59Z',
    options: [
      { id: 'option-2-1', text: 'Approve Upgrade', votes: 2310 },
      { id: 'option-2-2', text: 'Reject Upgrade', votes: 421 },
      { id: 'option-2-3', text: 'Postpone Decision', votes: 756 }
    ],
    isActive: true
  },
  {
    id: 'poll-3',
    title: 'New Governance Model',
    description: 'Should we adopt a new governance model that gives more voting power to long-term token holders?',
    startDate: '2025-05-05T00:00:00Z',
    endDate: '2025-05-20T23:59:59Z',
    options: [
      { id: 'option-3-1', text: 'Yes, implement time-weighted voting', votes: 1876 },
      { id: 'option-3-2', text: 'No, keep the current model', votes: 932 },
      { id: 'option-3-3', text: 'Need more research', votes: 543 }
    ],
    isActive: true
  }
];

// Sample completed polls
export const completedPolls: Poll[] = [
  {
    id: 'poll-4',
    title: 'Token Burn Proposal',
    description: 'Should we burn 5% of the total token supply to reduce inflation?',
    startDate: '2025-04-01T00:00:00Z',
    endDate: '2025-04-15T23:59:59Z',
    options: [
      { id: 'option-4-1', text: 'Yes, burn tokens', votes: 4782 },
      { id: 'option-4-2', text: 'No, maintain supply', votes: 1251 }
    ],
    isActive: false
  },
  {
    id: 'poll-5',
    title: 'Partnership Selection',
    description: 'Which strategic partnership should we pursue in Q2 2025?',
    startDate: '2025-03-15T00:00:00Z',
    endDate: '2025-03-30T23:59:59Z',
    options: [
      { id: 'option-5-1', text: 'DeFi Protocol Integration', votes: 2134 },
      { id: 'option-5-2', text: 'NFT Marketplace Collaboration', votes: 1876 },
      { id: 'option-5-3', text: 'Cross-Chain Bridge Partnership', votes: 3541 }
    ],
    isActive: false
  }
];

// All polls combined
export const allPolls: Poll[] = [...activePolls, ...completedPolls];

// Get poll by ID
export const getPollById = (id: string): Poll | undefined => {
  return allPolls.find(poll => poll.id === id);
};

// User vote history
export const userVoteHistory: Vote[] = [
  {
    pollId: 'poll-4',
    optionId: 'option-4-1',
    timestamp: '2025-04-10T15:32:21Z',
    voter: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    transactionHash: '0x8cb5f13542947720fab81eb6fc6ef12c10b18c11e57a3c315e8a0f5bb9a8a7c2'
  },
  {
    pollId: 'poll-5',
    optionId: 'option-5-3',
    timestamp: '2025-03-22T09:17:45Z',
    voter: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    transactionHash: '0x6c5e25a3a92126c4b0a0a0a9f037e7d6c7ca4856e8e1545f95a3c2c3d5a9c8b1'
  }
];