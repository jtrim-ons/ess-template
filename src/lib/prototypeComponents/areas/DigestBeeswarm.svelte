<script>

import { slide } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";
import ChooseBaselineArea from "$lib/prototypeComponents/general/selections/ChooseBaselineArea.svelte";
import Row from "$lib/prototypeComponents/areas/DigestBeeswarm/Row.svelte";
import ShareOptions from "$lib/prototypeComponents/general/share/ShareOptions.svelte";
import XAxis from "$lib/prototypeComponents/areas/DigestBeeswarm/Beeswarm/XAxis.svelte";
import HeaderRow from "$lib/prototypeComponents/areas/DigestBeeswarm/Digest/HeaderRow.svelte";
import BeeswarmKey from "$lib/prototypeComponents/areas/DigestBeeswarm/Beeswarm/BeeswarmKey.svelte";

import { getContext } from 'svelte';
import { scaleLinear } from 'd3-scale';

export let topic, topicUppercase, chosenId1, baselineComparisonOptions, chosenId2, previousTimePeriodOptions, indicators, latestData, initialData, otherData, baselineComparisonArea, visibleAreas;

let selectedArea = getContext("selectedArea");

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations");

let chosenId3 = 0;
let optionsArray3 = [topicUppercase+' digest', 'Compare '+selectedArea.areanm+' to other areas'];
$: chosenId3Generalised = optionsArray3[chosenId3].replace(topicUppercase+' ', '').replace(selectedArea.areanm+' ', '');

let containerWidth = 1000;

let col1Width = 180, col2Width = 65, col3Width = 100;

$: col4Width = containerWidth - col1Width - col2Width - col3Width - 25;

//////

let svgHeight = 120;
let svgOuterPadding = {top: 0, left: 5, right: 15, bottom: 0, spaceBeyondXScale: 40};
let scaleHeight = svgHeight - svgOuterPadding.bottom - svgOuterPadding.top;

$: scaleWidth = col3Width+col4Width-svgOuterPadding.left-svgOuterPadding.right-svgOuterPadding.spaceBeyondXScale*2;

let yDomainGlobal = [-1, 1];

$: y = scaleLinear()
    .domain(yDomainGlobal)
    .range([0, scaleHeight]);

</script>

<Radio
asButtons={true}
name="selectMapOption"
optionsArray={optionsArray3}
bind:chosenId={chosenId3}
></Radio>

<div class="digest-beeswarm-container" bind:offsetWidth={containerWidth}>

    <div class="options-and-keys-container">

        {#if chosenId3Generalised === "digest"}

            <div transition:slide={{ delay: 0, duration: 500, easing: quintOut, axis: 'y' }}>

                <ChooseBaselineArea
                bind:chosenId={chosenId1}
                optionsArray={baselineComparisonOptions}
                name="select-baseline-area"
                text="Comparing {selectedArea.areanm} to"
                dropdownWidth={chosenId1.length > 20 ? 300: chosenId1.length*20}
                ></ChooseBaselineArea>

                <ChooseBaselineArea
                bind:chosenId={chosenId2}
                optionsArray={previousTimePeriodOptions}
                name="select-previous-time period"
                text="Comparing most recent time period to"
                dropdownWidth=250
                ></ChooseBaselineArea> 

                <HeaderRow
                {col1Width}
                {col2Width}
                {col3Width}
                {col4Width}
                {baselineComparisonArea}
                ></HeaderRow>

               
            
            </div>

        {:else}

            <div transition:slide={{ delay: 0, duration: 500, easing: quintOut, axis: 'y' }}>


                <div class="row-container-key-and-axis">
                    <div class="background-styling-container" style={"grid-template-columns: [line1] "+(col1Width+col2Width)+"px [line2] "+(col3Width+col4Width)+"px [end]"}>

                        <div>

                            <BeeswarmKey
                            width={col1Width+col2Width}
                            ></BeeswarmKey>


                        </div>

                        <XAxis
                        width={col3Width+col4Width}
                        {scaleWidth}
                        outerPadding={svgOuterPadding}
                        ></XAxis>

                    </div>

                </div>

                
            
            </div>


        {/if}

    </div>

    {#each topic.subTopicsList as subTopic, topicNumb} 

        <h4 class={topicNumb === 0 & chosenId3Generalised != 'digest' ? "first-sub-topic-header" : "other-sub-topic-header"}>{subTopic[0].toUpperCase()+subTopic.substring(1)}</h4>

        <div class="sub-topic-rows-container">

            {#each indicators.filter((e) => e.subTopic === subTopic) as indicator, rowNumb}

                <Row
                {baselineComparisonArea}
                {indicator}
                {topicNumb}
                {rowNumb}
                {chosenId2}
                chosenIdGeneralised={chosenId3Generalised}
                metadata={indicatorsMetadata.find((e) => e.code === indicator.code)}
                calculations={indicatorsCalculations.find((e) => e.id === indicator.id)}
                latestData={latestData.filter((e) => e.id === indicator.id)}
                initialData={initialData.filter((e) => e.id === indicator.id)}
                otherData={otherData.filter((e) => e.id === indicator.id)}
                {col1Width}
                {col2Width}
                {col3Width}
                {col4Width}
                {visibleAreas}
                {svgHeight}
                {svgOuterPadding}
                {scaleHeight}
                {scaleWidth}
                bind:yDomainGlobal={yDomainGlobal}
                {y}
                ></Row>

            {/each}

        </div>


    {/each}

    <ShareOptions
    ></ShareOptions>
 





</div>






<style>

.row-container-key-and-axis {
    margin: 0px;
    padding: 10px 0px 5px 0px;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
}

.background-styling-container {
    display: grid;
    padding: 0px;
    margin: 0px;
    background-color: #f7f7f7;
    border-radius: 0px 0px 5px 5px;
    border-style: solid;
    border-color: #cbd5e1;
    border-width: 1px;
}


.first-sub-topic-header {
    padding: 0px;
    margin: 20px 0px 0px 5px;
}

.other-sub-topic-header {
    padding: 0px;
    margin: 40px 0px 0px 5px;
}

.options-and-keys-container {
    margin: 0px;
}

.digest-beeswarm-container {
    margin: 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(128,128,128);
}

.sub-topic-rows-container {
    margin: 10px 0px 30px 0px;
    padding: 0px;
    border-bottom-style: solid;
    border-bottom-color: #cbd5e1;
    border-bottom-width: 1px;
}




    
</style>