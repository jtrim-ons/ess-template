<script>

import { base } from "$app/paths";

import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import TopicNav from "./TopicNav.svelte";
import Content from "$lib/layout/Content.svelte";

import { toProperCase } from '$lib/utils.js'
import { getContext } from 'svelte';

let indicators = getContext("indicators");
let indicatorsMetadata = getContext("indicatorsMetadata");

console.log(indicatorsMetadata)

let topicsList = [...new Set(indicators.map((e) => toProperCase(e.topic)))].sort();
let indicatorsList = indicators.map((e) => indicatorsMetadata.find((el) => el.code == e.code).label).sort();;

</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore topics"}]}>
    <Headline>Explore topics</Headline>
    <Subhead>Discover national and regional trends with maps, charts and headline indicators</Subhead>
</Titleblock>

<Content>
    <h2>Select a topic</h2>
</Content>
<TopicNav 
data={topicsList}
open/>


<Content>
    <h2>Select an indicator</h2>
</Content>
<TopicNav 
data={indicatorsList}
open
colwidth="full"/>


<style>

h2 {
    margin-top:20px;
    margin-bottom: 0px;
    padding-bottom: 0px;
}


</style>