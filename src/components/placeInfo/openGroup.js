import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';
import NavBar from '../common/navbar';
import { storeGroups } from '../../actions/group.action';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import '../../styles/openGroup.scss';

class OpenGroup extends Component {
    constructor(props){
        super(props)
        this.state = { 
            name: '',
            people: '',
            date: '',
            time: '',
            intensity: ''
        }
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.standard-basic-name')){
            this.setState({
                name: e.target.value
            })
        }else if(targetElement.matches('.standard-basic-people')){
            this.setState({
                people: e.target.value
            })
        }else if(targetElement.matches('.standard-basic-date')){
            this.setState({
                date: e.target.value
            })    
        }else if(targetElement.matches('.standard-basic-time')){
            this.setState({
                time: e.target.value
            })    
        }else if(targetElement.matches('.standard-basic-intensity')){
            this.setState({
                intensity: e.target.value
            })
        }
    }

    handleSubmit = () => {
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        const uid = this.props.uid;
        const { name, people, date, time, intensity } = this.state;

        db.collection("rooms").doc().set(
           {
            host: uid,
            place_ID: place_ID,
            name: name,
            people_need: people,
            date: date,
            time: time,
            intensity: intensity,
            participants: [],
            store_time: new Date() 
           }
        )
        .then(() => {
            const { dispatch, history } = this.props;
            console.log("Document successfully written!");
            dispatch(storeGroups(uid, name, people, time, intensity));
            history.push(`/placeInfo?${place_ID}`);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
    }

    render() { 
        return ( 
            <div className="open-group-container">
                <NavBar history={ this.props.history }/>
                <div className="form">
                    <Typography variant="h3" gutterBottom>
                        Open Group
                    </Typography>
                    <TextField className="standard-basic-name" label="Name (Required)" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-people" type="number" label="People Needed (Required)" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-date" type="date" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-time" type="string" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-intensity" label="Intensity" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <Button className="submit-btn" variant="contained" color="primary" onClick={ this.handleSubmit }>
                        Submit
                    </Button>
                </div>
            </div>
        );
    }
}
 

function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating,
        uid: store.user.uid
    }
}


 
export default connect(mapStateToProps)(OpenGroup);

