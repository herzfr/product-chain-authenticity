import React from 'react';
import useAuth, { AuthProvider } from './services/auth-client.context';
import MainApp from './route-app/main-app';
import MainWeb from './route-app/main-web';


function CoreApp() {
  const { isAuthenticated, identity } = useAuth();
  return (
    <main id="pageContent">
      {isAuthenticated ? <MainApp /> : <MainWeb />}
    </main>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <CoreApp />
    </AuthProvider>
  );
};

export default App
