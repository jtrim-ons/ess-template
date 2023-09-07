<script>
import { base } from "$app/paths";
import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import Placeholder from "$lib/layout/Placeholder.svelte";
import { getContext } from 'svelte';
import KeyIndicators from "$lib/datavis/KeyIndicators.svelte";
import ContentSection from "$lib/datavis/ContentSection.svelte";

export let data;

console.log(data);

let latestData = getContext('latestData');
let areas = getContext('areas');
let areasParentsLookup = getContext("areasParentsLookup");
let areasGeogLevel = getContext("areasGeogLevel");
let indicators = getContext('indicators');
let areasGeogInfo = getContext("areasGeogInfo");

let mainAreaParentsLookup = areasParentsLookup.find((e) => e.areacd === data.areaCode);

let selectedAreas = [];

selectedAreas.push({data: areas.find((e) => e.areacd === data.areaCode), role: "main"})
selectedAreas.push({data: areas.find((e) => e.areacd === mainAreaParentsLookup.parentcd), role: "parent"})

if (mainAreaParentsLookup.countrycd !== null & mainAreaParentsLookup.parentcd !== mainAreaParentsLookup.countrycd) {

    selectedAreas.push({data: areas.find((e) => e.areacd === mainAreaParentsLookup.countrycd), role: "country"})
}

if (mainAreaParentsLookup.parentcd !== "K02000001") {

    selectedAreas.push({data: areas.find((e) => e.areacd === "K02000001"), role: "uk"})
}

let selectedGeogLevel = areasGeogLevel.find((e) => e.areacd === data.areaCode).level
let areasSameGeog = areasGeogLevel.filter((e) => { 
    if (["uk", "country"].includes(selectedGeogLevel)) {return e.level === selectedGeogLevel }
    else if (selectedGeogLevel === "region") {return ["region", "country"].includes(e.level) }
    else if (selectedGeogLevel === "both") {return ["both", "lower"].includes(e.level)}
    else {return ["both", selectedGeogLevel].includes(e.level)}
});
let clusterLevel = areasGeogInfo.find((e) => e.areacd === data.areaCode).headline;

let siblingAreas = {};

siblingAreas.neighbours = areasParentsLookup.filter((e) => e.areacd != data.areaCode & e.parentcd === mainAreaParentsLookup.parentcd & areasSameGeog.map((el) => el.areacd).includes(e.areacd)).map((el) => el.areacd);

siblingAreas.similar = clusterLevel === null ? [] : areasGeogInfo.filter((e) => e.areacd != data.areaCode & e.headline === clusterLevel & areasSameGeog.map((el) => el.areacd).includes(e.areacd)).map((el) => el.areacd);

siblingAreas.siblings = areasParentsLookup.filter((e) => e.areacd != data.areaCode & areasSameGeog.map((el) => el.areacd).includes(e.areacd)).map((el) => el.areacd)

$: checkboxedRoles = {parent: true, country: true, uk: true, neighbour: false, cluster: false, custom: null};

$: console.log(selectedAreas)
  
</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Find a local area", url: `${base}/areas`}, {label: selectedAreas.find((e) => e.role === "main").data.areanm}]}>
    <Headline>{selectedAreas.find((e) => e.role === "main").data.areanm}</Headline>
    <Subhead>Get localised data, insights and trends for {selectedAreas.find((e) => e.role === "main").data.areanm}</Subhead>
</Titleblock>

<SectionsWithNav contentsLabel="Explore this area">

    <KeyIndicators
    areaKeyIndicators={data.configData.areaKeyIndicators}
    latestData={latestData.filter((e)=> data.configData.areaKeyIndicators.map((el=>el.id)).includes(e.codeId))}
    initialData={data.preloadedData.initialData}
    trimmedIndicators={indicators.filter((e) => data.configData.areaKeyIndicators.map((el=>el.id)).includes(e.id))}
    {selectedAreas}
    ></KeyIndicators>
   
    {#each [...new Set(data.configData.areaSections.map((e) => e.section))] as sectionName}

        <ContentSection
        {sectionName}
        sectionIndicators={data.configData.areaSections.filter((el) => el.section === sectionName)}
        {indicators}
        {selectedAreas}
        latestData={latestData}
        initialData={data.preloadedData.initialData}
        otherData={data.preloadedData.otherData}
        bind:checkboxedRoles={checkboxedRoles}
        {siblingAreas}
        ></ContentSection>

    {/each}

    










    <!-- <section title="Demographics">
        <SelectComparisonAreas
        areas={data.areas}
        ></SelectComparisonAreas>
        <Placeholder>This is a section giving an overview of demographic indicators</Placeholder>
    </section>
    <section title="Economy">
        <SelectComparisonAreas
        areas={data.areas}
        ></SelectComparisonAreas>
        <Placeholder>This is a section giving an overview of economic indicators</Placeholder>
        <div class="mapContainer">
        </div>
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
    <section title="Interactive content">
        {#each data.componentsArray as component, i}
        {#if component.type === "line"}
            <LineChart
            data={[...data2,...additionalData].filter((e) => e.code === component.code & visibleAreas.map((f) => f.areacd).includes(e.areacd) )}
            indicator={component.indicator}
            ></LineChart>
        {:else if component.type === "double-beeswarm"}
            <DoubleBeeswarmChart
            data={component.data}
            indicator={component.indicator}
            visibleAreas={component.visibleAreas}
            ></DoubleBeeswarmChart>
        {/if}
        {/each}
    </section> -->
    <section title="Related areas">
        <Placeholder>Find parent, child and neighbouring areas</Placeholder>
    </section>
    <section title="Get the data">
        <h2 class="ons-u-mt-xl">Get the data</h2>
        <p>Here, you can find information and links to the data.</p>
    </section>
</SectionsWithNav>

<style>

section {
    margin-top: 40px;
}

</style>