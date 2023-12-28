<script>
    import { base } from "$app/paths";
    import { Breadcrumb, Titleblock, Cards, Card, Button } from "@onsvisual/svelte-components";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
</script>

<Breadcrumb links={[{label: "Home", href: "/"}, {label: "Explore subnational statistics"}]} background="#eaeaea"/>
<Titleblock title="Explore subnational statistics" background="#eaeaea">
    <Subhead>Get facts and figures about local areas within the United Kingdom, and see how they compare over time</Subhead>
</Titleblock>

<Cards colwidth="wide" marginTop>
    <Card title="Explore topics">
        <p>Discover national and regional trends with maps, charts and headline indicators</p>
        <Button icon="arrow" iconPosition="after" href="{base}/indicators">Explore</Button>
    </Card>
    <Card title="Find a local area">
        <p>Get localised data, insights and trends for local authorities and regions</p>
        <Button icon="arrow" iconPosition="after" href="{base}/areas">Find</Button>
    </Card>
</Cards>