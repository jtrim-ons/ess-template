<script>

import { getContext } from 'svelte';
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { scaleLinear } from 'd3-scale';
import { colorsObject } from '$lib/config';

let areas = getContext('areas'); 

export let filteredData, selectedAreas, areasWithData, plottedAreas, siblingAreas, selectedArea, indicator, col1Width, rowNumb;

let width=500, height=60;

$: outerPadding = {top: 10, left: 10, right: 10, bottom: 10};

$: chartWidth = width - outerPadding.left - outerPadding.right - col1Width;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

$: siblingsData = filteredData.filter((e) => siblingAreas.siblings.includes(e.areacd) || e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd);

function doRectanglesOverlap(x1, x2, y1, y2, x3, x4, y3, y4) {
  return x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
}

function calculateMedian(arr, property) {
    
    const values = arr.map(obj => obj[property]);
    values.sort((a, b) => a - b);
    const length = values.length;

    if (length % 2 === 0) {
        const mid1 = values[length / 2 - 1];
        const mid2 = values[length / 2];
        return (mid1 + mid2) / 2;
    } else {
        return values[Math.floor(length / 2)];
    }
}

function getPropertyRank(arr, property, targetValue) {
  // Extract the values of the specified property from each object
  const values = arr.map(obj => obj[property]);

  // Sort the extracted values in ascending order
  values.sort((a, b) => a - b);

  // Find the index of the target value within the sorted array
  const rank = values.indexOf(targetValue) + 1;

  return rank;
}

$: medianValue = calculateMedian(siblingsData, "value")

$: maxDistanceFromMedian = Math.max(Math.abs(medianValue - Math.min(...siblingsData.map((e) => e.value))), Math.abs(medianValue - Math.max(...siblingsData.map((e) => e.value))));

$: calculatedDomain = [medianValue - maxDistanceFromMedian , medianValue + maxDistanceFromMedian];

$: siblingsDataCalcRange = siblingsData.map((e) => ({
    ...e,
    calcYValue: (e.value - medianValue)/maxDistanceFromMedian
}))

$: selectedAreasWithData = plottedAreas.map((e) => ({
    ...e,
    value: filteredData.filter((el) => el.areacd === e.areacd).length > 0 ? filteredData.find((el) => el.areacd === e.areacd).value : null,
    calcYValue: filteredData.filter((el) => el.areacd === e.areacd).length > 0 ? (filteredData.find((el) => el.areacd === e.areacd).value - medianValue)/maxDistanceFromMedian : null
})).filter((e) => e.yValue !== null).sort((a, b) => a.calcYValue - b.calcYValue);


$: yDomain = [-1, 1];

$: y = scaleLinear()
    .domain(yDomain)
    .range([0, chartWidth]);

$: plotData = new AccurateBeeswarm(siblingsDataCalcRange, 4, (d) =>  y((d.calcYValue < 0 ? -1 : 1)*(1-Math.pow(1-Math.abs(d.calcYValue), indicator.beeswarmPower))))
        .calculateYPositions();

/*$: plotData = new AccurateBeeswarm(siblingsDataCalcRange, 4, (d) =>  y((d.calcYValue < 0 ? -1 : 1)*Math.pow(Math.abs(d.calcYValue), 0.75)))
        .calculateYPositions();*/

/*$: plotData = new AccurateBeeswarm(siblingsDataCalcRange, 4, (d) =>  y(Math.pow(d.calcYValue, 0.5)))
        .calculateYPositions();*/

$: x = scaleLinear()
    .domain([Math.min(...plotData.map(d => d.y)), Math.max(...plotData.map(d => d.y))])
    .range([0, chartHeight]);

$: plotDataPrimary = new AccurateBeeswarm(selectedAreasWithData, 7, (d) => y(Math.pow(d.calcYValue, 1)))
        .calculateYPositions();

let prefix = indicator.prefix === null ? "" : indicator.prefix === "pounds" ? "£" : indicator.prefix;
let suffix = indicator.suffix === null ? "" : indicator.suffix;
let subText = indicator.subText === null ? "" : indicator.subText;
let subTextShort = indicator.subTextShort === null ? "" : indicator.subTextShort;
let roundingFactor = Math.pow(10, indicator.roundingFactor);

$: labelWidthArray = [];
$: labelPositionArray = new Array(plotDataPrimary.length);


$: primaryCirclesMidpoint = Math.min(...plotDataPrimary.map((e) => e.y))  + (Math.max(...plotDataPrimary.map((e) => e.y)) - Math.min(...plotDataPrimary.map((e) => e.y)))/2;

let showAllLabels = true;

