<script>

import { getContext } from 'svelte';
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { scaleLinear } from 'd3-scale';
import { colorsObject } from '$lib/config';
import { select } from "d3-selection";

let areas = getContext('areas'); 

export let filteredData, indicator, checkboxedRoles, siblingAreas, selectedAreas, areasWithData, plottedAreas, key = false;

let width=400, height=100;

$: outerPadding = {top: 10, left: 20, right: 30, bottom: 10};

$: chartWidth = width - outerPadding.left - outerPadding.right;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

//$: areasWithData = [...new Set(filteredData.map((e) => e.areacd))];

function round(value, dp = 4) {
    const divisor = Math.pow(10, dp);
    return Math.round(value * divisor) / divisor;
}
	
function getDeviation(value, median, mad = 1) {
    return (value - median) / mad;
}

function getMedianMad(values) { 

    values = values.map((e) => Math.pow(e.value, indicator.beeswarmPower))

    const getMedian = (vals) => {
        const half = vals.length / 2;
        const sorted = [...vals].sort((a, b) => a - b);
        return half % 1 === 0 ? (sorted[half - 1] + sorted[half]) / 2 : sorted[Math.floor(half)];
    };
    const median = getMedian(values);
    const deviations = values.map(val => Math.abs(val - median));
    const mad = getMedian(deviations) * 1.4826;

    return [median, mad];
}

$: siblingsData = filteredData.filter((e) => siblingAreas.siblings.includes(e.areacd) || e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd);

$: calculatedDomain = [Math.min(...siblingsData.map((e) => e.value)), Math.max(...siblingsData.map((e) => e.value))];

$: siblingsDataCalcRange = siblingsData.map((e) => ({
    ...e,
    calcYValue: (e.value-calculatedDomain[0])/(calculatedDomain[1]-calculatedDomain[0])
}))



$: output = getMedianMad(siblingsData);
$: deviations = siblingsData.map(val => getDeviation(Math.pow(val.value, indicator.beeswarmPower), output[0], output[1]));


$: selectedAreasWithData = plottedAreas.map((e) => ({
    ...e,
    yValue: filteredData.filter((el) => el.areacd === e.areacd)
})).filter((e) => e.yValue.length > 0);

$: deviationsPrimary = selectedAreasWithData.map(e => getDeviation(Math.pow(e.yValue[0].value, indicator.beeswarmPower), output[0], output[1]));

$: yDomain = indicator.highEqualsGood === "F" ? [1, 0] : [0, 1];

$: y = scaleLinear()
	.domain(yDomain)
	.range([0, chartWidth]);

$: plotData = new AccurateBeeswarm(siblingsDataCalcRange, 5, (d) => y(Math.pow(d.calcYValue, indicator.beeswarmPower)))
        .calculateYPositions()

$: x = scaleLinear()
	.domain([Math.min(...plotData.map(d => d.y)), Math.max(...plotData.map(d => d.y))])
	.range([0, chartHeight]);

$: plotDataPrimary = new AccurateBeeswarm(selectedAreasWithData.map((e,i) => ({
        ...e, 
        yDev: deviationsPrimary[i]
        })), 8, (d) => y(d.yDev))
        .calculateYPositions()

let prefix = indicator.prefix === null ? "" : indicator.prefix === "pounds" ? "£" : indicator.prefix;
let suffix = indicator.suffix === null ? "" : indicator.suffix;

$: hoverIndex = null;


function mouseoverEvent(event) { hoverIndex = parseFloat(select(this).attr("hoverid")) }
function mouseleaveEvent(event) { hoverIndex = null }

</script>

