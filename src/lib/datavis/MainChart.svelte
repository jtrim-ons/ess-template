<script>

import ChartOptions from "./ChartOptions.svelte";
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";
import LineChart from "./LineChart.svelte";
import VerticalBeeswarm from "./VerticalBeeswarm.svelte";
import Map from "./Map.svelte";
import { base } from "$app/paths";

export let indicator, latestData, otherData, initialData, selectedAreas, checkboxedRoles, siblingAreas, selectedArea, parentArea;

let chosenChart = 1;

let optionsArray = [...otherData, ...initialData].filter((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd).length > 0 ? ["Over time", "To other areas", "Geographically"] : ["To other areas", "Geographically"];

$: data = (optionsArray[chosenChart-1] === "Over time" ? [...latestData,...initialData,...otherData] :
optionsArray[chosenChart-1] === "To other areas" ? [...latestData, ...initialData] : latestData).sort((a,b) => a.year - b.year);

$: areasWithData = [...new Set(data.map((e) => e.areacd))];

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}})),...(checkboxedRoles.neighbour ? siblingAreas.neighbours.map((e) => {return {role: "neighbour", areacd: e} }) : []), ...(checkboxedRoles.cluster ? siblingAreas.similar.map((e) => {return {role: "cluster", areacd: e} }): [])].filter((e) => areasWithData.includes(e.areacd));

$: filteredData = data.filter((e) => plottedAreas.map((el) => el.areacd).includes(e.areacd));

</script>

<div class="mainChartContainer">

    <ChartOptions
    bind:chosenChart={chosenChart}
    {optionsArray}
    ></ChartOptions>

    <div class="chartOutlineGroup">

        <h3>{indicator.label}</h3>

        {#if indicator.unit != null}
            <p>{indicator.unit}</p>
        {/if}

        <SelectComparisonAreas
        selectedAreas={selectedAreas.filter((e) => [...latestData,...otherData, ...initialData].filter((el) => e.data.areacd === el.areacd).length > 0 & e.role !== "main")}
        {areasWithData}
        bind:checkboxedRoles={checkboxedRoles}
        {selectedArea}
        {parentArea}
        ></SelectComparisonAreas>

        {#if optionsArray[chosenChart-1] === "Over time"}

            <LineChart
            {plottedAreas}
            {filteredData}
            {indicator}
            ></LineChart>

        {:else if optionsArray[chosenChart-1] === "To other areas"}

            <VerticalBeeswarm
            {selectedAreas}
            {plottedAreas}
            {filteredData}
            {indicator}
            ></VerticalBeeswarm>


        {:else if optionsArray[chosenChart-1] === "Geographically"}

            <Map
            {selectedAreas}
            {filteredData}
            ></Map>


        {/if}

        <p>Source: Office for National Statistics</p>

    </div>

    <img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

</div>

<style>

h3 {
    padding: 10px 0px 0px 10px;
    margin: 0px
}

p {
    padding: 5px 0px 0px 10px;
}

.chartOutlineGroup {
    width: 100%;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}


</style>



