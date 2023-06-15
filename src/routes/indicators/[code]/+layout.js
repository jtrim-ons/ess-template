import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData, getAreas } from "$lib/utils";
import { get } from 'svelte/store';
import { indicators, defaultIndicatorComponents  } from "$lib/config.js";
import { selectedArea, comparisonAreasArray, findSelectedAreas } from "$lib/selectedAreasStore.js";

//console.log()

export async function load({ fetch, params }) {

    const indicator = indicators.find((e) => e.code == params.code);

    const areas = await getAreas(`${base}/data/csv/areas.csv`, fetch);

    let visibleAreas = findSelectedAreas(get(selectedArea), get(comparisonAreasArray), areas);

    let componentsArray = "components" in indicator ? indicator.components : defaultIndicatorComponents;

    for (var i=0; i < componentsArray.length; i++) {

        if (componentsArray[i].type === "map") {

            componentsArray[i].data = await getData(`${base}/data/json/indicator-raw/`+indicator.years[1]+`/`+indicator.filename+`.json`, fetch);

        } else {

            let data = [];

            for (var j=0; j < visibleAreas.length; j++) {

                let areaIndicatorData = await getData(`${base}/data/json/area/`+indicator.filename+`/`+visibleAreas[j].areacd+`.json`, fetch);

                areaIndicatorData.areanm = visibleAreas[j].areanm;

                data.push(areaIndicatorData);

            }

            componentsArray[i].data = data;

        }
    }

    return { componentsArray, indicator, visibleAreas };
}
