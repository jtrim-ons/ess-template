<script>

import LineLabel from "$lib/prototypeComponents/areas/DigestBeeswarmLine/LineChart/LineLabel.svelte";

import { getContext } from "svelte";
import { scaleLinear } from 'd3-scale';
import { curveBasis, line } from 'd3-shape';

import { rowSvgOuterPadding, rowSvgHeight, encodingColourPalette, colorsObject } from "$lib/config";
import { calculatePosition } from "$lib/utils";

export let indicator;
export let rowNumb, topicNumb;
export let metadata, calculations;
export let col4Width;
export let chosenId2;
export let chosenId3;
export let baselineComparisonArea;
export let visibleAreas;
export let scaleHeight, scaleWidth;
export let x, xDomain;
export let chosenId11;
export let chosenId6;

$: earliestYear = chosenId2 === "earliest available year" ? calculations.mainMinXDomain : chosenId2 === "previous year" ? calculations.maxXDomain - 1 : chosenId2;

$: selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");

let medianValue = calculations.calcs[calculations.maxXDomain].median;
let medianAbsoluteDeviation = calculations.calcs[calculations.maxXDomain].mad;

$: mainData1 = Array.from({ length: calculations.maxXDomain - earliestYear + 1 }, (_, index) => earliestYear + index)
                .map((e) => ({
                    xDomainNumb: e,
                    value: calculations.calcs[e] == undefined ? undefined : "main" in calculations.calcs[e] ? calculations.calcs[e].main : undefined 
                })).filter((e) => e.value != undefined & !isNaN(e.value));

$: mainData2 = mainData1.map((e) => ({
    ...e,
    zScore: calculatePosition(rowSvgOuterPadding, chosenId3, scaleWidth, x, e.value, medianValue, medianAbsoluteDeviation)
}));

$: mainData3 = [...mainData2.map((e) => ({...e, zScore: e.zScore - 15})),...mainData2.reverse().map((e) => ({...e, zScore: e.zScore + 15}))];

$: comparisonRole = (baselineComparisonArea.areacd === "median" ? baselineComparisonArea : selectedAndRelatedAreas.find((el) => baselineComparisonArea.areacd === el.areacd)).role;

$: comparisonData1 = Array.from({ length: calculations.maxXDomain - earliestYear + 1 }, (_, index) => earliestYear + index)
                .map((e) => ({
                    xDomainNumb: e,
                    value: calculations.calcs[e] == undefined ? undefined : comparisonRole in calculations.calcs[e] ? calculations.calcs[e][comparisonRole] : undefined 
                })).filter((e) => e.value != undefined & !isNaN(e.value));

$: comparisonData2 = comparisonData1.map((e) => ({
    ...e,
    zScore: calculatePosition(rowSvgOuterPadding, chosenId3, scaleWidth, x, e.value, medianValue, medianAbsoluteDeviation)
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

$: minLabelPosition = Math.min(...[...mainData2, ...comparisonData2].map((e) => e.zScore));
$: minLabelPosition2 = Math.min(...[...mainData2, ...comparisonData2].map((e) => e.zScore));

$: y = scaleLinear()
    .domain([minLabelYear, calculations.maxXDomain])
    .range([0, scaleHeight]);

$: pathFunction = line()
    .curve(curveBasis)
    .x((d) => { return d.zScore })
    .y((d) => { return y(d.xDomainNumb); });


let colour = encodingColourPalette["better"];
let text = "Improved since 2012";


</script>


<div class="time-comparison-cell-container" style={chosenId6.includes(0) | chosenId3 != 0 | colour == null ? null : "background-color:"+colour+"; box-shadow: 0 0 4px 3px "+colour+";"}>

    {#if chosenId11.includes(0) & chosenId3 === 0}

        <p class="from-comparison-description">{chosenId6.includes(0) ? (Math.random() < 0.5 & mainData2.length > 1 ? "Statistically significant change" : "") : text}</p>

    {/if}

    {#if chosenId3 === 0}

    {#if mainData2.length > 1}

        <svg class="line-row-svg line-row-svg-{topicNumb*100+rowNumb}"
        viewBox="0 0 {col4Width} {rowSvgHeight[chosenId3 === 0 ? "split" : "full"]}"
        width="100%"
        height={20+rowSvgHeight[chosenId3 === 0 ? "split" : "full"]}>

            <g class="chart-container"
            transform="translate({rowSvgOuterPadding.left[chosenId3 === 0 ? "split" : "full"]+rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]},{rowSvgOuterPadding.top[chosenId3 === 0 ? "split" : "full"]})">


                <line
                x1={minLabelPosition2 < 30 | minLabelPosition < 30 ? 0 : 25}
                x2={minLabelPosition2 < 30 | minLabelPosition < 30 ? scaleWidth-25 : scaleWidth}
                y1=0
                y2=0
                stroke="rgb(200,200,200)"
                stroke-width="1.5px"
                ></line>

                <text
                text-anchor={minLabelPosition2 < 30 | minLabelPosition < 30 ? "start": "end"}
                font-size="14px"
                x={minLabelPosition2 < 30 | minLabelPosition < 30 ? scaleWidth-20 : 20}
                y=5
                stroke="rgb(175,175,175)"
                fill="rgb(175,175,175)"
                stroke-width="0.5px"
                >{minLabelYear}</text>

                <line
                x1={minLabelPosition2 < 30 | minLabelPosition < 30 ? 0 : 25}
                x2={minLabelPosition2 < 30 | minLabelPosition < 30 ? scaleWidth-25 : scaleWidth}
                y1={scaleHeight}
                y2={scaleHeight}
                stroke="rgb(200,200,200)"
                stroke-width="1.5px"
                ></line>

                <text
                text-anchor={minLabelPosition2 < 30 | minLabelPosition < 30 ? "start": "end"}
                font-size="14px"
                x={minLabelPosition2 < 30 | minLabelPosition < 30 ? scaleWidth-20 : 20}
                y={scaleHeight+5}
                stroke="rgb(175,175,175)"
                fill="rgb(175,175,175)"
                stroke-width="0.5px"
                >{calculations.maxXDomain}</text>

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

                        <g transform="translate({circle.zScore},{y(circle.xDomainNumb)})">

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

                    <g transform="translate({circle.zScore},{y(circle.xDomainNumb)})">

                        <circle
                        r={circle.xDomainNumb == minLabelYear ? 4 : circle.xDomainNumb == calculations.maxXDomain ? 5 : 0}
                        fill={colorsObject.main}
                        stroke-width="1px"
                        stroke="white"
                        ></circle>

                    </g>

                {/each}

                {#if mainLatestValue != null & mainPreviousValue != null & !chosenId6.includes(0)}

                    <LineLabel
                    xPosition={mainData2.length > 1 ? Math.abs(mainData2[mainData2.length-1].zScore-mainData2[0].zScore)/2+Math.min(mainData2[mainData2.length-1].zScore,mainData2[0].zScore) : mainData2[0].zScore}
                    {metadata}
                    {mainLatestValue}
                    {mainPreviousValue}
                    {scaleWidth} {scaleHeight}
                    {chosenId3}
                    ></LineLabel>

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