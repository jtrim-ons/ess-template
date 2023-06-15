<svelte:options accessors={true} />

<script>

import { scaleLinear } from 'd3-scale';
import { selectedArea, comparisonAreasArray } from "$lib/selectedAreasStore.js";
import AxisY from './doubleBeeswarmComponents/AxisY.svelte';
import SlopeLines from './doubleBeeswarmComponents/SlopeLines.svelte';
import BeeswarmCircles from './doubleBeeswarmComponents/BeeswarmCircles.svelte';
import { colorsObject, rolesHierarchyObject2 } from '$lib/config';

export let data, indicator, width = 360, zeroBaseline = true, visibleAreas;

let filteredData = data.filter((e) => !Array.isArray(e)).filter((e) => visibleAreas.map((f) => f.areacd).includes(e.areacd));

$: selected = filteredData.filter((e)=> ["main", "country", "parent"].includes(e.role)).map((e) => e.areacd.replace(/[^a-z0-9]/gi, '').toLowerCase());

let main = {area: $selectedArea, data: data.find((e)=> e.areacd === $selectedArea.areacd)}
let parent = {data: data.find((e)=> e.areacd === $selectedArea.parentcd)}

let restructuredData = [];

filteredData.forEach((d) => {

	restructuredData.push({name: d.areanm, z: d.areacd, x: indicator.years[0], y: parseFloat(d[indicator.years[0]]), role: d.role})
	restructuredData.push({name: d.areanm, z: d.areacd, x: indicator.years[1], y: parseFloat(d[indicator.years[1]]), role: d.role})
})

restructuredData.forEach((d) => d.z = d.z.replace(/[^a-z0-9]/gi, '').toLowerCase())

let nameLookup = {};

for (let i = 0; i < restructuredData.length; i++) { nameLookup[restructuredData[i].z] = restructuredData[i].name }

let roleLookup = {};

for (let i = 0; i < restructuredData.length; i++) { roleLookup[restructuredData[i].z] = restructuredData[i].role }


let xDomain = [Math.min(...restructuredData.map(e => e.x)), Math.max(...restructuredData.map(e => e.x))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, width-padding["left"]-padding["right"]]);

$: lineDataArray = [];

$: onHover = false;

let rolesArray = [...new Set(restructuredData.map((e) => e.role))].sort((a,b) => rolesHierarchyObject2[a] - rolesHierarchyObject2[b]);

let height = 480; // number of pixels or valid css height string

let padding = {top: (rolesArray.length+1)*20+40, left: 180, right: 120, bottom: 20};
let yAxisOffset = 80;

$: yDomain = [zeroBaseline ? 0 : Math.floor(Math.min(...restructuredData.map(e => e.y))/10)*10, Math.ceil(Math.max(...restructuredData.map(e => e.y))/10)*10];

$: y = scaleLinear()
	.domain(yDomain)
	.range([height-padding["top"]-padding["bottom"], 0]);


</script>


<div class="chart-title">

<h3>{main.area.areanm} has a {parseFloat(main.data[indicator.years[1]]) > parseFloat(parent.data[indicator.years[1]]) ? "higher" : "lower"} {indicator.label.toLowerCase()} than the average for {parent.data.areanm}</h3>

<p>{indicator.unit} by area, {xDomain[0]} and {xDomain[1]}</p>
	
</div> 


<div class="svg-container" bind:clientWidth={width}>
	<svg
	{height}
	{width}
	>

	<g class="key">

        {#each rolesArray as role, j}

        <g transform={"translate(0,"+(j+1)*20+")"}>



            <g transform={"translate("+10+","+(-5)+")"}>

            <circle
            r=6
            fill={colorsObject[role]}
            stroke="white"
            >
            </circle>

            </g>

            <text
            x=30
            font-size="16px"
            fill={colorsObject[role]}

            >{role === "parent" ? data.find((e) => e.role == "parent").areanm : 
            role === "main" ? data.find((e) => e.role == "main").areanm :
            role === "country" ? data.find((e) => e.role == "country").areanm :
            role === "custom0" ? data.find((e) => e.role == "custom0").areanm :
            role === "custom1" ? data.find((e) => e.role == "custom1").areanm :
            role === "custom2" ? data.find((e) => e.role == "custom2").areanm :
            role === "custom3" ? data.find((e) => e.role == "custom3").areanm :
            role === "custom4" ? data.find((e) => e.role == "custom4").areanm :
            role === "neighbour" ? "Other areas in "+data.find((e) => e.role == "parent").areanm:
            role === "similar" ? "Statistically similar areas to "+data.find((e) => e.role == "main").areanm : ""}</text>

        </g>


        {/each}

    </g>

		<g 
		class="chart-container"
		transform={"translate("+padding["left"]+","+padding["top"]+")"}
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
			{xDomain}
			{x}
			{lineDataArray}
			{selected}
			{onHover}
			></SlopeLines>

			<BeeswarmCircles
			{xDomain}
			{x}
			{y}
			{nameLookup}
			{roleLookup}
			data={restructuredData}
			{selected}
			bind:lineDataArray={lineDataArray}
			bind:onHover={onHover}
			></BeeswarmCircles>

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