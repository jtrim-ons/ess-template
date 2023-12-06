<script>

import { scaleLinear } from 'd3-scale';
import AxisY from '$lib/datavis/shared/AxisY.svelte';
import AxisX from '$lib/datavis/shared/AxisX.svelte';
import Line from '$lib/datavis/lineChartComponents/Line.svelte';
import Labels from '$lib/datavis/Labels.svelte';
import labelplacer from 'labelplacer';

import StickyKey2 from "$lib/prototypeComponents/general/StickyKey2.svelte";

import { getContext } from 'svelte';
import Dropdown from "$lib/prototypeComponents/general/selections/Dropdown.svelte";

let areas = getContext('areas');

export let visibleAreas, combinedData, indicators;

export let globalVisibleAreasTracker, baselineComparisonArea, chosenId1, chosenId2, chosenId4, chosenId5, chosenId6;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations").filter((e) => indicators.map((e) => e.id).includes(e.id));

let indicatorsFiltered = indicators.filter((e) => indicatorsCalculations.find((el) => el.code === e.code ).mainMaxXDomain != indicatorsCalculations.find((el) => el.code === e.code ).mainMinXDomain);

let width=400, height=500, labelColumnWidth = 170;

$: outerPadding = {top: 10, left: 80, right: labelColumnWidth + 5, bottom: 40};

$: chartWidth = width - outerPadding.left - outerPadding.right;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

let optionsArray101 = indicatorsFiltered.map((e) => e.label)
$: chosenId101 = optionsArray101[0];

$: indicator = indicators.find((e) => chosenId101 == e.label);
$: metadata = indicatorsMetadata.find((e) => e.label == chosenId101);
$: calculations = indicatorsCalculations.find((e) => e.code == metadata.code);

$: filteredData = combinedData.filter((e) => e.id === indicator.id);

$: visibleAreas2 = visibleAreas.filter((e) => filteredData.filter((el) => e.areacd === el.areacd).length > 0);

$: yDomain = [indicator.zeroBaseline === "TRUE" ? 0 : Math.floor(0.95*Math.min(...filteredData.map((d) => d.value))), Math.ceil(Math.max(...filteredData.map((d) => d.value)))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);


$: xDomain = [Math.min(...filteredData.map((d) => d.xDomainNumb)), Math.max(...filteredData.map((d) => d.xDomainNumb))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: hoverIndex = null;

let primaryRolesArray = ["main", "parent", "country", "uk", "custom1", "custom2", "custom3", "custom4"];

$: latestYear = calculations.maxXDomain;

$: labelData = visibleAreas2.map((e) => ({
  ...e,
  yPosition: filteredData.filter((el) => e.areacd == el.areacd).length > 0 ? y(filteredData.filter((el) => e.areacd == el.areacd)[filteredData.filter((el) => e.areacd == el.areacd).length-1].value) : null
})).filter((e,i) => {if(hoverIndex != null ) {return i==hoverIndex} else {return primaryRolesArray.includes(e.role) }});

$: labelPlacements = labelplacer(labelData, [-outerPadding.top, chartHeight], d => d.yPosition, d => d.areanm.length > 20 ? 34: 17);




</script>

<div class="title-container">

    <div class="dropdown-container">

        <Dropdown
        name={"select-indicator-dropdown"}
        bind:chosenId={chosenId101}
        optionsArray={optionsArray101}
        ></Dropdown>

    </div>

</div>

<div class="subtitle-container">

    <p>{metadata.subtitle}
    </p>

</div>

<StickyKey2
visibleAreas={visibleAreas2}
bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
{baselineComparisonArea}
bind:chosenId1={chosenId1}
bind:chosenId2={chosenId2}
bind:chosenId4={chosenId4}
bind:chosenId5={chosenId5}
bind:chosenId6={chosenId6}
></StickyKey2>

<div class="svg-container" bind:clientWidth={width}>

	<svg
	{height}
	{width}
	>

        <g 
        class="chart-container"
        transform={"translate("+outerPadding.left+","+outerPadding.top+")"}
        >
            <rect
            width={chartWidth}
            height={chartHeight}
            fill="black"
            opacity=0.02
            stroke="none"
            ></rect>

            <AxisY
            {yDomain}
            {y}
            {metadata}
            ></AxisY>

            <AxisX
            {chartHeight}
            {xDomain}
            {x}
            ></AxisX>

            <g class="visibleLinesGroup">

                {#each visibleAreas2.reverse() as area, i}

                    {#if filteredData.filter((e) => e.areacd == area.areacd).length > 0}

                    <Line
                    {area}
                    lineData={filteredData.filter((e) => e.areacd == area.areacd)}
                    {i}
                    {hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    ></Line>

                    {/if}

                {/each}

            </g>

            <g class="overlayLinesGroup">

                {#each visibleAreas2 as area, i}

                    {#if filteredData.filter((e) => e.areacd == area.areacd).length > 0}

                    <Line
                    overlay=true
                    {area}
                    lineData={filteredData.filter((e) => e.areacd === area.areacd)}
                    {i}
                    bind:hoverIndex={hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    ></Line>

                    {/if}

                {/each}

            </g>

            <Labels
            x={x(xDomain[1])+5}
            {labelPlacements}
            {hoverIndex}
            ></Labels>
    </svg>

</div>

<style>

.subtitle-container p {
    margin: 10px 0px 0px 0px;
    padding: 0px;
}


</style>