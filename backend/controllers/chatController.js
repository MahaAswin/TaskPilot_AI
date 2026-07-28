import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

// Internal memory cache of mock conversations to allow stateful interactions (Rename, Pin, Delete, Favorite)
let mockChats = [
  { 
    _id: 'chat-mock-1', 
    title: 'Biology Study Companion', 
    folder: 'Studies',
    isPinned: true, 
    isFavorite: true, 
    updatedAt: new Date(Date.now() - 3600000) 
  },
  { 
    _id: 'chat-mock-2', 
    title: 'Roadmap Orchestration Guide', 
    folder: 'Projects',
    isPinned: true, 
    isFavorite: false, 
    updatedAt: new Date(Date.now() - 7200000) 
  },
  { 
    _id: 'chat-mock-3', 
    title: 'Weekly Workout Schedule Planner', 
    folder: 'Personal',
    isPinned: false, 
    isFavorite: true, 
    updatedAt: new Date(Date.now() - 86400000) 
  },
  { 
    _id: 'chat-mock-4', 
    title: 'Water Cycle Flowchart Project', 
    folder: 'Studies',
    isPinned: false, 
    isFavorite: false, 
    updatedAt: new Date(Date.now() - 172800000) 
  }
];

// Initial mock messages map
let mockMessages = {
  'chat-mock-1': [
    {
      _id: 'msg-1',
      sender: 'user',
      content: 'Explain the mitochondria in a simple table and outline a study checklist.',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      _id: 'msg-2',
      sender: 'assistant',
      content: `### 🔋 The Mitochondria Summary

The mitochondria is widely known as the powerhouse of the cell, generating adenosine triphosphate (ATP).

#### Key Components
| Part | Function | Description |
| :--- | :--- | :--- |
| **Outer Membrane** | Protection | Contains porins for molecule pass-through |
| **Inner Membrane** | ATP Synthase | Folded into cristae to maximize surface area |
| **Matrix** | Krebs Cycle | Fluid containing enzymes, DNA, and ribosomes |

#### Study Checklist
- [x] Review membranes structure
- [ ] Diagram Krebs Cycle steps
- [ ] Self-test on oxidative phosphorylation`,
      agentTraces: [
        { agentName: 'CoordinatorAgent', status: 'completed', message: 'Analyzed request intent. Assigned biology topics.' },
        { agentName: 'KnowledgeAgent', status: 'completed', message: 'Queried academic database for mitochondria functions.' },
        { agentName: 'TaskAgent', status: 'completed', message: 'Generated active checklist tasks.' }
      ],
      createdAt: new Date(Date.now() - 3590000)
    }
  ]
};

/**
 * @desc    Retrieve user's historical chat sessions
 * @route   GET /api/chat
 * @access  Private
 */
export const getChatSessions = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, mockChats, 'Historical sessions retrieved');
});

/**
 * @desc    Initialize a chat session
 * @route   POST /api/chat
 * @access  Private
 */
export const createChatSession = asyncHandler(async (req, res) => {
  const newChat = {
    _id: `chat-mock-${Date.now()}`,
    title: req.body.title || 'New AI Productivity Session',
    folder: req.body.folder || 'Default',
    isPinned: false,
    isFavorite: false,
    updatedAt: new Date()
  };

  mockChats.unshift(newChat);
  mockMessages[newChat._id] = [];

  return ApiResponse.created(res, newChat, 'Conversation session initialized');
});

/**
 * @desc    Update conversation session variables (Pin, Favorite, Rename)
 * @route   PUT /api/chat/:id
 * @access  Private
 */
export const updateChatSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, isPinned, isFavorite, folder } = req.body;

  const chatIdx = mockChats.findIndex(c => c._id === id);
  if (chatIdx === -1) {
    return res.status(404).json({ success: false, message: 'Chat session not found' });
  }

  const updatedChat = { ...mockChats[chatIdx] };
  if (title !== undefined) updatedChat.title = title;
  if (isPinned !== undefined) updatedChat.isPinned = isPinned;
  if (isFavorite !== undefined) updatedChat.isFavorite = isFavorite;
  if (folder !== undefined) updatedChat.folder = folder;
  updatedChat.updatedAt = new Date();

  mockChats[chatIdx] = updatedChat;

  return ApiResponse.success(res, updatedChat, 'Conversation variables updated');
});

/**
 * @desc    Delete a chat session
 * @route   DELETE /api/chat/:id
 * @access  Private
 */
export const deleteChatSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mockChats = mockChats.filter(c => c._id !== id);
  delete mockMessages[id];

  return ApiResponse.success(res, { id }, 'Conversation deleted successfully');
});

/**
 * @desc    Get all messages inside a conversation session
 * @route   GET /api/chat/:id/messages
 * @access  Private
 */
