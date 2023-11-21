<script>

import { scaleLinear } from 'd3-scale';
import { roundNumber, addThousandsSeparator } from "$lib/utils";

export let breaks, metadata;

let width=400, height=60;

let colorsInit = ["#b2182b", "#d6604d", "#fddbc7", "#d1e5f0", "#4393c3", "#2166ac"];
$: colors = metadata.polarity == -1 ? colorsInit.slice().reverse() : colorsInit;

$: prefix = metadata.prefix === null ? "" : metadata.prefix;
$: suffix = metadata.suffix === null ? "" : metadata.suffix;

/*$: xDomain = [breaks[0], breaks[breaks.length-1]];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, width-60]);*/

</script>

<div class="svg-container" bind:clientWidth={width}>

    <svg {width} {height}>

        <g transform="translate(10,10)">

            {#each breaks as block, i}

                <rect
                x={i*(width-20)/breaks.length}
                width={(width-20)/breaks.length}
                y=0
                height=20
                stroke="none"
                fill={colors[i]}
                >
                </rect>
                
                <line
                x1={i*(width-20)/breaks.length}
                x2={i*(width-20)/breaks.length}
                y1=0
                y2=30
                stroke-width="2px"
                stroke="black"
                ></line>

                {#if i > 0}

                    <text
                    x={i*(width-20)/breaks.length}
                    y=45
                    text-anchor="middle"
                    font-size="14px"
                    stroke="black"
                    fill="black"
                    stroke-width="0.5px"
                    >{prefix+addThousandsSeparator(roundNumber(block, metadata.decimalPlaces))+suffix}</text>

                {/if}

            {/each}

            <line
            x1={width-20}
            x2={width-20}
            y1=0
            y2=30
            stroke-width="2px"
            stroke="black"
            ></line>

        </g>



    </svg>

</div>



