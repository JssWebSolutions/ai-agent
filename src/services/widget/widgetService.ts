import { db } from '../../config/firebase';
import { doc, updateDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import { Agent } from '../../types/agent';

export interface WidgetInteraction {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  responseTime: number;
  successful: boolean;
}

export async function updateWidgetSettings(
  agentId: string, 
  settings: Agent['widgetSettings']
): Promise<void> {
  try {
    const agentRef = doc(db, 'agents', agentId);
    
    // Clean up the settings object
    const cleanSettings = {
      theme: settings.theme,
      position: settings.position,
      buttonSize: settings.buttonSize,
      borderRadius: settings.borderRadius,
      showAgentImage: settings.showAgentImage,
      customColors: settings.theme === 'custom' 
        ? {
            primary: settings.customColors?.primary || '#3B82F6',
            background: settings.customColors?.background || '#FFFFFF',
            text: settings.customColors?.text || '#1F2937'
          }
        : null
    };

    await updateDoc(agentRef, {
      widgetSettings: cleanSettings,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating widget settings:', error);
    throw new Error('Failed to update widget settings');
  }
}

// Function to save a widget interaction
export async function saveWidgetInteraction(
  agentId: string, 
  interaction: Omit<WidgetInteraction, 'id' | 'timestamp'>
): Promise<void> {
  try {
    const interactionsRef = collection(db, 'agents', agentId, 'interactions');
    
    // Add the interaction with timestamp and generate a unique ID
    await addDoc(interactionsRef, {
      ...interaction,
      timestamp: Timestamp.now(),
      id: Date.now().toString()  // You could use a better unique ID generation strategy here
    });
  } catch (error) {
    console.error('Error saving widget interaction:', error);
    throw new Error('Failed to save widget interaction');
  }
}
