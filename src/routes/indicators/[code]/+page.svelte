<script>
import { base } from "$app/paths";
import { page } from "$app/stores";

import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import Map from "$lib/datavis/Map.svelte";

export let data;

$: console.log(data);

$: areasForPlotting = data.areasGeogLevel.filter((e) => ["both", "lower"].includes(e.level)).map((e) => e.areacd)

$: filteredData = data.areasGeogInfo.filter((el) => areasForPlotting.includes(el.areacd))

$: console.log(filteredData)

/*export let indicator;
export let geoType = "ltla";
export let year = 2023;
export let data = [];
export let idKey = "areacd";
export let valueKey = "value";
export let colors = ["#ffffcc", "#41b6c4", "#41b6c4", "#2c7fb8", "#253494"];
export let selected = null;
export let hovered = null;*/

</script>


<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore indicators", url: `${base}/indicators`}, {label: "topic"}]}>
    <Headline>{data.params.code[0].toUpperCase()+data.params.code.substring(1)}</Headline>
    <Subhead>{"Topic information"}</Subhead>
</Titleblock>
<SectionsWithNav contentsLabel="Explore this indicator">
    

    <Map
    data={filteredData.filter((e) => e.health !== null).filter((e) => e.health <= 4)}
    idKey="areacd"
    valueKey="health"
    clustersLookup={data.clustersLookup}
    ></Map>

    <section title="Get the data">
        <h2 class="ons-u-mt-xl">Get the data</h2>
        <p>Here, you can find information and links to the data.</p>
    </section>
   

    
</SectionsWithNav>