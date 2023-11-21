<script>

import { colorsObject  } from '$lib/config';

export let x, labelPlacements, hoverIndex, latestData, indicator

let prefix = indicator.prefix === null ? "" : indicator.prefix === "pounds" ? "£" : indicator.prefix;
let suffix = indicator.suffix === null ? "" : indicator.suffix;
let subTextShort = indicator.subTextShort === null ? "" : indicator.subTextShort;
let roundingFactor = Math.pow(10, indicator.roundingFactor);

</script>

<g class="labelsContainer" transform={"translate("+x+",0)"}>

    {#each labelPlacements as label}
        <text
        y={label.y+8}
        font-size="16px"
        fill={hoverIndex != null ? "#F39431": colorsObject[label.datum.role]}
        stroke={hoverIndex != null ? "#F39431": colorsObject[label.datum.role]}
        stroke-width="0.5px"
        >{prefix+(Math.round(latestData.find((e) => e.areacd === label.datum.areacd).value*roundingFactor)/roundingFactor)+suffix}</text>



    {/each}

</g>