<script>

import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";
import ClusterMap from "$lib/prototypeComponents/topics/mapSection/clustering/ClusterMap.svelte";
import IndicatorMap from "$lib/prototypeComponents/topics/mapSection/indicator/IndicatorMap.svelte";
import SummaryMap from "$lib/prototypeComponents/topics/mapSection/summary/SummaryMap.svelte";

import { clusterToTopicLookup } from "$lib/config";
import { toProperCase } from '$lib/utils.js'

export let topicName, indicatorsList, latestData, initialData, otherData;

let chosenId = 0;

//let optionsArray = [...Object.keys(clusterToTopicLookup).filter((e) => clusterToTopicLookup[e] === topicName).map((e) => toProperCase(e)+" cluster"),...[toProperCase(topicName)+" summary", "Map an indicator"]];

let optionsArray = [...Object.keys(clusterToTopicLookup).filter((e) => clusterToTopicLookup[e] === topicName).map((e) => toProperCase(e)+" cluster"),...["Map an indicator"]];



</script>

<Radio
asButtons={true}
name="selectMapOption"
{optionsArray}
bind:chosenId={chosenId}
></Radio>


<div class="map-container">

    {#if optionsArray[chosenId].includes(" cluster")}

        <ClusterMap
        clusterName={optionsArray[chosenId].replace(" cluster", "").toLowerCase()}
        ></ClusterMap>

    {:else}

        <IndicatorMap
        {indicatorsList}
        {latestData}
        {initialData}
        {otherData}
        ></IndicatorMap>


    {/if}










</div>


<style>


.map-container {
    margin: 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}








</style>