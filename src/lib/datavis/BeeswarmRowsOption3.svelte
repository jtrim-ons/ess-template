<script>

import HorizontalBeeswarmOption2 from "./HorizontalBeeswarmOption2.svelte";
import { base } from "$app/paths";
import Key from "./shared/Key.svelte";
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";

export let trimmedIndicators, latestData, primaryIndicators, secondaryIndicators, otherIndicators, selectedAreas, siblingAreas, checkboxedRoles, selectedArea, parentArea, selectedIndicatorsArray;

let open = false;

$: areasWithData = [...new Set(latestData.map((e) => e.areacd))];

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}}))].filter((e) => areasWithData.includes(e.areacd));

$: indicatorsArray = selectedIndicatorsArray.reverse().map((e) => [...primaryIndicators,...secondaryIndicators,...otherIndicators].find((el) => el.label === e))

$: console.log(selectedIndicatorsArray, indicatorsArray)

</script>

<div class="beeswarmRowsContainer">

    {#each indicatorsArray as indicator, i}

        {#if true}

                <HorizontalBeeswarmOption2
                {indicator}
                filteredData={latestData.filter((e) => e.codeId === indicator.id )}
                {checkboxedRoles}
                {siblingAreas}
                {selectedAreas}
                {areasWithData}
                {plottedAreas}
                ></HorizontalBeeswarmOption2>  
                
        {/if}

    {/each}

</div>

<style>

.beeswarmRowsContainer {
    width: 100%;
}

img {
    margin-bottom: 60px;
}
  
h5 {
    width: 35%;
} 
 
</style>