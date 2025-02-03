import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp,
  getDoc,
  arrayUnion,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Agent, Interaction } from '../../types/agent';
import { COLLECTIONS } from '../database/collections';
import { agentConverter } from './converters'; 
import { doc, setDoc } from 'firebase/firestore';
import { updateUserAgentCount } from '../auth/userService';

export interface FirestoreAgent extends Agent {
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

export interface FirestoreInteraction extends Interaction {
  read?: boolean;
}

export async function getUserAgents(userId: string): Promise<Agent[]> {
  if (!userId) {
    return [];
  }

  try {
    const agentsRef = collection(db, COLLECTIONS.AGENTS).withConverter(agentConverter);
    const agentsQuery = query(agentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(agentsQuery);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting agents:', error);
    return [];
  }
}

export async function createAgent(agent: Omit<Agent, 'id'>): Promise<string> {
  if (!agent.userId) {
    throw new Error('User ID is required');
  }

  try {
    // Create base agent data with defaults
    const baseAgent = {
      userId: agent.userId,
      name: agent.name || 'New Agent',
      language: agent.language || 'en',
      firstMessage: agent.firstMessage || 'Hello! How can I help you today?',
      systemPrompt: agent.systemPrompt || 'You are a helpful AI assistant.',
      voiceSettings: {
        gender: agent.voiceSettings?.gender || 'female',
        pitch: agent.voiceSettings?.pitch || 0,
        speed: agent.voiceSettings?.speed || 1,
        accent: agent.voiceSettings?.accent || 'neutral',
        volume: agent.voiceSettings?.volume || 0,
        rate: agent.voiceSettings?.rate || 0
      },
      responseStyle: agent.responseStyle || 'concise',
      interactionMode: agent.interactionMode || 'informative',
      behaviorRules: agent.behaviorRules || [
        "Always be helpful and friendly",
        "Maintain your assigned identity",
        "Use appropriate language and tone", 
        "Be concise but informative"
      ],
      llmProvider: agent.llmProvider || 'openai',
      model: agent.model || 'gpt-3.5-turbo',
      widgetSettings: {
        theme: agent.widgetSettings?.theme || 'light',
        position: agent.widgetSettings?.position || 'bottom-right',
        buttonSize: agent.widgetSettings?.buttonSize || 'medium',
        borderRadius: agent.widgetSettings?.borderRadius || 'medium',
        showAgentImage: agent.widgetSettings?.showAgentImage ?? true,
        customColors: agent.widgetSettings?.customColors || null
      },
      trainingExamples: agent.trainingExamples || [],
      analytics: {
        interactions: []
      },
      apiKeys: {
        openai: null,
        gemini: null
      },
      image: agent.image || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const agentsRef = collection(db, COLLECTIONS.AGENTS).withConverter(agentConverter);
    const docRef = doc(agentsRef);
    const newAgent = {
      ...baseAgent,
      id: docRef.id
    };

    await setDoc(docRef, {
      ...newAgent
    });
    
    try {
      await updateUserAgentCount(agent.userId, 1);
    } catch (error) {
      console.error('Error updating user agent count:', error);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating agent:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create agent: Unknown error');
  }
}

export async function updateAgent(agent: Agent): Promise<void> {
  try {
    const agentRef = doc(db, COLLECTIONS.AGENTS, agent.id).withConverter(agentConverter);
    const { id, ...updateData } = agent;

    // Clean up widget settings
    const widgetSettings = {
      theme: updateData.widgetSettings.theme,
      position: updateData.widgetSettings.position,
      buttonSize: updateData.widgetSettings.buttonSize,
      borderRadius: updateData.widgetSettings.borderRadius,
      showAgentImage: updateData.widgetSettings.showAgentImage,
      customColors: updateData.widgetSettings.theme === 'custom' 
        ? {
            primary: updateData.widgetSettings.customColors?.primary || '#3B82F6',
            background: updateData.widgetSettings.customColors?.background || '#FFFFFF',
            text: updateData.widgetSettings.customColors?.text || '#1F2937'
          }
        : null
    };

    // Clean up API keys - replace undefined with null
    const apiKeys = {
      openai: updateData.apiKeys.openai || null,
      gemini: updateData.apiKeys.gemini || null
    };

    const cleanData = {
      ...updateData,
      widgetSettings,
      apiKeys,
      updatedAt: serverTimestamp()
    };

    await updateDoc(agentRef, cleanData);
  } catch (error) {
    console.error('Error updating agent:', error);
    throw new Error('Failed to update agent');
  }
}

export async function deleteAgent(agentId: string): Promise<void> {
  try {
    const agentRef = doc(db, COLLECTIONS.AGENTS, agentId);
    const agentSnap = await getDoc(agentRef);
    
    if (!agentSnap.exists()) {
      throw new Error('Agent not found');
    }

    const agentData = agentSnap.data();
    await deleteDoc(agentRef);
    
    if (agentData?.userId) {
      await updateUserAgentCount(agentData.userId, -1);
    }
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw new Error('Failed to delete agent');
  }
}

export async function addInteraction(
  agentId: string, 
  interaction: { 
    query: string; 
    response: string; 
    responseTime: number; 
    successful: boolean; 
    conversationId: string;
  }
): Promise<void> {
  try {
    const agentRef = doc(db, COLLECTIONS.AGENTS, agentId);
    const interactionData = {
      id: `interaction-${Date.now()}`,
      ...interaction,
      timestamp: Timestamp.now()
    };

    await updateDoc(agentRef, {
      'analytics.interactions': arrayUnion(interactionData),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding interaction:', error);
    throw new Error('Failed to add interaction');
  }
}