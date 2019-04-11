import React from 'react'
import Link from './link'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const FEED_QUERY = gql `
{
    feed {
      links {
        id
        createdAt
        description
        url
      }
    }
  }
`

class LinkList extends React.Component {
    render() {
        return (
            <Query query={FEED_QUERY}>
                {({ loading, error, data }) => {
									if(loading) return <div>Loading...</div>
									if(error) return <div>Something went wrong!</div>

									const linksToRender = data.feed.links

									return (
										<div>
											{linksToRender.map(link =>
												<Link 
														key={link.id} 
														link={link} 
												/>
											)}
										</div>
									)
								}
              }
            </Query>
        )
    }
}

export default LinkList