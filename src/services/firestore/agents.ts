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
import { Agent } from '../../types/agent';
import { COLLECTIONS } from '../database/collections';
import { agentConverter } from './converters';
import { updateUserAgentCount } from '../auth/userService';


/**
 * Fetches all agents for a specific user. If no agents exist, it creates a default agent.
 * @param userId - The ID of the user.
 * @returns A promise resolving to an array of agents.
 */
export async function getUserAgents(userId: string): Promise<Agent[]> {
  try {
    const agentsRef = collection(db, COLLECTIONS.AGENTS).withConverter(agentConverter);
    const agentsQuery = query(agentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(agentsQuery);
    
    if (querySnapshot.empty) {
      // Add default agent if no agents exist
      const defaultAgent = getDefaultAgent(userId);
      const id = await createAgent(defaultAgent);
      return [{ ...defaultAgent, id }];
    }

    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting agents:', error);
    throw new Error('Failed to load agents');
  }
}


export interface FirestoreAgent extends Agent {
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}



/**
 * Creates a new agent document in Firestore.
 * @param agent - The agent data to create.
 * @returns A promise resolving to the new agent's ID.
 */
export async function createAgent(agent: Omit<Agent, 'id'>): Promise<string> {
  try {
    const agentsRef = collection(db, COLLECTIONS.AGENTS).withConverter(agentConverter);
    const docRef = await addDoc(agentsRef, {
      ...agent,
      image: agent.image ?? null, // Replace undefined with null
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as FirestoreAgent);
    
    // Update user's agent count
    await updateUserAgentCount(agent.userId, 1);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw new Error('Failed to create agent');
  }
}


/**
 * Updates an existing agent document in Firestore.
 * @param agent - The updated agent data.
 */
export async function updateAgent(agent: Agent): Promise<void> {
  try {
    const agentRef = doc(db, COLLECTIONS.AGENTS, agent.id).withConverter(agentConverter);
    const { id, ...updateData } = agent;

    // Clean up widget settings before sending to Firestore
    const widgetSettings = {
      ...updateData.widgetSettings,
      customColors: updateData.widgetSettings.theme === 'custom' 
        ? {
            primary: updateData.widgetSettings.customColors?.primary || '#3B82F6',
            background: updateData.widgetSettings.customColors?.background || '#FFFFFF',
            text: updateData.widgetSettings.customColors?.text || '#1F2937'
          }
        : null
    };

    // Clean up the data before sending to Firestore
    const cleanData = {
      ...updateData,
      updatedAt: serverTimestamp(),
      widgetSettings
    };

    await updateDoc(agentRef, cleanData);
  } catch (error) {
    console.error('Error updating agent:', error);
    throw new Error('Failed to update agent');
  }
}

/**
 * Deletes an agent document from Firestore.
 * @param agentId - The ID of the agent to delete.
 */
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

/**
 * Adds an interaction to an agent's analytics.
 * @param agentId - The ID of the agent.
 * @param interaction - The interaction details.
 */
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

/**
 * Returns the default agent configuration for a user.
 * @param userId - The ID of the user.
 * @returns The default agent configuration.
 */
export function getDefaultAgent(userId: string): Omit<Agent, 'id'> {
  return {
    userId,
    name: 'AI Assistant',
    language: 'en',
    firstMessage: 'Hello! I am your AI assistant. How can I help you today?',
    systemPrompt: 'You are a helpful and friendly AI assistant. Always maintain your assigned identity and characteristics.',
    voiceSettings: {
      gender: 'female',
      pitch: 0,
      speed: 1,
      accent: 'neutral'
    },
    responseStyle: 'detailed',
    interactionMode: 'informative',
    behaviorRules: [
      'Always be helpful and friendly',
      'Maintain your assigned identity',
      'Use appropriate language and tone',
      'Be concise but informative'
    ],
    apiKeys: {
      openai: '',
      gemini: ''
    },
    llmProvider: 'openai',
    model: 'gpt-3.5-turbo',
    widgetSettings: {
      theme: 'light',
      position: 'bottom-right',
      buttonSize: 'medium',
      borderRadius: 'medium',
      showAgentImage: true,
      customColors: null
    },
    trainingExamples: [],
    analytics: {
      interactions: []
    }
  };
}
