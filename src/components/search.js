import React from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './link'
import { Input, Button, Col, InputGroup, InputGroupAddon, ListGroup, Alert, Spinner } from 'reactstrap'

const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($filter: String!) {
        feed(filter: $filter) {
            links {
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
    }
`

class Search extends React.Component {
    state = {
        loading: false,
        links: [],
        filter: '',
        msg: null
    }

    _executeSearch = async () => {
        const { filter } = this.state
        this.setState({ loading: true })
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter },
        })

        const links = result.data.feed.links

        this.setState({ 
            links, 
            loading: result.loading, 
            msg: !result.data.feed.length ? 'No result found' : null 
        })
    }

    render() {
        const { links, filter, loading, msg } = this.state
        return (
            <div>
                <Col>
                    <InputGroup>
                        <Input 
                            type="text"
                            value={filter}
                            onChange={({target}) => this.setState({ filter: target.value })}
                        />
                        <InputGroupAddon addonType="append">
                        <Button 
                            color="secondary" 
                            onClick={() => this._executeSearch()}
                        >
                            Search
                        </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    <br />
                   <ListGroup>
                   {loading && (
                        <div class="offset-md-5 offset-lg-5 offset-sm-5 offset-xs-5">
                            <Spinner 
                                style={{ width: '3rem', height: '3rem' }} 
                                type="grow" 
                            />
                        </div>
                    )}
                        {!links.length && !loading && (
                            <Alert color={msg ? "danger" : "info"} style={{textAlign:'center'}}>
                                {msg ? msg : 'List is empty'}
                            </Alert>
                        )}
                        {links.map((link, i) => <Link key={link.id} link={link} i={i} />)}
                    </ListGroup>
                </Col>
            </div>
        )
    }
}

export default withApollo(Search)