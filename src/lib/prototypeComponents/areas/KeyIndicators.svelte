<script>

import Panel from "$lib/prototypeComponents/areas/KeyIndicators/Panel.svelte";

import { getContext } from "svelte";

export let indicators, chosenId11, baselineComparisonArea, chosenId2;


$: console.log(indicators);

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations");


</script>



<section title="Key indicators">

    <h1>Key indicators</h1>

    <div class="rowsContainer">

        {#each indicators as indicator}

            <Panel
            {indicator}
            metadata={indicatorsMetadata.find((e) => e.code === indicator.code)} calculations={indicatorsCalculations.find((e) => e.id === indicator.id)}
            {chosenId11}
            {baselineComparisonArea}
            {chosenId2}
            ></Panel>

        {/each}
    </div>
</section>



<style>

h1 {
    padding: 0px 0px 40px 10px;
    margin: 0px;
}

section {
    margin: 0px 0px 100px 0px;
    border-bottom-style: solid;
    border-bottom-color: #cbd5e1;
    border-bottom-width: 1px;
}


</style>