<script>

import Row from "$lib/prototypeComponents/topics/keyIndicators/options/dotPlot/Row.svelte";
import HeadersRow from "$lib/prototypeComponents/topics/keyIndicators/options/dotPlot/HeadersRow.svelte";
import { getContext } from 'svelte';

export let indicatorsList, latestData, initialData, selectedAreas, chosenId1, chosenId2, chosenId3, chosenId0;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations").filter((e) => indicatorsList.includes(e.id));

$: maxChangeArray = new Array(indicatorsCalculations.length);
$: maxValueFromMedianArray = new Array(indicatorsCalculations.length);

$: {
    
    indicatorsCalculations.forEach((e,i) => {

        e.medianValue = e.ltCount > 200 ? e.ltMedian : e.utCount > 140 ? e.utMedian : e.ukValue != 'NA' ? e.ukValue : e.gbValue != 'NA' ? e.gbValue : e.ewValue != 'NA' ? e.ewValue : e.engValue != 'NA' ? e.engValue : null;

        let absoluteOrPercent = indicatorsMetadata.find((el) => el.code == e.code).absoluteOrPercent;

        maxValueFromMedianArray[i] = chosenId0 == 0 ? Math.max(e.medianValue - e.minValue, e.maxValue - e.medianValue) / (absoluteOrPercent == "A" ? 1 : e.medianValue) : Math.max(...selectedAreas.map((el) => el.areacd).map((el) => latestData.find((elm) => elm.areacd == el & elm.id == e.id)).filter((el) => el != null).map((el) => Math.abs(el.value - e.medianValue)));
        
        maxChangeArray[i] = chosenId0 == 0 ? (absoluteOrPercent == "A" ? e.maxAbsoluteChange : e.maxPercentageChange) : "indicator-"+e.id in initialData ? Math.max(...selectedAreas.map((el) => el.areacd).map((el) => [latestData.find((elm) => elm.areacd == el & elm.id == e.id), initialData["indicator-"+e.id].find((elm) => elm.areacd == el)]).filter((el) => el[0] != null & el[1] != null).map((el) => Math.abs(el[0].value - el[1].value))) : null;

        e.label = indicatorsMetadata.find((el) => el.code == e.code).label;
    })

}

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
        {maxChangeArray}
        {maxValueFromMedianArray}
        ></Row>

    {/each}

</div>

<style>


.grid-container {
    display: flex;
    flex-direction: column;
}


</style>