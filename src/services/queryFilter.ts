interface QueryData {
  sessionId: string;
  interactionId: string;
  query: string;
  // ... other relevant data ...
}

const queryData: QueryData[] = [
  { sessionId: 'session1', interactionId: 'interaction1', query: 'What is the weather?' },
  { sessionId: 'session1', interactionId: 'interaction2', query: 'What time is it?' },
  { sessionId: 'session2', interactionId: 'interaction3', query: 'How do I get to the airport?' },
  { sessionId: 'session3', interactionId: 'interaction4', query: 'What is the meaning of life?' },
  { sessionId: 'session2', interactionId: 'interaction5', query: 'What is the capital of France?' }
];


/**
 * Filters queries based on session ID and/or interaction ID.
 *
 * @param sessionId - The session ID to filter by (optional).
 * @param interactionId - The interaction ID to filter by (optional).
 * @returns An array of queries matching the filter criteria.  Returns all queries if both IDs are null or undefined.
 */
export function filterQueries(sessionId?: string, interactionId?: string): QueryData[] {
  if (!sessionId && !interactionId) {
    return queryData; // Return all queries if no filter criteria are provided
  }

  return queryData.filter(query => {
    const sessionMatch = !sessionId || query.sessionId === sessionId;
    const interactionMatch = !interactionId || query.interactionId === interactionId;
    return sessionMatch && interactionMatch;
  });
}


// Example usage:
const queriesForSession1 = filterQueries('session1');
console.log('Queries for session1:', queriesForSession1);

const queriesForInteraction3 = filterQueries(undefined, 'interaction3');
console.log('Queries for interaction3:', queriesForInteraction3);

const queriesForSession2Interaction5 = filterQueries('session2', 'interaction5');
console.log('Queries for session2 and interaction5:', queriesForSession2Interaction5);

const allQueries = filterQueries();
console.log('All queries:', allQueries);
