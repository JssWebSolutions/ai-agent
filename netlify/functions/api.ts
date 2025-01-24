import { Handler } from '@netlify/functions';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { getAPIKeys } from '../../src/services/admin/apiKeys';
import { getChatResponse } from '../../src/services/api';

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Agent-ID',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const agentId = event.headers['x-agent-id'];

  try {
    // Get Agent Info
    if (path.startsWith('/agents/') && event.httpMethod === 'GET') {
      const requestedAgentId = path.split('/')[2];
      const agentRef = doc(db, 'agents', requestedAgentId);
      const agentDoc = await getDoc(agentRef);

      if (!agentDoc.exists()) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Agent not found' })
        };
      }

      const agent = agentDoc.data();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          name: agent.name,
          image: agent.image,
          firstMessage: agent.firstMessage,
          widgetSettings: agent.widgetSettings,
          language: agent.language
        })
      };
    }

    // Chat endpoint
    if (path === '/chat' && event.httpMethod === 'POST') {
      if (!agentId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Agent ID is required' })
        };
      }

      const body = JSON.parse(event.body || '{}');
      const { message } = body;

      if (!message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Message is required' })
        };
      }

      const agentRef = doc(db, 'agents', agentId);
      const agentDoc = await getDoc(agentRef);

      if (!agentDoc.exists()) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Agent not found' })
        };
      }

      const agent = agentDoc.data();
      const response = await getChatResponse(message, agent);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ response })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

export { handler };