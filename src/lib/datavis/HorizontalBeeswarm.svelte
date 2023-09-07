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

function splitTextIntoEqualParts(text, n) {
  // Split the text into words using spaces as separators
  const words = text.split(' ');

  // Calculate the target length of each part
  const targetLength = Math.ceil(words.length / n);

  // Initialize variables to store the result
  const result = [];
  let currentPart = [];

  // Iterate through the words and group them into parts
  words.forEach(word => {
    // If the current part is smaller than the target length, add the word
    if (currentPart.length < targetLength) {
      currentPart.push(word);
    } else {
      // If the current part is already at the target length, start a new part
      result.push(currentPart.join(' '));
      currentPart = [word];
    }
  });

  // Add the last part to the result
  if (currentPart.length > 0) {
    result.push(currentPart.join(' '));
  }

  return result;
}

function findMedianObject(objects) {
  // Sort the array of objects by the "value" property
  objects.sort((a, b) => a.x - b.x);

  // Calculate the index of the median element
  const medianIndex = Math.floor(objects.length / 2);

  // Return the object at the median index
  return objects[medianIndex];
}

$: siblingsData = filteredData.filter((e) => siblingAreas.siblings.includes(e.areacd) || e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd);

$: calculatedDomain = [Math.min(...siblingsData.map((e) => e.value)), Math.max(...siblingsData.map((e) => e.value))];

$: siblingsDataCalcRange = siblingsData.map((e) => ({
    ...e,
    calcYValue: (e.value-calculatedDomain[0])/(calculatedDomain[1]-calculatedDomain[0])
}))

$: selectedAreasWithData = plottedAreas.map((e) => ({
    ...e,
    yValue: filteredData.filter((el) => el.areacd === e.areacd)
})).filter((e) => e.yValue.length > 0);

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
        calcYValue: (e.yValue[0].value-calculatedDomain[0])/(calculatedDomain[1]-calculatedDomain[0])
        })), 8, (d) => y(Math.pow(d.calcYValue, indicator.beeswarmPower)))
        .calculateYPositions()

let prefix = indicator.prefix === null ? "" : indicator.prefix === "pounds" ? "£" : indicator.prefix;
let suffix = indicator.suffix === null ? "" : indicator.suffix;

$: hoverIndex = null;


function mouseoverEvent(event) { hoverIndex = parseFloat(select(this).attr("hoverid")) }
function mouseleaveEvent(event) { hoverIndex = null }

$: minElement = plotData.reduce((prev, curr) => prev.x < curr.x ? prev : curr);
$: maxElement = plotData.reduce((prev, curr) => prev.x > curr.x ? prev : curr);

$: minElementText = areas.find((e) => e.areacd === minElement.datum.areacd).areanm +" has the "+(indicator.highEqualsGood === "F" ? "higher " : "lowest ") + indicator.shortDesc.toLowerCase();

$: maxElementText = areas.find((e) => e.areacd === maxElement.datum.areacd).areanm +" has the "+(indicator.highEqualsGood === "F" ? "lowest " : "highest ") + indicator.shortDesc.toLowerCase();

$: medianElement =  findMedianObject(plotData);

$: console.log(medianElement)



</script>

<div class="rowContainer">

    <div class="svg-container" bind:clientWidth={width}>

        <p style="padding-top: 10px;"><span style="font-weight: bold">{indicator.label}</span></p>

        {#if indicator.unit != null}
        <p><span style="padding-left: 0px; font-size: 14px; font-style: italic">{indicator.unit+" in "+indicator.latestYear}</span><p>
        {/if}

        <svg
        height={height+(key ? 110: 0)}
        {width}
        >

            <rect
            width={width}
            height={height}
            fill="grey"
            opacity=0></rect>

            <g class="chart-container" transform={"translate("+outerPadding.left+","+outerPadding.top+")"}>

                {#if key} 

                    <g class="keyContainer">

                        {#each [minElement, maxElement] as element, i}

                            <g class={["min","max"][i]+"Element"}
                            transform={"translate("+element.x+","+(x(element.y)+20)+")"}>
                            
                                <path
                                d="M0 0 l-4 4 l8 0 z"
                                fill="black"
                                stroke="black"
                                ></path>

                                <path
                                d={"M0 6 l 0 45 l"+[10,-10][i]+" 0"}
                                fill="none"
                                stroke="black"
                                stroke-width="1px"
                                ></path>

                                {#each splitTextIntoEqualParts([minElementText, maxElementText][i], 2) as text, j}

                                    <text
                                    text-anchor={["start", "end"][i]}
                                    x={[12, -12][i]}
                                    y={55+j*12}
                                    font-size="12px"
                                    >{text}</text>

                                {/each}

                            </g>

                        {/each}

                    </g>

                {/if}
                

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

                <g class="medianLine" transform={"translate(0,"+(chartHeight/2)+")"}>

                    <line
                    x1={medianElement.x}
                    x2={medianElement.x}
                    y1=-40
                    y2={key ? 110 : 40}
                    fill="none"
                    stroke="#871A5B"
                    stroke-width="2px"
                    ></line>

                    {#if key}

                        <text
                        x={medianElement.x}
                        y=80
                        text-anchor="middle"
                        fill="white"
                        stroke="white"
                        stroke-width="8px"
                        font-size="14px">{Math.round(medianElement.datum.value).toLocaleString()}</text>

                        <text
                        x={medianElement.x}
                        y=80
                        text-anchor="middle"
                        fill="#871A5B"
                        font-size="14px">{Math.round(medianElement.datum.value).toLocaleString()}</text>

                        <text
                        x={medianElement.x}
                        y=120
                        text-anchor="middle"
                        fill="#871A5B"
                        font-size="12px">Half of areas have a value</text>

                        <text
                        x={medianElement.x}
                        y=132
                        text-anchor="middle"
                        fill="#871A5B"
                        font-size="12px">higher/lower than this line</text>

                        <path
                        transform={"translate("+medianElement.x+","+120+")"}
                        d="M -80 0 l-60 0"
                        stroke-width="1px"
                        stroke="black"
                        ></path>

                        <path
                        transform={"translate("+medianElement.x+","+120+")"}
                        d="M -148 0 l6 -6 l0 12 z"
                        stroke="none"
                        fill="black"
                        ></path>

                        <text
                        transform={"translate("+medianElement.x+","+120+")"}
                        x=-150
                        y=20
                        text-anchor="middle"
                        fill="black"
                        font-size="12px">worse than</text>

                        <text
                        transform={"translate("+medianElement.x+","+120+")"}
                        x=-150
                        y=32
                        text-anchor="middle"
                        fill="black"
                        font-size="12px">average</text>

                        <path
                        transform={"translate("+medianElement.x+","+120+")"}
                        d="M 80 0 l60 0"
                        stroke-width="1px"
                        stroke="black"
                        ></path>

                        <path
                        transform={"translate("+medianElement.x+","+120+")"}
                        d="M 148 0 l-6 -6 l0 12 z"
                        stroke="none"
                        fill="black"
                        ></path>

                        <text
                        transform={"translate("+medianElement.x+","+120+")"}
                        x=150
                        y=20
                        text-anchor="middle"
                        fill="black"
                        font-size="12px">better than</text>

                        <text
                        transform={"translate("+medianElement.x+","+120+")"}
                        x=150
                        y=32
                        text-anchor="middle"
                        fill="black"
                        font-size="12px">average</text>

                    {/if}



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