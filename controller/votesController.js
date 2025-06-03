import { Votes } from '../model/votesModel.js';
import { Meetings } from '../model/meetingsModel.js';
import { Games } from '../model/gamesModel.js';
import { Player } from '../model/playerModel.js';

export const getAll = async (req, res) => {
    try {
        const votes = await Votes.find()
            .populate('meetingId')
            .populate('voterId')
            .populate('votedForId');
        res.status(200).json(votes);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getByMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        if (!meetingId) {
            return res.status(400).json({
                message: "Meeting ID is required"
            });
        }
        
        const votes = await Votes.find({ meetingId })
            .populate('meetingId')
            .populate('voterId')
            .populate('votedForId');
        res.status(200).json(votes);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const castVote = async (req, res) => {
    try {
        const { meetingId, voterId, votedForId } = req.body;
        
        if (!meetingId || !voterId) {
            return res.status(400).json({
                message: "Meeting ID and voter ID are required"
            });
        }

        // Verify meeting exists and is active
        const meeting = await Meetings.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found"
            });
        }

        if (meeting.endedAt) {
            return res.status(400).json({
                message: "Cannot vote in an ended meeting"
            });
        }

        // Verify game is in voting status
        const game = await Games.findById(meeting.gameId);
        if (!game || game.status !== 'voting') {
            return res.status(400).json({
                message: "Game is not in voting phase"
            });
        }

        // Verify voter is alive
        const isAlive = [...game.playerIds, ...game.impostorIds].some(id => id.toString() === voterId);
        if (!isAlive) {
            return res.status(400).json({
                message: "Dead players cannot vote"
            });
        }

        // Check if voter has already voted in this meeting
        const existingVote = await Votes.findOne({ meetingId, voterId });
        if (existingVote) {
            return res.status(400).json({
                message: "Player has already voted in this meeting"
            });
        }

        // Verify voter exists
        const voter = await Player.findById(voterId);
        if (!voter) {
            return res.status(404).json({
                message: "Voter not found"
            });
        }

        // If voting for someone, verify they exist and are alive
        if (votedForId) {
            const votedFor = await Player.findById(votedForId);
            if (!votedFor) {
                return res.status(404).json({
                    message: "Voted player not found"
                });
            }

            const isVotedForAlive = [...game.playerIds, ...game.impostorIds].some(id => id.toString() === votedForId);
            if (!isVotedForAlive) {
                return res.status(400).json({
                    message: "Cannot vote for dead players"
                });
            }
        }

        // Create the vote (votedForId can be null for skip votes)
        const newVote = new Votes({
            meetingId,
            voterId,
            votedForId: votedForId || null,
            votedAt: new Date()
        });

        const savedVote = await newVote.save();

        const populatedVote = await Votes.findById(savedVote._id)
            .populate('meetingId')
            .populate('voterId')
            .populate('votedForId');

        res.status(201).json(populatedVote);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const getVoteResults = async (req, res) => {
    try {
        const { meetingId } = req.params;
        if (!meetingId) {
            return res.status(400).json({
                message: "Meeting ID is required"
            });
        }

        // Get all votes for this meeting
        const votes = await Votes.find({ meetingId })
            .populate('voterId')
            .populate('votedForId');

        // Count votes
        const voteCount = {};
        let skipVotes = 0;

        votes.forEach(vote => {
            if (vote.votedForId) {
                const playerId = vote.votedForId._id.toString();
                voteCount[playerId] = (voteCount[playerId] || 0) + 1;
            } else {
                skipVotes++;
            }
        });

        // Find player with most votes
        let ejectedPlayer = null;
        let maxVotes = 0;
        let tie = false;

        for (const [playerId, count] of Object.entries(voteCount)) {
            if (count > maxVotes) {
                maxVotes = count;
                ejectedPlayer = playerId;
                tie = false;
            } else if (count === maxVotes && maxVotes > 0) {
                tie = true;
            }
        }

        // If tie or no majority, no one gets ejected
        if (tie || maxVotes <= skipVotes) {
            ejectedPlayer = null;
        }

        const results = {
            totalVotes: votes.length,
            voteCount,
            skipVotes,
            ejectedPlayer: ejectedPlayer ? await Player.findById(ejectedPlayer) : null,
            tie: tie,
            votes: votes
        };

        res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const ejectPlayer = async (req, res) => {
    try {
        const { gameId, playerId } = req.body;
        
        if (!gameId || !playerId) {
            return res.status(400).json({
                message: "Game ID and player ID are required"
            });
        }

        // Verify game exists
        const game = await Games.findById(gameId);
        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        // Remove player from both playerIds and impostorIds
        await Games.findByIdAndUpdate(gameId, {
            $pull: { 
                playerIds: playerId,
                impostorIds: playerId
            }
        });

        const updatedGame = await Games.findById(gameId)
            .populate('playerIds')
            .populate('impostorIds');

        res.status(200).json({
            message: "Player ejected successfully",
            game: updatedGame
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}
