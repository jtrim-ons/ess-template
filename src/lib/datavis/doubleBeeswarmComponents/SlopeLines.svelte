<script>

import { colorsObject } from '$lib/config';

export let lineDataArray, x1, x2, hoverIndex;

let primaryRolesArray = ["main", "parent", "country", "uk", "custom1", "custom2", "custom3", "custom4"];

</script>


<g class="slopeLinesContainer">

    {#if lineDataArray[0].length === lineDataArray[1].length}

        {#each lineDataArray[0].map((e) => e.datum.areacd) as area}


            <line
            x1={lineDataArray[0].find((e) => e.datum.areacd == area).y+x1}
            x2={lineDataArray[1].find((e) => e.datum.areacd == area).y+x2}
            y1={lineDataArray[0].find((e) => e.datum.areacd == area).x}
            y2={lineDataArray[1].find((e) => e.datum.areacd == area).x}
            stroke-width="3px"
            stroke={hoverIndex != null ? "#F39431": colorsObject[lineDataArray[0].find((e) => e.datum.areacd == area).datum.role]}
            
            ></line>


        {/each}

    {/if}

</g>