<script>
    import { base } from "$app/paths";
    import Titleblock from "$lib/layout/Titleblock.svelte";
    import Content from "$lib/layout/Content.svelte";
    import Headline from "$lib/layout/partial/Headline.svelte";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
    import Cards from "$lib/layout/Cards.svelte";
    import Card from "$lib/layout/partial/Card.svelte";
    import ButtonLink from "$lib/ui/ButtonLink.svelte";
</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics"}]}>
    <Headline>Explore subnational statistics</Headline>
    <Subhead>Get facts and figures about local areas within the United Kingdom, and see how they compare over time</Subhead>
</Titleblock>

<Content>
    <Cards colwidth="wide">
        <Card>
            <h2>Explore topics</h2>
            <p>Discover national and regional trends with maps, charts and headline indicators</p>
            <ButtonLink icon="arrow" href="{base}/indicators">Explore</ButtonLink>
        </Card>
        <Card>
            <h2>Find a local area</h2>
            <p>Get localised data, insights and trends for local authorities and regions</p>
            <ButtonLink icon="arrow" href="{base}/areas">Find</ButtonLink>
        </Card>
        <!-- <Card>
            <h2>Get the data</h2>
            <p>Find and download subnational datasets covering local authorities and regions</p>
            <ButtonLink icon="arrow">Download</ButtonLink>
        </Card> -->
    </Cards>
</Content>