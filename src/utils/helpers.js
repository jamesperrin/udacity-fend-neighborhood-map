class Helpers {

    /**
     * @description Converts JSON Object into a parameters format
     * @param jsonObj JSON Object
     */
    static JsonObjectToParams = (jsonObj) => Object.keys(jsonObj).map(key => `${key}=${jsonObj[key]}`).join('&')

}

export default Helpers;