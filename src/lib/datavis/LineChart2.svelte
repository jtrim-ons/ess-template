<script>

import { scaleLinear } from 'd3-scale';
import { selectedArea, comparisonAreasArray } from "$lib/selectedAreasStore.js";
import { calculateSmallestDifference } from '$lib/dataVisFunctions';
import AxisY from './shared/AxisY.svelte';
import AxisX from './shared/AxisX.svelte';
import Key from './shared/Key.svelte';
import Line from './lineChartComponents/Line.svelte';
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";
import { onMount } from 'svelte';
import { select, selectAll } from "d3-selection";
import { rolesHierarchyObject2 } from '$lib/config';
import RoboSentences from './RoboSentences.svelte';

export let data, indicator, width = 360, zeroBaseline = true, labelsOnChart = true, visibleAreas, areas, id, areaBasedData, countByGeoLevel, countOfNulls, mainAreaNameStyled, ukAreaNameStyle,  countryAreaNameStyled, parentAreaNameStyle, areaType;

let mounted = false, maxLabelWidth = 0, minLabelYSeparation = 999;

let areasWithData = [];

$: areasWithData = [...new Set(data.map((e) => e.areacd))];

$: filteredData = data.filter((e) => visibleAreas.map((f) => f.areacd).includes(e.areacd ))

$: visibleAreas.forEach((e) => {

    e.data = filteredData.filter((d) => e.areacd === d.areacd)
});

$: rolesArray = [...new Set(visibleAreas.map((e) => e.role))].sort((a,b) => rolesHierarchyObject2[a] - rolesHierarchyObject2[b]);

let chartHeight = 300; // number of pixels or valid css height string

$: labelsOnChart  = maxLabelWidth < 200 & minLabelYSeparation > 14;

$: outerPadding = {top: 10, left: 70, right: labelsOnChart ? maxLabelWidth + 5 : 20, bottom: 40};

$: chartWidth = width - outerPadding.left - outerPadding.right;

$: xDomain = [Math.min(...filteredData.map((d) => d.year)), Math.max(...filteredData.map((d) => d.year))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: yDomain = [zeroBaseline ? 0 : 0.95*Math.min(...filteredData.map((d) => d.value)), Math.max(...filteredData.map((d) => d.value))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);

$: hoverIndex = null;

const calculateLabelPositions = (visibleAreas) => {

    if (mounted) { 
        
        setTimeout(() => {

            maxLabelWidth = Math.max(0,...[...select(".lineChart"+id).selectAll(".nameLabel")].map((e) => e.getBBox().width));
            minLabelYSeparation = calculateSmallestDifference([...[...select(".lineChart"+id).selectAll(".nameLabel")].map((e) => e.getBBox().y)]);
        }, 100)
    }
}

$: calculateLabelPositions(visibleAreas);

onMount(() => {

    mounted = true;
    calculateLabelPositions(visibleAreas);

}) 

let chartPicker = 1;

</script>

{#if mounted}

<div class={"lineChart"+id}>

<div class="chart-title">

    <RoboSentences
    data={areaBasedData}
    {countOfNulls}
    {areaType}
    {mainAreaNameStyled}
    {countryAreaNameStyled}
    {ukAreaNameStyle}
    {parentAreaNameStyle}
    block={{code: indicator.code, indicator: indicator, sentence: 5}}
    {countByGeoLevel}
    fullStop=""
    ></RoboSentences>
    
    <p>{indicator.unit} by area, {xDomain[0]} to {xDomain[1]}</p>
    
</div> 

<div class="radio-container">
    <label>
        <input type="radio" value={1} name="chartPicker" bind:group={chartPicker}>
        Line chart
    </label>
    <label>
        <input type="radio" value={2} name="chartPicker" bind:group={chartPicker}>
        Beeswarm
    </label>
    <label>
        <input type="radio" value={3} name="chartPicker" bind:group={chartPicker}>
        Scatter chart
    </label>
    <label>
        <input type="radio" value={4} name="chartPicker" bind:group={chartPicker}>
        Map
    </label>
</div>

<SelectComparisonAreas
{areas}
{areasWithData}
></SelectComparisonAreas>

<div class="svg-container" bind:clientWidth={width}>

    {#if !labelsOnChart}

        <Key
        {rolesArray}
        {visibleAreas}
        ></Key>

        <Key
        rolesArray={["selected"]}
        {visibleAreas}
        {hoverIndex}
        ></Key>

    {/if}

	<svg
	height={chartHeight+outerPadding.top+outerPadding.bottom}
	{width}
	>

        <g class="chart-container"
            transform={"translate("+outerPadding.left+","+outerPadding.top+")"}>

                <AxisY
                {yDomain}
                {y}
                tickInterval={indicator.yTicks}

                ></AxisY>

                <AxisX
                {chartHeight}
                {xDomain}
                {x}
                ></AxisX>

                <g class="visibleLinesGroup">

                {#each visibleAreas.reverse() as lineData, i}

                    <Line
                    overlay={false}
                    {lineData}
                    {i}
                    {hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    {labelsOnChart}
                    ></Line>

                {/each}

                </g>

                <g class="overlayLinesGroup">

                {#each visibleAreas as lineData, i}

                    <Line
                    overlay={true}
                    {lineData}
                    {i}
                    bind:hoverIndex={hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    ></Line>

                {/each}

                </g>

        </g>

    </svg>

</div>

</div>

{/if}
    