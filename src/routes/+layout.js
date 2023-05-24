import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getPlaces } from "$lib/utils";

export async function load({ fetch }) {
    const places = await getPlaces(`${base}/data/csv/places.csv`, fetch);
    return { places };
}