$: {

    labelWidthArray.forEach((e,i) => {

        let potentialLabelPositionsArray = [
            {x: -e.width-2, y: 0, name: "topLeft"},
            {x: -e.width-2, y: 20, name: "bottomLeft"},
            {x: -e.width-8, y: 10, name: "left"},
            {x: 0, y: 0, name: "topRight"},
            {x: 0, y: 20, name: "bottomRight"},
            {x: -e.width/2, y: -3, name: "top"},
            {x: -e.width/2, y: 24, name: "bottom"},
            {x: 8, y: 10, name: "right"},
            {x: -e.width-2, y: -10, name: "furtherTopLeft"},
            {x: -e.width-2, y: 30, name: "furtherBottomLeft"},
            {x: -e.width-18, y: 10, name: "furtherLeft"},
            {x: -e.width-12, y: 0, name: "bottomFurtherLeft"},
            {x: -e.width-12, y: 0, name: "topFurtherLeft"},
            {x: 0, y: -10, name: "furtherTopRight"},
            {x: 0, y: 30, name: "furtherBottomRight"},
            {x: 10, y: 0, name: "topFurtherRight"},
            {x: 10, y: 20, name: "bottomFurtherRight"},
            {x: 10, y: -10, name: "furtherTopFurtherRight"},
            {x: -e.width-12, y: -10, name: "furtherTopFurtherLeft"},
            {x: 10, y: 30, name: "furtherBottomFurtherRight"},
            {x: -e.width-12, y: 30, name: "furtherBottomFurtherLeft"},
            {x: -e.width/2, y: -13, name: "furtherTop"},
            {x: -e.width/2, y: 34, name: "furtherBottom"},
            {x: 28, y: 10, name: "furtherRight"},
            {x: -e.width/2, y: -23, name: "furtherFurtherTop"},
            {x: -e.width/2, y: 44, name: "furtherFurtherBottom"},
            {x: -e.width-28, y: 10, name: "furtherFurtherLeft"},
            {x: 28, y: 10, name: "furtherFurtherRight"},
        ];

        let positionFound = false;

        for (var k=0; k<potentialLabelPositionsArray.length; k++) {

            if (!positionFound) {

                let proposedDimensions = {
                    x1: plotDataPrimary[i].x+potentialLabelPositionsArray[k].x,
                    x2: plotDataPrimary[i].x+potentialLabelPositionsArray[k].x+e.width,
                    y1: plotDataPrimary[i].y-primaryCirclesMidpoint+potentialLabelPositionsArray[k].y,
                    y2: plotDataPrimary[i].y-primaryCirclesMidpoint+potentialLabelPositionsArray[k].y+18.5
                }

                let loopedThrough = true;

                for (var l=0; l<plotDataPrimary.length; l++) {

                    if (l != i & doRectanglesOverlap(proposedDimensions.x1, proposedDimensions.x2, proposedDimensions.y1, proposedDimensions.y2, plotDataPrimary[l].x-7, plotDataPrimary[l].x+7, plotDataPrimary[l].y-7-primaryCirclesMidpoint, plotDataPrimary[l].y+7-primaryCirclesMidpoint)) {

                        loopedThrough = false
                    }

                    /*if (l != i) {

                        console.log(potentialLabelPositionsArray[k].name, i, k)

                        console.log(proposedDimensions.x1)
                        console.log(proposedDimensions.x2)
                        console.log(plotDataPrimary[l].x-7)
                        console.log(plotDataPrimary[l].x+7)

                        if (proposedDimensions.x1 < plotDataPrimary[l].x-7 & proposedDimensions.x2 > plotDataPrimary[l].x-7 & proposedDimensions.x2 < plotDataPrimary[l].x+7) {

                            if (proposedDimensions.y2 < plotDataPrimary[l].y-7-primaryCirclesMidpoint || proposedDimensions.y1 > plotDataPrimary[l].y+7-primaryCirclesMidpoint) {
                                
                                loopedThrough = false

                            }                           
                        }
                        
                        if (proposedDimensions.x1 > plotDataPrimary[l].x-7 & proposedDimensions.x2 > plotDataPrimary[l].x+7 & proposedDimensions.x1 < plotDataPrimary[l].x+7) {

                            if (proposedDimensions.y2 < plotDataPrimary[l].y-7-primaryCirclesMidpoint || proposedDimensions.y1 > plotDataPrimary[l].y+7-primaryCirclesMidpoint) {
                                
                                loopedThrough = false

                            }
                        }

                        if (proposedDimensions.x1 < plotDataPrimary[l].x-7 & proposedDimensions.x2 > plotDataPrimary[l].x+7) {

                            if (proposedDimensions.y2 < plotDataPrimary[l].y-7-primaryCirclesMidpoint || proposedDimensions.y1 > plotDataPrimary[l].y+7-primaryCirclesMidpoint) {
                                
                                loopedThrough = false

                            }

                        }
                    }*/
                }

                if (loopedThrough) {
                    labelPositionArray[i] = proposedDimensions
                    positionFound = true;

                    console.log(i,  potentialLabelPositionsArray[k].name, "we're going with this position")
                }

            }
            

            //console.log(proposedDimensions)
        }

        if (!positionFound) {showAllLabels = false}

        /*labelPositionArray[i] = {};

        if (i === 0) {
            labelPositionArray[i].x = "left"
            labelPositionArray[i].y = e.y > 0 ? "top" : "bottom"
        } else {
            if (labelPositionArray[i].y = "top") {

                
            }


            labelPositionArray[i].x = "right"
            labelPositionArray[i].y = "top"
        }*/
    })
}


