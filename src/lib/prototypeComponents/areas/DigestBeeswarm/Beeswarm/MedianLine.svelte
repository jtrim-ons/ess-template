<script>

import { addThousandsSeparator, roundNumber, splitTextIntoRows } from '$lib/utils';
import { geogLevelToNameLookup } from '$lib/config';

import { getContext } from 'svelte';

export let medianValue, metadata, scaleWidth, scaleHeight, hoverIndex, firstRow, background;

let label1TextDimensions = null, label2TextDimensions = null, label2TextArray;

if (firstRow & background ) {

    let selectedGeogLevel = getContext("selectedGeogLevel");

    label2TextArray = splitTextIntoRows("Median value across all "+geogLevelToNameLookup[selectedGeogLevel], 2);
}


</script>

<g class="median-line-group" transform={"translate("+scaleWidth/2+",0)"}
opacity={background ? 1 : 0.4}
>

    <line 
    opacity={hoverIndex == null ? 1 : 0}
    y1={-8.5+(firstRow & background ? -172 : 0)}
    y2={scaleHeight+15}
    stroke="#F66068"
    stroke-width="2.5px"
    pointer-events="none"
    ></line>

    {#if background}

        {#if label1TextDimensions != null}

            <rect
            opacity={hoverIndex == null ? 1 : 0}
            x={-label1TextDimensions.width/2-3}
            width={label1TextDimensions.width+6}
            y=-28.5
            height=20
            class="medianLine"
            stroke="#F66068"
            stroke-width="1.5px"
            fill="white"
            rx="5px"
            ></rect>

        {/if}

        <text
        bind:contentRect={label1TextDimensions}
        opacity={hoverIndex == null ? 1 : 0}
        y=-13
        class="medianLine"
        fill="#F66068"
        stroke-width="0px"
        pointer-events="none"
        text-anchor="middle"
        font-size="16px"
        >{metadata.prefix+addThousandsSeparator(roundNumber(medianValue, metadata.decimalPlaces))+metadata.suffix}</text>

        {#if firstRow}

            <g transform="translate(0,-65)">

                {#if label2TextDimensions != null}

                        <rect
                        opacity={hoverIndex == null ? 1 : 0}
                        x={-label2TextDimensions.width/2-3}
                        width={label2TextDimensions.width+6}
                        y=-17
                        height=40
                        class="medianLine"
                        stroke="#F66068"
                        stroke-width="1.5px"
                        fill="white"
                        rx="5px"
                        ></rect>

                {/if}

                <g bind:contentRect={label2TextDimensions}>

                    {#each label2TextArray as line, i}

                    <text
                    opacity={hoverIndex == null ? 1 : 0}
                    y={i*17}
                    class="medianLine"
                    fill="#F66068"
                    stroke-width="0px"
                    pointer-events="none"
                    text-anchor="middle"
                    font-size="16px"
                    >{line}</text>

                    {/each}

                </g>

            </g>

        {/if}

    {/if}

</g>
