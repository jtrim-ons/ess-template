<script>

import Header from "$lib/prototypeComponents/areas/Header.svelte";
import Checkbox from "$lib/prototypeComponents/general/selections/Checkbox.svelte";

import { getContext } from "svelte";
import { colorsObject } from "$lib/config";

export let baselineComparisonArea;
export let chosenId3;
export let visibleAreas;

export let chosenId1;
export let chosenId2;
export let chosenId4;
export let chosenId5;
export let globalVisibleAreasTracker;
export let showAreaOptions, showBaselines;
export let chosenId6;

let selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");
let selectedArea = getContext("selectedArea");

$: keyArray = chosenId3 === 0 ? [selectedAndRelatedAreas[0], (baselineComparisonArea.areacd === "median" ? baselineComparisonArea : selectedAndRelatedAreas.find((el) => baselineComparisonArea.areacd === el.areacd))] : visibleAreas;

</script>

<div class="sticky">

    <div>

    <Header
    bind:chosenId1={chosenId1}
    bind:chosenId2={chosenId2}
    bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
    showAreaOptions={chosenId3 != 0 ? true : false}
    showBaselines={chosenId3 != 1 ? true : false}
    bind:chosenId4={chosenId4} bind:chosenId5={chosenId5}
    ></Header>

    </div>

    <Checkbox
    optionsArray={["Include 95% confidence intervals"]}
    name="chosenComparison"
    bind:chosenId={chosenId6}
    ></Checkbox>

    <div class="key-container">

        {#each keyArray as area, i} 

            <div class="area-container">

                <svg
                width=20
                height=24
                >

                    <g transform="translate(10,12)">

                        {#if ["parent", "country", "uk"].includes(area.role)}

                            <rect
                            transform={["country", "uk"].includes(area.role) ? "rotate(45)" : null }
                            x={-6}
                            y={-6}
                            width={2*6}
                            height={2*6}
                            fill={colorsObject[area.role]}
                            stroke="white"
                            >
                            </rect>

                        {:else}

                            <circle
                            r={6}
                            fill={colorsObject[area.role]}
                            stroke="white"
                            >
                            </circle>

                        {/if}

                    </g>

                </svg>

                <p style="color: {colorsObject[area.role]}">{area.areanm}</p>

            </div>

        {/each}

    </div>

</div>




<style>


.sticky {
    background-color: white;
    margin: 0px 0px 0px 0px;
    padding: 0px 10px 10px 10px;
    position: sticky;
    top: 0px;
	z-index: 1;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    gap: 10px;
    border-bottom-style: solid;
    border-bottom-color: #cbd5e1;
    border-bottom-width: 1px;
}

.key-container {
    display: flex;
    flex-wrap: wrap;
}

.area-container {
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