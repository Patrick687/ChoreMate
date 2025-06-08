import request from 'supertest';
import { expressApp } from '../../utils/apollo/apolloServer';
import { SignupInput } from '../../generated/graphql-types';

describe('GraphQL Signup', () => {
  it('should sign up a new user', async () => {
    const mutation = `
      mutation Mutation($args: SignupInput) {
        signup(args: $args) {
          user {
            id
            userName
            email
            firstName
            lastName
          }
          token
        }
      }
    `;

    const variables: { args: SignupInput; } = {
      args: {
        email: "testuser@example.com",
        password: "TestPassword123!",
        userName: "testuser",
        firstName: "Test",
        lastName: "User"
      }
    };

    const response = await request(expressApp)
      .post('/graphql')
      .send({ query: mutation, variables });

    expect(response.status).toBe(200);
    expect(response.body.data.signup.user.email).toBe("testuser@example.com");
    expect(response.body.data.signup.token).toBeDefined();
  });
});