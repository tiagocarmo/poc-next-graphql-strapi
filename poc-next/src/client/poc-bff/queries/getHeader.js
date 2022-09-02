import gql from 'graphql-tag';

const QUERY_GET_HEADER = gql`
query {
  getHeader {
    menu {
      links {
        title
        url
        external
      }
    }
  }
}
`;

export default QUERY_GET_HEADER;
