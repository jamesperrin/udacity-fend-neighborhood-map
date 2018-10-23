import React, { Component } from 'react';
import './App.css';
import config from './config/config';
import FoursquareAPI from './FoursquareAPI';
import ListVenues from './ListVenues';

class App extends Component {

    state = {
        venues_fakes : [
            { name: 'Café du Monde', id: "4aa59477f964a520dd4820e3", location: {lat: 29.957451318025385, lng: -90.06190001964569} },
            { name: 'Cafe Beignet', id: "4ad4c04df964a52072f320e3", location: {lat: 29.955215743004878, lng: -90.06716251373291} },
            { name: 'Palace Café', id: "4ad4c050f964a520a0f420e3", location: {lat: 29.952902, lng: -90.068193} },
            { name: 'Cafe Pontalba', id: "4bf58dd8d48988d17a941735", location: {lat: 29.957258, lng: -90.063818} },
            { name: 'The Market Cafe', id: "4ae25ec4f964a520be8d21e3", location: {lat: 29.95910391865961, lng: -90.06057170840525} },
            { name: 'Cafe Maspero', id: "4aecf62ef964a52076cc21e3", location: { lat: 29.956004680661643, lng: -90.0634610652136 } }
        ], // Used for testing
        venues: [], // List of Venues
        mapMarkers: [] // Used for accesssing map Markers
    };

    /**
     * @description Retrieves list of Venues from Foursquare API
     */
    getVenues() {
        let searchParams = {
            'near': '29.957431,-90.0629443',
            'query': 'cafe',
            'limit': 10
        };

        // Using Foursquare API to retrieve list of Venues
        FoursquareAPI
            .search(searchParams)
            .then(results => {
                const venues = results.response.venues;

                // Setting state
                this.setState({ venues }, this.renderMap());
            }).catch(err => {
                console.error(err);
            });
    }

    /**
     * @description Renders Google Map
     */
    renderMap() {
        const { apiKey } = config.GoogleMap;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', () => {
            this.initMap();
        });

        // Addin script to web page
        document.body.appendChild(script);
    }

    /**
     * @description Google Map initialization
     */
    initMap() {
        // Create google map to display
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 29.957431, lng: -90.062944 },
            title: 'Udacity FEND Neighborhood Map',
            zoom: 15,
            mapTypeId: 'roadmap'
        });

        // Creates Map Markers
        this.createMapMarkers(map);
    }

    /**
     * @description Create Google Map Markers
     * @param {Object} map Reference to Google Map
     */
    createMapMarkers(map) {
        const { venues } = this.state;
        const infoWindow = new window.google.maps.InfoWindow();
        const bounds = new window.google.maps.LatLngBounds();
        let mapMarkers = [];

        // Shaping Venues' data
        const venuesData = venues.map(venue => {
            return {
                title: venue.name,
                id: venue.id,
                position: {
                    lat: venue.location.lat,
                    lng: venue.location.lng
                }
            };
        });

        // Creating map markers
        venuesData
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
                        .then(results => {
                            const result = results.response.venue;

                            // Shaping Venue details
                            const venueDetails = {
                                name: result.name,
                                adress: result.location.address,
                                cityStateZip: `${result.location.city}, ${result.location.state} ${result.location.postalCode}`,
                                phone: result.contact.formattedPhone,
                                photo: `${result.bestPhoto.prefix}285x210${result.bestPhoto.suffix}`
                            };

                            // Creating InfoWindow content
                            const contentString = `<div class="infoWindow"><strong>${venueDetails.name}</strong><p>${venueDetails.adress}</p><p>${venueDetails.cityStateZip}</p><p>${venueDetails.phone}</p><hr /><img src="${venueDetails.photo}" alt="Venue Image" /><div/>`;

                            infoWindow.setContent(contentString);
                        }).catch(err => { 
                            console.error(err);

                            // Using catch block in case of hitting Foursquare API premium rate limit.
                            // Allows testing of app

                            // Shaping Venue details
                            const venueDetails = {
                                name: venue.name,
                                adress: venue.location.address,
                                cityStateZip: `${venue.location.city}, ${venue.location.state} ${venue.location.postalCode}`,
                                phone: venue.contact.formattedPhone
                            };

                            // Creating InfoWindow content
                            const contentString = `<div class="infoWindow"><strong>${venueDetails.name}</strong><p>${venueDetails.adress}</p><p>${venueDetails.cityStateZip}</p><p>${venueDetails.phone}</p><div/>`;

                            infoWindow.setContent(contentString);
                        });// END FoursquareAPI.getVenueDetails()

                    // Open InfoWindow event
                    infoWindow.open(map, mapMarker);
                }); // END mapMarker.addListener('click')

                // Add marker to array of map markers
                mapMarkers.push(mapMarker);

                // Setting map boundaries
                bounds.extend(mapMarker.position);
        });// END venuesMarkers.forEach()

        // Sizing map based on set boundaries
        map.fitBounds(bounds);

        // Setting state
        this.setState({mapMarkers});
    }

    /**
     * @description Handles Venue list item click event.
     * @param {string} venueId Venue's ID
     */
    handleListItemClick = (venueId) => {
        const { mapMarkers } = this.state;
        const mapMarkerIndex = mapMarkers.findIndex(marker => marker.id === venueId);
        window.google.maps.event.trigger(mapMarkers[mapMarkerIndex], 'click');
    }

    /**
     * @description Updates Google Map Markers' visibility
     * @param {string} venueName - Venue's name
     */
    updateMarkersVisibility = (venueName) => {
        const { venues } = this.state;
        let { mapMarkers } = this.state;

        // Chaning map markers' visible
        mapMarkers = venues.map(venue => {
            const mapMarker = mapMarkers.find(marker => marker.id === venue.id);
            const isMatch = venue.name.toLowerCase().includes(venueName.trim());
            mapMarker.setVisible(isMatch);

            return mapMarker;
        });

        // Setting state
        this.setState({ mapMarkers });
    }

    // Component Did mount event
    componentDidMount() {
        this.getVenues();
    }

    // Component Render() event
    render() {
        return (
            <div className="container">
                <input type='checkbox' id='menu-trigger' className='menu-trigger' />
                <label htmlFor="menu-trigger"></label>
                <div className='venues-wrapper'>
                    <h1>Search for Venues</h1>
                    <ListVenues
                        handleListItemClick={this.handleListItemClick}
                        venues={this.state.venues}
                        updateMarkersVisibility={this.updateMarkersVisibility} />
                </div>
                <div id="map"></div>
            </div>
    );
  }
}

export default App;