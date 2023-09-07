<script>

import { colorsObject  } from '$lib/config';
import { selectedArea } from "$lib/selectedAreasStore.js";

export let rolesArray, visibleAreas, hoverIndex = null, radius = 3.5, line = true;

let areaType = $selectedArea.parentcd === "E92000001" ? "regions" : $selectedArea.parentcd === "K02000001" ? "countries" : "local authorities";
    
</script>

<div class="keyContainer">

    {#each rolesArray as role, i} 

    <div class="roleContainer">
    
        <svg
        width=20
        height=24
        >

            {#if hoverIndex !== null || role !== "selected"}

            {#if line}

            <line
            x1=0
            x2=20
            y1=12
            y2=12
            stroke={colorsObject[role]}
            stroke-width="2px"
            ></line>

            {/if}

            <g transform="translate(10,12)">

            {#if ["parent", "country", "uk"].includes(role)}

                <rect
                transform={["country", "uk"].includes(role) ? "rotate(45)" : null }
                x={-radius}
                y={-radius}
                width={2*radius}
                height={2*radius}
                fill={hoverIndex === i ? "#F39431": colorsObject[role]}
                stroke="white"
                >
                </rect>

            {:else}

                <circle
                r={radius}
                fill={hoverIndex === i ? "#F39431" : colorsObject[role]}
                stroke="white"
                >
                </circle>

            {/if} 

            </g>

            {/if}

        </svg>

        <p style="color: {colorsObject[role]}">
        {role === "selected" ? hoverIndex === null ? "" : visibleAreas.reverse()[hoverIndex].areanm : role === "similar" ? "Statistically similar areas" : role === "neighbour" ? "Other "+areaType+" in "+$selectedArea.parentnm : visibleAreas.find((e) => e.role === role)["areanm"]}
        </p>

    </div>



    {/each}

</div>

<style>

.keyContainer {
    display: flex;
    flex-wrap: wrap;
}

.roleContainer {
    padding-right: 20px;
    display: flex;
    align-items: center;
    padding-bottom: 0px;
    margin-bottom: 0px;
}

p {
    font-size: 16px;
    padding-left: 6px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    margin: 0px;
}




</style>