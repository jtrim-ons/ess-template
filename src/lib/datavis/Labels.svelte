<script>

import { colorsObject  } from '$lib/config';

export let x, labelPlacements, hoverIndex;

</script>

<g class="labelsContainer" transform={"translate("+x+",0)"}>

    {#each labelPlacements as label}

        <text
        y={label.y+8}
        font-size="16px"
        fill={"white"}
        stroke="white"
        stroke-width="4px"

        >{label.datum.areanm}</text>

        <text
        y={label.y+8}
        font-size="16px"
        fill={hoverIndex != null ? "#F39431": colorsObject[label.datum.role]}
        stroke={hoverIndex != null ? "#F39431": colorsObject[label.datum.role]}
        stroke-width="0.5px"
        >{label.datum.areanm}</text>



    {/each}

</g>