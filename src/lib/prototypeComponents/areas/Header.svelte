<script>

import ChooseBaseline from "$lib/prototypeComponents/general/selections/ChooseBaseline.svelte";
import ToggleIcon from '$lib/prototypeComponents/general/icon/ToggleIcon.svelte';
import Checkbox from "$lib/prototypeComponents/general/selections/Checkbox.svelte";
import MultiSelect from "$lib/prototypeComponents/general/selections/MultiSelect.svelte";

import { getContext } from "svelte";

export let chosenId1;
export let chosenId2;
export let chosenId4;
export let chosenId5;
export let globalVisibleAreasTracker;
export let showAreaOptions, showBaselines;

let selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");
let selectedArea = getContext("selectedArea");
let baselineComparisonOptions = getContext("baselineComparisonOptions");
let previousTimePeriodOptions = getContext("previousTimePeriodOptions");

let twistyOpen = false, hover = false;

const clickEvent = () => { twistyOpen = !twistyOpen;  }

const mouseoverEvent = () => { hover = true; }
const mouseleaveEvent = () => { hover = false; }

let width = 1000;

$: {
    
    globalVisibleAreasTracker.neighbour = chosenId5.includes(0);
    globalVisibleAreasTracker.cluster = chosenId5.includes(1);
}

$: {
    globalVisibleAreasTracker.parent = false;
    globalVisibleAreasTracker.country = false;
    globalVisibleAreasTracker.uk = false;

    chosenId4.forEach((e) => {

        globalVisibleAreasTracker[selectedAndRelatedAreas.find((el) => selectedAndRelatedAreas[e+1].areanm === el.areanm).role] = true;

    })
}

</script>


<div class="twisty-container">

    <p class="twisty-label {twistyOpen ? "twisty-label-open": ""}" on:mouseover={mouseoverEvent} on:mouseleave={mouseleaveEvent} on:click={clickEvent}><ToggleIcon {twistyOpen} {hover}></ToggleIcon>{showAreaOptions & showBaselines ? "Select comparison areas and previous time period" : showAreaOptions ? "Select areas to compare "+selectedArea.areanm+" to" : "Select comparison area and previous time period"}</p>

    {#if twistyOpen}

        {#if showBaselines}

            <div class="row-container" bind:offsetWidth={width}>

                <div class="col1">

                    <ChooseBaseline
                    bind:chosenId={chosenId1}
                    optionsArray={baselineComparisonOptions}
                    width={width/2-20}
                    name="select-baseline-area"
                    text="Comparing {selectedArea.areanm} to:"
                    ></ChooseBaseline>

                </div>

                <div class="divider"></div>

                <div class="col2">

                    <ChooseBaseline
                    bind:chosenId={chosenId2}
                    optionsArray={previousTimePeriodOptions}
                    width={width/2-20}
                    name="select-previous-time period"
                    text="Comparing most recent time period to:"
                    ></ChooseBaseline> 

                </div>

            </div>

        {/if}
        
        {#if showAreaOptions}

            <div class="row-container">

                <div class="col1">

                    <p class="checkbox-title">Parent areas:</p>

                    <Checkbox
                    optionsArray={selectedAndRelatedAreas.filter((e) => e.role != "main").map((e) => e.areanm)}
                    name="chosenComparison"
                    bind:chosenId={chosenId4}
                    spacing="5px"
                    ></Checkbox>

                </div>

                <div class="divider"></div>

                <div class="col2">

                    <p class="checkbox-title">Related areas:</p>

                    <Checkbox
                    optionsArray={["Other areas in "+selectedAndRelatedAreas.find((e) => e.role === "parent").areanm, "Statistically similar areas"]}
                    name="chosenComparison"
                    bind:chosenId={chosenId5}
                    spacing="5px"
                    ></Checkbox>

                </div>

            </div>

            <div class="divider-horizontal"></div>

            <div class="row-container">

                <MultiSelect
                bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
                ></MultiSelect>

            </div>

        {/if}

    {/if}

</div>



<style>


.twisty-container {
    margin: 10px 0px 0px 0px;
    padding: 0px;
}

.twisty-label {
    margin: 0px;
    padding: 5px 10px 10px 0px;
    display: inline-block;
    font-weight: bold;
    color: #206095;
    cursor: pointer;
    text-underline-position: under;
    transform: translateY(-1px);
    font-size: 18px;
}

.twisty-label-open {
    background-color: #fbc900;
    box-shadow: 0 -2px #fbc900, 0 4px #222;
    color: #222;
    outline: 3px solid transparent;
    outline-offset: 1px;
}

.twisty-label:hover {
    text-decoration: underline;
    color: #222;
}

.row-container {
    margin: 10px 0px 10px 0px;
    padding: 0px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    gap: 20px;
}

.col1, .col2 {
    flex: 1;
    flex-shrink: 0;
}

.divider {
    border-right-style: solid;
    border-right-color: #cbd5e1;
    border-right-width: 1px;
}

.divider-horizontal {
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
}

.checkbox-title {
    margin: 0px 0px 5px 0px;
    padding: 0px;
}

p {
    font-size: 16px;
    margin: 0px;
    padding: 0px;
}
    



</style>