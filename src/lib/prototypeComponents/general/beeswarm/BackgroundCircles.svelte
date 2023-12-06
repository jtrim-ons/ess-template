<script>

import HoverCircles from "$lib/prototypeComponents/general/beeswarm/HoverCircles.svelte";
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { select } from "d3-selection";
import { circleRadius, rowSvgOuterPadding } from "$lib/config";

export let chosenId3;
export let visibleAreas, backgroundLatestData;
export let x, y, yDomainGlobal;
export let scaleWidth;
export let medianValue, medianAbsoluteDeviation;
export let chartIndex, hoverIndex, hoverChartIndex;


//// calculate positions of background circles
$: backgroundCirclesStep1 = backgroundLatestData.map((e) => ({
    ...e,
    zScore: (e.value - medianValue)/medianAbsoluteDeviation
}));

$: backgroundCirclesStep2 = new AccurateBeeswarm(backgroundCirclesStep1, circleRadius.background[chosenId3 === 0 ? 'split' : 'full'], (d) => (x(d.zScore) > scaleWidth ? scaleWidth + rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2 : x(d.zScore) < 0 ? -rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]/2 : x(d.zScore))).calculateYPositions();

$: yDomainGlobal[0] = backgroundCirclesStep2 != undefined ? Math.min(...backgroundCirclesStep2 .map(d => d.y), yDomainGlobal[0]) : yDomainGlobal[0];
$: yDomainGlobal[1] = backgroundCirclesStep2 != undefined ? Math.max(...backgroundCirclesStep2 .map(d => d.y), yDomainGlobal[1]) : yDomainGlobal[1];

function mouseoverEvent(event) { 
    
    let elementHoverId = select(this).attr("hoverid");

    if (!visibleAreas.map((e) => e.areacd).includes(hoverIndex) & chosenId3 != 0) {

        hoverIndex = elementHoverId;
        hoverChartIndex = chartIndex;
    }
};

function mouseleaveEvent(event) { 
    
    hoverIndex = null;
    hoverChartIndex = null;
};


</script>

<g class="backgroundCirclesGroup">

    {#each backgroundCirclesStep2 as circle,i}

        <g transform={"translate("+circle.x+","+y(circle.y)+")"}>

            <circle
            r={circleRadius.background[chosenId3 === 0 ? 'split' : 'full']+1}
            stroke="none"
            fill="white"
            opacity=1
            ></circle>

        </g>

    {/each}
</g>

<g class="backgroundCirclesGroup"
opacity={hoverIndex === null ? 1 : 0.3}>

    {#each backgroundCirclesStep2 as circle,i}

        <g transform={"translate("+circle.x+","+y(circle.y)+")"}>

            <circle
            hoverid={circle.datum.areacd}
            on:mouseover={mouseoverEvent}
            on:mouseleave={mouseleaveEvent}
            on:focus={mouseoverEvent}
            r={circleRadius.background[chosenId3 === 0 ? 'split' : 'full']}
            stroke="none"
            fill="#cccccc"
            opacity=0.5
            ></circle>

        </g>

    {/each}

</g>

<HoverCircles
backgroundCirclesStep2={backgroundCirclesStep2.filter((e,i) => e.datum.areacd === hoverIndex)}
{y}
></HoverCircles>