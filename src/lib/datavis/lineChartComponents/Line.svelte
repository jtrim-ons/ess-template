<script>

import { colorsObject  } from '$lib/config';
import { line } from 'd3-shape';
import { select } from "d3-selection";

export let overlay=false, lineData, i, hoverIndex, x, y, xDomain, area;

$: pathFunction = line()
    .x((d) => { return x(d.year); })
    .y((d) => { return y(d.value); });

function mouseoverEvent(event) { hoverIndex = parseFloat(select(this).attr("hoverid")) };
function mouseleaveEvent(event) { hoverIndex = null };

let primaryRolesArray = ["main", "parent", "country", "uk", "custom1", "custom2", "custom3", "custom4"];

</script>

<g 
class="lineContainer" 
opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.25}
>

    <path
    on:mouseover={overlay ? mouseoverEvent : null}
    on:mouseleave={overlay ? mouseleaveEvent : null}
    on:focus={overlay ? mouseoverEvent : null}
    d={pathFunction(lineData)}
    fill="none"
    stroke={hoverIndex === i ? "#F39431" : colorsObject[area.role]}
    stroke-width={overlay ? "16px" : "2px"}
    opacity={overlay ? 0 : hoverIndex === i || primaryRolesArray ? 1 : 0.25}
    hoverid={i}
    ></path>

    
    {#if (hoverIndex === i || primaryRolesArray.includes(area.role)) & !overlay}

    <g class="pointsContainer">

        {#each lineData as datapoint, j}

            <g transform={"translate("+x(datapoint.year)+","+y(datapoint.value)+")"}>

                {#if ["parent", "country", "uk"].includes(area.role)}

                    <rect
                    transform={["country", "uk"].includes(area.role) ? "rotate(45)" : null }
                    x=-3
                    y=-3
                    width=6
                    height=6
                    fill={hoverIndex === i ? "#F39431": colorsObject[area.role]}
                    stroke="white"
                    >
                    </rect>

                {:else}

                    <circle
                    r=3.5
                    fill={hoverIndex === i ? "#F39431" : colorsObject[area.role]}
                    stroke="white"
                    >
                    </circle>

                {/if} 



            </g>

        {/each}
    </g>

    {/if}
</g>
