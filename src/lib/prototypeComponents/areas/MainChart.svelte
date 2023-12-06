<script>

import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";
import ShareOptions from "$lib/prototypeComponents/general/share/ShareOptions.svelte";
import IndicatorMap from "$lib/prototypeComponents/topics/mapSection/indicator/IndicatorMap.svelte";
import LineChart from "$lib/prototypeComponents/areas/MainChart/LineChart.svelte";

export let indicators, visibleAreas, globalVisibleAreasTracker;
export let baselineComparisonArea;
export let chosenId1, chosenId2, chosenId4, chosenId5, chosenId6;
export let combinedData;

let optionsArray = ["Line chart", "Map"];
$: chosenChart = 0;

let width = 1000;

</script>

<div style="margin-top: 120px;">

    <Radio
    name="select-row-view"
    optionsArray={optionsArray}
    bind:chosenId={chosenChart}
    width={width}
    ></Radio>

    <div class="main-chart-line-outer-container">

        {#if chosenChart === 0}

        <LineChart
        {combinedData}
        {visibleAreas}
        {indicators}
        bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
        {baselineComparisonArea}
        bind:chosenId1={chosenId1}
        bind:chosenId2={chosenId2}
        bind:chosenId4={chosenId4}
        bind:chosenId5={chosenId5}
        bind:chosenId6={chosenId6}
        ></LineChart>

        {:else}

        <IndicatorMap
        indicatorsList={indicators.map((e) => e.id)}
        {combinedData}
        ></IndicatorMap>



        {/if}



        

    
        <ShareOptions
        ></ShareOptions>

    </div>

</div>













<style>

.main-chart-line-outer-container {
    margin: 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(128,128,128);
}






</style>