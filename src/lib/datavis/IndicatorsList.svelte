<script>

import ChartOptions from "./ChartOptions.svelte";
import KeyFigures from "./indicatorsListComponents/KeyFigures.svelte";
import BeeswarmRowsNew from "./BeeswarmRowsNew.svelte";

export let latestData, initialData, selectedAreas, trimmedIndicators, primaryIndicators, secondaryIndicators, otherIndicators, siblingAreas, checkboxedRoles, selectedArea, parentArea;

let chosenChart = 1;

let optionsArray = ["Summary", "Compared to other areas"];

let col1Width;

$: console.log(col1Width)


</script>


<div class="mainListContainer">

    <ChartOptions
    compareIntroText={false}
    bind:chosenChart={chosenChart}
    {optionsArray}
    ></ChartOptions>

    {#if optionsArray[chosenChart-1] === "Summary"}

        <KeyFigures
        indicators={[...primaryIndicators,...secondaryIndicators,...otherIndicators]}
        {latestData}
        {initialData}
        {selectedAreas}
        bind:col1Width={col1Width}
        ></KeyFigures>

    {:else if optionsArray[chosenChart-1] === "Compared to other areas"}

        <BeeswarmRowsNew
        {trimmedIndicators}
        {latestData}
        indicators={[...primaryIndicators,...secondaryIndicators,...otherIndicators]}
        {selectedAreas}
        {siblingAreas}
        bind:checkboxedRoles={checkboxedRoles}
        {selectedArea}
        {parentArea}
        {col1Width}
        ></BeeswarmRowsNew>


    {/if}

</div>

<style>

.mainListContainer {
    margin-bottom: 60px;
}

    
</style>