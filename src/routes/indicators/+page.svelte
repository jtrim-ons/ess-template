<script>

import { base } from "$app/paths";

import { Breadcrumb, Titleblock } from "@onsvisual/svelte-components";
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

<Breadcrumb links={[{label: "Home", href: "/"}, {label: "Explore subnational statistics", href: `${base}/`}, {label: "Expore topics"}]} background="#eaeaea"/>
<Titleblock title="Explore topics" background="#eaeaea">
    <Subhead>Discover national and regional trends with maps, charts and headline indicators</Subhead>
</Titleblock>

<TopicNav 
title="Select a topic"
data={topicsList}
open/>

<TopicNav 
title="Select an indicator"
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