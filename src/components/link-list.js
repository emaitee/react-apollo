import React from 'react'
import Link from './link'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ListGroup, Spinner, Alert, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
 query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput){
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        description
        url
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

class LinkList extends React.Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    // const data = store.readQuery({ query: FEED_QUERY })
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy}
    })

    const votedLink = data.feed.links.find(link => link.id === linkId)

    votedLink.votes = createVote.link.votes
    
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if(exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return { first, skip, orderBy }
  }

  _getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new');
    if(isNewPage) {
      return data.feed.links
    }

    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if(page <= data.feeds.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10) 
    if(page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

    render() {
        return (
            <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
                {({ loading, error, data, subscribeToMore }) => {
									if(loading) return (
                    <div class="offset-md-5 offset-lg-5 offset-sm-5 offset-xs-5">
                      <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
                    </div>
                  )

									if(error) return (
                    <Alert color="danger">
                      { error.message }
                    </Alert>
                  )

                  if(!data.feed.links.length) return (
                    <Alert color="info">
                      No links yet. Navigate to "Submit" to add a new link
                    </Alert>
                  )

                  this._subscribeToNewLinks(subscribeToMore)
                  this._subscribeToNewVotes(subscribeToMore)

                  const linksToRender = this._getLinksToRender(data)
                  const isNewPage = this.props.location.pathname.includes('new')
                  const pageIndex = this.props.match.params.page 
                    ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
                    : 0

									return (
										<div>
                      {linksToRender.map((link, index) =>
                        <ListGroup>
                          <Link 
                              key={link.id} 
                              link={link} 
                              index={index}
                              updateStoreAfterVote={this._updateCacheAfterVote}
                          />
                        </ListGroup>
                      )}
                      <br />
                      {isNewPage && (
                        <Pagination>
                          {/* <PaginationItem>
                            <PaginationLink first />
                          </PaginationItem> */}
                          <PaginationItem>
                            <PaginationLink onClick={this._previousPage} previous />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink onClick={this._nextPage} next />
                          </PaginationItem>
                          {/* <PaginationItem>
                            <PaginationLink last />
                          </PaginationItem> */}
                        </Pagination>
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