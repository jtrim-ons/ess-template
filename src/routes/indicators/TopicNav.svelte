<script>

import { base } from "$app/paths";

import { Grid, Cards } from "@onsvisual/svelte-components";
import CardTopic from "$lib/layout/partial/CardTopic.svelte";

export let data, colwidth = "medium", title = null;

</script>

<Cards {title} {colwidth} marginTop>
    {#each data as topic}
        <CardTopic title={topic} description={"Description of topic"} href="{base}/indicators/{topic}" blank/>
    {/each}
</Cards>