<script>

import { medianAbsoluteDeviationLimit } from '$lib/config';

export let scaleHeight, scaleWidth;

let tickInterval = 1;

let ticks = [];

for (let i = -medianAbsoluteDeviationLimit; i <= medianAbsoluteDeviationLimit; i++) { if (i % tickInterval == 0) {ticks.push(i)} }


</script>

<g class="x-gridlines-group">

    <rect
    transform={"translate("+(scaleWidth*(-1+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2))+",0)"}
    x=1.5
    width={scaleWidth*(-3+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2)-3}
    y={0}
    height={scaleHeight}
    fill="url(#diagonalHatch)"
    opacity=0.25
    ></rect>

    {#each ticks as d, i}

        <g class="tick" transform={"translate("+(scaleWidth*(d+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2))+",0)"}>

            <line
            y1={0}
            y2={scaleHeight}
            stroke="white"
            opacity=1
            stroke-width={Math.abs(d) % 2 === 1 ? "1px" : "1px"}
            ></line>


        </g>

    {/each}

</g>