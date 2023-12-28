<script>
import { base } from "$app/paths";

import { Breadcrumb, Titleblock, NavSections, NavSection } from "@onsvisual/svelte-components";
import Subhead from "$lib/layout/partial/Subhead.svelte";

import { toProperCase } from '$lib/utils.js'

export let data;

</script>

<Breadcrumb links={[{label: "Home", href: "/"}, {label: "Explore subnational statistics", href: `${base}/`}, {label: "Expore indicators", href: `${base}/indicators`}, {label: "topic"}]}/>
<Titleblock title="Indicator name">
    <Subhead>{"Indicator information"}</Subhead>
</Titleblock>

<NavSections contentsLabel="Explore this indicator">

    <NavSection title="Get the data">

        <p>Here, you can find information and links to the data.</p>

    </NavSection>
</NavSections>



<style>

section {
    margin-bottom: 80px;
}


</style>