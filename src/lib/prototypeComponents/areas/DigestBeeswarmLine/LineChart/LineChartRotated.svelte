<script>

import LineLabel from "$lib/prototypeComponents/areas/DigestBeeswarmLine/LineChart/LineLabel.svelte";
import LineLabelRotated from "$lib/prototypeComponents/areas/DigestBeeswarmLine/LineChart/LineLabelRotated.svelte";

import { getContext } from "svelte";
import { scaleLinear } from 'd3-scale';
import { curveBasis, line } from 'd3-shape';

import { rowSvgOuterPadding, medianAbsoluteDeviationLimit, encodingColourPalette, colorsObject } from "$lib/config";
import { calculatePosition,  addThousandsSeparator, roundNumber } from "$lib/utils";

export let indicator;
export let rowNumb, topicNumb;
export let metadata, calculations;
export let col4Width;
export let chosenId2;
export let chosenId3;
export let baselineComparisonArea;
export let visibleAreas;
export let x, xDomain;
export let chosenId11;
export let chosenId6;

$: labelWidthArray = [];


$: scaleWidth = col4Width - (chosenId6.includes(0) ? 50 : 110);
$: svgHeight = 80;
$: padding = {top: 5, left: 25, right: 0, bottom: 25}

$: scaleHeight = svgHeight - padding.top-padding.bottom - rowSvgOuterPadding.areaSpaceBeyondXScale.split*2;

$: earliestYear = chosenId2 === "earliest available year" ? calculations.mainMinXDomain : chosenId2 === "previous year" ? calculations.maxXDomain - 1 : chosenId2;


let selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");

let medianValue = calculations.calcs[calculations.maxXDomain].median;
let medianAbsoluteDeviation = calculations.calcs[calculations.maxXDomain].mad;

$: mainData1 = Array.from({ length: calculations.maxXDomain - earliestYear + 1 }, (_, index) => earliestYear + index)
                .map((e) => ({
                    xDomainNumb: e,
                    value: calculations.calcs[e] == undefined ? undefined : "main" in calculations.calcs[e] ? calculations.calcs[e].main : undefined 
                })).filter((e) => e.value != undefined & !isNaN(e.value));

$: mainData2 = mainData1.map((e) => ({
    ...e,
    zScore: calculatePosition(rowSvgOuterPadding, chosenId3, scaleWidth, y, e.value, medianValue, medianAbsoluteDeviation)
}));

$: mainData3 = [...mainData2.map((e) => ({...e, zScore: e.zScore - 10})),...mainData2.reverse().map((e) => ({...e, zScore: e.zScore + 10}))];

$: comparisonRole = (baselineComparisonArea.areacd === "median" ? baselineComparisonArea : selectedAndRelatedAreas.find((el) => baselineComparisonArea.areacd === el.areacd)).role;

$: comparisonData1 = Array.from({ length: calculations.maxXDomain - earliestYear + 1 }, (_, index) => earliestYear + index)
                .map((e) => ({
                    xDomainNumb: e,
                    value: calculations.calcs[e] == undefined ? undefined : comparisonRole in calculations.calcs[e] ? calculations.calcs[e][comparisonRole] : undefined 
                })).filter((e) => e.value != undefined & !isNaN(e.value));

$: comparisonData2 = comparisonData1.map((e) => ({
    ...e,
    zScore: calculatePosition(rowSvgOuterPadding, chosenId3, scaleWidth, y, e.value, medianValue, medianAbsoluteDeviation)
}));

$: comparisonData3 = [...comparisonData2.map((e) => ({...e, zScore: e.zScore - 5})),...comparisonData2.reverse().map((e) => ({...e, zScore: e.zScore + 5}))];

let mainLatestValue = calculations.calcs[calculations.maxXDomain].main;
$: mainPreviousValue = earliestYear in calculations.calcs ? calculations.calcs[earliestYear].main : null;

$: madFromPreviousValue = mainLatestValue == null | mainPreviousValue == null | medianAbsoluteDeviation == null ? null : (mainLatestValue - mainPreviousValue)/medianAbsoluteDeviation;

$: useColour = chosenId11.includes(1);

$: belowMinusOneColour = metadata.polarity == 0 ? null : metadata.polarity == -1 ? "better" : "worse";
$: withinOneColour = metadata.polarity == 0 ? null : "similar";
$: aboveOneColour = metadata.polarity == 0 ? null : metadata.polarity == 1 ? "better" : "worse";

$: similarThreshold = chosenId11.includes(3) ? 2 : 1;

