<script>

import { getContext } from 'svelte';
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { scaleLinear } from 'd3-scale';
import { colorsObject } from '$lib/config';
import {select} from 'd3-selection';
import {onMount} from 'svelte';

export let name, yDomain, col1Width, siblingsDataCalcRange, indicator, id, selectedAreasWithData, checkboxedRoles, xDomain, xDom;

let width = 400, height = 40;
let areas = getContext('areas'); 

$: outerPadding = {top: 10, left: 10, right: 10, bottom: 10};

$: chartWidth = width - outerPadding.left - outerPadding.right - col1Width;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

$: y = scaleLinear()
    .domain(yDomain)
    .range([0, chartWidth]);

$: plotData = new AccurateBeeswarm(siblingsDataCalcRange, 4, (d) =>  y((d.calcYValue < 0 ? -1 : 1)*(1-Math.pow(1-Math.abs(d.calcYValue), indicator.beeswarmPower))))
        .calculateYPositions();

$: { 
    xDomain = plotData != undefined ? [Math.min(...plotData.map(d => d.y)), Math.max(...plotData.map(d => d.y))]  : [0, 1];
}

$: x = scaleLinear()
    .domain(xDom)
    .range([0, chartHeight]);

$: plotDataPrimary = new AccurateBeeswarm(selectedAreasWithData, 7, (d) => y((d.calcYValue < 0 ? -1 : 1)*(1-Math.pow(1-Math.abs(d.calcYValue), indicator.beeswarmPower))))
        .calculateYPositions();

let prefix = indicator.prefix === null ? "" : indicator.prefix === "pounds" ? "£" : indicator.prefix;
let suffix = indicator.suffix === null ? "" : indicator.suffix;
let subText = indicator.subText === null ? "" : indicator.subText;
let subTextShort = indicator.subTextShort === null ? "" : indicator.subTextShort;
let roundingFactor = Math.pow(10, indicator.roundingFactor);

$: labelWidthArray = [];

$: primaryCirclesMidpoint = Math.min(...plotDataPrimary.map((e) => e.y))  + (Math.max(...plotDataPrimary.map((e) => e.y)) - Math.min(...plotDataPrimary.map((e) => e.y)))/2;

let mounted = false;

onMount(() => { mounted = true;  });

