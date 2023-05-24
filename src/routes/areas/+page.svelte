<script>
    import { base } from "$app/paths";
    import Titleblock from "$lib/layout/Titleblock.svelte";
    import Headline from "$lib/layout/partial/Headline.svelte";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
    import AreaNav from "./AreaNav.svelte";
</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Find a local area"}]}>
    <Headline>Find a local area</Headline>
    <Subhead>Get localised data, insights and trends for local authorities and regions</Subhead>
</Titleblock>
<AreaNav open/>