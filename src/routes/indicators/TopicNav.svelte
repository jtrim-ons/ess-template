<script>
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import { indicators } from "$lib/config";

    import SelectTopic from "$lib/ui/SelectTopic.svelte";
    import Twisty from "$lib/ui/Twisty.svelte";
    import Content from "$lib/layout/Content.svelte";
    import Cards from "$lib/layout/Cards.svelte";
    import CardTopic from "$lib/layout/partial/CardTopic.svelte";
    import Spacer from "$lib/layout/Spacer.svelte";

    export let open = false;

    function doSelect(e) {
        goto(`${base}/indicators/${e.detail.code}`);
    }
</script>

<Content>
    <div class="select-container">
        <SelectTopic mode="search" placeholder="Find an indicator" items={indicators} on:select={doSelect}/>
    </div>
    <Twisty label="Browse indicators" {open}>
        <Cards rowgap="12" colgap="32">
            {#each indicators as indicator}
            <CardTopic title={indicator.label} description={indicator.description} href="{base}/indicators/{indicator.code}" blank/>
            {/each}
        </Cards>
    </Twisty>
    <Spacer/>
</Content>