export const getChatMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const messages = mockMessages[id] || [];
  return ApiResponse.success(res, messages, 'Conversation messages retrieved');
});

/**
 * @desc    Send a message to the coordinator agent
 * @route   POST /api/chat/:id/message
 * @access  Private
 */
export const postChatMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!mockMessages[id]) {
    mockMessages[id] = [];
  }

  // Save user message
  const userMsg = {
    _id: `msg-${Date.now()}-user`,
    sender: 'user',
    content: prompt,
    createdAt: new Date()
  };
  mockMessages[id].push(userMsg);

  // Generate structured multi-agent response
  const lowerPrompt = prompt.toLowerCase();
  let aiResponse = '';
  let traces = [];

  if (lowerPrompt.includes('roadmap') || lowerPrompt.includes('plan')) {
    aiResponse = `### 🗺️ Custom Strategic Roadmap

Here is your step-by-step development roadmap:

1. **Phase 1: Project Initiation**
   - Define database models.
   - Configure REST endpoint validations.
2. **Phase 2: Authentication Handlers**
   - Secure passwords hashing with bcrypt.
   - Enforce JWT token authorizations.

#### Project Milestones
| Milestone | Timeline | Deliverables |
| :--- | :--- | :--- |
| **M1: Architecture** | Week 1 | Folder scaffolding |
| **M2: Security** | Week 2 | JWT route safeguards |
| **M3: Release** | Week 3 | Client page interfaces |`;
    
    traces = [
      { agentName: 'CoordinatorAgent', status: 'completed', message: 'Routed to schedule planner agent.' },
      { agentName: 'PlannerAgent', status: 'completed', message: 'Calculated project milestones and Gantt charts.' },
      { agentName: 'TaskAgent', status: 'completed', message: 'Queued deliverables list into tasks board.' }
    ];
  } else if (lowerPrompt.includes('chart') || lowerPrompt.includes('mindmap')) {
    aiResponse = `### 🎨 Visual Layout Generated

Below is the structured schematic breakdown of your request.

#### Diagram Summary
- **Nodes**: 4 Active components
- **Links**: Unidirectional flows
- **Topic**: Data processing engine

*Double-click the tab on the right panel preview deck to view high-fidelity mock representations.*`;

    traces = [
      { agentName: 'CoordinatorAgent', status: 'completed', message: 'Assigned request to Creative agent.' },
      { agentName: 'CreativeAgent', status: 'completed', message: 'Rendered mind map nodes hierarchy.' }
    ];
  } else {
    aiResponse = `### 🚀 Coordinator Core Output

Thank you for your prompt: *"${prompt}"*.

Here is a summary list of operational details:
- **Status**: Scaffolding active.
- **Service**: REST API routes are fully mapped.
- **Scope**: Multi-agent timeliners are running.

| Parameter | Configuration | Value |
| :--- | :--- | :--- |
| Core | Express.js | Mapped |
| Client | React/Vite | Compiling |`;

    traces = [
      { agentName: 'CoordinatorAgent', status: 'completed', message: 'Analyzed request intent. No sub-agent required.' },
      { agentName: 'ProductivityCoach', status: 'completed', message: 'Tracked response parameters score.' }
    ];
  }

  const aiMsg = {
    _id: `msg-${Date.now()}-ai`,
    sender: 'assistant',
    content: aiResponse,
    agentTraces: traces,
    createdAt: new Date()
  };

  mockMessages[id].push(aiMsg);

  // Update conversation timestamp
  const chatIdx = mockChats.findIndex(c => c._id === id);
  if (chatIdx !== -1) {
    mockChats[chatIdx].updatedAt = new Date();
  }

  return ApiResponse.success(res, aiMsg, 'Message response processed');
});

/**
 * @desc    Mock upload attachment zone
 * @route   POST /api/chat/upload
 * @access  Private
 */
export const uploadChatFile = asyncHandler(async (req, res) => {
  const mockFile = {
    name: req.body.name || 'document_upload.pdf',
    size: req.body.size || 102456,
    type: req.body.type || 'application/pdf',
    ocrTextPlaceholder: 'Simulated OCR extracted text content for analysis...'
  };

  return ApiResponse.success(res, mockFile, 'File uploaded and parsed successfully');
});

/**
 * @desc    Mock export conversation
 * @route   POST /api/chat/:id/export
 * @access  Private
 */
export const exportChatHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { format } = req.body; // 'pdf', 'docx', 'md', 'txt'

  const downloadLink = `/api/chat/${id}/download?format=${format}`;
  return ApiResponse.success(res, { downloadLink }, `Conversation compiled to ${format.toUpperCase()} format`);
});
