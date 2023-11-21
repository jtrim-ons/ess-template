<script>

import HorizontalBeeswarmNew from "./HorizontalBeeswarmNew.svelte";
import { base } from "$app/paths";
import Key from "./shared/Key.svelte";
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";
import HorizontalBeeswarmKey from "./HorizontalBeeswarmKey.svelte";

import { getContext } from 'svelte';


let beeswarmKeyData = getContext('beeswarmKeyData');

$: console.log(beeswarmKeyData)

export let trimmedIndicators, latestData, indicators, selectedAreas, siblingAreas, checkboxedRoles, selectedArea, parentArea, col1Width;

$: console.log(indicators)

let open = false;

$: areasWithData = [...new Set(latestData.map((e) => e.areacd))];

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}}))].filter((e) => areasWithData.includes(e.areacd));

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

    <div class="keyContainer">

        <HorizontalBeeswarmKey
        filteredData={beeswarmKeyData}
        {selectedAreas}
        {areasWithData}
        {plottedAreas}
        {siblingAreas}
        {selectedArea}
        ></HorizontalBeeswarmKey>

    </div>

    {#each indicators.filter((e) => e.includeAsBeeswarm === "T") as indicator, i}

        <HorizontalBeeswarmNew
        {indicator}
        filteredData={latestData.filter((e) => e.codeId === indicator.id )}
        {selectedAreas}
        {areasWithData}
        {plottedAreas}
        {siblingAreas}
        {selectedArea}
        {col1Width}
        rowNumb={i}
        ></HorizontalBeeswarmNew>

    {/each}

</div>

<img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

<style>

.keyContainer {
    width: 450px;
}

.beeswarmRowsContainer {
    border-radius: 0px 5px 5px 5px;
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