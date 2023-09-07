<script>

import { base } from "$app/paths";
import { goto } from "$app/navigation";

import { getContext } from 'svelte';
import SelectTopic from "$lib/ui/SelectTopic.svelte";
import Content from "$lib/layout/Content.svelte";
import Cards from "$lib/layout/Cards.svelte";
import CardTopic from "$lib/layout/partial/CardTopic.svelte";
import Spacer from "$lib/layout/Spacer.svelte";

let topics = getContext('topics');
let indicators = getContext('indicators');

console.log(topics);

function doSelect(e) {
    goto(`${base}/indicators/${e.detail.code}`);
}


</script>

<Content>
    <!-- <div class="select-container">
        <SelectTopic mode="search" placeholder="Find an indicator" items={indicators} on:select={doSelect}/>
    </div> -->
    <Cards rowgap="12" colgap="32">
        {#each [...new Set(topics.map((e) => e.name))] as topic}
        <CardTopic title={topic[0].toUpperCase()+topic.substring(1)} description={"Description of topic"} href="{base}/indicators/{topic}" blank/>
        {/each}
    </Cards>
    <Spacer/>
</Content>