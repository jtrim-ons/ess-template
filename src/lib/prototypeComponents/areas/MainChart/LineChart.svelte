<script>

import { scaleLinear } from 'd3-scale';
import AxisY from '$lib/datavis/shared/AxisY.svelte';
import AxisX from '$lib/datavis/shared/AxisX.svelte';
import Line from '$lib/datavis/lineChartComponents/Line.svelte';
import Labels from '$lib/datavis/Labels.svelte';
import labelplacer from 'labelplacer';
import { getContext } from 'svelte';

let areas = getContext('areas');

export let visibleAreas, combinedData, indicators;

let width=400, height=500, labelColumnWidth = 170;

$: outerPadding = {top: 10, left: 80, right: labelColumnWidth + 5, bottom: 40};

$: chartWidth = width - outerPadding.left - outerPadding.right;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

$: indicator = indicators[0];

$: hoverIndex = null;

$: filteredData = [];

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

            <!-- <AxisY
            {yDomain}
            {y}
            {indicator}
            ></AxisY>

            <AxisX
            {chartHeight}
            {xDomain}
            {x}
            ></AxisX> -->

            <g class="visibleLinesGroup">

                {#each visibleAreas.reverse() as area, i}

                    {#if filteredData.filter((e) => e.areacd == area.areacd).length > 0}

                    <!-- <Line
                    {area}
                    lineData={filteredData.filter((e) => e.areacd == area.areacd)}
                    {i}
                    {hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    ></Line> -->

                    {/if}

                {/each}

            </g>

            <g class="overlayLinesGroup">

                {#each visibleAreas as area, i}

                    {#if filteredData.filter((e) => e.areacd == area.areacd).length > 0}

                    <!-- <Line
                    overlay=true
                    {area}
                    lineData={filteredData.filter((e) => e.areacd === area.areacd)}
                    {i}
                    bind:hoverIndex={hoverIndex}
                    {x}
                    {y}
                    {xDomain}
                    ></Line> -->

                    {/if}

                {/each}

            </g>

            <!-- <Labels
            x={x(xDomain[1])+5}
            {labelPlacements}
            {hoverIndex}
            ></Labels> -->
    </svg>

</div>
