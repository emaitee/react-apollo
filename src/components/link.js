import React from 'react'
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from './utils'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ListGroupItem, Row, Col } from 'reactstrap'

const VOTE_MUTATION = gql`
	mutation VoteMutation($linkId: ID!) {
		vote(linkId: $linkId) {
			id
			link {
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

class Link extends React.Component {
	render() {
		const authToken = localStorage.getItem(AUTH_TOKEN)
		return (
			<ListGroupItem>
				<Row>
					<span className="gray">{this.props.index + 1}.</span>
					{authToken && (
						<Mutation 
							mutation={VOTE_MUTATION} 
							variables={{ linkId: this.props.link.id }}
							update={(store, { data: { vote } }) => 
								this.props.updateStoreAfterVote(store, vote, this.props.link.id)
							}
						>
							{voteMutation => (
								<div className="ml1 gray f11" onClick={voteMutation}>
									▲
								</div>
							)}
						</Mutation>
					)}
			
				<Col>
					<div>
						{this.props.link.description} ({ this.props.link.url})
					</div>
					<div>
						{this.props.link.votes.length} votes | by {' '}
						{this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown' }{' '}
						{timeDifferenceForDate(this.props.link.createdAt)}
					</div>
				</Col>
				</Row>
			</ListGroupItem>
		)
	}
}

export default Link