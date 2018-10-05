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
        const { locations} = this.props;
        const { query } = this.state;

        let displayLocations;

        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i');
            displayLocations = locations.filter(location =>  match.test(location.title));
        } else {
            displayLocations = locations;
        }
        displayLocations.sort(sortBy('title'));

        return (
            <div className='locations-list'>
                <input type="text"
                    value={query}
                    placeholder='Filter locations'
                    onChange={(e) => this.updateQuery(e.target.value)} />
                <ul>
                    {displayLocations.map(location => (
                        <li key={location.title} onClick={(e) => { this.handleClick(e) }}>{location.title}</li>
                    ))}
                </ul>
            </div>
        )
    }
}
 
export default ListLocations;
