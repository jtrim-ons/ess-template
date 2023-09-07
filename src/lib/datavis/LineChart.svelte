<script>

import { scaleLinear } from 'd3-scale';
import AxisY from './shared/AxisY.svelte';
import AxisX from './shared/AxisX.svelte';
import Line from './lineChartComponents/Line.svelte';
import Labels from './Labels.svelte';
import labelplacer from 'labelplacer';
import { getContext } from 'svelte';


let areas = getContext('areas');

export let plottedAreas, filteredData, indicator;

let width=400, height=500, labelColumnWidth = 200

$: outerPadding = {top: 10, left: 80, right: labelColumnWidth + 5, bottom: 40};

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

$: labelData = plottedAreas.map((e) => ({
  ...e,
  yPosition: y(filteredData.find((el) => el.areacd === e.areacd & el.year === Math.max.apply(null,filteredData.filter((elm) => elm.areacd === e.areacd).map((elmt) => elmt.year))).value),
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
            {indicator}
            ></AxisY>

            <AxisX
            {chartHeight}
            {xDomain}
            {x}
            ></AxisX>

            <g class="visibleLinesGroup">

                {#each plottedAreas.reverse() as area, i}

                    <Line
                    {area}
                    lineData={filteredData.filter((e) => e.areacd === area.areacd)}
                    {i}
                    {hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    ></Line>

                {/each}

            </g>

            <g class="overlayLinesGroup">

                {#each plottedAreas as area, i}

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

                {/each}

            </g>

            <Labels
            x={x(xDomain[1])+5}
            {labelPlacements}
            {hoverIndex}
            ></Labels>
    </svg>

</div>
