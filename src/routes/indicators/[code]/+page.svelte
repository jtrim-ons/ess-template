<script>
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { indicators } from "$lib/config";

    import Titleblock from "$lib/layout/Titleblock.svelte";
    import Headline from "$lib/layout/partial/Headline.svelte";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
    import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
    import TopicNav from "../TopicNav.svelte";
    import Placeholder from "$lib/layout/Placeholder.svelte";
    import LineChart from "$lib/datavis/LineChart.svelte";
    import DoubleBeeswarmChart from "$lib/datavis/DoubleBeeswarmChart.svelte";
    import SelectComparisonAreas from "$lib/layout/SelectComparisonAreas.svelte";

    export let data;

    console.log(data);

</script>

{#if data.indicator}
<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore indicators", url: `${base}/indicators`}, {label: data.indicator.label}]}>
    <Headline>{data.indicator.label}</Headline>
    <Subhead>{data.indicator.description}</Subhead>
</Titleblock>
<TopicNav/>
<SectionsWithNav contentsLabel="Explore this indicator">
    <section title="Overview">
        <!-- <Placeholder>The population density of England in 2020 was {Math.round(data.data.E92000001[2020])} people per square kilometer, which is {data.data.E92000001[2020] > data.data.S92000003[2020] ? "higher" : "lower"} than the population density of Scotland ({Math.round(data.data.S92000003[2020])} per square kilometer).</Placeholder> -->
    </section>
    <section title="Distribution">
        <Placeholder>This is beeswarm/scatter chart showing distribution and change</Placeholder>
    </section>
    <section title="Interactive content">
        {#each data.componentsArray as component, i}
            {#if component.type === "line"}

            {:else if component.type === "double-beeswarm"}
                <DoubleBeeswarmChart
                data={component.data}
                indicator={data.indicator}
                visibleAreas={data.visibleAreas}
                ></DoubleBeeswarmChart>
            {:else if component.type === "map"}
                
            {/if}
        {/each}
    </section>
    <section title="Change over time">
        <Placeholder>This is a line chart showing the data as a time series</Placeholder>
    </section>
    <section title="Get the data">
        <h2 class="ons-u-mt-xl">Get the data</h2>
        <p>Here, you can find information and links to the data.</p>
    </section>
   

    
</SectionsWithNav>
{/if}