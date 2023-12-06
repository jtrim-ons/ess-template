<script>

import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";
import Row from "$lib/prototypeComponents/areas/DigestBeeswarmLine/Row.svelte";
import ShareOptions from "$lib/prototypeComponents/general/share/ShareOptions.svelte";
import StickyKey from "$lib/prototypeComponents/general/StickyKey.svelte";

import { medianAbsoluteDeviationLimit, rowSvgHeight, rowSvgOuterPadding } from '$lib/config';
import { getContext } from "svelte";
import { scaleLinear } from 'd3-scale';

export let topic;
export let indicators;
export let visibleAreas, globalVisibleAreasTracker;
export let chosenId1, baselineComparisonArea;
export let chosenId2;
export let chosenId4, chosenId5;
export let chosenId11;
export let chosenId6;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations");

//// Choose view options
let selectedArea = getContext("selectedArea");

let chosenId3 = 0;
//let optionsArray3 = [topicUppercase+' digest', 'Compare '+selectedArea.areanm+' to other areas', 'Compare '+selectedArea.areanm+' over time'];
let optionsArray3 = ["Summary", "Compared to other areas", "Change over time"];

//// Set widths for columns of each row

let width = 1000;
let col1Width = 240;
$: col3Width = chosenId3 === 0 ? 20 : 0;
$: col2Width = chosenId3 === 0 ? (width - col1Width - col3Width-5)/2 : chosenId3 === 1 ? width - col1Width - col3Width : 0;
$: col4Width = chosenId3 === 0 ? (width - col1Width - col3Width-5)/2 : chosenId3 === 1 ? 0 : width - col1Width - col3Width;

//// Define graph parameters

$: scaleHeight = rowSvgHeight[chosenId3 === 0 ? "split" : "full"] - rowSvgOuterPadding.bottom[chosenId3 === 0 ? "split" : "full"] - rowSvgOuterPadding.top[chosenId3 === 0 ? "split" : "full"];
$: scaleWidthArea = col2Width - rowSvgOuterPadding.left[chosenId3 === 0 ? "split" : "full"] - rowSvgOuterPadding.right[chosenId3 === 0 ? "split" : "full"] - rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]*2;
$: scaleWidthTime = col4Width - rowSvgOuterPadding.left[chosenId3 === 0 ? "split" : "full"] - rowSvgOuterPadding.right[chosenId3 === 0 ? "split" : "full"] - rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]*2;

let xDomain = [-medianAbsoluteDeviationLimit, medianAbsoluteDeviationLimit];

$: x = scaleLinear()
    .domain(xDomain)
    .range([0, scaleWidthArea]);

let yDomainGlobal = [-1, 1];

$: y = scaleLinear()
    .domain(yDomainGlobal)
    .range([0, scaleHeight]);

//// define interactivity trackers
let hoverIndex = null;
let hoverChartIndex = null;

</script>

<Radio
name="select-row-view"
optionsArray={optionsArray3}
bind:chosenId={chosenId3}
width={width}
></Radio>

<div class="digest-beeswarm-line-outer-container">

    <div class="digest-beeswarm-line-inner-container" bind:offsetWidth={width}>

        <div class="key-and-rows-container">

            <StickyKey
            {baselineComparisonArea}
            {chosenId3}
            {visibleAreas}

            bind:chosenId1={chosenId1}
            bind:chosenId2={chosenId2}
            bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
            showAreaOptions={chosenId3 != 0 ? true : false}
            showBaselines={chosenId3 != 1 ? true : false}
            bind:chosenId4={chosenId4} bind:chosenId5={chosenId5}
            bind:chosenId6={chosenId6}
            ></StickyKey>

            {#each topic.subTopicsList as subTopic, topicNumb} 

                <div class="sub-topic-container">

                    <h4 class="sub-topic-header">{subTopic[0].toUpperCase()+subTopic.substring(1)}</h4>

                    <div class="sub-topic-rows-container">

                        {#each indicators.filter((e) => e.subTopic === subTopic) as indicator, rowNumb}

                            <div class="divider"></div>

                            <Row
                            {rowNumb} {topicNumb}
                            {indicator}
                            metadata={indicatorsMetadata.find((e) => e.code === indicator.code)} calculations={indicatorsCalculations.find((e) => e.id === indicator.id)}
                            {col1Width} {col2Width} {col3Width} {col4Width}
                            {chosenId2}
                            {chosenId3}
                            {visibleAreas} 
                            {baselineComparisonArea}
                            {scaleHeight} {scaleWidthArea} {scaleWidthTime}
                            {xDomain} {x} bind:yDomainGlobal={yDomainGlobal} {y}
                            bind:hoverIndex={hoverIndex} bind:hoverChartIndex={hoverChartIndex}
                            {chosenId11}
                            {chosenId6}
                            ></Row>   

                        {/each}

                    </div>

                    <div class="divider"></div>

                </div>

            {/each}

        </div>

        <ShareOptions
        ></ShareOptions>

    </div>

</div>



<style>

.digest-beeswarm-line-outer-container {
    margin: 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(128,128,128);
}

.digest-beeswarm-line-inner-container {
    margin: 0px;
    padding: 0px;
}

.sub-topic-container {
    padding: 0px;
    margin: 40px 0px 0px 0px;
}

.sub-topic-header {
    padding: 0px;
    margin: 0px;
}

.sub-topic-rows-container {
    margin: 5px 0px 5px 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
}

.divider {
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
}
    
</style>