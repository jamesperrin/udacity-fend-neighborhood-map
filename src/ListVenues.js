import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class ListVenues extends Component {

    state = {
        query: ''
    }

    /**
     * @description Updates Venues' name query
     * @param {string} query - Query for Venues' name
     */
    updateQuery = (query) => {
        // Setting state
        this.setState({ query: query.trim() });

        // Updating Map Markers' Visibility
        this.props.updateMarkersVisibility(query.trim());
    }

    // Component Render() event
    render() {
        const { venues, handleListItemClick } = this.props;
        const { query } = this.state;

        let displayVenues;

        if (query) {
            const hasMatch = new RegExp(escapeRegExp(query), 'i');
            displayVenues = venues.filter(venue =>  hasMatch.test(venue.name));
        } else {
            displayVenues = venues;
        }

        displayVenues.sort(sortBy('name'));

        return (
            <div className='venues-list' tabindex="0">
                <input
                    type="text"
                    value={query}
                    placeholder="Filter venues"
                    aria-label="Filter venues"
                    onChange={(e) => this.updateQuery(e.target.value)}/>
                <ul tabindex="0">
                    {displayVenues.map(venue => (
                        <li key={venue.id} onClick={() => handleListItemClick(venue.id) }>{venue.name}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default ListVenues;