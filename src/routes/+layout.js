import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getAreas } from "$lib/utils";

export async function load({ fetch }) {
    const areas = await getAreas(`${base}/data/csv/areas.csv`, fetch);
    return { areas };
}
