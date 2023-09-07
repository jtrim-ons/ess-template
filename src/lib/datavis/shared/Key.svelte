<script>

import { colorsObject  } from '$lib/config';
import { getContext } from 'svelte';

let areas = getContext('areas');

export let plottedAreas; 

let radius = 6;

</script>


<div class="keyContainer">

    {#each plottedAreas as role, i} 

        <div class="roleContainer">

        <svg
        width=20
        height=24
        >

            <g transform="translate(10,12)">

                {#if ["parent", "country", "uk"].includes(role.role)}

                    <rect
                    transform={["country", "uk"].includes(role.role) ? "rotate(45)" : null }
                    x={-radius}
                    y={-radius}
                    width={2*radius}
                    height={2*radius}
                    fill={colorsObject[role.role]}
                    stroke="white"
                    >
                    </rect>

                {:else}

                    <circle
                    r={radius}
                    fill={colorsObject[role.role]}
                    stroke="white"
                    >
                    </circle>

                {/if} 
            
                </g>


        </svg>

        <p style="color: {colorsObject[role.role]}">
            {areas.find((e) => e.areacd === role.areacd).areanm}
        </p>

    </div>


    {/each}

</div>



<style>

.keyContainer {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
    padding-bottom: 10px;
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