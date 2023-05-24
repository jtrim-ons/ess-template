<script>
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { getContext } from "svelte";
    import { getName } from "@onsvisual/robo-utils";
    import Titleblock from "$lib/layout/Titleblock.svelte";
    import Headline from "$lib/layout/partial/Headline.svelte";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
    import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
    import AreaNav from "../AreaNav.svelte";
    import Placeholder from "$lib/layout/Placeholder.svelte";

    const areas = getContext("areas");

    $: area = areas.find(p => p.areacd === $page.params.code);
</script>

{#if area}
<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Find a local area", url: `${base}/areas`}, {label: area.areanm}]}>
    <Headline>{area.areanm}</Headline>
    <Subhead>Get localised data, insights and trends for {getName(area, "the")}</Subhead>
</Titleblock>
<AreaNav/>
<SectionsWithNav contentsLabel="Explore this area">
    <section title="Key indicators">
        <Placeholder>This is a grid of key indicators</Placeholder>
    </section>
    <section title="Demographics">
        <Placeholder>This is a section giving an overview of demographic indicators</Placeholder>
    </section>
    <section title="Economy">
        <Placeholder>This is a section giving an overview of economic indicators</Placeholder>
    </section>
    <section title="Labour market">
        <Placeholder>This is a section giving an overview of labour market indicators</Placeholder>
    </section>
    <section title="Health">
        <Placeholder>This is a section giving an overview of health indicators</Placeholder>
    </section>
    <section title="Education">
        <Placeholder>This is a section giving an overview of education indicators</Placeholder>
    </section>
    <section title="Interactive conent">
        <Placeholder>This is a grid of other interactive content related to this area</Placeholder>
    </section>
    <section title="Related areas">
        <Placeholder>Find parent, child and neighbouring areas</Placeholder>
    </section>
    <section title="Get the data">
        <h2 class="ons-u-mt-xl">Get the data</h2>
        <p>Here, you can find information and links to the data.</p>
    </section>
</SectionsWithNav>
{/if}