<script>

import { base } from "$app/paths";

import Content from "$lib/layout/Content.svelte";
import Cards from "$lib/layout/Cards.svelte";
import CardTopic from "$lib/layout/partial/CardTopic.svelte";
import Spacer from "$lib/layout/Spacer.svelte";

export let data, colwidth = "medium";

</script>

<Content>
    <Cards rowgap="12" colgap="32" {colwidth}>
        {#each data as topic}
        <CardTopic title={topic} description={"Description of topic"} href="{base}/indicators/{topic}" blank/>
        {/each}
    </Cards>
    <Spacer/>
</Content>