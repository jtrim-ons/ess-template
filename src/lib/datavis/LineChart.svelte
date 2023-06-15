<script>

import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { selectedArea, comparisonAreasArray } from "$lib/selectedAreasStore.js";
import AxisY from './doubleBeeswarmComponents/AxisY.svelte';
import AxisX from './doubleBeeswarmComponents/AxisX.svelte';
import { colorsObject, rolesHierarchyObject, rolesHierarchyObject2 } from '$lib/config';
import { select } from "d3-selection";

export let data, indicator, width = 360, zeroBaseline = true, labelsOnChart = true, legend = true, visibleAreas;

$: selected = {area: $selectedArea, data: data.find((e)=> e.areacd === $selectedArea.areacd)}

let restructuredData = [];

$: filteredData = data.filter((e) => visibleAreas.map((f) => f.areacd).includes(e.areacd));

$: createRestructuredData(filteredData, indicator) 

function createRestructuredData(data, indicator) {

    let outputArray = [];

    data = data.sort((a,b) => rolesHierarchyObject[b.role] - rolesHierarchyObject[a.role]);

    data.forEach((e) => {

    let dataArray = [];

    for (var i = indicator.years[0]; i <= indicator.years[1]; i++) {

        if (i in e) {dataArray.push({x : i, y : e[i]})}
    }

    outputArray.push({name: e.areanm, z: e.areacd, data: dataArray, role: e.role })
    })

    restructuredData = outputArray
}

$: rolesArray = [...new Set(restructuredData.map((e) => e.role))].sort((a,b) => rolesHierarchyObject2[a] - rolesHierarchyObject2[b]);

let chartHeight = 300; // number of pixels or valid css height string

$: outerPadding = {top: (rolesArray.length+1)*20, left: 70, right: 180, bottom: 40};
let columns = 2;

$: chartWidth = width - outerPadding.left - outerPadding.right;

$: xDomain = [Math.min(...restructuredData.map(d => Math.min(...d.data.map(e => e.x)) )), Math.max(...restructuredData.map(d => Math.max(...d.data.map(e => e.x)) ))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: yDomain = [zeroBaseline ? 0 : Math.min(...restructuredData.map(d => Math.min(...d.data.map(e => e.y)) )), Math.max(...restructuredData.map(d => Math.max(...d.data.map(e => e.y)) ))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);

$: pathFunction = line()
    .x((d) => { return x(d.x); })
    .y((d) => { return y(d.y); });

$: console.log(indicator.label.toLowerCase());

$: changeOverSampleSelected = (selected.data[xDomain[1]]-selected.data[xDomain[0]])/selected.data[xDomain[0]];

$: hoverIndex = null;

function mouseoverEvent(event) {

    hoverIndex = parseFloat(select(this).attr("hoverid"));
}

function mouseleaveEvent(event) {

    hoverIndex = null;
}

$: console.log(hoverIndex);


</script>

<div class="chart-title">

<h3>{selected.area.areanm}'s {indicator.label.toLowerCase()} has {changeOverSampleSelected > 0.02 ? "increased" : changeOverSampleSelected < -0.02 ? "decreased" : "barely changed"} {changeOverSampleSelected > 0.02 || changeOverSampleSelected < -0.02 ? "by " + Math.abs((changeOverSampleSelected*100).toFixed(0))+"%" : ""} since {xDomain[0]}</h3>

<p>{indicator.unit} by area, {xDomain[0]} to {xDomain[1]}</p>

</div> 

<div class="svg-container" bind:clientWidth={width}>
	<svg
	height={chartHeight+outerPadding.top+outerPadding.bottom}
	{width}
	>
        <g class="key">

        {#each rolesArray as role, j}

        <g transform={"translate(0,"+(j+1)*20+")"}>

            <line
            x1=0
            x2=20 
            y1=-5
            y2=-5
            stroke={colorsObject[role]}
            stroke-width="2px"
            ></line>

            {#if ["main", "parent", "country", "custom0", "custom1", "custom2", "custom3", "custom4"].includes(role)}

            <g transform={"translate("+10+","+(-5)+")"}>

            {#if role === "parent"}

            <rect
            x=-3
            y=-3
            width=6
            height=6
            fill={colorsObject[role]}
            stroke="white"
            >
            </rect>

            {:else if role === "country"}

            <rect
            transform="rotate(45)"
            x=-3
            y=-3
            width=6
            height=6
            fill={colorsObject[role]}
            stroke="white"
            >
            </rect>

            {:else}

            <circle
            r=3.5
            fill={colorsObject[role]}
            stroke="white"
            >
            </circle>

            {/if} 

            </g>

        {/if}

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

            {#each restructuredData as lineData, i}

                <g
                opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.25}>

                <path
                d={pathFunction(lineData.data)}
                fill="none"
                stroke={hoverIndex === i ? "#F39431" : colorsObject[lineData.role]}
                stroke-width="2px"
                opacity={hoverIndex === i || ["main", "parent", "country", "custom0", "custom1", "custom2", "custom3", "custom4"].includes(lineData.role) ? 1 : 0.5}
                ></path>

                {#if hoverIndex === i || ["main", "parent", "country", "custom0", "custom1", "custom2", "custom3", "custom4"].includes(lineData.role) }

                <text
                x={x(xDomain[1])+5}
                y={5+y(lineData.data.find((e)=>e.x === xDomain[1]).y)}
                font-size="16px"
                fill={hoverIndex === i ? "#F39431" : colorsObject[lineData.role]}
                >{lineData.name}</text>

                {/if}

                {#if hoverIndex === i || ["main", "parent", "country", "custom0", "custom1", "custom2", "custom3", "custom4"].includes(lineData.role)}

                    {#each lineData.data as datapoint, j}

                    <g transform={"translate("+x(datapoint.x)+","+y(datapoint.y)+")"}>

                    {#if lineData.role === "parent"}

                    <rect
                    x=-3
                    y=-3
                    width=6
                    height=6
                    fill={hoverIndex === i ? "#F39431": colorsObject[lineData.role]}
                    stroke="white"
                    >
                    </rect>

                    {:else if lineData.role === "country"}

                    <rect
                    transform="rotate(45)"
                    x=-3
                    y=-3
                    width=6
                    height=6
                    fill={hoverIndex === i ? "#F39431": colorsObject[lineData.role]}
                    stroke="white"
                    >
                    </rect>

                    {:else}

                    <circle
                    r=3.5
                    fill={hoverIndex === i ? "#F39431" : colorsObject[lineData.role]}
                    stroke="white"
                    >
                    </circle>

                    {/if} 

                    </g>


                    {/each}

                {/if}

                </g>

            {/each}

            {#each restructuredData as lineData, i}

                <path
                hoverid={i}
                on:mousemove={mouseoverEvent}
                on:mouseleave={mouseleaveEvent}
                class="hoverLine"
                d={pathFunction(lineData.data)}
                fill="none"
                stroke={"white"}
                stroke-width="15px"
                opacity={0}
                ></path>

            {/each}

        </g>

    </svg>
</div>

<style>

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