$: colour = !useColour | madFromPreviousValue == null | metadata.polarity == 0 | earliestYear == calculations.maxXDomain ? null : madFromPreviousValue < -similarThreshold ? encodingColourPalette[belowMinusOneColour] : madFromPreviousValue <= similarThreshold ? encodingColourPalette[withinOneColour] : encodingColourPalette[aboveOneColour];

$: baselineComparisonName = baselineComparisonArea.areacd === "median" ? "median" : baselineComparisonArea.areanm;

$: betterWorse = chosenId11.includes(2);

$: belowMinusOneText = metadata.polarity == 0 | !betterWorse ? "Decreased" : metadata.polarity == -1 ? "Improved" : "Worsened";
$: withinOneText = "Little change";
$: aboveOneText = metadata.polarity == 0 | !betterWorse ? "Increased" : metadata.polarity == 1 ? "Improved" : "Worsened";

$: text = earliestYear == calculations.maxXDomain ? "No historical data" : mainLatestValue == null ? "No data in "+ calculations.maxXDomain : mainPreviousValue == null ? "No data in "+earliestYear : (madFromPreviousValue < -similarThreshold ? belowMinusOneText : madFromPreviousValue <= similarThreshold ? withinOneText : aboveOneText)+" since "+earliestYear;

$: minLabelYear = Math.min(...[...mainData2, ...comparisonData2].map((e) => e.xDomainNumb));

$: maxLabelPosition = Math.max(...[...mainData2, ...comparisonData2].filter((e) => e.xDomainNumb == minLabelYear).map((e) => e.zScore));
$: maxLabelPosition2 = Math.max(...[...mainData2, ...comparisonData2].filter((e) => e.xDomainNumb == calculations.maxXDomain).map((e) => e.zScore));

$: x = scaleLinear()
    .domain([minLabelYear, calculations.maxXDomain])
    .range([0, scaleWidth]);

let yDomain = [-medianAbsoluteDeviationLimit, medianAbsoluteDeviationLimit];

$: y = scaleLinear()
    .domain(yDomain)
    .range([scaleHeight, 0]);

$: pathFunction = line()
    .curve(curveBasis)
    .y((d) => { return d.zScore })
    .x((d) => { return x(d.xDomainNumb); });

let colour = encodingColourPalette["better"];
let text = "Improved since 2012";

$: labelText = ["pp", "abs"].includes(metadata.howToMeasureChange) ? (mainLatestValue-mainPreviousValue > 0 ? "+" : "")+(metadata.howToMeasureChange == "pp" ? "" : metadata.prefix)+addThousandsSeparator(roundNumber(mainLatestValue-mainPreviousValue, metadata.decimalPlaces))+(metadata.howToMeasureChange == "pp" ? " pp" : "") : (mainLatestValue-mainPreviousValue > 0 ? "+" : "")+roundNumber((mainLatestValue-mainPreviousValue)/mainPreviousValue, 1)+"%";

$: xPosition = mainData2.length > 1 ? Math.abs(mainData2[mainData2.length-1].zScore-mainData2[0].zScore)/2+Math.min(mainData2[mainData2.length-1].zScore,mainData2[0].zScore) : mainData2[0].zScore;

</script>


