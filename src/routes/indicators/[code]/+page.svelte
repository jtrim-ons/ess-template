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

    $: indicator = indicators.find(t => t.code === $page.params.code);
</script>

{#if indicator}
<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore indicators", url: `${base}/indicators`}, {label: indicator.label}]}>
    <Headline>{indicator.label}</Headline>
    <Subhead>{indicator.description}</Subhead>
</Titleblock>
<TopicNav/>
<SectionsWithNav contentsLabel="Explore this indicator">
    <section title="Overview">
        <Placeholder>This is an overview map and summary</Placeholder>
    </section>
    <section title="Distribution">
        <Placeholder>This is beeswarm/scatter chart showing distribution and change</Placeholder>
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