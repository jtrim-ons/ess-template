import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData, getAreas } from "$lib/utils";
import { get } from 'svelte/store';
import { indicators, defaultAreaComponents, areaComponents  } from "$lib/config.js";
import { selectedArea, findSelectedAreas } from "$lib/selectedAreasStore.js";

export async function load({ fetch, params }) {

    let requiredDataLookup = {"double-beeswarm": "data2", "map": "data1", "line": "data2"};

    let componentsArray = params.code in areaComponents ? areaComponents.params.code : defaultAreaComponents;

    componentsArray.forEach((c) => { c["indicator"] = indicators.find((i) => c.code == i.code); })

    const areas = await getAreas(`${base}/data/csv/areas.csv`, fetch);

    selectedArea.set(areas.find(p => p.areacd === params.code));

    let preloadedAreas = findSelectedAreas(get(selectedArea), [true, true, true, true, null], areas);

    console.log(componentsArray)

    let dataImportingInstructions = [...new Map(componentsArray.map(({ type, code }) => ({type: requiredDataLookup[type], code: code, concat: requiredDataLookup[type]+"-"+code})).map(v => [v.concat, v])).values() ];

    let data1 = [], data2 = [];

    console.log(dataImportingInstructions)

    for (var i = 0; i < dataImportingInstructions.length; i++) {

        let indicator = indicators.find((e) => e.code == dataImportingInstructions[i].code);

        console.log(indicator)

        if (dataImportingInstructions[i].type == "data1") {

            let importedData = await getData(`${base}/data/json/indicator-raw/`+indicator.years[1]+`/`+indicator.code+`.json`, fetch)

            data1.push({code: indicator.code, year: indicator.years[1], data: importedData})

        } else if (dataImportingInstructions[i].type == "data2") {

            for (var j=0; j < preloadedAreas.length; j++) {

                let importedData = await getData(`${base}/data/json/area/`+indicator.code+`/`+preloadedAreas[j].areacd+`.json`, fetch)

                importedData.areanm = preloadedAreas[j].areanm;
                importedData.code = indicator.code;
                importedData.role = preloadedAreas[j].role;

                data2.push(importedData);
            }
        }

    }

    let data3 = [], data4 = [];

    let keyIndicators = ["population_density", "population", "female_life_expectancy", "gdhi"];
    let mainAreas = preloadedAreas.filter((e) => ["main", "parent", "country"].includes(e.role))

    console.log(mainAreas);

    

    for (var i = 0; i < keyIndicators.length; i++) {

        let indicator = indicators.find((e) => e.code == keyIndicators[i]);

        for (var j=0; j < mainAreas.length; j++) {

            let importedData = await getData(`${base}/data/json/area/`+indicator.code+`/`+mainAreas[j].areacd+`.json`, fetch)

            importedData.areanm = preloadedAreas[j].areanm;
            importedData.indicator = indicator;
            importedData.role = preloadedAreas[j].role;

            data3.push(importedData);

            let importedData2 = await getData(`${base}/data/json/rank-area/`+indicator.code+`/`+mainAreas[j].areacd+`.json`, fetch)

            importedData2.areanm = preloadedAreas[j].areanm;
            importedData2.indicator = indicator;
            importedData2.role = preloadedAreas[j].role;

            data4.push(importedData2);
        }

       
    }

    return { componentsArray, preloadedAreas, data1, data2, data3, data4, dataImportingInstructions };
}
