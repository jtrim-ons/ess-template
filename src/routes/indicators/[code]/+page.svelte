<script>
import { base } from "$app/paths";

import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import Placeholder from "$lib/layout/Placeholder.svelte";

import { toProperCase } from '$lib/utils.js'

export let data;

</script>


<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore indicators", url: `${base}/indicators`}, {label: "topic"}]}>
    <Headline>{""}</Headline>
    <Subhead>{"Topic information"}</Subhead>
</Titleblock>

<SectionsWithNav contentsLabel="Explore this indicator">

    <section title="Get the data">

        <h2 class="ons-u-mt-xl">Get the data</h2>
        <p>Here, you can find information and links to the data.</p>

    </section>
    




   
    
</SectionsWithNav>



<style>

section {
    margin-bottom: 80px;
}


</style>