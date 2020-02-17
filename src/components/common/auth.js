import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loading from './load';

export default function(ComposedClass){
    class Auth extends Component {
        constructor(props) {
              super(props);
              this.state = {
              };
        }
  
        componentDidMount(){
            const { authenticated, authenticating, history } = this.props;
            if(!authenticating){
                if(authenticated){
                    console.log("Login")
                }else{
                    history.push('/login')
                }
            }else{
                if(!authenticated){
                    history.push('/login')
                }
            }
        }
  
        render() {
            const { authenticated, authenticating } = this.props;
            // TODO: redirects
            if(authenticating) {
                return <Loading />
            } else {
                if(authenticated) {
                    return <ComposedClass {...this.props}/>
                } else {
                    return <div></div>
                }

            }
  
        }
    }
  
    // Retrieve data from store as props
    function mapStateToProps(store) {
        return {
            offline: store.offline,
            authenticating: store.user.authenticating,
            authenticated: store.user.authenticated
        };
    }

    return connect(mapStateToProps)(Auth);
}