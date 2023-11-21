<script>
import { base } from "$app/paths";

import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import KeyIndicators from "$lib/prototypeComponents/topics/keyIndicators/KeyIndicators.svelte";
import Placeholder from "$lib/layout/Placeholder.svelte";
import MapSection from "$lib/prototypeComponents/topics/mapSection/MapSection.svelte";
import GroupedBeeswarms from "$lib/prototypeComponents/topics/groupedBeewarms/GroupedBeeswarms.svelte";

import { toProperCase } from '$lib/utils.js'

export let data;

let topicName = data.topic;
let keyIndicatorsArray = data.indicatorsList.slice(0, Math.min(5, data.indicatorsList.length));

let latestData = data.latestData.filter((e) => data.indicatorsList.includes(e.id));

$: checkboxedRoles = {parent: false, country: false, uk: false, neighbour: false, cluster: false, custom: null};

</script>


<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore indicators", url: `${base}/indicators`}, {label: "topic"}]}>
    <Headline>{toProperCase(topicName)}</Headline>
    <Subhead>{"Topic information"}</Subhead>
</Titleblock>

<SectionsWithNav contentsLabel="Explore this indicator">

    <section title="Key indicators">

        <h1>Key indicators</h1>

        <KeyIndicators
        indicatorsList={keyIndicatorsArray}
        {latestData}
        initialData={data.preloadedData.initialData}
        otherData={data.preloadedData.otherData}
        bind:checkboxedRoles={checkboxedRoles}
        ></KeyIndicators>

    </section>

    <section title="Explore geographically">

        <h1>Explore geographically</h1>

        <MapSection
        indicatorsList={data.indicatorsList}
        {topicName}
        {latestData}
        initialData={data.preloadedData.initialData}
        otherData={data.preloadedData.otherData}
        ></MapSection>

    </section>

    <!-- <section title="Top and bottom ranked areas">

        <h1>Top and bottom ranked areas</h1>

    </section> -->

    <section title="Compare areas by group">

        <h1>Compare areas by group</h1>

        <GroupedBeeswarms
        {topicName}
        {latestData}
        indicatorsList={data.indicatorsList}
        bind:checkboxedRoles={checkboxedRoles}
        ></GroupedBeeswarms>

    </section>

    <section title="Related publications">

        <Placeholder>Find related publications</Placeholder>

    </section>

    <section title="Get the data">

        <h2 class="ons-u-mt-xl">Get the data</h2>
        <p>Here, you can find information and links to the data.</p>

    </section>
    




   
    
</SectionsWithNav>



<style>

section {
    margin-bottom: 80px;
}


</style>