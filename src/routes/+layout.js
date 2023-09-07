import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData } from "$lib/utils";

export async function load({ fetch }) {

    const latestData = await getData(`${base}/data/csv/latest-year/data.csv`, fetch);
    const areas = await getData(`${base}/data/config-data/areas.csv`, fetch);
    const areasParentsLookup = await getData(`${base}/data/config-data/areas-parents-lookup.csv`, fetch);
    const areasGeogLevel = await getData(`${base}/data/config-data/areas-geog-level.csv`, fetch);
    const indicators = await getData(`${base}/data/config-data/config-indicators.csv`, fetch);
    const areasGeogInfo = await getData(`${base}/data/config-data/areas-geog-info.csv`, fetch);
    const topics = await getData(`${base}/data/config-data/config-topics.csv`, fetch);
    
    return { latestData, areas, areasParentsLookup, areasGeogLevel, indicators, areasGeogInfo, topics };

}
