import gql from 'graphql-tag'
/**
 * Mutation to create forum.
 * @exports
 */
export const createForum = gql`
  mutation createForum($name: String!) {
    forum: createForum(name: $name) {
      id
      name
	  UserId
	  slug
    }
  }
`;
/**
 * Query to get current user.
 * @exports
 */
export const getCurrentUser = gql`
  query getCurrentUser {
	  viewer {
		  id
      image
      displayName
	  }
  }
`
/**
 * Get forums.
 * @export
 */
export const getForums = gql`
  query getForums {
    forums {
      id
      name
	  slug
    }
  }
`