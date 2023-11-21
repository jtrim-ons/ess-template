<script>

import HorizontalBeeswarmKey from "$lib/datavis/HorizontalBeeswarmKey.svelte";
import HorizontalBeeswarm2 from "$lib/prototypeComponents/general/beeswarm/HorizontalBeeswarm2.svelte";
import SelectComparisonAreas from "$lib/datavis/SelectComparisonAreas.svelte";
import Key from "$lib/datavis/shared/Key.svelte";

import { scaleLinear } from 'd3-scale';

import { getContext } from 'svelte';

export let selectedAreas, latestData, indicatorsList, areasSameGeog, checkboxedRoles;


let indicatorsMetadata = getContext("indicatorsMetadata");
let indicators = getContext("indicators");

let periodsLookup = getContext("periodsLookup");

let width = 1000;
let height = 100;
let col1Width = 250;
let outerPadding = {top: 25, left: 0, right: 0, bottom: 15};
let spaceForAreasBeyondScale = 20;

$: chartWidth = width - outerPadding.left - outerPadding.right - col1Width - spaceForAreasBeyondScale*2;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

let xDomainGlobal = [-1, 1];

$: x = scaleLinear()
    .domain(xDomainGlobal)
    .range([0, chartHeight]);

let hoverIndex = null;
let hoverChartIndex = null;

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}}))].filter((e) => latestData.map((e) => e.areacd).includes(e.areacd));

</script>


<div class="visualisation-container" bind:clientWidth={width}>

    <HorizontalBeeswarmKey
    ></HorizontalBeeswarmKey>

    <SelectComparisonAreas
    selectedAreas={selectedAreas.filter((e) => latestData.filter((el) => e.data.areacd === el.areacd).length > 0 & e.role !== "main")}
    areasWithData={latestData.map((e) => e.areacd)}
    bind:checkboxedRoles={checkboxedRoles}
    selectedArea={selectedAreas.find((e) => e.role === "main").data.areanm}
    parentArea={selectedAreas.find((e) => e.role === "parent").data.areanm}
    includeSiblings={false}
    ></SelectComparisonAreas>

    <Key
    {plottedAreas}
    ></Key>

    <div style="margin-top: 30px; margin-bottom: 30px">

        {#each indicatorsList.filter((e) => latestData.filter((el) => el.id === e & el.areacd === selectedAreas.find((e) => e.role === "main").data.areacd).length > 0) as indicator, i}

            <HorizontalBeeswarm2
            {selectedAreas}
            {areasSameGeog}
            index={i}
            data={latestData.filter((e) => e.id === indicator)}
            name={indicatorsMetadata.find((elm) => elm.code == indicators.find((el) => el.id == indicator).code).label}
            bind:checkboxedRoles={checkboxedRoles}
            metadata={indicatorsMetadata.find((e) => e.code === indicators.find((el) => el.id == indicator).code)}
            {col1Width}
            {outerPadding}
            {chartWidth}
            {chartHeight}
            {spaceForAreasBeyondScale}
            {x}
            {height}
            {width}
            bind:xDomainGlobal={xDomainGlobal}
            bind:hoverIndex={hoverIndex}
            bind:hoverChart={hoverChartIndex}
            ></HorizontalBeeswarm2>

        {/each}


    </div>

    <div class="svgs-container">

      

    </div>

</div>




<style>

.visualisation-container {
    margin: 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

.title-container {
    display: flex;
    flex-wrap: wrap;
}

.dropdown-container {
    margin: 2px 0px 2px 0px;
    padding: 0px;
}

.title-container p {
    margin: 0px;
    padding: 0px 5px 0px 10px;
    line-height: 40px;
}





</style>
