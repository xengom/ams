import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { getGlobalStateService } from './extAPIServices/getGlobalStateService';

async function initializeGlobalStates() {
  const globalStateService = getGlobalStateService.getInstance();
  
  try {
    console.log('Initializing global states...');
    await Promise.all([
      globalStateService.getStates('token'),
      globalStateService.getStates('exchangeRate')
    ]);
    console.log('Global states initialized successfully');
    
    globalStateService.startExchangeRateTimer();
    globalStateService.startTokenTimer();
  } catch (error) {
    console.error('Failed to initialize global states:', error);
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// 서버 시작 전에 전역 상태 초기화
initializeGlobalStates().then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});