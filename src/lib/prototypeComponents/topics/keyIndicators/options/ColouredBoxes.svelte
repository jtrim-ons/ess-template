<script>

import Grid from "$lib/prototypeComponents/topics/keyIndicators/options/colouredBoxes/Grid.svelte";
import ChooseSelection from "$lib/prototypeComponents/topics/keyIndicators/ChooseSelection.svelte";
import Key from "$lib/prototypeComponents/topics/keyIndicators/options/colouredBoxes/Key.svelte";
import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";
import Checkbox from "$lib/prototypeComponents/general/selections/Checkbox.svelte";
import { getContext } from 'svelte';

export let indicatorsList, latestData, initialData, checkboxedRoles;

let chosenId1 = 0;
let chosenId2 = 0;
let chosenId3 = [0];

let areasParentsLookup = getContext("areasParentsLookup");

let regions = areasParentsLookup.filter((e) => ["K02000001", "E92000001"].includes(e.parentcd) & e.areacd != "E92000001");

$: selectedAreas = chosenId1 === 0 ? regions: (checkboxedRoles.custom == null || checkboxedRoles.custom == undefined) ? [] : checkboxedRoles.custom;

</script>


<div class="key-indicators-coloured-boxes-option-1-container">

    <ChooseSelection
    radioName="colouredBoxesRadio"
    {latestData}
    bind:checkboxedRoles={checkboxedRoles}
    bind:chosenId={chosenId1}
    ></ChooseSelection>

    <div class="key-and-selections-container">


        <div class="selections-container">

            <p>Colour by:</p>

            <Radio
            optionsArray={["Rank", "Change over time", "Both"]}
            name="dotPlotComparisonType"
            bind:chosenId={chosenId2}
            marginBottom="0px"
            fontSize="16px"
            ></Radio>

            <p style="margin-top: 12px">Show labels:</p>

            <Checkbox
            optionsArray={chosenId3.includes(0) ? ["For most recent year", "For comparison year"] : ["For most recent year"]}
            name="chosenComparison"
            bind:chosenId={chosenId3}
            marginBottom="0px"
            fontSize="16px"
            ></Checkbox>

        </div>

        <Key
        chosenId={chosenId2}
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
    ></Grid>

</div>


<style>

.key-and-selections-container {
    display: flex;
    flex-direction: row;
    margin: 20px 0px 10px 0px;
}

.selections-container {
    margin: 0px 20px 0px 0px;
    padding: 7px 20px 10px 15px;
    display: flex;
    flex-direction: column;
    background-color:#F5F5F6;
    border-radius: 10px;
    flex-grow: 1;
}

.selections-container p {
    margin: 0px 0px 2px 0px;
    padding: 0px;
    font-size: 16px;
}

</style>