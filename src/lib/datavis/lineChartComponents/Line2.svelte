<script>

import { colorsObject  } from '$lib/config';
import { line } from 'd3-shape';
import { select } from "d3-selection";
import { onMount } from 'svelte';

export let lineData, hoverIndex, i, x, y, xDomain, overlay, labelsOnChart;

function mouseoverEvent(event) {

    hoverIndex = parseFloat(select(this).attr("hoverid"));
}

function mouseleaveEvent(event) {

    hoverIndex = null;
}

let primaryRolesArray = ["main", "parent", "country", "uk", "custom0", "custom1", "custom2", "custom3", "custom4"];

$: pathFunction = line()
    .x((d) => { return x(d.year); })
    .y((d) => { return y(d.value); });
    
</script>

{#if lineData.data.length > 0}

<g opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.25}>

<path
on:mouseover={overlay ? mouseoverEvent : null}
on:mouseleave={overlay ? mouseleaveEvent : null}
on:focus={overlay ? mouseoverEvent : null}
d={pathFunction(lineData.data)}
fill="none"
stroke={hoverIndex === i ? "#F39431" : colorsObject[lineData.role]}
stroke-width={overlay ? "16px" : "2px"}
opacity={overlay ? 0 : hoverIndex === i || primaryRolesArray.includes(lineData.role) ? 1 : 0.25}
hoverid={i}
></path>

{#if (hoverIndex === i || primaryRolesArray.includes(lineData.role)) & !overlay}

    {#each lineData.data as datapoint, j}

    <g transform={"translate("+x(datapoint.year)+","+y(datapoint.value)+")"}>

    {#if ["parent", "country", "uk"].includes(lineData.role)}

    <rect
    transform={["country", "uk"].includes(lineData.role) ? "rotate(45)" : null }
    x=-3
    y=-3
    width=6
    height=6
    fill={hoverIndex === i ? "#F39431": colorsObject[lineData.role]}
    stroke="white"
    >
    </rect>

    {:else}

    <circle
    r=3.5
    fill={hoverIndex === i ? "#F39431" : colorsObject[lineData.role]}
    stroke="white"
    >
    </circle>

    {/if} 

    </g>


    {/each}

{/if}


{#if (hoverIndex === i || primaryRolesArray.includes(lineData.role)) & !overlay}

<text
class={"nameLabel"}
x={labelsOnChart ? x(xDomain[1])+5 : 9999}
y={5+y(lineData.data.find((e)=>e.year === xDomain[1]).value)}
font-size="16px"
fill={hoverIndex === i ? "#F39431" : colorsObject[lineData.role]}
>{lineData.areanm}</text>

{/if}

</g>

{/if}