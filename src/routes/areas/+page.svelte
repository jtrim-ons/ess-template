<script>
    import { base } from "$app/paths";
    import { Breadcrumb, Titleblock } from "@onsvisual/svelte-components";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
    import AreaNav from "./AreaNav.svelte";
</script>

<Breadcrumb links={[{label: "Home", href: "/"}, {label: "Explore subnational statistics", href: `${base}/`}, {label: "Find a local area"}]} background="#eaeaea"/>
<Titleblock title="Find a local area" background="#eaeaea">
    <Subhead>Get localised data, insights and trends for local authorities and regions</Subhead>
</Titleblock>
<AreaNav open/>