<div class="rowContainer">

    <div class="svg-container" bind:clientWidth={width}>

        <p style="padding-top: 10px;"><span style="font-weight: bold">{indicator.label}</span></p>

        {#if indicator.unit != null}
        <p><span style="padding-left: 0px; font-size: 14px; font-style: italic">{indicator.unit+" in "+indicator.latestYear}</span><p>
        {/if}

        <svg
        height={height+(key ? 100: 0)}
        {width}
        >
            <rect
            width={width}
            height={height}
            fill="grey"
            opacity=0></rect>

            <g class="chart-container" transform={"translate("+outerPadding.left+","+(outerPadding.top)+")"}>

                <g class="backgroundElements">

                    {#each plotData as circle,i}

                        <g transform={"translate("+circle.x+","+x(circle.y)+")"}>

                            <circle
                            on:mouseover={mouseoverEvent}
                            on:mouseleave={mouseleaveEvent}
                            on:focus={mouseoverEvent}
                            r=5
                            stroke="none"
                            fill="black"
                            opacity=0.1
                            hoverid={i}
                            ></circle>

                        </g>

                    {/each}

                </g>

                <g class="hoverElements">

                    {#each plotData as circle,i}

                        {#if hoverIndex === i}

                            <g transform={"translate("+circle.x+","+x(circle.y)+")"}>

                                <circle
                                pointer-events="none"
                                r=8
                                stroke="white"
                                stroke-width="1.5px"
                                fill="#F39431"
                                opacity=1
                                ></circle>

                                <text
                                text-anchor={circle.x < chartWidth/2 ? "start": "end"}
                                x={circle.x < chartWidth/2 ? 10 : -10}
                                y=-30
                                stroke-width="3px"
                                fill="whtie"
                                stroke="white"
                                >{prefix+(circle.datum.value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                                <text
                                text-anchor={circle.x < chartWidth/2 ? "start": "end"}
                                x={circle.x < chartWidth/2 ? 10 : -10}
                                y=-30
                                fill="#F39431"
                                stroke="#F39431"
                                >{prefix+(circle.datum.value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                                <text
                                text-anchor={circle.x < chartWidth/2 ? "start": "end"}
                                x={circle.x < chartWidth/2 ? 10 : -10}
                                y=-10
                                stroke-width="3px"
                                fill="whtie"
                                stroke="white"
                                >{areas.find((e) => e.areacd === circle.datum.areacd).areanm}</text>

                                <text
                                text-anchor={circle.x < chartWidth/2 ? "start": "end"}
                                x={circle.x < chartWidth/2 ? 10 : -10}
                                y=-10
                                fill="#F39431"
                                stroke="#F39431"
                                >{areas.find((e) => e.areacd === circle.datum.areacd).areanm}</text>

                            </g>

                        {/if}

                    {/each}

                </g>

                <g class="primaryElements" transform={"translate(0,"+(chartHeight/2)+")"} opacity={hoverIndex === null ? 1 : 0.1}>

                    {#each plotDataPrimary as circle,i}

                        <g transform={"translate("+circle.x+","+(-circle.y)+")"}>

                            {#if ["parent", "country", "uk"].includes(circle.datum.role)}
                                            
                                <rect
                                pointer-events="none"
                                transform={["country", "uk"].includes(circle.datum.role) ? "rotate(45)" : null }
                                x={-6}
                                y={-6}
                                width={12}
                                height={12}
                                fill={colorsObject[circle.datum.role]}
                                stroke="white"
                                stroke-width="1.5px"
                                opacity={hoverIndex === null ? 1 : 0.2}
                                >
                                </rect>

                    {:else} 

                            <circle
                            pointer-events="none"
                            r={8}
                            fill={colorsObject[circle.datum.role]}
                            stroke="white"
                            stroke-width="1.5px"
                            opacity={hoverIndex === null ? 1 : 0.2}
                            >
                            </circle>

                    {/if}

                    {#if plotDataPrimary.length <= 3}

                    <g class="labelGroup">

                            {#if circle.x === Math.min(...plotDataPrimary.map((e) => e.x))}

                                <text
                                pointer-events="none"
                                x=-10
                                y=0
                                text-anchor="end"
                                stroke={"white"}
                                fill={"white"}
                                stroke-width="3px"
                                >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                                <text
                                pointer-events="none"
                                x=-10
                                y=0
                                text-anchor="end"
                                stroke={colorsObject[circle.datum.role]}
                                fill={colorsObject[circle.datum.role]}
                                >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                            {:else if circle.x === Math.max(...plotDataPrimary.map((e) => e.x))}

                                    <text
                                    pointer-events="none"
                                    x=10
                                    y=0
                                    text-anchor="start"
                                    stroke={"white"}
                                    fill={"white"}
                                    stroke-width="3px"
                                    >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                                    <text
                                    pointer-events="none"
                                    x=10
                                    y=0
                                    text-anchor="start"
                                    stroke={colorsObject[circle.datum.role]}
                                    fill={colorsObject[circle.datum.role]}
                                    >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>


                            {:else if circle.y === Math.max(...plotDataPrimary.filter((e) => e.x != Math.max(...plotDataPrimary.map((e) => e.x)) & e.x != Math.min(...plotDataPrimary.map((e) => e.x))).map((e) => e.y))}

                                    <text
                                    pointer-events="none"
                                    x=0
                                    y=-15
                                    text-anchor="middle"
                                    stroke={"white"}
                                    fill={"white"}
                                    stroke-width="3px"
                                    >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                                    <text
                                    pointer-events="none"
                                    x=0
                                    y=-15
                                    text-anchor="middle"
                                    stroke={colorsObject[circle.datum.role]}
                                    fill={colorsObject[circle.datum.role]}
                                    >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                            {:else}

                                    <text
                                    pointer-events="none"
                                    x=0
                                    y=25
                                    text-anchor="middle"
                                    stroke={"white"}
                                    fill={"white"}
                                    stroke-width="3px"
                                    >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                                    <text
                                    pointer-events="none"
                                    x=0
                                    y=25
                                    text-anchor="middle"
                                    stroke={colorsObject[circle.datum.role]}
                                    fill={colorsObject[circle.datum.role]}
                                    >{prefix+(circle.datum.yValue[0].value.toFixed(indicator.toFixed)).toLocaleString()+suffix}</text>

                            {/if}

                        </g>

                    {/if}

                    </g>

                    {/each}



                </g>

            </g>

        </svg>

    </div>

</div>



<style>

p {
    padding: 0px 0px 0px 20px;
    margin: 0px;
}

.rowContainer {
    margin-top: 0px;
    border-style: solid;
    border-width: 2px 0px 0px 0px;
    border-color: #e8e8e8;
    
}

svg {overflow: visible;}


</style>