import React from 'react'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

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
                    <input 
                        className="mb2"
                        value={description}
                        onChange={({ target }) => this.setState({ description: target.value })}
                        type="text"
                        placeholder="A description for the link"
                    />
                    <input 
                        className="mb2"
                        value={url}
                        onChange={({target}) => this.setState({ url: target.value })}
                        type="text"
                        placeholder="The URL for the link"
                    />
                    <Mutation 
                        mutation={POST_MUTATION} 
                        variables={{ description, url }}
                        onCompleted={() => this.props.history.push('/')}
                    >
                        {(postMutation) => (
                            <button onClick={postMutation}>
                                Submit
                            </button>
                        )}
                    </Mutation>
                </div>
            </div>
        )
    }
}

export default CreateLink