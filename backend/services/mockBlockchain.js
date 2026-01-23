/**
 * Mock Blockchain Service
 * Simulates a blockchain smart contract interaction layer.
 * In a real application, this would use web3.js or ethers.js to communicate with an Ethereum node.
 */
class MockBlockchainService {
    constructor() {
        console.log("Initializing Mock Blockchain Service...");
        this.chain = [];
        this.votes = {
            "Candidate A": 0,
            "Candidate B": 0,
            "Candidate C": 0
        }; 
        this.voters = {}; 
        this.votingOpen = true;
    }

    /**
     * Checks if a voter has already voted
      @param {string} voterId 
     @returns {boolean}
     */
    hasVoted(voterId) {
        return !!this.voters[voterId];
    }

    vote(voterId, candidate) {
        if (!this.votingOpen) {
            throw new Error("Voting is closed.");
        }

        if (this.hasVoted(voterId)) {
            throw new Error("You have already voted. Cannot vote again.");
        }

        if (this.votes[candidate] === undefined) {
            throw new Error("Invalid candidate.");
        }

        // Record vote
        this.votes[candidate]++;
        this.voters[voterId] = true;

        const block = {
            index: this.chain.length + 1,
            timestamp: new Date().toISOString(),
            data: { voterId, candidate },
            previousHash: "0x" + Math.random().toString(16).substr(2, 40)
        };
        this.chain.push(block);

        console.log(`[Blockchain] New Block Mined: User ${voterId} voted for ${candidate}`);
        return { transactionHash: "0x" + Math.random().toString(16).substr(2, 64), blockNumber: this.chain.length };
    }

    getResults() {
        return this.votes;
    }
}

module.exports = new MockBlockchainService();
