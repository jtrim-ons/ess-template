<script>

import Dropdown from "$lib/prototypeComponents/general/selections/Dropdown.svelte";
import Map from "$lib/prototypeComponents/general/mapping/Map.svelte";
import { getContext } from 'svelte';
import Legend from "./Legend.svelte";

export let indicatorsList, combinedData;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicators = getContext("indicators").filter((e) => indicatorsList.includes(e.id));
let indicatorsCalculations = getContext("indicatorsCalculations").filter((e) => indicatorsList.includes(e.id));

let periodsLookup = getContext("periodsLookup");

let areasGeogLevel = getContext("areasGeogLevel");
let areasForPlotting = areasGeogLevel.filter((e) => ["both", "lower"].includes(e.level)).map((e) => e.areacd);

let optionsArray1 = indicators.map((e) => e.label)
$: chosenId1 = optionsArray1[0];

$: selectedIndicatorId = indicators.find((e) => e.label == chosenId1).id;

$: metadata = indicatorsMetadata.find((e) => e.label === chosenId1);
//$: calculations 

$: calculations = indicatorsCalculations.find((e) => e.code == metadata.code);

$: filteredData = combinedData.filter((e) => areasForPlotting.includes(e.areacd) & e.xDomainNumb == calculations.maxXDomain & e.id == calculations.id);

//$: optionsArray2 = [...new Set(combinedData.map((e) => e.xDomainNumb))].sort((a,b) => b - a).map((e) => periodsLookup.find((el) => el.xDomainNumb == e).label);
//$: chosenId2 = periodsLookup.find((e) => e.xDomainNumb == indicatorsCalculations.find((el) => el.id == selectedIndicatorId).maxXDomain).label;

$: console.log(filteredData)
//$: filteredData = chosenId2 != null ? combinedData.filter((e) => areasForPlotting.includes(e.areacd) & e.xDomainNumb === periodsLookup.find((el) => el.label == chosenId2).xDomainNumb) : null;

let breaks = [];

</script>


<div class="legend-and-map-container">

    <div class="legend-container">

        <div class="title-container">

            <div class="dropdown-container">

                <Dropdown
                name={"select-indicator-dropdown"}
                bind:chosenId={chosenId1}
                optionsArray={optionsArray1}
                width="300px"
                ></Dropdown>

            </div>

        </div>

        <div class="subtitle-container">

            <p>{metadata.subtitle+" in"}

                 {calculations.maxXDomain}

            </p>

        </div>

        <div class="map-scale-container">

            <Legend
            {breaks}
            {metadata}
            ></Legend>

        </div>

    </div>

    {#if filteredData}

        <Map
        data={filteredData}
        idKey="areacd"
        valueKey="value"
        mapRange="uk"
        useBreaks={true}
        bind:breaks={breaks}
        polarity={metadata.polarity}
        ></Map>

    {/if}

</div>



<style>


.legend-and-map-container {
    display: flex;
    flex-direction: row;
}

.legend-container {
    width: 50%;
    padding: 0px 10px 0px 0px;
}

.title-container {
    display: flex;
    flex-wrap: wrap;
}



.dropdown-container {
    margin: 0px;
    padding: 0px 5px 0px 5px;
    display: inline-block;
}

.subtitle-container {
    margin: 15px 0px 2px 0px;
    padding: 10px 0px 10px 0px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-bottom-style: solid;
    border-bottom-color: #cbd5e1;
    border-bottom-width: 1px;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
    
}

.subtitle-container p {
    margin: 0px;
    padding: 0px 5px 0px 5px;
    line-height: 22px;
}

.map-scale-container {
    margin: 10px 0px 0px 0px;
    padding: 0px; 
    background-color:#F5F5F6;
    border-radius: 10px;

}






</style>