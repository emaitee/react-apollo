import React from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap'

class Header extends React.Component {
    state = {
        isOpen: false
    }
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
            <Navbar color="light" light expand="md" style={{marginBottom: 10}}>
                <NavbarBrand className="logo" href="/">Hacker News</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Link to="/" >
                            <NavLink>Home</NavLink>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/search" >
                            <NavLink>Search</NavLink>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/top" >
                            <NavLink>Top</NavLink>
                        </Link>
                    </NavItem>
                    {authToken && (
                        <NavItem>
                            <Link to="/create">
                                <NavLink>Submit</NavLink>
                            </Link>
                        </NavItem>
                    )}
                    <NavItem>
                        {authToken ? (
                            <NavLink 
                                onClick={() => {
                                localStorage.removeItem(AUTH_TOKEN)
                                this.props.history.push('/')
                            }}
                            >Logout</NavLink>
                        ): (
                            <Link to="/login">
                                <NavLink>Login</NavLink>
                            </Link> 
                        )}
                    </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}

export default withRouter(Header)