const calculateLabelPosition = (labelInfo, labelIndex) => {

if (!mounted) {return "translate(0,0)"} else {

    let labelWidth = parseFloat(labelInfo.width);

    let potentialLabelPositionsArray = [
        {x: -labelWidth-10, y: 0, name: "topLeft"},
        {x: -labelWidth-10, y: 20, name: "bottomLeft"},
        {x: -labelWidth-10, y: 10, name: "left"},
        {x: 2, y: 0, name: "topRight"},
        {x: 2, y: 20, name: "bottomRight"},
        {x: -labelWidth/2, y: -3, name: "top"},
        {x: -labelWidth/2, y: 24, name: "bottom"},
        {x: 8, y: 10, name: "right"},
        {x: -labelWidth-2, y: -10, name: "furtherTopLeft"},
        {x: -labelWidth-2, y: 30, name: "furtherBottomLeft"},
        {x: -labelWidth-18, y: 10, name: "furtherLeft"},
        {x: -labelWidth-12, y: 0, name: "bottomFurtherLeft"},
        {x: -labelWidth-12, y: 0, name: "topFurtherLeft"},
        {x: 0, y: -10, name: "furtherTopRight"},
        {x: 0, y: 30, name: "furtherBottomRight"},
        {x: 10, y: 0, name: "topFurtherRight"},
        {x: 10, y: 20, name: "bottomFurtherRight"},
        {x: 10, y: -10, name: "furtherTopFurtherRight"},
        {x: -labelWidth-12, y: -10, name: "furtherTopFurtherLeft"},
        {x: 10, y: 30, name: "furtherBottomFurtherRight"},
        {x: -labelWidth-12, y: 30, name: "furtherBottomFurtherLeft"},
        {x: -labelWidth/2, y: -13, name: "furtherTop"},
        {x: -labelWidth/2, y: 34, name: "furtherBottom"},
        {x: 28, y: 10, name: "furtherRight"},
        {x: -labelWidth/2, y: -23, name: "furtherFurtherTop"},
        {x: -labelWidth/2, y: 44, name: "furtherFurtherBottom"},
        {x: -labelWidth-28, y: 10, name: "furtherFurtherLeft"},
        {x: 28, y: 10, name: "furtherFurtherRight"},
    ];

    let allRectsSelection = select(".beeswarm-row-svg-"+id).selectAll(".labelGroup").selectAll("rect");
    let allCirclesSelection = select(".beeswarm-row-svg-"+id).select(".labelsCirclesGroup").selectAll("circle");

    let positionFound = false;

    for (var k=0; k<potentialLabelPositionsArray.length; k++) {

        if (!positionFound) {

            let proposedDimensions = {
                x1: plotDataPrimary[labelIndex].x+potentialLabelPositionsArray[k].x,
                x2: plotDataPrimary[labelIndex].x+potentialLabelPositionsArray[k].x+labelWidth,
                y1: plotDataPrimary[labelIndex].y-primaryCirclesMidpoint+potentialLabelPositionsArray[k].y,
                y2: plotDataPrimary[labelIndex].y-primaryCirclesMidpoint+potentialLabelPositionsArray[k].y+18.5
            }

            let loopedThrough = true;

            allRectsSelection.each(function () {
        
                let rect = select(this);
                const regex = /translate\(([\d.-]+),\s*([\d.-]+)\)/;
                let rectData = select(this).attr("transform").match(regex)

                if (doRectanglesOverlap(proposedDimensions.x1, proposedDimensions.x2, proposedDimensions.y1, proposedDimensions.y2, parseFloat(rectData[1]),
                parseFloat(rectData[1])+parseFloat(rect.attr("width")), parseFloat(rectData[2]), parseFloat(rectData[2])+18.5) & rect.attr("labelid") != labelIndex ) {

                    loopedThrough = false;
                }
                
            })

            allCirclesSelection.each(function() {

                let circle = select(this);
                const regex = /translate\(([\d.-]+),\s*([\d.-]+)\)/;
                let circleData = select(this).attr("transform").match(regex)

                let radius = parseFloat(circle.attr("r"))+3;

                if (doRectanglesOverlap(proposedDimensions.x1, proposedDimensions.x2, proposedDimensions.y1, proposedDimensions.y2, parseFloat(circleData[1])-radius, parseFloat(circleData[1])+radius, parseFloat(circleData[2])-radius, parseFloat(circleData[2])+radius) & circle.attr("labelid") != labelIndex ) {

                    loopedThrough = false;
                }


            })

            if (loopedThrough) {

                return "translate("+proposedDimensions.x1+","+proposedDimensions.y1+")"
            }
        }
    }       

    return "translate(200,0)"

}
}


let hoverIndex = null;

function mouseoverEvent(event) { hoverIndex = parseFloat(select(this).attr("hoverid")) };
function mouseleaveEvent(event) { hoverIndex = null };

let hoverLabelWidth1;
let hoverLabelWidth2;



</script>


