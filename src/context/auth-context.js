import React, {useState} from 'react';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';

const AuthContext = React.createContext();

const authMutation = gql`
  mutation authUser($login: String!, $password: String!) {
    authUser(login: $login, password: $password) {
      success
      session
    }
  }
`;

const resethMutation = gql`
  mutation resetPassword($login: String!, $email: String!) {
    resetPassword(login: $login, email: $email) {
      success
    }
  }
`;

const sessionQuery = gql`
  query userSession($session: String!){
    userSession(session: $session){
      success
    }
  }
`;

let session = '';

function AuthProvider(props) {
  const [authUser] = useMutation(authMutation);
  const [resetPassword] = useMutation(resethMutation);
  const [auth, setAuth] = useState(false);

  if (session === '') {
    session = localStorage.getItem('session');
  }

  const {loading, error, data, refetch} = useQuery(sessionQuery,
      {variables: {session}});

  if (loading) return <AuthContext.Provider/>;

  if (loading === false && error === undefined) {
    if (data.userSession.success) {
      if (auth === false) setAuth(true);
    } else if (session !== '') {
      localStorage.setItem('session', '');
      session = '';
      setAuth(false);
    }
  }

  const login = (login, password) => {
    return new Promise(resolve => {
      authUser({
        variables: {
          login: login,
          password: password,
        },
      }).then(async (result) => {
        let success = result.data['authUser'].success;
        if (success) {
          localStorage.setItem('session', result.data['authUser'].session);
          session = result.data['authUser'].session;
          setAuth(true);
        }
        resolve(success);
      });
    });
  };

  const logout = async () => {
    localStorage.setItem('session', '');
    session = '';
    setAuth(false);
  };
  const isLog = () => {
    return auth;
  };

  const getSession = () => {
    return session;
  };

  const reset = (login, email) => {
    return new Promise(resolve => {
      resetPassword({
        variables: {
          login: login,
          email: email,
        },
      }).then((result) => {
        let success = result.data['resetPassword'].success;
        resolve(success);
      });
    });
  };

  return (
      <AuthContext.Provider
          value={{
            login,
            logout,
            isLog,
            getSession,
            reset,
            refetch,
          }} {...props} />
  );
}

const useAuth = () => React.useContext(AuthContext);
export {AuthProvider, useAuth};
