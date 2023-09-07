<script>

import { scaleLinear } from 'd3-scale';
import { selectedArea, comparisonAreasArray } from "$lib/selectedAreasStore.js";
import BeeswarmCircles from './doubleBeeswarmComponents/BeeswarmCircles.svelte';
import SlopeLines from './doubleBeeswarmComponents/SlopeLines.svelte';
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";
import AxisY from './shared/AxisY.svelte';
import Key from './shared/Key.svelte';

import { rolesHierarchyObject2 } from '$lib/config';

export let width = 200, id, data, indicator, visibleAreas, areas;

let chartHeight = 450, yAxisOffset = 120;

$: outerPadding = {top: 70, left: 200, right: 100, bottom: 50};

$: chartWidth = width - outerPadding.left - outerPadding.right;

let areasWithData = [];

$: areasWithData = [...new Set(data.filter((e) => indicator.years.includes(e.year)).map((e) => e.areacd))];

$: filteredData = data.filter((e) => visibleAreas.map((f) => f.areacd).includes(e.areacd ) & indicator.years.includes(e.year));

$: rolesArray = [...new Set(visibleAreas.filter((e) => areasWithData.includes(e.areacd)).map((e) => e.role))].sort((a,b) => rolesHierarchyObject2[a] - rolesHierarchyObject2[b]);

let rolesObject = {};
$: visibleAreas.forEach((e) => {rolesObject[e.areacd] = e.role })

$: xDomain = indicator.years;

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: yDomain = [indicator.zeroBaseline ? 0 : 0.95*Math.min(...filteredData.map((d) => d.value)), Math.max(...filteredData.map((d) => d.value))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);

$: hoverIndex = null;

let plotDataArray = [[], []]

</script>


<div class="chart-title">

	<h3>Robo text goes here</h3>
    
    <p>{indicator.unit} by area, {xDomain[0]} to {xDomain[1]}</p>
	
</div> 

<SelectComparisonAreas
{areas}
{areasWithData}
></SelectComparisonAreas>

<Key
{rolesArray}
radius=5
line={false}
{visibleAreas}
></Key>

<div class="svg-container" bind:clientWidth={width}>
	<svg
	height={chartHeight+outerPadding.bottom+outerPadding.top}
	{width}
	>

	<g 
		class="chart-container"
		transform={"translate("+outerPadding["left"]+","+outerPadding["top"]+")"}
		>

			<AxisY
			{yDomain}
			{x}
			{y}
			{yAxisOffset}
			tickInterval={indicator.yTicks}
			></AxisY>

			<line
			x1={x(xDomain[0])}
			x2={x(xDomain[0])}
			y1={y(yDomain[0])}
			y2={y(yDomain[1])-20}
			stroke-width="1px"
			stroke="black"
			></line>

			<text
            x={x(xDomain[0])}
			y=-30
			text-anchor="middle"
            font-size="14px"
            fill={"black"}
			>{indicator.years[0]}</text>

			<text
            x={x(xDomain[1])}
			y=-30
			text-anchor="middle"
            font-size="14px"
            fill={"black"}
			>{indicator.years[1]}</text>

			<line
			x1={x(xDomain[1])}
			x2={x(xDomain[1])}
			y1={y(yDomain[0])}
			y2={y(yDomain[1])-20}
			stroke-width="1px"
			stroke="black"
			></line>

			<SlopeLines
			{areas}
			{plotDataArray}
			x1={x(indicator.years[0])}
			x2={x(indicator.years[1])}
			{hoverIndex}
			{rolesObject}
			rolesArray={rolesArray.filter((e) => !["similar", "neighbour"].includes(e) )}
			></SlopeLines>

			{#each indicator.years as year, i}

				<BeeswarmCircles
				{rolesObject}
				xValue={x(year)}
				{y}
				data={filteredData.filter((e) => e.year === year)}
				bind:hoverIndex={hoverIndex}
				bind:plotData={plotDataArray[i]}
				></BeeswarmCircles>

			{/each}

	</g>


	</svg>
</div>


<style>
	.chart-container {
		width: 100%;
	}
	.visuallyhidden {
		position: absolute; 
		width: 1px; 
		height: 1px; 
		margin: -1px; 
		padding: 0; 
		overflow: hidden;
		clip: rect(0,0,0,0);  
		border: 0;
	}

	p {
		margin-bottom: 10px;
		width: 90%;
		padding: 0px;
	}
	
	h3 {
		margin-bottom: 0px;
		width: 90%;
	}
	
	
</style>