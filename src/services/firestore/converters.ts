import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { User } from '../../types/auth';
import { Agent } from '../../types/agent';

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => ({
    ...user,
    createdAt: user.createdAt ? Timestamp.fromDate(user.createdAt) : Timestamp.now(),
    lastLogin: user.lastLogin ? Timestamp.fromDate(user.lastLogin) : Timestamp.now(),
    updatedAt: Timestamp.now()
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as User;
  }
};

export const agentConverter: FirestoreDataConverter<Agent> = {
  toFirestore: (agent: Agent) => {
    const data = {
      ...agent,
      analytics: {
        interactions: agent.analytics.interactions.map(int => ({
          ...int,
          timestamp: int.timestamp instanceof Date
            ? Timestamp.fromDate(int.timestamp)
            : int.timestamp ? Timestamp.fromDate(new Date(int.timestamp)) : Timestamp.now()
        }))
      },
      updatedAt: Timestamp.now(),
      createdAt: agent.createdAt || Timestamp.now()
    };

    const { id, ...cleanData } = data;
    return cleanData;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      analytics: {
        interactions: (data.analytics?.interactions || []).map((int: any) => ({
          ...int,
          timestamp: int.timestamp instanceof Timestamp
            ? int.timestamp.toDate()
            : new Date(int.timestamp)
        }))
      },
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as unknown as Agent;
  }
};
