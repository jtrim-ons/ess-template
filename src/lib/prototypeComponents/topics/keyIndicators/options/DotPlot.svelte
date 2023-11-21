<script>

import ChooseSelection from "$lib/prototypeComponents/topics/keyIndicators/ChooseSelection.svelte";
import Key from "$lib/prototypeComponents/topics/keyIndicators/options/dotPlot/Key.svelte";
import Grid from "$lib/prototypeComponents/topics/keyIndicators/options/dotPlot/Grid.svelte";
import { getContext } from 'svelte';

export let indicatorsList, latestData, initialData, checkboxedRoles, chosenId0;

let chosenId1 = 0;
let chosenId2 = 2;
let chosenId3 = [];

let areasParentsLookup = getContext("areasParentsLookup");

let regions = areasParentsLookup.filter((e) => ["K02000001", "E92000001"].includes(e.parentcd) & e.areacd != "E92000001");

$: selectedAreas = chosenId1 === 0 ? regions: (checkboxedRoles.custom == null || checkboxedRoles.custom == undefined) ? [] : checkboxedRoles.custom;

</script>

<div class="key-indicators-dot-plot-boxes-option-2-container">

    <ChooseSelection
    radioName="dotPlotRadio"
    {latestData}
    bind:checkboxedRoles={checkboxedRoles}
    bind:chosenId={chosenId1}
    ></ChooseSelection>

    <div class="key-and-selections-container">

        <Key
        ></Key>

    </div>

    <Grid
    {indicatorsList}
    {latestData}
    {initialData}
    {selectedAreas}
    {chosenId1}
    {chosenId2}
    {chosenId3}
    {chosenId0}
    ></Grid>

</div>


<style>

.key-and-selections-container {
    display: flex;
    flex-direction: row;
    margin: 20px 0px 10px 0px;
}


</style>