const express = require('express');
const router = express.Router();
const blockchainService = require('../services/mockBlockchain');

/**
 * GET /api/results
 * Retrieve current voting results from the blockchain
 */
router.get('/results', (req, res) => {
    try {
        const results = blockchainService.getResults();
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * POST /api/vote
 * Cast a vote for a candidate
 */
router.post('/vote', (req, res) => {
    // Current frontend sends: { voterId, candidateId } but "candidateId" holds the name "Candidate A"
    // Adjusting extraction to match frontend expectation or backend service
    const { voterId, candidate } = req.body;
    // Support both naming conventions if needed, or stick to one. 
    // mockBlockchain uses 'vote(voterId, candidate)'
    // We will assume frontend sends { voterId, candidate: "Candidate A" }

    if (!voterId || !candidate) {
        return res.status(400).json({ message: 'Voter ID and Candidate are required' });
    }

    try {
        const receipt = blockchainService.vote(voterId, candidate);
        res.json({ 
            message: 'Vote cast successfully', 
            receipt 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
