import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type LoginInput = {
  email: Scalars['String'],
  password: Scalars['String'],
};

export type LoginResponse = {
   __typename?: 'LoginResponse',
  accessToken: Scalars['String'],
  user: User,
};

export type Mutation = {
   __typename?: 'Mutation',
  login: LoginResponse,
  logout: Scalars['Boolean'],
  register: User,
  revokeRefreshTokensForUser: Scalars['Boolean'],
};


export type MutationLoginArgs = {
  data: LoginInput
};


export type MutationRegisterArgs = {
  data: RegisterInput
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['Int']
};

export type Query = {
   __typename?: 'Query',
  me: User,
  user: User,
  users: Array<User>,
};


export type QueryUserArgs = {
  uuid: Scalars['String']
};

export type RegisterInput = {
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  uuid: Scalars['ID'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  name: Scalars['String'],
  email: Scalars['String'],
};
export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'uuid' | 'name' | 'email'>
  ) }
);

export const MeDocument = gql`
    query Me {
  me {
    uuid
    name
    email
  }
}
    `;

    export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
      return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
    }
      export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
      
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;