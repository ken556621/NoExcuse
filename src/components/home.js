import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './common/firebase';

import '../styles/home.scss';
import Logo from '../../img/logo.png';




class HomePage extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const { dispatch } = this.props;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('Login success');
              dispatch({ type: 'LOGIN_SUCCESS' });
            } else {
              console.log('Not login yet')
            }
        });
    }

    logout = () => {
        const { dispatch, history } = this.props;
        firebase.auth().signOut()
        .then(function() {
            console.log('logout');
            dispatch({ type: 'LOGOUT' });
            history.push('/login');
        })
        .catch(function(error) {
            console.log(error)
        });
    }

    render() { 
        return ( 
            <div className="homepage-container">
                <nav>
                    <div className="logo">
                        <Link to='/'>
                           <img src= { Logo }/>
                        </Link>
                    </div>
                    <div className="login">
                        <Link to='/login'>
                            <div className={ this.props.authenticated ? 'hide' : 'show' }>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Login</span>
                            </div>
                        </Link>
                            <div className={ this.props.authenticated ? 'show' : 'hide' } onClick={ this.logout }>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Logout</span>
                            </div>
                    </div>
                </nav>
                <main>
                    <div className="banner">
                        <div className="btn-wrapper">
                            <Link to='/people'>
                                <div className="find-people">
                                    找人
                                </div>
                            </Link>
                            <Link to='/place'>
                                <div className="find-place">
                                    找場
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
 
function mapStateToProps(store) {
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    };
}


 
export default connect(mapStateToProps)(HomePage);