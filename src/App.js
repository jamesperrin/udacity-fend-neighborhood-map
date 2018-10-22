import React, { Component } from 'react';
import './App.css';
import FoursquareAPI from './FoursquareAPI'
import ListLocations from './ListLocations'
import config from './config/config'

class App extends Component {

    state = {
        venues_test : [
            {name: 'Café du Monde', location: {lat: 29.957451318025385, lng: -90.06190001964569}},
            {name: 'Cafe Beignet', location: {lat: 29.955215743004878, lng: -90.06716251373291}},
            {name: 'Palace Café', location: {lat: 29.952902, lng: -90.068193}},
            {name: 'Cafe Pontalba', location: {lat: 29.957258, lng: -90.063818}},
            {name: 'The Market Cafe', location: {lat: 29.95910391865961, lng: -90.06057170840525}},
            { name: 'Cafe Maspero', location: { lat: 29.956004680661643, lng: -90.0634610652136 } }
        ],
        venues: [],
        markers: [],
        mapMarkers: []
    };

    /**
     * @description Retrieves list of Venues from Foursquare API
     */
    getVenues() {
        let params =             {
            'near': '29.957431,-90.0629443',
            'query': 'cafe',
            'limit': 10
        }

        FoursquareAPI.search(params).then(data => {
            const venues = data.response.venues;
            const markers = venues.map(venue => {
                return {
                    title: venue.name,
                    id: venue.id,
                    position: {
                        lat: venue.location.lat,
                        lng: venue.location.lng
                    },
                    isVisiable: true
                };
            });

            //DEBUG CODE
            // console.log(venues);
            // console.log(markers);

            // Setting state
            this.setState({ venues, markers}, this.renderMap());
        }).catch(err => {
            console.error(err);
        });
    }

    /**
     * @description Google Map initialization
     */
    initMap() {
        const { venues } = this.state;
        let mapMarkers = [];
        const infoWindow = new window.google.maps.InfoWindow();

        // Create google map to display
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 29.957431, lng: -90.062944 },
            title: 'Udacity FEND Neighborhood Map',
            zoom: 15,
            mapTypeId: 'roadmap',
        });

        // Filter map markers
        this.state.markers && this.state.markers
            .filter(marker => marker.isVisiable)
            .forEach(marker => { 
                let mapMarker = new window.google.maps.Marker({
                    map: map,
                    animation: window.google.maps.Animation.DROP,
                    ...marker
                });

                // Add Click event listner to each marker
                mapMarker.addListener('click', function () { 
                    const venue = venues.find(venue => venue.id === marker.id);

                    // Retrieve venue details
                    FoursquareAPI.getVenueDetails(venue.id)
                        .then(res => res)
                        .then(data => {
                            const result = data.response.venue;
                            const name = result.name;
                            const photo = `${result.bestPhoto.prefix}380x280${result.bestPhoto.suffix}`;
                            const adress = result.location.address;
                            const cityState = `${result.location.city}, ${result.location.state} ${result.location.postalCode}`;
                            const formattedPhone = result.contact.formattedPhone;

                            const contentString = `<div class="infoWindow"><strong>${name}</strong><p>${adress}</p><p>${cityState}</p><p>${formattedPhone}</p><hr /><img src="${photo}" alt="Venue Image" /><div/>`;

                            infoWindow.setContent(contentString);
                        }).catch(err => { 
                            console.error(err);
                            const contentString = `<div class="infoWindow"><strong>${venue.name}</strong><div/>`;

                            infoWindow.setContent(contentString);

                        });// END FoursquareAPI.getVenueDetails()

                    // Open InfoWindow
                    infoWindow.open(map, mapMarker);
                });

                // Add marker to array of map markers
                mapMarkers.push(mapMarker);
        });// END markers filter

        // Setting state
        this.setState({mapMarkers});
    }

    /**
     * @description Handles Venue list click event.
     * @param venue_id Venue ID
     */
    handleListItemClick = (venue_id) => {
        const { mapMarkers } = this.state;
        const mapMarkerIndex = mapMarkers.findIndex(marker => marker.id === venue_id);
        window.google.maps.event.trigger(mapMarkers[mapMarkerIndex], 'click');

        //DEBUG CODE
        // const marker = mapMarkers.find(marker => marker.id === venue_id);
        // console.log(marker);
    }

    /**
     * @description Renders Google Map
     */
    renderMap() {
        const ApiKey = config.GoogleMap.apiKey;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${ApiKey}`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => {
            this.initMap();
        });

        document.body.appendChild(script);
    }

    componentDidMount() {
        this.getVenues();
    }

    render() {
        return (
            <div className="container">
                <input type='checkbox' id='menu-trigger' className='menu-trigger' />
                <label htmlFor="menu-trigger"></label>
                <div className='locations-wrapper'>
                    <h1>Search for Venues</h1>
                    <ListLocations handleListItemClick={this.handleListItemClick} venues={this.state.venues} showMenu={this.state.showMenu} />
                </div>
                <div id="map"></div>
            </div>
    );
  }
}

export default App;
