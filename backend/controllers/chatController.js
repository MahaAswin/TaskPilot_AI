import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import coordinatorAgent from '../agents/CoordinatorAgent.js';

// @desc    Create new chat session
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      title: req.body.title || 'New Productivity Session',
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chat sessions for user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages inside a chat session
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) {
      res.status(404);
      return next(new Error('Conversation not found'));
    }

    const messages = await Message.find({ chat: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a chat session and its messages
// @route   DELETE /api/chats/:id
// @access  Private
export const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!chat) {
      res.status(404);
      return next(new Error('Conversation not found'));
    }

    await Message.deleteMany({ chat: req.params.id });
    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Stream Agent outputs & save final response
// @route   POST /api/chats/:id/message
// @access  Private
export const sendMessageStream = async (req, res, next) => {
  const { prompt } = req.body;
  const chatId = req.params.id;

  try {
    // 1. Confirm Chat exists
    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) {
      res.status(404);
      return next(new Error('Conversation session not found'));
    }

    if (!prompt) {
      res.status(400);
      return next(new Error('Prompt is required'));
    }

    // Update chat timestamp
    await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

    // 2. Save User Message
    const userMessage = await Message.create({
      chat: chatId,
      sender: 'user',
      content: prompt,
    });

    // 3. Configure HTTP headers for Streaming (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Notify client user message was saved
    res.write(`data: ${JSON.stringify({ type: 'user_message', payload: userMessage })}\n\n`);

    // Context for agents
    const context = {
      user: req.user,
    };

    // 4. Run Coordinator Agent and stream events
    let assistantResult;
    try {
      assistantResult = await coordinatorAgent.run(prompt, context, (type, payload) => {
        res.write(`data: ${JSON.stringify({ type, payload })}\n\n`);
      });
    } catch (agentErr) {
      res.write(`data: ${JSON.stringify({ 
        type: 'status', 
        payload: { agent: 'CoordinatorAgent', status: 'failed', message: `Fatal Error: ${agentErr.message}` } 
      })}\n\n`);
      res.write(`data: ${JSON.stringify({ 
        type: 'content', 
        payload: `⚠️ **System Integration Error:** ${agentErr.message}` 
      })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    // 5. Gather agent traces and image generation outputs
    // We scan assistantResult content for image tags and extract them so they reside in metadata
    const imageMatches = [...assistantResult.content.matchAll(/!\[(.*?)\]\((https:\/\/image\.pollinations\.ai\/.*?)\)/g)];
    const imagesMeta = imageMatches.map(m => ({
      prompt: m[1],
      url: m[2]
    }));

    // 6. Save Assistant response to DB
    const botMessage = await Message.create({
      chat: chatId,
      sender: 'assistant',
      content: assistantResult.content,
      agentTraces: assistantResult.agentTraces,
      images: imagesMeta
    });

    // Stream saved message info to update frontend IDs
    res.write(`data: ${JSON.stringify({ type: 'assistant_message', payload: botMessage })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('[Chat Streaming Controller Error]', error);
    res.write(`data: ${JSON.stringify({ type: 'error', payload: error.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
};
