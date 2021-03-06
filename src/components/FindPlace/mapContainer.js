import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper, Polygon } from "google-maps-react";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";

import InfoWindow from "./InfoWindow";
import MapStyle from "./mapStyle";
import Load from "../common/Load";

import "./MapContainer.scss";
import "./InfoWindow.scss"

export class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }
    }
 
    myStyle = {
        width: "95%",
        height: "100%",
        margin: "0 auto"
    }

    displayMarker = (places) => {
        return (
            places.map((place) => {
                return (
                    <Marker 
                        name={ place.name } 
                        position={{ lat: place.location.latitude, lng: place.location.longitude }}
                        address={ place.address }
                        photo={ place.photo }
                        rooms={ place.rooms }
                        key={ place.id }
                        id={ place.id }
                        onClick={ this.clickMarker }
                        icon={ 
                            place.rooms.length === 0 ? 
                            {
                                url: "https://image.flaticon.com/icons/svg/2467/2467984.svg",
                                anchor: new google.maps.Point(32,32),
                                scaledSize: new google.maps.Size(40,40)
                            } :
                            {
                                url: "https://image.flaticon.com/icons/svg/1692/1692975.svg",
                                anchor: new google.maps.Point(32,32),
                                scaledSize: new google.maps.Size(40,40)
                            }
                        }
                    />
                )
            })
        )
    }

    clickMarker = (props, marker, e) => {
        return (
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            })
        )
    }

    onMapClicked = () => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
    };

    clickInfoWindow = (id) => {
        const { history } = this.props;
        history.push(`/placeInfo?${id}`);
    }

    windowHasClosed = () => {
        this.setState({
            showingInfoWindow: false
        })
    }

    render() {
      const { isLoading } = this.props;
      const { polyData, targetPlaces, searchPlaceData, searchAreaData } = this.props.placeData;
      const { zoom, userLat, userLng, defaultLat, defaultLng, mapCenterLat, mapCenterLng } = this.props.coordinates;
      const { searhUserMode, searchPlaceMode, searchAreaMode } = this.props.mode
      const { id, name, address, photo } = this.state.selectedPlace;
      const rooms = this.state.selectedPlace.rooms || [];
      if(isLoading){
          return <Load />
      }
      return (
        <div className="map-container">
            <Map 
                google={ this.props.google } 
                onClick={ this.onMapClicked }
                zoom={ zoom || 15 } 
                styles={ MapStyle }
                style={ this.myStyle }
                initialCenter={{
                    lat: userLat || defaultLat,
                    lng: userLng || defaultLng  
                }}
                center={
                    mapCenterLat ? 
                    {
                        lat: mapCenterLat || defaultLat,
                        lng: mapCenterLng || defaultLng
                    } : 
                    {
                        lat: userLat || defaultLat,
                        lng: userLng || defaultLng
                    }
                }
                >
                { polyData.length !== 0 && searchAreaMode ?
                    <Polygon
                        paths={ polyData }
                        strokeColor="#e8581c"
                        strokeOpacity={1}
                        strokeWeight={2}
                        fillColor="#757575"
                        fillOpacity={0.1}
                    /> : 
                    null
                 }

                <Marker 
                    name={ "Your location" } 
                    position={{ lat: userLat || defaultLat, lng: userLng || defaultLng }}
                    icon={{
                        url: "https://image.flaticon.com/icons/svg/140/140378.svg",
                        anchor: new google.maps.Point(32,32),
                        scaledSize: new google.maps.Size(30,30)
                    }}
                />

            { targetPlaces.length === 0 || !searhUserMode ? null : this.displayMarker(targetPlaces) }
            { !searchPlaceData || !searchPlaceMode ? null : this.displayMarker(searchPlaceData) }
            { searchAreaData.length === 0 || !searchAreaMode ? null : this.displayMarker(searchAreaData) } 

                <InfoWindow 
                    marker={ this.state.activeMarker }
                    visible={ this.state.showingInfoWindow }
                    onClose={ this.windowHasClosed }
                    onClick={ () => this.clickInfoWindow(id, name, address, photo) }
                >
                    <div className="infoWindow-container">
                        <div className="col-left">
                            <img src={ photo } />
                        </div>
                        <div className="col-right">
                            <Typography className="place-name">
                                { name }
                            </Typography>
                            <div className="place-rooms">
                                <div className="groups">
                                    { rooms.length !== 0 ? rooms.map(room => <Typography className="group" key={ id }>{ room.placeName }</Typography>) : <Typography className="default-group-words">目前沒有團</Typography> }
                                </div>
                            </div>
                        </div>
                    </div>
                </InfoWindow>
            </Map>
        </div>
      );
    }
}


function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    }
}


 
export default connect(mapStateToProps)(GoogleApiWrapper({
    apiKey: ("AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o")
})(MapContainer))