<div class="time-comparison-cell-container" style={chosenId6.includes(0) & chosenId3 != 0 | colour == null ? null : "background-color:"+colour+"; box-shadow: 0 0 4px 3px "+colour+";"}>

    {#if chosenId11.includes(0) & chosenId3 === 0}

        <p class="from-comparison-description">{chosenId6.includes(0) ? (Math.random() < 0.5 & mainData2.length > 1 ? "Statistically significant change" : "") : text}</p>

    {/if}

    {#if chosenId3 === 0}

    {#if mainData2.length > 1}

        <svg class="line-row-svg line-row-svg-{topicNumb*100+rowNumb}"
        viewBox="0 0 {col4Width} {svgHeight}"
        width="100%"
        height={svgHeight}>

            <g class="chart-container"
            transform="translate({padding.left},{padding.top+rowSvgOuterPadding.areaSpaceBeyondXScale.split})">

                <line
                y1={scaleHeight+rowSvgOuterPadding.areaSpaceBeyondXScale.split}
                y2={maxLabelPosition}
                x1=0
                x2=0
                stroke="rgb(200,200,200)"
                stroke-width="1.5px"
                stroke-dasharray="4 2"
                ></line>

                <line
                y1={scaleHeight+rowSvgOuterPadding.areaSpaceBeyondXScale.split}
                y2={maxLabelPosition2}
                x1={scaleWidth}
                x2={scaleWidth}
                stroke="rgb(200,200,200)"
                stroke-width="1.5px"
                stroke-dasharray="4 2"
                ></line>

                <text
                text-anchor="middle"
                font-size="14px"
                x={0}
                y={scaleHeight+15+rowSvgOuterPadding.areaSpaceBeyondXScale.split}
                stroke="rgb(175,175,175)"
                fill="rgb(175,175,175)"
                stroke-width="0.5px"
                >{minLabelYear}</text>

                <text
                text-anchor="middle"
                font-size="14px"
                x={scaleWidth}
                y={scaleHeight+15+rowSvgOuterPadding.areaSpaceBeyondXScale.split}
                stroke="rgb(175,175,175)"
                fill="rgb(175,175,175)"
                stroke-width="0.5px"
                >{calculations.maxXDomain}</text>

                {#if mainLatestValue != null & mainPreviousValue != null & !chosenId6.includes(0)}

                    <line
                    x1={scaleWidth+12}
                    x2={scaleWidth+12}
                    y1={mainData2[0].zScore}
                    y2={mainData2[mainData2.length-1].zScore}
                    stroke={colorsObject.main}
                    stroke-width="1.5px"
                    fill="none"
                    ></line>

                    <g transform="translate({scaleWidth+12},{mainData2[mainData2.length-1].zScore})">

                        <path
                        transform={mainData2[0].zScore < mainData2[mainData2.length-1].zScore ? "rotate(180)" : null}
                        d={"M0 0 l-3 3 l6 0 z"}
                        stroke={colorsObject.main}
                        stroke-width="1.5px"
                        fill={colorsObject.main}
                        ></path>
                        
                    </g>

                {/if}

                <g opacity=0.75>

                    <path
                    d={pathFunction(comparisonData2)}
                    stroke={colorsObject[comparisonRole]}
                    fill="none"
                    stroke-width="2px"
                    ></path>

                    {#if chosenId6.includes(0)}

                        <path
                        d={pathFunction(comparisonData3)}
                        fill={colorsObject[comparisonRole]}
                        stroke="none"
                        stroke-width="2px"
                        opacity=0.25
                        ></path>


                    {/if}

                </g>

                <path
                d={pathFunction(mainData2)}
                stroke={colorsObject.main}
                fill="none"
                stroke-width="2px"
                ></path>

                {#if chosenId6.includes(0)}

                    <path
                    d={pathFunction(mainData3)}
                    fill={colorsObject.main}
                    stroke="none"
                    stroke-width="2px"
                    opacity=0.25
                    ></path>


                {/if}

                <g opacity=0.75>

                    {#each comparisonData2 as circle, i}

                        <g transform="translate({x(circle.xDomainNumb)},{circle.zScore})">

                            <circle
                            r={circle.xDomainNumb == minLabelYear ? 4 : circle.xDomainNumb == calculations.maxXDomain ? 5 : 0}
                            fill={colorsObject[comparisonRole]}
                            stroke-width="1px"
                            stroke="white"
                            ></circle>

                        

                        </g>

                    {/each}

                </g>

                {#each mainData2 as circle, i}

                    <g transform="translate({x(circle.xDomainNumb)},{circle.zScore})">

                        <circle
                        r={circle.xDomainNumb == minLabelYear ? 4 : circle.xDomainNumb == calculations.maxXDomain ? 5 : 0}
                        fill={colorsObject.main}
                        stroke-width="1px"
                        stroke="white"
                        ></circle>

                    </g>

                {/each}

                {#if mainLatestValue != null & mainPreviousValue != null & !chosenId6.includes(0)}

                    <g class="value-label-group"
                    transform="translate({scaleWidth+20},{mainData2[mainData2.length-1].zScore-11})">
            
                        <g>
            
                            <rect
                            labelid={0}
                            transform="translate({0},{0})"
                            x=0
                            y=0
                            width={labelWidthArray.length > 0 ? labelWidthArray[0].width + 6: 0}
                            height={22}
                            rx="3px"
                            stroke={colorsObject.main}
                            fill="white"
                            stroke-width="1.5px"
                            
                            ></rect>
            
                            <text bind:contentRect={labelWidthArray[0]}
                            labelid={0}
                            transform="translate({0},{0})"
                            x={3}
                            y={16}
                            text-anchor="start"
                            stroke-width="0.25px"
                            stroke={colorsObject.main}
                            fill={colorsObject.main}
                            font-size={"16px"}
                            >
                            {labelText}</text>
            
                        </g>
            
                    </g>



                {/if}

            



            </g>

        </svg>

    {/if}

    {/if}

</div>



<style>


.time-comparison-cell-container {
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
}

svg {
    overflow: visible;
}

p {
    text-align: center;
    padding: 5px;
    margin: 0px;
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    text-wrap: balance;
}




</style>