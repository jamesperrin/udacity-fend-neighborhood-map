import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class ListLocations extends Component {
    state = {
        query: ''
    }

    updateQuery = (query) => { 
        this.setState({query: query.trim()});
    }

    handleClick = (e) => { 
        console.log(e.target.innerText);
    }

    render() { 
        const { venues} = this.props;
        const { query } = this.state;

        let displayLocations;

        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i');
            displayLocations = venues.filter(venue =>  match.test(venue.name));
        } else {
            displayLocations = venues;
        }

        displayLocations.sort(sortBy('name'));

        return (
            <div className='locations-list'>
                <input type="text"
                    value={query}
                    placeholder='Filter locations'
                    onChange={(e) => this.updateQuery(e.target.value)} />
                <ul>
                    {displayLocations.map(venue => (
                        <li key={venue.id} data-id={venue.id}  onClick={(e) => { this.handleClick(e) }}>{venue.name}</li>
                    ))}
                </ul>
            </div>
        )
    }
}
 
export default ListLocations;
