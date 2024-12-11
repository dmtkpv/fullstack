import { joi } from '#api/index.js'
import { Client } from '@googlemaps/google-maps-services-js'
const { GOOGLE_MAPS_KEY: key } = process.env;
const api = new Client();

export default function () {



    // -----------------
    // Search
    // -----------------

    async function search (options) {

        joi.check(options, {
            input: joi.string().required(),
            locale: joi.string().valid('en', 'nl').required(),
            types: joi.array().items(joi.string().valid('(cities)'))
        })

        async function request (components) {
            const { input, types, locale: language } = options;
            const params = { key, input, language, types, components, region: 'nl' }
            const { data } = await api.placeAutocomplete({ params })
            return data;
        }

        let data = await request('country:nl');

        if (!data.predictions?.length) {
            data = await request();
        }

        return data.predictions.map(item => ({
            text: item.description,
            value: item.place_id
        }))

    }



    // -----------------
    // Info
    // -----------------

    async function info (options) {

        joi.check(options, {
            place_id: joi.string().required(),
            locale: joi.string().valid('en', 'nl').required(),
            fields: joi.array().items(joi.string().valid('formatted_address', 'geometry', 'address_components', 'name')).required()
        })

        const { place_id, fields, locale: language } = options;
        const params = { key, place_id, fields, language }
        const { data } = await api.placeDetails({ params })

        if (data.result.geometry) {
            data.result.geometry = data.result.geometry.location
        }

        if (data.result.address_components) {
            const get = type => data.result.address_components.find(c => c.types.includes(type))?.long_name;
            data.result.address_components = {
                street_number: get('street_number'),
                route: get('route'),
                locality: get('locality'),
                region: get('administrative_area_level_1'),
                country: get('country'),
                postcode: get('postal_code'),
            }
        }

        return data.result

    }



    // -----------------
    // Exports
    // -----------------

    return {
        search,
        info
    }



}