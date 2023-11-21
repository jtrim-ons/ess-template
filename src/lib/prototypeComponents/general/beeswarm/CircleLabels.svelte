<script>

import { colorsObject } from "$lib/config";
import { addThousandsSeparator, roundNumber, doRectanglesOverlap } from "$lib/utils";
import { onMount } from 'svelte';
import { select } from 'd3-selection';

import { getContext } from 'svelte';

export let primaryCirclesStep2, backgroundCirclesStep2, hoverIndex, checkboxedRoles, metadata, index, x, hoverChartIndex;

let areas = getContext('areas'); 

$: prefix = metadata.prefix === null ? "" : metadata.prefix;
$: suffix = metadata.suffix === null ? "" : metadata.suffix;

$: labelWidthArray = [];

$: primaryCirclesMidpoint = Math.min(...primaryCirclesStep2.map((e) => e.y))  + (Math.max(...primaryCirclesStep2.map((e) => e.y)) - Math.min(...primaryCirclesStep2.map((e) => e.y)))/2;

const calculateLabelPosition = (labelInfo, labelIndex) => {

    if (!mounted) {return "translate(0,0)"} else {

        let labelWidth = labelInfo ? parseFloat(labelInfo.width) : 0;

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

        let allRectsSelection = select(".beeswarm-row-svg-"+index).selectAll(".labelsGroup").selectAll("rect");
        let allCirclesSelection = select(".beeswarm-row-svg-"+index).select(".primaryCirclesGroup").select(".circleIdentifierForLabelsGroup").selectAll("circle");

        let positionFound = false;

        for (var k=0; k<potentialLabelPositionsArray.length; k++) {

            if (!positionFound) {

                let proposedDimensions = {
                    x1: primaryCirclesStep2[labelIndex].x+potentialLabelPositionsArray[k].x,
                    x2: primaryCirclesStep2[labelIndex].x+potentialLabelPositionsArray[k].x+labelWidth,
                    y1: primaryCirclesStep2[labelIndex].y-primaryCirclesMidpoint+potentialLabelPositionsArray[k].y,
                    y2: primaryCirclesStep2[labelIndex].y-primaryCirclesMidpoint+potentialLabelPositionsArray[k].y+18.5
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

                    let radius = parseFloat(circle.attr("r"));

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

let hoverLabelWidth1;
let hoverLabelWidth2;

let mounted = false;

$: console.log(primaryCirclesStep2.sort((a,b) => a.x - b.x))

onMount(() => { mounted = true;  });

</script>

<g class="labelsGroup">

    {#if hoverIndex === null}

        {#each primaryCirclesStep2.sort((a,b) => a.x - b.x) as circle,i}

            <g class="valueLabel">

                <rect
                labelid={i}
                transform={calculateLabelPosition(labelWidthArray[i], i)}
                x=0
                y=7
                width={labelWidthArray.length > i ? labelWidthArray[i].width + 6: 0}
                height=18.5
                rx="3px"
                stroke={colorsObject[circle.datum.role === "custom" ? "custom"+(1+checkboxedRoles.custom.map((e) => e.areacd).indexOf(circle.datum.areacd)) : circle.datum.role]}
                fill="white"
                stroke-width="1px"
                pointer-events="none"
                ></rect>

                <text bind:contentRect={labelWidthArray[i]}
                labelid={i}
                transform={calculateLabelPosition(labelWidthArray[i], i)}
                x=3
                y=21
                text-anchor="start"
                fill={colorsObject[circle.datum.role === "custom" ? "custom"+(1+checkboxedRoles.custom.map((e) => e.areacd).indexOf(circle.datum.areacd)) : circle.datum.role]}
                font-size="14px"
                pointer-events="none"
                >
                {prefix+addThousandsSeparator(roundNumber(circle.datum.value, metadata.decimalPlaces))+suffix}</text>

            </g>

        {/each}

    {:else} 

         {#each backgroundCirclesStep2 as circle, i}   

            <g transform={"translate("+circle.x+","+x(circle.y)+")"}>
                
                <g class="hoverLabelGroup1">

                    <rect
                    x=8
                    y=-22
                    width={parseFloat(hoverLabelWidth1 === undefined ? 100 : hoverLabelWidth1.width) + 6}
                    height=18.5
                    rx="3px"
                    stroke="#F39431"
                    fill="white"
                    stroke-width="1px"
                    pointer-events="none"
                    ></rect>

                    <text bind:contentRect={hoverLabelWidth1}
                    x=11
                    y=-8
                    text-anchor="start"
                    fill="#F39431"
                    font-size="14px"
                    pointer-events="none"
                    >
                    {prefix+addThousandsSeparator(roundNumber(circle.datum.value, metadata.decimalPlaces))+suffix}</text>

                </g>

                {#if hoverChartIndex === index}

                    <g class="hoverLabelGroup2">

                        <rect
                        x={-(parseFloat(hoverLabelWidth2 === undefined ? 100 : hoverLabelWidth2.width) + 12)}
                        y=5
                        width={parseFloat(hoverLabelWidth2 === undefined ? 100 : hoverLabelWidth2.width) + 6}
                        height=18.5
                        rx="3px"
                        stroke="#F39431"
                        fill="white"
                        stroke-width="1px"
                        pointer-events="none"
                        ></rect>

                        <text bind:contentRect={hoverLabelWidth2}
                        x={-(parseFloat(hoverLabelWidth2 === undefined ? 100 : hoverLabelWidth2.width) + 9)}
                        y=19
                        text-anchor="start"
                        fill="#F39431"
                        font-size="14px"
                        pointer-events="none"
                        >
                        {areas.find((e) => e.areacd === circle.datum.areacd).areanm}</text>

                    </g>

                {/if}
            
            </g>

        {/each}




    {/if}

</g>