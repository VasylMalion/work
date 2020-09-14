import React from 'react';
import {useAuth} from './context/auth-context';
import './style/App.scss';

const AuthenticatedApp = React.lazy(() => import('./authenticated-app'));
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'));

function App() {
  const user = useAuth();
  return user.isLog() ? <AuthenticatedApp/> : <UnauthenticatedApp/>;
}

export default App;