</script>


<div class="rowContainer" bind:clientWidth={width} style="grid-template-columns: [line1] {col1Width}px [line2] {width-col1Width}px [end]; background-color: {rowNumb % 2 === 0 ? "#fafafa" : "#ffffff"}">

    <p class="col1">{indicator.label}</p>

    <div class="svg-container">

        <svg
        {height}
        width={width-col1Width}
        >

                <g class="chart-container" transform={"translate("+outerPadding.left+","+outerPadding.top+")"}>

                    <g class="backgroundCirclesGroup">

                        {#each plotData as circle,i}
    
                                <g transform={"translate("+circle.x+","+x(circle.y)+")"}>
    
                                    <circle
                                    pointer-events="none"
                                    r=5
                                    stroke="none"
                                    fill="#6e6e6e"
                                    fill-opacity=0.15
                                    ></circle>
    
                                </g>
    
                        {/each}
    
                    </g>

                    <g class="medianLineGroup" transform={"translate("+y(0)+",0)"}>

                        <line
                        x1=0
                        x2=0
                        y1=-18
                        y2={chartHeight+10}
                        stroke="#871A5B"
                        stroke-width="1.5px"
                        ></line>    

                    </g>

                    <g class="primaryCirclesGroup">

                        {#each plotDataPrimary as circle,i}
    
                                <g transform={"translate("+circle.x+","+(chartHeight/2+circle.y-primaryCirclesMidpoint)+")"}>
    
                                    <circle
                                    pointer-events="none"
                                    r=6
                                    stroke="white"
                                    stroke-width="1px"
                                    fill={colorsObject[circle.datum.role]}
                                    opacity=1
                                    ></circle>

                                    <!-- <g class="labelGroup" 
                                    transform={"translate("+(labelWidthArray.length > i ? (labelPositionArray[i].x === "left" ? -11-labelWidthArray[i].width: 0): 0)+","+(labelWidthArray.length > i ? (labelPositionArray[i].y === "bottom" ? 22 : 0) : 0)+")"}>

                                        <rect
                                        x=3
                                        y=-20
                                        width={labelWidthArray.length > i ? labelWidthArray[i].width + 6: 0}
                                        height=18.5
                                        rx="3px"
                                        stroke={colorsObject[circle.datum.role]}
                                        fill="white"
                                        stroke-width="1px"
                                        ></rect>

                                        <text bind:contentRect={labelWidthArray[i]}
                                        x=6
                                        y=-6
                                        text-anchor="start"
                                        fill={colorsObject[circle.datum.role]}
                                        font-size="14px">{prefix+(Math.round(circle.datum.value*roundingFactor)/roundingFactor).toLocaleString()+suffix}</text>

                                    </g>    -->
    
                                </g>
    
                        {/each}

                        {#each plotDataPrimary as circle,i}

                            <g class="labelGroup">

                                <rect
                                transform={"translate("+(showAllLabels & labelPositionArray[i] != undefined ? labelPositionArray[i].x1 : 9999)+","+(showAllLabels & labelPositionArray[i] != undefined  ? labelPositionArray[i].y1 : 9999)+")"}
                                x=0
                                y=0
                                width={labelWidthArray.length > i ? labelWidthArray[i].width + 6: 0}
                                height=18.5
                                rx="3px"
                                stroke={colorsObject[circle.datum.role]}
                                fill="white"
                                stroke-width="1px"
                                ></rect>

                                <text bind:contentRect={labelWidthArray[i]}
                                transform={"translate("+(showAllLabels & labelPositionArray[i] != undefined ? labelPositionArray[i].x1 : 9999)+","+(showAllLabels & labelPositionArray[i] != undefined  ? labelPositionArray[i].y1 : 9999)+")"}
                                x=3
                                y=14
                                text-anchor="start"
                                fill={colorsObject[circle.datum.role]}
                                font-size="14px">{prefix+(Math.round(circle.datum.value*roundingFactor)/roundingFactor).toLocaleString()+suffix}</text>




                            </g>



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