import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData } from "$lib/utils";
import { get } from 'svelte/store';

export async function load({ fetch, params }) {

    const areaSections = await getData(`${base}/data/config-data/config-area-sections.csv`, fetch);
    const areaKeyIndicators = await getData(`${base}/data/config-data/config-area-key.csv`, fetch);
    const datasetsLog = await getData(`${base}/data/config-data/datasets-log.csv`, fetch);

    let otherDataIndicators = areaSections.map((e) => e.code);
    //.filter((e) => e.priority == "p")

    let initialDataIndicators = [...otherDataIndicators,...areaKeyIndicators.map((e) => e.code).filter((e) => !otherDataIndicators.includes(e.code))];

    console.log(initialDataIndicators);

    let otherData = {}, initialData = {};

    for (var i = 0; i < otherDataIndicators.length; i++) {

        if (datasetsLog.filter((e) => e.code == otherDataIndicators[i] & e.type == "other").length > 0) {

            let data = await getData(`${base}/data/csv/other-years/${otherDataIndicators[i]}.csv`, fetch)

            otherData[otherDataIndicators[i]] = data;
        }
    }

    for (var i = 0; i < initialDataIndicators.length; i++) {

        if (datasetsLog.filter((e) => e.code == initialDataIndicators[i] & e.type == "initial").length > 0) {

            let data = await getData(`${base}/data/csv/initial-year/${initialDataIndicators[i]}.csv`, fetch)

            initialData[initialDataIndicators[i]] = data;
        }
    }

   return {areaCode: params.code, configData: {areaSections: areaSections, areaKeyIndicators: areaKeyIndicators}, preloadedData: {otherData: otherData, initialData: initialData}}
}
