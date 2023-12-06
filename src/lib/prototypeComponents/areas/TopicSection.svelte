<script>

import TopicIntroText from "$lib/prototypeComponents/areas/roboText/TopicIntroText.svelte";
import DigestBeeswarmLine from "$lib/prototypeComponents/areas/DigestBeeswarmLine.svelte";
import MainChart from "$lib/prototypeComponents/areas/MainChart.svelte";


import { getContext } from 'svelte';

export let topic;
export let visibleAreas, globalVisibleAreasTracker;
export let chosenId1, baselineComparisonArea;
export let chosenId2;
export let chosenId4, chosenId5;
export let chosenId11;
export let chosenId6;
export let combinedData

let indicators = getContext("indicators").filter((e) => e.topic === topic.name)

let topicUppercase = topic.name[0].toUpperCase()+topic.name.substring(1);

</script>

<section title={topicUppercase}>

    <h1><a href="https://www.ons.gov.uk/">{topicUppercase}</a></h1>

    <!-- <TopicIntroText
    {topic}
    ></TopicIntroText> -->

    <DigestBeeswarmLine
    {topic}
    {indicators}
    {visibleAreas} bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
    bind:chosenId1={chosenId1} {baselineComparisonArea}
    bind:chosenId2={chosenId2}
    bind:chosenId4={chosenId4} bind:chosenId5={chosenId5}
    {chosenId11}
    bind:chosenId6={chosenId6}
    ></DigestBeeswarmLine>

    <MainChart
    {indicators}
    {visibleAreas} bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
    {baselineComparisonArea}
    bind:chosenId1={chosenId1}
    bind:chosenId2={chosenId2}
    bind:chosenId4={chosenId4}
    bind:chosenId5={chosenId5}
    bind:chosenId6={chosenId6}
    {combinedData}
    ></MainChart>

</section>





<style>


section {
    margin-bottom: 100px;
}

h1 {
    padding: 0px 0px 40px 10px;
    margin: 0px
}




</style>