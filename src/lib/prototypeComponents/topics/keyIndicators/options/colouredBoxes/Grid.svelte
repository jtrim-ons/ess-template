<script>

import Row from "$lib/prototypeComponents/topics/keyIndicators/options/colouredBoxes/Row.svelte";
import HeadersRow from "$lib/prototypeComponents/topics/keyIndicators/options/colouredBoxes/HeadersRow.svelte";
import { getContext } from 'svelte';

export let indicatorsList, latestData, initialData, selectedAreas, chosenId1, chosenId2, chosenId3;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations").filter((e) => indicatorsList.includes(e.id));

indicatorsCalculations.forEach((e,i) => {

    e.medianValue = e.ltCount > 200 ? e.ltMedian : e.utCount > 140 ? e.utMedian : e.ukValue != 'NA' ? e.ukValue : e.gbValue != 'NA' ? e.gbValue : e.ewValue != 'NA' ? e.ewValue : e.engValue != 'NA' ? e.engValue : null;

    e.label = indicatorsMetadata.find((el) => el.code == e.code).label;
})

$: console.log(selectedAreas)

</script>

<div class="grid-container">

    <HeadersRow
    {indicatorsCalculations}
    {chosenId2}
    {chosenId3}
    ></HeadersRow>

    {#each selectedAreas as row, j}

        <Row
        {row}
        {j}
        {chosenId1}
        {chosenId2}
        {chosenId3}
        {indicatorsCalculations}
        {indicatorsMetadata}
        {initialData}
        {latestData}
        ></Row>

    {/each}

</div>

<style>


.grid-container {
    display: flex;
    flex-direction: column;
}


</style>