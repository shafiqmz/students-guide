import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import User from '../models/user.js';

export const getUsersForConversation = async (req, res) => {
    try {
        const user = req.user;

        if (user && user.role) {
            let filteredUsers;

            if (user.role === 'Student') {
                filteredUsers = await User.find({
                    university: user.university,
                    role: { $in: ['Teacher', 'Admin'] },
                    _id: { $ne: user._id },
                }).select('name profilePicture role email');
            } else {
                filteredUsers = await User.find({
                    university: user.university,
                    _id: { $ne: user._id },
                }).select('name profilePicture role email');
            }

            res.json(filteredUsers);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createConversation = async (req, res) => {
    const { participants } = req.body;

    try {
        const existingConversation = await Conversation.find({
            participants: { $all: participants },
        });

        if (existingConversation.length > 0) {
            return res.status(201).json(existingConversation[0]);
        }

        const newConversation = await Conversation.create({ participants });

        res.status(201).json(newConversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getConversationsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const conversations = await Conversation.find({ participants: userId })
            .populate({
                path: 'participants',
                match: { _id: { $ne: userId } },
                select: 'name profilePicture',
            })
            .exec();

        const conversationsWithLastMessage = await Promise.all(
            conversations.map(async (conversation) => {
                const lastMessage = await Message.findOne({ conversation: conversation._id })
                    .sort({ timestamp: -1 })
                    .select('content timestamp sender')
                    .populate('sender', 'name profilePicture')
                    .exec();


                const isRead = !lastMessage ? true : lastMessage.sender._id.toString() === userId ? true : conversation.isRead;

                return lastMessage
                    ? {
                        _id: conversation._id,
                        participants: conversation.participants,
                        isRead: isRead,
                        lastMessage: {
                            content: lastMessage.content,
                            timestamp: lastMessage.timestamp,
                            sender: lastMessage.sender,
                        },
                    }
                    : null;
            })
        );

        const filteredConversations = conversationsWithLastMessage.filter(
            (conversation) => conversation !== null
        );

        const sortedConversations = filteredConversations.sort(
            (a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp
        );

        res.json(sortedConversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const sendMessage = async (req, res) => {
    const { conversationId, sender, content } = req.body;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(sender)) {
            return res.status(404).json({ error: 'Conversation or sender not found' });
        }

        const newMessage = await Message.create({
            conversation: conversationId,
            sender,
            content,
        });

        await Conversation.updateOne(
            { _id: conversationId },
            { $set: { isRead: false } }
        );

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getConversationById = async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
        const conversation = await Conversation.findById(conversationId)
            .populate({
                path: 'participants',
                select: 'name profilePicture _id',
            })
            .exec();

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const currentUser = req.user;

        const oppositeParticipant = conversation.participants.find(
            participant => String(participant._id) !== String(currentUser._id)
        );

        await Conversation.updateOne(
            { _id: conversationId, 'participants': currentUser._id },
            { $set: { isRead: true } }
        );

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name profilePicture')
            .sort({ timestamp: 1 })
            .exec();

        const response = {
            _id: conversation._id,
            participants: [{
                _id: oppositeParticipant._id,
                name: oppositeParticipant.name,
                profilePicture: oppositeParticipant.profilePicture,
            }],
            messages: messages,
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};