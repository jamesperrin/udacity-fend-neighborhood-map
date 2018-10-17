import React, { Component } from 'react';
import './App.css';
import ListLocations from './ListLocations'
import FoursquareAPI from './FoursquareAPI'
import config from './config/config'
// import Helpers from './utils/helpers'

class App extends Component {

    state = {
        venues_test : [
            {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
            {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
            {name: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
            {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
            {name: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
            {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ],
        venues: []
    };

    initMap() { 
        // Display the map
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 29.957431, lng: -90.062944},
            zoom: 13,
            mapTypeId: 'roadmap',
        });

        // Add markers to map

    }

    componentDidMount() {
        const ApiKey = config.GoogleMap.apiKey;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${ApiKey}`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => {

            let faParams =             {
                'near': '29.957431,-90.0629443',
                'query': 'cafe',
                'limit': 10
            }

            FoursquareAPI.searchByParams(faParams).then(data => {
                //console.log(data);

                this.setState({
                    venues: data.response.venues
                });
            }).catch(err => {
                console.error(err);
            });

            this.initMap();
        });

        document.body.appendChild(script);
    }

    render() {
        return (
            <div className="container">
                <input type='checkbox' id='menu-trigger' className='menu-trigger' />
                <label htmlFor="menu-trigger"></label>
                <div className='locations-wrapper'>
                    <h1>Search for Venues</h1>
                    <ListLocations venues={this.state.venues} showMenu={this.state.showMenu} />
                </div>
                <div id="map"></div>
            </div>
    );
  }
}

export default App;
