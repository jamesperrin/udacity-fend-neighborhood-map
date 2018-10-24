import React, { Component } from 'react';
import './App.css';
import config from './config/config';
import FoursquareAPI from './FoursquareAPI';
import ListVenues from './ListVenues';

class App extends Component {

    state = {
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
                    icon: config.GoogleMap.icon.default,
                    ...marker
                });

                // Add marker to array of map markers
                mapMarkers.push(mapMarker);

                // Setting map boundaries
                bounds.extend(mapMarker.position);

                // Add Click event listner to each marker
                mapMarker.addListener('click', () => {
                    // Clearing animations
                    this.clearMarkersAnimation();

                    // Creating InfoWindow
                    this.createInfoWindow(map, mapMarker, infoWindow);
                }); // END mapMarker.addListener('click')

                // Mouseover event
                mapMarker.addListener('mouseover',() => {
                    mapMarker.setIcon(config.GoogleMap.icon.selected);
                });

                // Mouseout event
                mapMarker.addListener('mouseout', () => {
                    if (infoWindow.marker !== mapMarker) {
                        mapMarker.setIcon(config.GoogleMap.icon.default);
                    }
                });
        });// END venuesMarkers.forEach()

        // Sizing map based on set boundaries
        map.fitBounds(bounds);

        // Setting state
        this.setState({mapMarkers});
    }

    /**
     * @description Clears Animations for all Map Markers
     */
    clearMarkersAnimation = () => {
        let { mapMarkers } = this.state;

        mapMarkers.forEach(marker => {
            marker.setIcon(config.GoogleMap.icon.default);
            marker.setAnimation(null);
        });

        // Setting state
        this.setState({mapMarkers});
    }

    /**
     * @description Creates and Populates Map Marker InfoWindow
     * @param {Object} map Reference to Google Map
     * @param {Object} marker Map Marker
     * @param {Object} infoWindow Reference to Google Maps InfoWindow
     */
    createInfoWindow = (map, marker, infoWindow) => {
        const { venues } = this.state;

        marker.setIcon(config.GoogleMap.icon.selected);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);

        if (infoWindow.marker !== marker) {
            const venue = venues.find(venue => venue.id === marker.id);

            infoWindow.setContent('');
            infoWindow.marker = marker;

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
                    const contentString = `<div class="infoWindow"><strong>${venueDetails.name}</strong><p>${venueDetails.adress}</p><p>${venueDetails.cityStateZip}</p><p>${venueDetails.phone}</p><hr /><img src="${venueDetails.photo}" alt="${venueDetails.name} Venue Image" /><div/>`;

                    infoWindow.setContent(contentString);
                }).catch(err => {
                    console.error(err);

                    // Using catch block in case of hitting Foursquare API premium rate limit.
                    // Allows testing of app

                    // Shaping Venue details
                    const venueDetails = {
                        name: venue.name,
                        adress: venue.location.address,
                        cityStateZip: `${venue.location.city}, ${venue.location.state} ${venue.location.postalCode}`
                    };

                    // Creating InfoWindow content
                    const contentString = `<div class="infoWindow"><strong>${venueDetails.name}</strong><p>${venueDetails.adress}</p><p>${venueDetails.cityStateZip}</p><div/>`;

                    infoWindow.setContent(contentString);
                });// END FoursquareAPI.getVenueDetails()

            // Make sure the marker property is cleared if the infowindow is closed.
            infoWindow.addListener('closeclick', function () {
                infoWindow.marker = null;
                marker.setAnimation(null);
                marker.setIcon(config.GoogleMap.icon.default);
            });

            // Open InfoWindow event
            infoWindow.open(map, marker);
        }
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
                <div className="venues-container">
                    <input type="checkbox" id="menu-trigger" className="menu-trigger" />
                    <label htmlFor="menu-trigger"></label>
                    <div className="venues-wrapper">
                        <h1>Search for Venues</h1>
                        <ListVenues
                            handleListItemClick={this.handleListItemClick}
                            venues={this.state.venues}
                            updateMarkersVisibility={this.updateMarkersVisibility} />
                        <div id="venue-container-footer">
                            <ul>
                                <li>
                                    Data source: <a href="https://developer.foursquare.com/docs/api/endpoints" target="_blank" title="Foursquare Places API" rel="noopener noreferrer">Foursquare Places API</a>
                                </li>
                                <li>
                                    Developer: <a href="https://github.com/jamesperrin" title="James Perrin's GitHub Profile" target="_blank" rel="noopener noreferrer">James Perrin</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="map" aria-hidden="true" role="application"></div>
            </div>
    );
  }
}

export default App;