<script>

import { colorsObject } from '$lib/config';
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { select } from "d3-selection";

export let xValue, y, data, radius = 7, hoverIndex, rolesObject, plotData;

$: plotData = new AccurateBeeswarm(data, radius*1.2, (d) => y(d.value))
        .calculateYPositions();

function mouseoverEvent(event) {

hoverIndex = parseFloat(select(this).attr("hoverid"));
}

function mouseleaveEvent(event) {

hoverIndex = null;
}

</script>

<g transform={"translate("+xValue+",0)"}> 

    {#each plotData as circle, i}

    <g transform={"translate("+circle.y+","+circle.x+")"}>

    <circle
    on:mouseover={mouseoverEvent}
    on:mouseleave={mouseleaveEvent}
    on:focus={mouseoverEvent}
    hoverid={i}
    r={radius*1.8}
    stroke="none"
    fill="white"
    ></circle>

    </g>

    {/each}

    {#each plotData as circle, i}

    <g transform={"translate("+circle.y+","+circle.x+")"}>

    {#if ["parent", "country", "uk"].includes(rolesObject[circle.datum.areacd])}

    <rect
    pointer-events="none"
    transform={["country", "uk"].includes(rolesObject[circle.datum.areacd]) ? "rotate(45)" : null }
    x={hoverIndex === i ? -radius-3 : -radius}
    y={hoverIndex === i ? -radius-3 : -radius}
    width={hoverIndex === i ? radius*2+6 : radius*2}
    height={hoverIndex === i ? radius*2+6 : radius*2}
    fill={hoverIndex === i ? "#F39431": colorsObject[rolesObject[circle.datum.areacd]]}
    stroke="white"
    opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.2}
    >
    </rect>

    {:else}

    <circle
    pointer-events="none"
    r={hoverIndex === i ? radius+3 : radius}
    fill={hoverIndex === i ? "#F39431" : colorsObject[rolesObject[circle.datum.areacd]]}
    stroke="white"
    opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.2}
    >
    </circle>

    {/if} 

    </g>

    {/each}




</g>

