import gql from 'graphql-tag';

const QUERY_GET_PAGE_COOKIE = gql`
query {
  getPageCookie {
    doc {
      title
      content
    }
  }
}
`;

export default QUERY_GET_PAGE_COOKIE;
