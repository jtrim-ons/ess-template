<script>

import { scaleLinear } from 'd3-scale';
import BeeswarmCirclesVariableRadius from './doubleBeeswarmComponents/BeeswarmCirclesVariableRadius.svelte';
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";
import AxisY from './shared/AxisY.svelte';
import Key from './shared/Key.svelte';
import { rolesHierarchyObject2, colorsObject } from '$lib/config';

export let width = 200, id, data, indicator, visibleAreas, areas;

let chartHeight = 450, yAxisOffset = 320;

$: outerPadding = {top: 50, left: 350, right: 200, bottom: 50};

$: chartWidth = width - outerPadding.left - outerPadding.right;

let areasWithData = [];

$: areasWithData = [...new Set(data.filter((e) => indicator.years[1] === e.year).map((e) => e.areacd))];

$: filteredData = data.filter((e) => indicator.years[1] === e.year);

$: rolesArray = [...new Set(visibleAreas.filter((e) => areasWithData.includes(e.areacd)).map((e) => e.role))].sort((a,b) => rolesHierarchyObject2[a] - rolesHierarchyObject2[b]);

let rolesObject = {};
$: visibleAreas.forEach((e) => {rolesObject[e.areacd] = e.role })

$: yDomain = [indicator.zeroBaseline ? 0 : 0.95*Math.min(...filteredData.map((d) => d.value)), Math.max(...filteredData.map((d) => d.value))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);

$: hoverIndex = null;

let plotDataArray = [];

</script>


<div class="chart-title">

	<h3>Robo text goes here</h3>
    
    <p>{indicator.unit} by area</p>
	
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
			{y}
			{yAxisOffset}
			tickInterval={indicator.yTicks}
			></AxisY>

			<line
			x1={0}
			x2={0}
			y1={y(yDomain[0])}
			y2={y(yDomain[1])-20}
			stroke-width="1px"
			stroke="black"
			></line>

            <BeeswarmCirclesVariableRadius
            radius=5
            {rolesObject}
            xValue={0}
            {y}
            data={filteredData}
            bind:hoverIndex={hoverIndex}
            bind:plotData={plotDataArray}
            ></BeeswarmCirclesVariableRadius>


            {#if hoverIndex !== null}

            <text
            x={plotDataArray[hoverIndex].y-10}
            y={plotDataArray[hoverIndex].x-10}
            text-anchor="end"
            fill={colorsObject["selected"]}
            >{areas.find((e) => plotDataArray[hoverIndex].datum.areacd === e.areacd).areanm}</text>

            {/if}


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