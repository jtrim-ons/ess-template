<script>

import CircleLabels from "$lib/prototypeComponents/general/beeswarm/CircleLabels.svelte";

import { rowSvgOuterPadding, colorsObject, circleRadius } from "$lib/config";
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { getContext } from "svelte";

export let mainLatestValue;
export let comparisonLatestValue;
export let baselineComparisonArea;
export let baselineComparisonName;
export let chosenId6;
export let chosenId3;
export let visibleAreas, data;
export let metadata;
export let scaleWidth;
export let y, x;
export let medianValue, medianAbsoluteDeviation;
export let hoverIndex;

//// calculate positions of primary circles - includes adjustments (e.g. include median, exclude other areas) for split view
let selectedArea = getContext("selectedArea");
let selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");

$: splitViewData = [{areacd: baselineComparisonArea.areacd, areanm: baselineComparisonName, value: comparisonLatestValue}, {areacd: selectedArea.areacd, areanm: selectedArea.areanm, value: mainLatestValue}].filter((e) => e.value != null);

$: primaryCirclesStep1 = (chosenId3 === 0 ? splitViewData : data.filter((e) => visibleAreas.map((e) => e.areacd).includes(e.areacd))).map((e) => ({
    ...e,
    role: e.areacd === "median" ? "median" : [...selectedAndRelatedAreas,...visibleAreas].find((el) => e.areacd === el.areacd).role,
    zScore: (e.value - medianValue)/medianAbsoluteDeviation
}));

$: primaryCirclesStep2 = new AccurateBeeswarm(primaryCirclesStep1, chosenId3 === 0 ? circleRadius.primary.split*0.6 : circleRadius.primary.full+1.5, (d) => (x(d.zScore) > scaleWidth ? scaleWidth + rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2 : x(d.zScore) < 0 ? -rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2 : x(d.zScore))).calculateYPositions();

$: yDomainLocal = [Math.min(...primaryCirclesStep2 .map(d => d.y)), Math.max(...primaryCirclesStep2 .map(d => d.y))];

$: adjustmentFactor = -(yDomainLocal[0]+yDomainLocal[1])/2;

</script>

<g class="primaryCirclesGroup"
transform={"translate(0,"+y(0)+")"}
opacity={hoverIndex === null ? 1 : 0.2}>

    {#each primaryCirclesStep2 as circle,i}

                    <g transform={"translate("+circle.x+","+(chosenId6.includes(0) ? -7.5+15*i : circle.y+adjustmentFactor)+")"}>

                        {#if chosenId6.includes(0)}

                            <line
                            x1={Math.max(-circle.x+rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2, -25)}
                            x2={Math.min(scaleWidth-circle.x+rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2, 25)}
                            y1=0
                            y2=0
                            stroke="white"
                            fill="none"
                            stroke-width="4px"
                            ></line>

                            <line
                            x1={Math.max(-circle.x+rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2, -25)}
                            x2={Math.min(scaleWidth-circle.x+rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2, 25)}
                            y1=0
                            y2=0
                            stroke={colorsObject[circle.datum.role]}
                            fill="none"
                            opacity=0.5
                            stroke-width="4px"
                            ></line>

                          

                        {/if}

                        <g transform="scale({chosenId3 === 0 & i === 0 & splitViewData.length === 2 ? 0.75 : 1})">

                            {#if ["parent", "country", "uk"].includes(circle.datum.role)}
                                            
                                <rect
                                pointer-events="none"
                                transform={["country", "uk"].includes(circle.datum.role) ? "rotate(45)" : null }
                                x={-circleRadius.primary[chosenId3 === 0 ? "split" : "full"]+0.5}
                                y={-circleRadius.primary[chosenId3 === 0 ? "split" : "full"]+0.5}
                                width={circleRadius.primary[chosenId3 === 0 ? "split" : "full"]*2-1}
                                height={circleRadius.primary[chosenId3 === 0 ? "split" : "full"]*2-1}
                                fill={colorsObject[circle.datum.role]}
                                stroke="white"
                                stroke-width="1px"
                                opacity=1
                                >
                                </rect>

                            {:else} 

                                <circle
                                pointer-events="none"
                                r={circleRadius.primary[chosenId3 === 0 ? "split" : "full"]}
                                stroke="white"
                                stroke-width="1px"
                                fill={colorsObject[circle.datum.role]}
                                opacity=1
                                ></circle>


                            {/if}

                        </g>

                    </g>

    {/each}

</g>

{#if !chosenId6.includes(0)}

    <CircleLabels
    {scaleWidth}
    {chosenId3}
    {metadata}
    {primaryCirclesStep2}
    {y}
    {hoverIndex}
    ></CircleLabels>

{/if}