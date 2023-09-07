import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData, getAreas } from "$lib/utils";
import { get } from 'svelte/store';

//console.log()

export async function load({ fetch, params }) {

    const clustersLookup = await getData(`${base}/data/config-data/clusters-lookup.csv`, fetch);
    
    return { params, clustersLookup };
}
