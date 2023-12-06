<script>

import { colorsObject, rowSvgOuterPadding } from "$lib/config";
import { addThousandsSeparator, roundNumber } from "$lib/utils";
import { onMount } from 'svelte';
import { select } from 'd3-selection';

import { getContext } from 'svelte';

export let scaleWidth;
export let chosenId3;
export let metadata;
export let primaryCirclesStep2;
export let y;
export let hoverIndex, hoverChartIndex;

$: labelWidthArray = [];

</script>

<g class="labels-group">

    {#if chosenId3 === 0}

        {#each primaryCirclesStep2 as circle, i}

            <g class="value-label-group"
            transform="translate({Math.min(scaleWidth+rowSvgOuterPadding.right.split+rowSvgOuterPadding.areaSpaceBeyondXScale.split-(labelWidthArray[i] == null ? 0 : labelWidthArray[i].width+6), Math.max(-rowSvgOuterPadding.left.split-rowSvgOuterPadding.areaSpaceBeyondXScale.split, circle.x-(labelWidthArray[i] == null ? 0 : (primaryCirclesStep2[i].x < primaryCirclesStep2[i === 0 ? primaryCirclesStep2.length-1 : 0].x ? labelWidthArray[i].width+6 : 0))))},{y(0)+12})">

                <rect
                labelid={i}
                transform="translate({0},{0})"
                x=0
                y=0
                width={labelWidthArray.length > i ? labelWidthArray[i].width + 6: 0}
                height={circle.datum.role != "main" ? 21 : 24}
                rx="3px"
                stroke={colorsObject[circle.datum.role]}
                fill="white"
                stroke-width="1.5px"
                
                ></rect>

                <text bind:contentRect={labelWidthArray[i]}
                labelid={i}
                transform="translate({0},{0})"
                x=3
                y={circle.datum.role != "main" ? 16 : 18}
                text-anchor="start"
                stroke-width="0.25px"
                stroke={colorsObject[circle.datum.role]}
                fill={colorsObject[circle.datum.role]}
                font-size={circle.datum.role != "main" ? "16px" : "18px"}
                >
                {metadata.prefix+addThousandsSeparator(roundNumber(circle.datum.value, metadata.decimalPlaces))+metadata.suffix}</text>

            </g>

        {/each}

    {/if}

</g>
