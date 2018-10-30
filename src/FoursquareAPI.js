import config from './config/config'
import Helpers from './utils/helpers'
import VenueCachedData from './data/foursquare_fake_venues.json';
import VenueDetailsCachedData from './data/foursquare_fake_venues_details.json';

const base = {
    'url': 'https://api.foursquare.com/v2',
    'credentials': Helpers.JsonObjectToParams(config.Foursquare),
    'headers': {
        'Accept': 'application/json'
    }
}

export default class FoursquareAPI {
    /**
     * @description Retrieves list of venues fakes
     */
    static search_fake = VenueCachedData;

    /**
     * @description Retrieves list of venues
     * @param params Parameters passed to Foursquare API Search
     */
    static search = (params) => {
        const search_params = Helpers.JsonObjectToParams(params);

        return fetch(`${base.url}/venues/search?${search_params}&${base.credentials}`, base.headers)
            .then(res => res.json());
    }

    /**
     * @description Retrieves details about a venue
     * @param venue_id Venue ID
     */
    static getVenueDetails = (venue_id) => {
        return fetch(`${base.url}/venues/${venue_id}?${base.credentials}`, base.headers)
        .then(res => res.json());
    }

    /**
     * @description Retrieves details about a venue
     * @param venue_id Venue ID
     */
    static getVenueDetails_Fake = (venue_id) => {
        const venue_details = VenueDetailsCachedData.venues.filter(v => v.id === venue_id);
        return venue_details[0];
    }

    /**
     * @description Retrieves photos for a venue
     * @param venue_id Venue ID
     */
    static getVenuePhotos = (venue_id) => {
        return fetch(`${base.url}/venues/${venue_id}/photos?${base.credentials}`, base.headers)
        .then(res => res.json());
    }
}