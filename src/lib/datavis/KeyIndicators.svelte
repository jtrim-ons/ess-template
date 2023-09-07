<script>

import Panel from "./keyIndicators/Panel.svelte";

export let areaKeyIndicators, latestData, trimmedIndicators, initialData, selectedAreas;

</script>

<section title="Key indicators">
    <h1>Key indicators</h1>

    <div class="rowsContainer">

        {#each areaKeyIndicators as ind}

            <Panel
            indicator={trimmedIndicators.find((e) => e.id === ind.id)}
            latestData={latestData.filter((e)=> e.codeId === ind.id)}
            initialData={initialData[ind.code]}
            {selectedAreas}
            ></Panel>

        {/each}
    </div>
</section>