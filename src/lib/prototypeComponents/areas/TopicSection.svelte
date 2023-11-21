<script>

import TopicIntroText from "$lib/prototypeComponents/areas/roboText/TopicIntroText.svelte";
import DigestBeeswarm from "$lib/prototypeComponents/areas/DigestBeeswarm.svelte";

import { getContext } from 'svelte';

export let topic, latestData, otherData, initialData, visibleAreas, globalVisibleAreasTracker, chosenId1, baselineComparisonOptions, chosenId2, previousTimePeriodOptions, baselineComparisonArea;

let indicators = getContext("indicators").filter((e) => e.topic === topic.name)

let topicUppercase = topic.name[0].toUpperCase()+topic.name.substring(1);


</script>

<section title={topicUppercase}>

    <h1><a href="https://www.ons.gov.uk/">{topicUppercase}</a></h1>

    <TopicIntroText
    {topic}
    ></TopicIntroText>

    <DigestBeeswarm
    {baselineComparisonArea}
    {topic}
    {topicUppercase}
    bind:chosenId1={chosenId1}
    {baselineComparisonOptions}
    bind:chosenId2={chosenId2}
    {previousTimePeriodOptions}
    {indicators}
    {latestData}
    {initialData}
    {otherData}
    {visibleAreas}
    ></DigestBeeswarm>

    
    <!-- <Radio
    asButtons={true}
    name="selectMapOption"
    {optionsArray}
    bind:chosenId={chosenId}
    ></Radio>

    <div class="info-rows-container">

    {#if chosenId == 0}

        <KeyFigures
        indicators={indicatorsList}
        latestData={latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd)}
        initialData={initialData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd)}
        {selectedAreas}
        ></KeyFigures>


    {:else}

        <ListOfBeeswarms
        {selectedAreas}
        {latestData}
        {indicatorsList}
        {areasSameGeog}
        bind:checkboxedRoles={checkboxedRoles}
        ></ListOfBeeswarms>


    {/if} -->






</section>





<style>


section {
    margin-bottom: 100px;
}




</style>