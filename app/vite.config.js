import vue from '@vitejs/plugin-vue'
import svg from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer'



// -------------------
// Data
// -------------------

const {
    API_URL,
    APP_URL,
    ADMIN_URL,
    GOOGLE_MAPS_KEY,
    CRISP_WEBSITE_ID,
} = process.env;



// -------------------
// Exports
// -------------------

export default {

    plugins: [
        vue(),
        svg({ svgo: false }),
        // visualizer({ template: 'treemap', open: true })
    ],

    define: {
        APP_URL: JSON.stringify(APP_URL),
        API_URL: JSON.stringify(API_URL),
        ADMIN_URL: JSON.stringify(ADMIN_URL),
        GOOGLE_MAPS_KEY: JSON.stringify(GOOGLE_MAPS_KEY),
        CRISP_WEBSITE_ID: JSON.stringify(CRISP_WEBSITE_ID),
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "sass:math";
                    @import "#app/styles/abstract.scss";
                `,
            }
        }
    }

};