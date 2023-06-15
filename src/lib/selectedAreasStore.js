import { base } from "$app/paths";
import { readable, writable } from "svelte/store";
import { countries } from "./config";
import { select } from "d3-selection";

export let selectedArea = writable(null);
export let comparisonAreasArray = writable([true, true, true, false, null])

export const findSelectedAreas = (selectedArea, comparisonAreasArray, areas) => {

    let allSelectedAreas;

    selectedArea["role"] = "main";

    allSelectedAreas = [selectedArea]

    if (comparisonAreasArray[0]) {

        let extraAreas = areas.filter((e) => e.areacd == selectedArea.parentcd).filter((e) => !allSelectedAreas.map((e) => e.areacd).includes(e.areacd));
        extraAreas = extraAreas.map((e) => ({...e, "role": "parent"}))

        allSelectedAreas = [...allSelectedAreas,...extraAreas];
    }

    if (comparisonAreasArray[1]) {

        let extraAreas = areas.filter((e) => e.areacd == {E: "E92000001", N: "N92000002", S: "S92000003", W: "W92000004"}[selectedArea.areacd.slice(0, 1)]).filter((e) => !allSelectedAreas.map((e) => e.areacd).includes(e.areacd));
        extraAreas = extraAreas.map((e) => ({...e, "role": "country"}))

        allSelectedAreas = [...allSelectedAreas,...extraAreas]
    }

    if (comparisonAreasArray[2]) {

        let extraAreas = areas.filter((e) => e.parentcd == selectedArea.parentcd).filter((e) => !allSelectedAreas.map((e) => e.areacd).includes(e.areacd));
        extraAreas = extraAreas.map((e) => ({...e, "role": "neighbour"}))

        allSelectedAreas = [...allSelectedAreas,...extraAreas];
    }

    if (comparisonAreasArray[3]) {

        let extraAreas = areas.filter((e) => selectedArea.similar.includes(e.areacd)).filter((e) => !allSelectedAreas.map((e) => e.areacd).includes(e.areacd));
        extraAreas = extraAreas.map((e) => ({...e, "role": "similar"}))

        allSelectedAreas = [...allSelectedAreas,...extraAreas];
    }

    if (comparisonAreasArray[4] !== null && comparisonAreasArray[4] !== undefined) {

        let extraAreas = comparisonAreasArray[4];
        extraAreas = extraAreas.map((e,i) => ({...e, "role": "custom"+(i+1)})).filter((e) => !allSelectedAreas.map((e) => e.areacd).includes(e.areacd));
        
        allSelectedAreas = [...allSelectedAreas,...extraAreas];

    }

    allSelectedAreas = [...new Map(allSelectedAreas.map(v => [v.areacd, v])).values() ];

    console.log(allSelectedAreas);

    return allSelectedAreas
}
