import apolloClient from '../client/poc-bff/client-back';
import QUERY_GET_HEADER from '../client/poc-bff//queries/getHeader';

const Home = ({ header }) => {
  return (
    <div>
      <ul>
        { header?.menu.map((item, key) => (
            <li key={key}>
              <a href={item.links.url}>{item.links.title}</a>
            </li>
          ))}
      </ul>
    </div>
  )
};

export const getServerSideProps = async ({ res, query }) => {
  try {
    const graphqlQuery = await apolloClient.query({
      query: QUERY_GET_HEADER,
      fetchPolicy: 'no-cache'
    });

    const header = graphqlQuery.data.getHeader;

    return {
      props: {
        header
      }
    };
  } catch (error) {
    console.log('Oops! … Did It Again', { error });
    return { props: {} };
  }
};


export default Home;
