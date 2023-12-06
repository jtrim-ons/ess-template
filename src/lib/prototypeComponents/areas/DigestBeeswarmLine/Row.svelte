<script>

import BeeswarmRow from '$lib/prototypeComponents/areas/DigestBeeswarmLine/Beeswarm/BeeswarmRow.svelte';
import LineChart from '$lib/prototypeComponents/areas/DigestBeeswarmLine/LineChart/LineChart.svelte';
import InfoButton from '$lib/prototypeComponents/general/info/InfoButton.svelte';

import LineChartRotated from '$lib/prototypeComponents/areas/DigestBeeswarmLine/LineChart/LineChartRotated.svelte';

import { onMount } from "svelte";

export let rowNumb, topicNumb;
export let indicator;
export let metadata, calculations;
export let col1Width, col2Width, col3Width, col4Width;
export let chosenId2;
export let chosenId3;
export let visibleAreas;
export let baselineComparisonArea;
export let scaleHeight, scaleWidthArea, scaleWidthTime;
export let xDomain, x, yDomainGlobal, y;
export let hoverIndex, hoverChartIndex;
export let chosenId11;
export let chosenId6;


let mounted = false;

onMount(() => {
		mounted = true;
});

let chosenIdX = 0;


</script>

<div class="row-container" style="background-color: {rowNumb % 2 === 0 ? "#fafafa" : "#ffffff"}">

    <div class="row-content-container" style="grid-template-columns: [line1] {col1Width}px [line2] {col2Width}px [line3] {col3Width}px [line4] {col4Width}px [end]">

        {#if mounted}
    
        <div class="col1">
            <p class="indicator-label"><a href="https://www.ons.gov.uk/">{chosenId11.includes(5) ? metadata.originalTitle : indicator.label}</a><InfoButton></InfoButton></p>

            {#if chosenId11.includes(5) }

            <p class="indicator-detail">{metadata.originalSubtitle}</p>

            {:else}

            <p class="indicator-detail">{metadata.subtitle}{chosenId3 === 1 ? " in "+calculations.maxXDomain : ""}</p>


            {/if}
        </div>

        <div class="col2">

            {#if chosenId3 != 2}

                <BeeswarmRow
                {indicator}
                {rowNumb} {topicNumb}
                {metadata} {calculations}
                {col2Width}
                {chosenId3}
                {baselineComparisonArea}
                {visibleAreas}
                {scaleHeight} scaleWidth={scaleWidthArea}
                {x} {xDomain} bind:yDomainGlobal={yDomainGlobal} {y}
                bind:hoverIndex={hoverIndex} bind:hoverChartIndex={hoverChartIndex}
                {chosenId11}
                {chosenId6}
                ></BeeswarmRow>

            {/if}

        </div>

        <div class="col3"></div>

        <div class="col4">

            {#if chosenId3 != 1}

                {#if chosenId11.includes(4)}

                    <LineChartRotated
                    {indicator}
                    {rowNumb} {topicNumb}
                    {metadata} {calculations}
                    {col4Width}
                    {chosenId2}
                    {chosenId3}
                    {baselineComparisonArea}
                    {visibleAreas}
                    {scaleHeight} scaleWidth={scaleWidthTime}
                    {x} {xDomain}
                    {chosenId11}
                    {chosenId6}
                    ></LineChartRotated>

                {:else}

                <LineChart
                {indicator}
                {rowNumb} {topicNumb}
                {metadata} {calculations}
                {col4Width}
                {chosenId2}
                {chosenId3}
                {baselineComparisonArea}
                {visibleAreas}
                {scaleHeight} scaleWidth={scaleWidthTime}
                {x} {xDomain}
                {chosenId11}
                {chosenId6}
                ></LineChart>

                {/if}

                <!-- <LineChart
                {rowNumb}
                {topicNumb}

                {latestData}
                {otherData}
                {initialData}

                {metadata}

                {col4Width}

                {chosenId3}

                {visibleAreas}
                {globalVisibleAreasTracker}

                {chosenId1}
                {baselineComparisonArea}

                {scaleHeight}
                scaleWidth={scaleWidthTime}

                {x}
                {xDomain}

                {mainLatestValue}
                {mainPreviousValue}

                {medianValue}
                {medianAbsoluteDeviation} 

                {latestTimePeriod}
                {previousTimePeriod}
                ></LineChart> -->

            {/if}

        </div>

        {/if}

    </div>

</div>


<style>


.row-container {
    margin: 0px;
    padding: 0px;
}

.row-content-container {
    margin: 0px;
    padding: 20px 0px 20px 0px;
    display: grid;
}

.col1 {
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
}

.col1 p {
    margin: 0px;
    padding: 0px 15px 0px 0px;
}

.indicator-label {
    font-size: 18px;
    line-height: 24px;
    text-wrap: balance;
}

.indicator-detail {
    font-size: 16px;
    line-height: 18px;
}

.col2, .col4 {
    margin: auto 0px;
}


</style>