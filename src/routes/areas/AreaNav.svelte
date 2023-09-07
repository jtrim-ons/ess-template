<script>
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import { getContext } from "svelte";
    import { countries, regions } from "$lib/config";
    import Content from "$lib/layout/Content.svelte";
    import Cards from "$lib/layout/Cards.svelte";
    import Card from "$lib/layout/partial/Card.svelte";
    import SelectArea from "$lib/ui/SelectArea.svelte";
    import Spacer from "$lib/layout/Spacer.svelte";

    const areas = getContext("areas");
    const areasParentsLookup = getContext("areasParentsLookup");

    const parents = [...regions, ...countries.slice(1)];

    function doSelect(e) {
        goto(`${base}/areas/${e.detail.areacd}`);
    }
</script>

<Content>
    <div class="select-container">
        <SelectArea items={areas} mode="search" placeholder="Find an area name or postcode" on:select={doSelect} autoClear/>
    </div>
    <div class="cardsContainer">
    <Cards colwidth="narrow">
        {#each parents as parent}
        <Card blank>
            <a href="{base}/areas/{parent.code}" class="parent-link">{parent.name}</a>
            {#each areas.filter((e) => areasParentsLookup.find((el) => e.areacd == el.areacd).parentcd === parent.code) as area}
            <a href="{base}/areas/{area.areacd}">{area.areanm}</a><br/>
            {/each}
        </Card>
        {/each}
    </Cards>
    </div>
    <Spacer/>
</Content>

<style>

.cardsContainer {
    margin-top: 40px;
}



</style>