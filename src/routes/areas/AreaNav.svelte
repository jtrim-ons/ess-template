<script>
    import { base } from "$app/paths";
    import { getContext } from "svelte";
    import { countries, regions } from "$lib/config";
    import Twisty from "$lib/ui/Twisty.svelte";
    import Content from "$lib/layout/Content.svelte";
    import Cards from "$lib/layout/Cards.svelte";
    import Card from "$lib/layout/partial/Card.svelte";
    import SelectArea from "$lib/ui/SelectArea.svelte";
    import Spacer from "$lib/layout/Spacer.svelte";

    export let open = false;

    const places = getContext("places");
    const parents = [...regions, ...countries.slice(1)];

    function doSelect(e) {
        goto(`${base}/areas/${e.detail.areacd}`);
    }
</script>

<Content>
    <div class="select-container">
        <SelectArea mode="search" placeholder="Find an area name or postcode" on:select={doSelect} autoClear/>
    </div>
    <Twisty label="Browse areas" {open}>
        <Cards colwidth="narrow">
            {#each parents as parent}
            <Card blank>
                <a href="{base}/areas/{parent.code}" class="parent-link">{parent.name}</a>
                {#each places.filter(p => p.parentcd === parent.code) as place}
                <a href="{base}/areas/{place.areacd}">{place.areanm}</a><br/>
                {/each}
            </Card>
            {/each}
        </Cards>
    </Twisty>
    <Spacer/>
</Content>