import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Message = mongoose.model('Message', messageSchema);

  export default Message;
  