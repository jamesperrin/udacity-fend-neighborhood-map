import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListLocations from './ListLocations'

class App extends Component {

    state = {
        locations : [
            {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
            {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
            {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
            {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
            {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
            {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ],
        showMenu: true
    };

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    }

    render() {
        return (
            <div className="container">
                <input type='checkbox' onClick={this.toggleMenu} id='menu-trigger' className='menu-trigger' />
                <label for="menu-trigger"></label>

                <div className={this.state.showMenu ? "locations-wrapper show-menu" : "locations-wrapper hide-menu"}>
                    <h1>Search for Venues</h1>
                    <ListLocations locations={this.state.locations} showMenu={this.state.showMenu} />
                </div>

                <div className='map-wrapper'>
                    <div id="map"></div>
                </div>
            </div>
    );
  }
}

export default App;
