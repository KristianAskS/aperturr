/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
// add cors for /api/*
const config = {
    async headers() {
        return [
            {source: '/api/:path*', headers: [
                {key: 'Access-Control-Allow-Credentials', value: '*'},
            ]},
        ];
    },
};

export default config;  
