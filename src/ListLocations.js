import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class ListLocations extends Component {

    state = {
        query: ''
    }

    /**
     * @description Updates state.query
     * @param {string} query - venue
     */
    updateQuery = (query) => { 
        this.setState({query: query.trim()});
    }

    render() {
        const { venues } = this.props;
        const { query } = this.state;

        let displayVenues;

        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i');
            displayVenues = venues.filter(venue =>  match.test(venue.name));
        } else {
            displayVenues = venues;
        }

        displayVenues.sort(sortBy('name'));

        return (
            <div className='locations-list'>
                <input type="text"
                    value={query}
                    placeholder='Filter locations'
                    onChange={(e) => this.updateQuery(e.target.value)} />
                <ul>
                    {displayVenues.map(venue => (
                        <li key={venue.id} onClick={() => this.props.handleListItemClick(venue.id) }>{venue.name}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default ListLocations;
