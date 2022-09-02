import gql from 'graphql-tag';

const QUERY_GET_PAGE_RULE = gql`
query {
  getPageRule {
    doc {
      title
      content
    }
  }
}
`;

export default QUERY_GET_PAGE_RULE;