<div class="rowContainer" bind:clientWidth={width} style="grid-template-columns: [line1] {col1Width}px [line2] {width-col1Width}px [end]; background-color: {id % 2 === 0 ? "#fafafa" : "#ffffff"}">

    <p class="col1">{name}</p>

    <div class="svg-container">

        <svg class={"beeswarm-row-svg-"+id}
        {height}
        width={width-col1Width}
        >

            <g class="chart-container" transform={"translate("+outerPadding.left+","+outerPadding.top+")"}>

                <g class="backgroundCirclesGroup">

                    {#each plotData as circle,i}

                            <g transform={"translate("+circle.x+","+x(circle.y)+")"}>

                                <circle
                                hoverid={i}
                                on:mouseover={mouseoverEvent}
                                on:mouseleave={mouseleaveEvent}
                                r=5
                                stroke="none"
                                fill="#6e6e6e"
                                fill-opacity={hoverIndex === null ? 0.15 : 0.05}
                                ></circle>

                            </g>

                    {/each}

                </g>

                <g class="medianLineGroup" transform={"translate("+y(0)+",0)"}>

                    <line
                    x1=0
                    x2=0
                    y1=-10
                    y2={chartHeight+10}
                    stroke="#871A5B"
                    stroke-width="1.5px"
                    ></line>    

                </g>

                <g class="labelsCirclesGroup">

                    {#each plotDataPrimary as circle,i}

                                <circle
                                transform={"translate("+circle.x+","+(chartHeight/2+circle.y-primaryCirclesMidpoint)+")"}
                                labelid={i}
                                pointer-events="none"
                                r=6
                                stroke="white"
                                stroke-width="1px"
                                fill={colorsObject[circle.datum.role]}
                                opacity=0
                                ></circle>

                    {/each}
                
                </g>

                <g class="primaryCirclesGroup" opacity={hoverIndex === null ? 1 : 0.1}>

                    {#each plotDataPrimary as circle,i}

                        <g transform={"translate("+circle.x+","+(chartHeight/2+circle.y-primaryCirclesMidpoint)+")"}>

                            {#if ["parent", "country", "uk"].includes(circle.datum.role)}
                                        
                                <rect
                                pointer-events="none"
                                transform={["country", "uk"].includes(circle.datum.role) ? "rotate(45)" : null }
                                x={-5}
                                y={-5}
                                width={10}
                                height={10}
                                fill={colorsObject["custom"+(1+checkboxedRoles.custom.map((e) => e.areacd).indexOf(circle.datum.areacd))]}
                                stroke="white"
                                stroke-width="1px"
                                opacity=1
                                >
                                </rect>

                            {:else} 

                                <circle
                                pointer-events="none"
                                r=6
                                stroke="white"
                                stroke-width="1px"
                                fill={colorsObject["custom"+(1+checkboxedRoles.custom.map((e) => e.areacd).indexOf(circle.datum.areacd))]}
                                opacity=1
                                ></circle>

                            {/if}

                        </g>

                    {/each}
                
                </g>

                <g class="labelsGroup" opacity={hoverIndex === null ? 1 : 0}>

                    {#each plotDataPrimary as circle,i}

                        



                    {/each}

                </g>

                <g class="hoverCirclesGroup">

                    {#each plotData as circle,i}

                        {#if hoverIndex === i}

                            <g transform={"translate("+circle.x+","+x(circle.y)+")"}>

                                <circle
                                pointer-events="none"
                                r=7
                                stroke="white"
                                stroke-width="1.5px"
                                fill="#F39431"
                                fill-opacity=1
                                ></circle>

                                <g class="hoverLabelGroup1">

                                    <rect
                                    x=5
                                    y=5
                                    width={parseFloat(hoverLabelWidth1 === undefined ? 100 : hoverLabelWidth1.width) + 6}
                                    height=18.5
                                    rx="3px"
                                    stroke="#F39431"
                                    fill="white"
                                    stroke-width="1px"
                                    pointer-events="none"
                                    ></rect>

                                    <text bind:contentRect={hoverLabelWidth1}
                                    x=8
                                    y=19
                                    text-anchor="start"
                                    fill="#F39431"
                                    font-size="14px"
                                    pointer-events="none"
                                    >
                                    {prefix+(Math.round(circle.datum.value*roundingFactor)/roundingFactor).toLocaleString()+suffix}</text>

                                </g>

                                <g class="hoverLabelGroup2">

                                    <rect
                                    x={-(parseFloat(hoverLabelWidth2 === undefined ? 100 : hoverLabelWidth2.width) + 6)}
                                    y=-22
                                    width={parseFloat(hoverLabelWidth2 === undefined ? 100 : hoverLabelWidth2.width) + 6}
                                    height=18.5
                                    rx="3px"
                                    stroke="#F39431"
                                    fill="white"
                                    stroke-width="1px"
                                    pointer-events="none"
                                    ></rect>

                                    <text bind:contentRect={hoverLabelWidth2}
                                    x={-(parseFloat(hoverLabelWidth2 === undefined ? 100 : hoverLabelWidth2.width) + 3)}
                                    y=-8
                                    text-anchor="start"
                                    fill="#F39431"
                                    font-size="14px"
                                    pointer-events="none"
                                    >
                                    {areas.find((e) => e.areacd === circle.datum.areacd).areanm}</text>

                                </g>



                            </g>

                        {/if}

                    {/each}

                </g>

            </g>


        </svg>


    </div>


</div>


<style>


.rowContainer {
    display: grid;
    padding: 10px 0px 10px 0px;
}


.col1 {
    padding: 0px 20px 0px 5px;
    font-size: 16px;
    line-height: 20px;
    margin: auto 0px auto 0px;
    text-wrap: balance;
}

svg {
    overflow: visible;
}



</style>