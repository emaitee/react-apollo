import React from 'react'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FEED_QUERY } from './link-list'
import { Input, Button } from 'reactstrap'
import { LINKS_PER_PAGE } from '../constants';

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

class CreateLink extends React.Component {
    state = {
        description: '',
        url: ''
    }

    render() {
        const { description, url } = this.state
        return (
            <div>
                <div className="flex flex-column mt3">
                    <Input 
                        className="mb2"
                        value={description}
                        onChange={({ target }) => this.setState({ description: target.value })}
                        type="text"
                        placeholder="A description for the link"
                    />
                    <br />
                    <Input 
                        className="mb2"
                        value={url}
                        onChange={({target}) => this.setState({ url: target.value })}
                        type="text"
                        placeholder="The URL for the link"
                    />
                    <br />
                    <Mutation 
                        mutation={POST_MUTATION} 
                        variables={{ description, url }}
                        onCompleted={() => this.props.history.push('/new/1')}
                        update={(store, { data: { post } }) => {
                            const first = LINKS_PER_PAGE
                            const skip = 0
                            const orderBy = 'createdAt_DESC'
                            const data = store.readQuery({ 
                                query: FEED_QUERY, 
                                variables: { first, skip, orderBy } 
                            })

                            data.feed.links.unshift(post)
                            store.writeQuery({
                                query: FEED_QUERY,
                                data
                            })
                        }}
                    >
                        {(postMutation) => (
                            <Button outline color="primary" onClick={postMutation}>
                                Submit
                            </Button>
                        )}
                    </Mutation>
                </div>
            </div>
        )
    }
}

export default CreateLink