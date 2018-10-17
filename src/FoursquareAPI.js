import config from './config/config'
import Helpers from './utils/helpers'

const _base = {
    'url': 'https://api.foursquare.com/v2',
    'credentials': `client_id=${config.Foursquare.client_id}&client_secret=${config.Foursquare.client_secret}&v=${config.Foursquare.v}`,
    'headers': {
        'Accept': 'application/json'
    }
}

class FoursquareAPI {
    static search_venues_Fake = () => { 
        return fetch('./data/foursquare_fake.json').then(res => res).then(data => data);
    }

    /**
     * @description Retrieves list of venues
     * @param query text search
     * @param limit limits list of results
     */
    static search = (query, limit = 10) => {
        return fetch(`${_base.url}/venues/search?ll=29.957431, -90.0629443&query=${query}&limit=${limit}&${_base.credentials}`, _base.headers)
            .then(res => res.json());
    }

    /**
     * @description Retrieves list of venues
     * @param params Parameters passed to Foursquare API
     */
    static searchByParams = (params) => {
        //const search_params = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const search_params = Helpers.JsonObjectToParams(params);

        //search_params;

        return fetch(`${_base.url}/venues/search?${search_params}&${_base.credentials}`, _base.headers)
            .then(res => res.json());
    }

    /**
     * @description Retrieves details about a venue
     * @param venue_id Venue ID
     */
    static getVenueDetails = (venue_id) => { 
        return fetch(`${_base.url}/venues/${venue_id}?${_base.credentials}`, _base.headers)
        .then(res => res.json());
    }

    /**
     * @description Retrieves photos for a venue
     * @param venue_id Venue ID
     */
    static getVenuePhotos = (venue_id) => { 
        return fetch(`${_base.url}/venues/${venue_id}/photos?${_base.credentials}`, _base.headers)
        .then(res => res.json());
    }

}

export default FoursquareAPI;