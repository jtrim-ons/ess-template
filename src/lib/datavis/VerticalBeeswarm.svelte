<script>

import { scaleLinear } from 'd3-scale';
import AxisY from './shared/AxisY.svelte';
import AxisX from './shared/AxisX.svelte';
import BeeswarmCircles from './doubleBeeswarmComponents/BeeswarmCircles.svelte';
import SlopeLines from './doubleBeeswarmComponents/SlopeLines.svelte';
import Labels from './Labels.svelte';
import labelplacer from 'labelplacer';
import { getContext } from 'svelte';


let areas = getContext('areas'); 

export let plottedAreas, filteredData, indicator, selectedAreas;

let width=400, height=470, labelColumnWidth = 220, yAxisOffset = 120;

$: outerPadding = {top: 40, left: 200, right: labelColumnWidth + 5, bottom: 40};

$: chartWidth = width - outerPadding.left - outerPadding.right;
$: chartHeight = height - outerPadding.top - outerPadding.bottom

$: xDomain = [Math.min(...filteredData.map((d) => d.year)), Math.max(...filteredData.map((d) => d.year))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: yDomain = [indicator.zeroBaseline === "TRUE" ? 0 : Math.floor(0.95*Math.min(...filteredData.map((d) => d.value))), Math.ceil(Math.max(...filteredData.map((d) => d.value)))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);

$: hoverIndex = null;

let primaryRolesArray = ["main", "parent", "country", "uk", "custom1", "custom2", "custom3", "custom4"];

$: plottedAreas = plottedAreas.map((e) => ({
  ...e,
  radius: primaryRolesArray.includes(e.role) ? 10 : 6
}));

let lineDataArray = [[],[]];

$: labelData = plottedAreas.map((e) => ({
    ...e,
    yPosition: y(filteredData.find((el) => el.areacd === e.areacd & el.year === xDomain[1]).value),
    areanm: areas.find((el) => e.areacd === el.areacd).areanm
})).filter((e,i) => {if(hoverIndex != null ) {return i==hoverIndex} else {return primaryRolesArray.includes(e.role) }});

$: labelPlacements = labelplacer(labelData, [-outerPadding.top, chartHeight], d => d.yPosition, d => d.areanm.length > 20 ? 34: 17);

</script>

<div class="svg-container" bind:clientWidth={width}>

	<svg
	{height}
	{width}
	>

        <g 
        class="chart-container"
        transform={"translate("+outerPadding.left+","+outerPadding.top+")"}
        >

        <g transform={"translate("+(-yAxisOffset)+",0)"}>

            <AxisY
            {yDomain}
            {y}
            {indicator}
            ></AxisY>

        </g>

        <rect
        x={-yAxisOffset/2}
        width={chartWidth+yAxisOffset}
        height={chartHeight}
        stroke="none"
        fill="black"
        opacity=0.02
        ></rect>

        {#if xDomain[1] != xDomain[0]}

            <SlopeLines
            {lineDataArray}
            x1={x(xDomain[0])}
            x2={x(xDomain[1])}
            {hoverIndex}
            ></SlopeLines>

        {/if}

        {#each xDomain[0] === xDomain[1] ? [xDomain[0]] : xDomain as year, i}

                <g transform={"translate("+x(year)+",0)"}>

                    <line
                    y1={y(yDomain[0])}
                    y2={y(yDomain[1])-20}
                    stroke-width="1px"
                    stroke="black"
                    ></line>

                    <text
                    y=-30
                    text-anchor="middle"
                    font-size="14px"
                    fill={"black"}
                    >{year}</text>

                    <BeeswarmCircles
                    {plottedAreas}
                    circleData={filteredData.filter((e) => e.year == year)}
                    {y}
                    bind:hoverIndex={hoverIndex}
                    bind:lineData={lineDataArray[i]}
                    ></BeeswarmCircles>

                </g>

        {/each}

        <Labels
        x={x(xDomain[1])+35+(lineDataArray[1].length > 0 ? Math.max(...lineDataArray[1].map((e) => e.y)): 0)}
        {labelPlacements}
        {hoverIndex}
        ></Labels>


    </svg>

</div>