import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData, getAreas } from "$lib/utils";
import { get } from 'svelte/store';
import { getContext } from 'svelte';

//console.log()

export async function load({ fetch, params }) {

    let topic = params.code.toLowerCase();

    let indicators = (await getData(`${base}/data/config-data/indicators/indicators-lookup.csv`, fetch)).filter((e) => !["4g-coverage", "homicide-offences", "inward-foreign-direct-investment-fdi", "total-value-of-uk-exports"].includes(e.code));
    indicators = indicators.filter((e) => e.topic === topic).map((e) => e.id);

    let otherData = {}, initialData = {};

    const datasetsLog = await getData(`${base}/data/config-data/datasets-log.csv`, fetch);

    for (var i = 0; i < datasetsLog.length; i++) {

        if (indicators.includes(datasetsLog[i].id)) {

            let data = await getData(`${base}/data/csv/${datasetsLog[i].type}-period/indicator-${datasetsLog[i].id}.csv`, fetch)

            if (datasetsLog[i].type === "initial") {

                initialData["indicator-"+datasetsLog[i].id] = data
            
            } else {

                otherData["indicator-"+datasetsLog[i].id] = data
            }
        }
    }

    return { topic: topic, indicatorsList: indicators, preloadedData: {otherData: otherData, initialData: initialData} }
}
