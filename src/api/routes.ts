import express from 'express';
import cors from 'cors';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAPIKeys } from '../services/admin/apiKeys';
import { getChatResponse } from '../services/api';
import { Agent } from '@/types/agent';


const router = express.Router();

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Agent-ID'],
  maxAge: 86400 // 24 hours
};

router.use(cors(corsOptions));

// Get Agent Info
router.get('/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const agentRef = doc(db, 'agents', agentId);
    const agentDoc = await getDoc(agentRef);

    if (!agentDoc.exists()) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agentDoc.data();
    return res.json({
      name: agent.name,
      image: agent.image,
      firstMessage: agent.firstMessage
    });
  } catch (error) {
    console.error('Error getting agent:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get API Keys
router.get('/keys', async (req, res) => {
  try {
    const agentId = req.headers['x-agent-id'];
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }

    const agentRef = doc(db, 'agents', agentId as string);
    const agentDoc = await getDoc(agentRef);

    if (!agentDoc.exists()) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const keys = await getAPIKeys();
    if (!keys) {
      return res.status(404).json({ error: 'API keys not found' });
    }

    return res.json({
      openai: keys.openai,
      gemini: keys.gemini
    });
  } catch (error) {
    console.error('Error getting API keys:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    const agentId = req.headers['x-agent-id'];
    const { message } = req.body;

    if (!agentId || !message) {
      return res.status(400).json({ error: 'Agent ID and message are required' });
    }

    const agentRef = doc(db, 'agents', agentId as string);
    const agentDoc = await getDoc(agentRef);

    if (!agentDoc.exists()) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const data = agentDoc.data();

    if (!data) {
      return res.status(404).json({ error: 'Agent data is empty' });
    }

    // Transform `data` to match `Agent` type
    const agent: Agent = {
      id: agentId as string,
      userId: data.userId,
      name: data.name,
      language: data.language,
      firstMessage: data.firstMessage,
      image: data.image,
      systemPrompt: '',
      voiceSettings: {
        volume: 1.0,
        rate: 1.0,
        pitch: 1.0,
        gender: 'male',
        speed: 0,
        accent: 'neutral'
      },
      responseStyle: 'concise',
      interactionMode: 'informative',
      behaviorRules: [],
      llmProvider: 'openai',
      model: 'gpt-3.5-turbo',
      widgetSettings: {
        theme: 'light',
        position: 'bottom-right',
        buttonSize: 'small',
        borderRadius: 'small',
        showAgentImage: false,
        customColors: null
      },
      trainingExamples: [],
      analytics: {
        interactions: [],
      },
      apiKeys: {
        openai: '',
        gemini: ''
      }
    };

    const response = await getChatResponse(message, agent);

    return res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
