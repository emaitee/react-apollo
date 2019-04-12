import React from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants';

class Header extends React.Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
            <div 
                className="flex pa1 justify-between nowrap" 
                style={{ backgroundColor: 'rgb(19,70,195)', padding:15 }}
            >
                <div className="flex flex-fixed white">
                    <div className="fw7 mr1 logo">
                        Hacker News
                    </div>
                    <Link to="/" className="ml1 no-underline white">New</Link>
                    {authToken && (
                        <div className="flex">
                            <div className="ml1">|</div>
                            <Link to="/create" className="ml1 no-underline white">Submit</Link>
                        </div>
                    )}
                    <div className="flex flex-fixed">
                        {authToken ? (
                            <div 
                                className="ml1 pointer white"
                                onClick={() => {
                                    localStorage.removeItem(AUTH_TOKEN)
                                    this.props.history.push('/')
                                }}
                            >
                                Logout
                            </div>
                        ): (
                            <Link to="/login" className="ml1 no-underline white">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)