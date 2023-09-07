<script>

import HorizontalBeeswarm from "./HorizontalBeeswarm.svelte";
import { base } from "$app/paths";
import Key from "./shared/Key.svelte";
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";

export let trimmedIndicators, latestData, primaryIndicators, secondaryIndicators, otherIndicators, selectedAreas, siblingAreas, checkboxedRoles, selectedArea, parentArea, selectedIndicatorsArray;

let open = false;

$: areasWithData = [...new Set(latestData.map((e) => e.areacd))];

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}}))].filter((e) => areasWithData.includes(e.areacd));

$: indicatorsArray = selectedIndicatorsArray.reverse().map((e) => [...primaryIndicators,...secondaryIndicators,...otherIndicators].find((el) => el.label === e))

</script>

<div class="beeswarmRowsContainer">

<SelectComparisonAreas
selectedAreas={selectedAreas.filter((e) => latestData.filter((el) => e.data.areacd === el.areacd).length > 0 & e.role !== "main")}
{areasWithData}
bind:checkboxedRoles={checkboxedRoles}
includeSiblings={false}
{selectedArea}
{parentArea}
></SelectComparisonAreas>

<Key
{plottedAreas}
></Key>


    {#each indicatorsArray as indicator, i}

        {#if true}

                <HorizontalBeeswarm
                key={i == 0}
                {indicator}
                filteredData={latestData.filter((e) => e.codeId === indicator.id )}
                {checkboxedRoles}
                {siblingAreas}
                {selectedAreas}
                {areasWithData}
                {plottedAreas}
                ></HorizontalBeeswarm>  
                
        {/if}

    {/each}

</div>

<img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

<style>

.beeswarmRowsContainer {
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

img {
    margin-bottom: 60px;
}
  
h5 {
    width: 35%;
} 
 
</style>