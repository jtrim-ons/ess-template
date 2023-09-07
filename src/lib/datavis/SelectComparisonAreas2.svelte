<script>

import { selectedArea, comparisonAreasArray} from "$lib/selectedAreasStore.js";
import Selections from "./SelectComparisonComponents/Selections.svelte";
import Twisty from "$lib/ui/Twisty.svelte";

export let areas, open = false, areasWithData;

$: comparisonAreaOptionsArray = [...(areasWithData.includes($selectedArea.countrycd) & $selectedArea.parentcd !== $selectedArea.countrycd ? ["country"] : []), 
                            ...(areasWithData.includes("K02000001") & $selectedArea.areacd !== "K02000001" & $selectedArea.parentcd != "K02000001" ? ["uk"] : []),
                            ...($selectedArea.similar !== null ? ["similar"] : []),
                            ...(areasWithData.includes($selectedArea.parentcd) & $selectedArea.parentcd !== null ? ["parent"] : []),
                            ...($selectedArea.parentcd !== null ? ["neighbour"] : [])
];

let selected = [];

let areaTypePlural = $selectedArea.parentcd === "K02000001" ? "countries" : $selectedArea.parentcd === "E92000001" ? "regions" : "local authorities";

$: checkboxArray = [
    {id: "parent", text: areas.find((p) => $selectedArea.parentcd === p.areacd)["areanm"]},
    {id: "country", text: {E: "England", N: "Northern Ireland", S: "Scotland", W: "Wales"}[$selectedArea.areacd.slice(0, 1)]},
    {id: "uk", text: "United Kingdom"},
    {id: "neighbour", text: "Other "+areaTypePlural+" in "+areas.find(p => $selectedArea.parentcd=== p.areacd)["areanm"]},
    {id: "similar", text: "Statistically similar local authorities"}
];

</script>

<div class={"twisty-container"}>

<Twisty label={"Select areas to compare "+($selectedArea.areanm)+" to"} {open}>

<div class="comparisonInputContainer">

    {#each checkboxArray as input, i}

        {#if comparisonAreaOptionsArray.includes(input.id)}

            <label>
                <input type="checkbox" bind:checked={$comparisonAreasArray[i]} />{input.text}
            </label>

        {/if}

    {/each}

    <Selections
    areas={areas.filter((e) => areasWithData.includes(e.areacd) )}></Selections>

</div>


</Twisty>

</div>

<style>

.twisty-container {
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 10px;
    margin-bottom: 15px;

}

.comparisonInputContainer :global() {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
    background-color:#F5F5F6;
    border-radius: 10px;
    margin-top: 0px;
    padding-top: 10px;
    padding-bottom: 10px;

}

p {
    padding-left: 15px;
    cursor: pointer;
}

p:hover {
    
}

label {
    padding-left: 20px;
    padding-top: 10px;
    font-size: 18px;
    cursor: pointer;


}

input[type="checkbox"] 
{ 
    margin-right: 10px; 
    transform: scale(1.2);
    cursor: pointer;
}



</style>
