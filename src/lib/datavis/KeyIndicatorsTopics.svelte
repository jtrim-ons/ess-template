<script>

import { base } from "$app/paths";
import Key from "./shared/Key.svelte";
import VerticalBeeswarmTopic from "./VerticalBeeswarmTopic.svelte";

export let indicators, checkboxedRoles, latestData, initialData;

let width = 600;

let selectedAreas = [];

$: areasWithData = [...new Set(latestData.map((e) => e.areacd))];

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}}))].filter((e) => areasWithData.includes(e.areacd));

$: plottedAreasCalc = plottedAreas.length > 0 ? plottedAreas : [{role: "custom1", areacd: "E92000001"}, {role: "custom2", areacd: "N92000002"}, {role: "custom3", areacd: "S92000003"}, {role: "custom4", areacd: "W92000004"}];

</script>



<section title="Key indicators" bind:clientWidth={width}>
    <h1>Key indicators</h1>

    <div class="container">

        <Key
        plottedAreas={plottedAreasCalc}
        ></Key>

        <div class="grid" style="grid-template-columns: [line1] {width/4-2}px [line2] {width/4-2}px [line3] {width/4-2}px [line4] {width/4-2}px [end];">

            {#each indicators as indicator, i}

                <div style="background-color: {i == 0 || i == 3 ? "#fafafa" : "#ffffff"}">

                    <h3>{indicator.label}</h3>

                    <div style="padding-left: 5px; padding:right: 5px;">

                        <VerticalBeeswarmTopic
                        {selectedAreas}
                        plottedAreas={plottedAreasCalc}
                        filteredData={[...latestData.filter((e) => plottedAreasCalc.map((el) => el.areacd).includes(e.areacd) & e.codeId == indicator.id),...initialData[indicator.code].filter((e) => plottedAreasCalc.map((el) => el.areacd).includes(e.areacd))]}
                        {indicator}
                        ></VerticalBeeswarmTopic>

                    </div>
                
                </div>


            {/each}


        </div>

    </div>

    <img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

</section>

<style>

section {
    margin-top: 50px;
}
    
.container {
    padding-top: 10px;
    border-radius: 5px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

.grid {
    margin-top: 20px;
    display: grid;



}

h3 {
    padding-left: 15px;
    padding-right: 15px;
    font-size: 18px;
    line-height: 18px;
    
}



</style>