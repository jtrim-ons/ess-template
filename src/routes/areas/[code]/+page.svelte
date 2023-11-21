<script>
import { base } from "$app/paths";
import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import Placeholder from "$lib/layout/Placeholder.svelte";

import TopicSection from "$lib/prototypeComponents/areas/TopicSection.svelte"
import SelectComparisonAreas from "$lib/datavis/SelectComparisonAreas.svelte";

import { geogLevelToNameLookup } from "$lib/config.js";

import { setContext, getContext } from 'svelte';

export let data;

let areas = getContext("areas");
let areasParentsLookup = getContext("areasParentsLookup");
let areasGeogLevel = getContext("areasGeogLevel");

let topics = getContext("topics");

let latestData = getContext("latestData");
let otherData = getContext("otherData");
let initialData = getContext("initialData");

//// Identify geography level of selected area

let selectedGeogLevel = areasGeogLevel.find((e) => e.areacd === data.areacd).level;
let areasWithSameGeog = areasGeogLevel.filter((e) => { 
    if (["uk", "country"].includes(selectedGeogLevel)) {return e.level === selectedGeogLevel }
    else if (selectedGeogLevel === "region") {return ["region", "country"].includes(e.level) }
    else if (selectedGeogLevel === "both") {return ["both", "lower"].includes(e.level)}
    else {return ["both", selectedGeogLevel].includes(e.level)}
}).map((e) => e.areacd);

setContext("selectedGeogLevel", selectedGeogLevel);
setContext("areasWithSameGeog", areasWithSameGeog);

//// Choose baseline comparators

let baselineComparisonOptions = ["median of all "+geogLevelToNameLookup[selectedGeogLevel]];
$: chosenId1 = baselineComparisonOptions[0];
$: baselineComparisonArea = chosenId1.substring(0, 6) === "median" ? "median" : areas.find((e) => e.areanm === chosenId1);

$: console.log(chosenId1);

let previousTimePeriodOptions = ["earliest available year", "previous year", "5 years earlier", "10 years earlier"];
$: chosenId2 = previousTimePeriodOptions[0];

//// Identify highlightable areas and track whether they should be visible + add extra areas to set of baseline comparison options

let selectedAndRelatedAreas = [];
let selectedArea = areas.find((e) => e.areacd === data.areacd);

setContext("selectedArea", selectedArea);

selectedAndRelatedAreas.push({...selectedArea, role: "main"});

let parentLookup = areasParentsLookup.find((e) => e.areacd === data.areacd);
let parentArea = areas.find((e) => e.areacd === parentLookup.parentcd)
selectedAndRelatedAreas.push({...parentArea, role: "parent"});
baselineComparisonOptions.push(parentArea.areanm);

if (parentLookup.parentcd != parentLookup.countrycd & parentLookup.countrycd != '') {
    
    selectedAndRelatedAreas.push({...areas.find((e) => e.areacd === parentLookup.countrycd), role: "country"});
    baselineComparisonOptions.push(parentLookup.countrynm)
}

if (parentLookup.parentcd != "K02000001") {
    
    selectedAndRelatedAreas.push({...areas.find((e) => e.areacd === parentLookup.countrycd), role: "uk"});
    baselineComparisonOptions.push("United Kingdom")
}

$: globalVisibleAreasTracker = {main: true, parent: false, country: false, uk: false, neighbour: false, cluster: false, custom: null};

$: visibleAreas = [...selectedAndRelatedAreas.filter((e) => globalVisibleAreasTracker[e.role]), ...(globalVisibleAreasTracker.custom == null ? [] : globalVisibleAreasTracker.custom.map((e, i) => ({...e, role: "custom"+(i+1)})))];

</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Find a local area", url: `${base}/areas`}, {label: selectedArea.areanm}]}>
    <Headline>{selectedArea.areanm}</Headline>
    <Subhead>Get localised data, insights and trends for {selectedArea.areanm}</Subhead>
</Titleblock>

<SectionsWithNav contentsLabel="Explore this area">

    <!-- <SelectComparisonAreas
    selectedAreas={selectedAndRelatedAreas.filter((e) => data.latestData.filter((el) => e.areacd === el.areacd).length > 0 & e.role !== "main")}
    areasWithData={data.latestData.map((e) => e.areacd)}
    bind:checkboxedRoles={globalVisibleAreasTracker}
    selectedArea={selectedAndRelatedAreas.find((e) => e.role === "main").areanm}
    parentArea={selectedAndRelatedAreas.find((e) => e.role === "parent").areanm}
    includeSiblings={false}
    ></SelectComparisonAreas> -->

    {#each topics as topic, i}

        <TopicSection
        {baselineComparisonArea}
        {topic}
        latestData={latestData.filter((e) => topic.indicatorsList.includes(e.id))}
        otherData={otherData.filter((e) => topic.indicatorsList.includes(e.id))}
        initialData={initialData.filter((e) => topic.indicatorsList.includes(e.id))}
        {visibleAreas}
        bind:globalVisibleAreasTracker={globalVisibleAreasTracker}
        bind:chosenId1={chosenId1}
        {baselineComparisonOptions}
        bind:chosenId2={chosenId2}
        {previousTimePeriodOptions}
        ></TopicSection>

    {/each}

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