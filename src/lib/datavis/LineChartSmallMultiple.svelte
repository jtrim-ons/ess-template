<script>

import { scaleLinear } from 'd3-scale';
import { selectedArea, comparisonAreasArray } from "$lib/selectedAreasStore.js";
import AxisY from './doubleBeeswarmComponents/AxisY.svelte';
import AxisX from './doubleBeeswarmComponents/AxisX.svelte';

export let data, indicator, width = 360;

let restructuredData = [];

data.forEach((e) => {

    let dataArray = [];

    for (var i = indicator.years[0]; i <= indicator.years[1]; i++) {

        if (i in e) {dataArray.push({x : i, y : e[i]})}
    }

    restructuredData.push({name: e.areanm, z: e.areacd, data: dataArray})
})

console.log(restructuredData);

let chartHeight = 100; // number of pixels or valid css height string

let outerPadding = {top: 60, left: 50, right: 20, bottom: 20};
let innerPadding = {middle: 20, right: 40, bottom: 80};
let columns = 2;

$: chartWidth = (width - outerPadding.left - outerPadding.right - innerPadding.middle*(columns-1) - innerPadding.right*columns)/columns;

$: console.log(width);
$: console.log(chartWidth);

$: xDomain = [Math.min(...restructuredData.map(d => Math.min(...d.data.map(e => e.x)) )), Math.max(...restructuredData.map(d => Math.max(...d.data.map(e => e.x)) ))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: yDomain = [Math.min(...restructuredData.map(d => Math.min(...d.data.map(e => e.y)) )), Math.max(...restructuredData.map(d => Math.max(...d.data.map(e => e.y)) ))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);



</script>


<div class="svg-container" bind:clientWidth={width}>
	<svg
	height=1200
	{width}
	>

        <g class="chart-container-global-group"
        transform={"translate("+outerPadding.left+","+outerPadding.top+")"}>

        {#each restructuredData as chartData, i}

            <g 
            class={"chart-container chart-container-"+i}
            transform={"translate("+((i % columns)*(chartWidth + innerPadding.middle + innerPadding.right))+","+((chartHeight + innerPadding.bottom)*(i - i % columns)/columns)+")"}
            >

                <text
                font-weight="bold"
                y=-5
                stroke="none"
                fill="#333"
                font-size="16px"
                >{chartData.name}</text>

                <AxisY
                {yDomain}
                {y}
                column={i % columns}
                ></AxisY>

                <AxisX
                {chartHeight}
                {xDomain}
                {x}
                ></AxisX>

                <path
                ></path>


            </g>



        {/each}

        </g>


    </svg>
</div>