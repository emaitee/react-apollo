import React from 'react'
import { AUTH_TOKEN } from '../constants'

class Login extends React.Component {
    state = {
        login: true,
        email: '',
        password: '',
        name: ''
    }

    _confirm = async () => {

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
                            <input 
                                value={name}
                                onChange={({target}) => this.setState({ name: target.value })}
                                type="text"
                                placeholder="Your name"
                            />
                        )
                    }
                    <input 
                        value={email}
                        onChange={({target}) => this.setState({ email: target.value })}
                        type="email"
                        placeholder="Your email address"
                    />
                    <input 
                        value={password}
                        onChange={({target}) => this.setState({ password: target.value })}
                        type="password"
                        placeholder="Choose a safe password"
                    />
                    
                </div>
                <div className="flex mt3">
                    <div className="pointer mr2 button" onClick={() => this._confirm()}>
                        {login ? 'login' : 'create account'}
                    </div>
                    <div className="pointer button" onClick={() => this.setState({ login: !login })}>
                        {login ? 'need to create an account?' : 'already have an account?'}
                    </div>
                </div>
            </div>
        )
    }
}

export default Login