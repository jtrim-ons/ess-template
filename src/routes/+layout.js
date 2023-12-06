import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData } from "$lib/utils";

export async function load({ fetch }) {

    const areas = await getData(`${base}/data/config-data/geography/areas.csv`, fetch);

    const areasParentsLookup = await getData(`${base}/data/config-data/geography/areas-parents-lookup.csv`, fetch);
    const areasGeogLevel = await getData(`${base}/data/config-data/geography/areas-geog-level.csv`, fetch);
    const areasGeogInfo = await getData(`${base}/data/config-data/geography/areas-geog-info.csv`, fetch);

    const indicators = await getData(`${base}/data/config-data/indicators/indicators-lookup.csv`, fetch);
    const indicatorsCalculations = await getData(`${base}/data/config-data/indicators/indicators-calculations.csv`, fetch);
    const indicatorsMetadata = await getData(`${base}/data/config-data/indicators/indicators-metadata.csv`, fetch);

    const combinedData = await getData(`${base}/data/csv/data.csv`, fetch);

    const periodsLookup = await getData(`${base}/data/config-data/periods/unique-periods-lookup.csv`, fetch);

    const clustersInfo = await getData(`${base}/data/config-data/clusters/clusters-info.csv`, fetch);
    const clustersLookup = await getData(`${base}/data/config-data/clusters/clusters-lookup.csv`, fetch);

    const beeswarmKeyData = await getData(`${base}/data/csv/beeswarmKeyData.csv`, fetch);
    
    return { areas, areasParentsLookup, areasGeogLevel, areasGeogInfo, indicators, indicatorsCalculations, indicatorsMetadata, combinedData, periodsLookup, beeswarmKeyData, clustersInfo, clustersLookup };

}
