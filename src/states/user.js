import gql from 'graphql-tag';

const fullUserQuery = gql(`
  query userSession($session: String!){
    userSession(session: $session){
      user {
        id
        login
        email
        firstName
        lastName
        pack
        packStart
        packEnd
        phone
        personalCount
        locale
        referLink
        referLinkLogin
        direction
        botToken
        avatar {
          full
          half
          personal
          genealogy
          dashboard
        }
        sponsor {
          login
          email
          firstName
          lastName
          phone
          avatar {
            dashboard
          }
        }
        promo {
          summer {
            allow
            start
            pack1
            pack3
            pack7
            end
          }
        }
      }
    }
  }
`);

let id = '';

function getSession() {
  return localStorage.getItem('session');
}

async function readUserSession(client, query, variables = {}) {
  variables.session = getSession();
  return (await client.query({
    query,
    variables,
  })).data.userSession.user;
}

const statistic = {
  Query: {
    user: async (_, __, {client}) => {
      let user = await readUserSession(client, fullUserQuery);
      id = user.id;
      return user;
    },
  },
  Mutation: {
    changeDirection: async (a, {direction}, {client, cache}) => {
      let data = {direction, __typename: 'User'};
      cache.writeData({id: `User:${id}`, data});
      await client.mutate({
        mutation: gql`mutation changeDirection ($session: String!, $direction: Int!){
          changeDirection (session: $session, direction: $direction) {
            success
          }
        }`,
        variables: {session: getSession(), direction},
      });
    },
  },
};

export default statistic;
