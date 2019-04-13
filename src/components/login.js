import React from 'react'
import { AUTH_TOKEN } from '../constants'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Input, Button, Spinner, Alert, } from 'reactstrap'

const SIGNUP_MUTATION = gql`
    mutation SignupMutation($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
            token
        }
    }
`

const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`

class Login extends React.Component {
    state = {
        login: true,
        email: '',
        password: '',
        name: ''
    }

    _confirm = async data => {
        const { token } = this.state.login ? data.login : data.signup
        this._saveUserData(token)
        this.props.history.push('/')
    }

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }

    render() {
        const { login, email, password, name } = this.state 
        return (
            <div>
                <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
                <div className="flex flex-column">
                    {
                        !login && (
                            <div>
                                <Input 
                                    value={name}
                                    onChange={({target}) => this.setState({ name: target.value })}
                                    type="text"
                                    placeholder="Your name"
                                />
                                <br />
                            </div>
                        )
                    }
                    <Input 
                        value={email}
                        onChange={({target}) => this.setState({ email: target.value })}
                        type="email"
                        placeholder="Your email address"
                    />
                    <br />
                    <Input 
                        value={password}
                        onChange={({target}) => this.setState({ password: target.value })}
                        type="password"
                        placeholder="Choose a safe password"
                    />
                    <br />
                </div>
                <div >
                    <Mutation 
                        mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                        variables={{ email, password, name }}
                        onCompleted={data => this._confirm(data)}
                    >
                        {(mutation, { loading, error }) => (
                            <>
                                <div >
                                    { loading && 
                                        <div className="offset-md-5 offset-lg-5">
                                            <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /> 
                                        </div>
                                    }
                                    { error && 
                                        <Alert color="danger">
                                            { error.message }
                                        </Alert>
                                    }
                                </div>
                                <Button outline color="primary" onClick={mutation} style={{marginRight:10}}>
                                    {login ? 'Login' : 'Create account'}
                                </Button>
                                
                            </>
                        )}
                    </Mutation>
                    
                    <Button outline color="success" onClick={() => this.setState({ login: !login })}>
                        {login ? 'Need to create an account?' : 'Already have an account?'}
                    </Button>
                </div>
            </div>
        )
    }
}

export default Login