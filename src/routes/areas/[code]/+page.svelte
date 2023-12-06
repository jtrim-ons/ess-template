<script>
import { base } from "$app/paths";
import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import Placeholder from "$lib/layout/Placeholder.svelte";

import KeyIndicators from "$lib/prototypeComponents/areas/KeyIndicators.svelte";

import Checkbox from "$lib/prototypeComponents/general/selections/Checkbox.svelte";

import TopicSection from "$lib/prototypeComponents/areas/TopicSection.svelte";

import { geogLevelToNameLookup } from "$lib/config.js";
import { calculateMedian } from '$lib/utils';

import { setContext, getContext } from 'svelte';

export let data;

let areas = getContext("areas");
let areasParentsLookup = getContext("areasParentsLookup");
let areasGeogLevel = getContext("areasGeogLevel");

let topics = getContext("topics");

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

//// Choose baseline comparator areas

let baselineComparisonOptions = ["Median of all "+geogLevelToNameLookup[selectedGeogLevel]];
$: chosenId1 = baselineComparisonOptions[0];
$: baselineComparisonArea = chosenId1.substring(0, 6) === "Median" ? {areacd: "median", areanm: "Median of all "+geogLevelToNameLookup[selectedGeogLevel], role: "median"} : areas.find((e) => e.areanm === chosenId1);


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
    
    selectedAndRelatedAreas.push({...areas.find((e) => e.areacd === "K02000001"), role: "uk"});
    baselineComparisonOptions.push("United Kingdom")
}

setContext("baselineComparisonOptions", baselineComparisonOptions);
setContext("selectedAndRelatedAreas", selectedAndRelatedAreas);

$: globalVisibleAreasTracker = {main: true, parent: false, country: false, uk: false, neighbour: false, cluster: false, custom: null};

$: visibleAreas = [...selectedAndRelatedAreas.filter((e) => globalVisibleAreasTracker[e.role]), ...(globalVisibleAreasTracker.custom == null ? [] : globalVisibleAreasTracker.custom.map((e, i) => ({...e, role: "custom"+(i+1)})))];

//// Conduct pre-render calculations
let indicators = getContext("indicators");
let indicatorsCalculations = getContext("indicatorsCalculations");

let globalMainMinXDomain = 9999;
let globalMainMaxXDomain = 0;

indicatorsCalculations.forEach((e) => {

    let indicator = indicators.find((el) => e.id === el.id);
    let sameGeogLevelData = indicator.data.filter((el) => areasWithSameGeog.includes(el.areacd));

    e.calcs = {};
    e.mainMinXDomain = e.maxXDomain;
    e.mainMaxXDomain = e.minXDomain;

    for (var i=e.minXDomain; i<=e.maxXDomain; i++) {

        let periodData = indicator.data.filter((el) => el.xDomainNumb == i);
        let periodDataSameGeog = periodData.filter((el) => areasWithSameGeog.includes(el.areacd));

        if (periodData.length > 0) {

            if (i == e.maxXDomain) {

                indicator.latestData = periodData;
                indicator.latestDataSameGeogLevel = periodDataSameGeog;

                let medianValue = calculateMedian(periodDataSameGeog, "value");
                let deviations = periodDataSameGeog.map(((e) => Math.abs(e.value - medianValue)));
                let medianAbsoluteDeviation = calculateMedian(deviations);

                e.calcs[e.maxXDomain] = {median: medianValue, mad: medianAbsoluteDeviation}

            } else {

                e.calcs[i] = {median: calculateMedian(periodDataSameGeog, "value") };
            }

            selectedAndRelatedAreas.forEach((el) => {
                
                let areaData = periodData.find((elm) => el.areacd === elm.areacd);

                e.calcs[i][el.role] = areaData == null ? null : areaData.value;

                if (el.role === "main" & areaData != null) {

                    e.mainMinXDomain = Math.min(i, e.mainMinXDomain);
                    e.mainMaxXDomain = Math.max(i, e.mainMaxXDomain);
                }
            })

        }

    globalMainMinXDomain = Math.min(globalMainMinXDomain, e.mainMinXDomain);
    globalMainMaxXDomain = Math.max(globalMainMaxXDomain, e.mainMaxXDomain);
        
    }
})

setContext("indicators", indicators);

//// Set options for previous years based on available data

let previousTimePeriodOptions = [...["earliest available year", "previous year"],...Array.from({ length: globalMainMaxXDomain  - globalMainMinXDomain  }, (_, index) => globalMainMinXDomain + index).reverse()];
setContext("previousTimePeriodOptions", previousTimePeriodOptions);
$: chosenId2 = previousTimePeriodOptions[0];


//// Define selection arrays for area checkboxes
let chosenId4 = [], chosenId5 = [];

$: chosenId6 = [];

/////////

let customiseCheckbox = ["Include description text (e.g. higher/better than median, improving/increasing)", "Include background colours", "Include better/worse/improving/worsening (rather than higher/lower/increasing/decreasing) wording", "Similar to/little change based on being within 2 MADs rather than 1", "Rotate change over time axis", "Use titles and subtitles directly from metadata"];
$: chosenId11 = [0, 1, 2];

</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Find a local area", url: `${base}/areas`}, {label: selectedArea.areanm}]}>
    <Headline>{selectedArea.areanm}</Headline>
    <Subhead>Get localised data, insights and trends for {selectedArea.areanm}</Subhead>
</Titleblock>

<SectionsWithNav contentsLabel="Explore this area">

    <div class="temp-container">

        <p class="checkbox-title" style="font-size: 16px">The following custom options affect the key indicators and rows of indicators sections. These options are for testing different possibilities for the final design, rather than options that will be available to users in the finished product.</p>

        <Checkbox
        optionsArray={customiseCheckbox}
        name="chosenComparison"
        bind:chosenId={chosenId11}
        spacing="15px"
        ></Checkbox>

    </div>

    <div class="visual-content-container">

        <KeyIndicators
        indicators={indicators.filter((e) => ["annual-personal-wellbeing-estimates-Anxiety mean score (where 10 is 'completely anxious')", "female-healthy-life-expectancy", "gross-disposable-household-income-per-head", "employment-rate-long-Unemployment Rate", "aged-16-to-64-years-level-3-or-above-qualifications"].includes(e.code))}
        {chosenId11}
        baselineComparisonArea={selectedAndRelatedAreas.find((e) => e.role === "country")}
        {chosenId2}
        ></KeyIndicators>

        {#each topics as topic, i}

            <TopicSection
            {topic}

            {visibleAreas}
            bind:globalVisibleAreasTracker={globalVisibleAreasTracker}

            bind:chosenId1={chosenId1}
            {baselineComparisonArea}

            bind:chosenId2={chosenId2}

            bind:chosenId4={chosenId4} bind:chosenId5={chosenId5}

            {chosenId11}
            bind:chosenId6={chosenId6}

            combinedData={data.combinedData}
            ></TopicSection>

        {/each}

        <section title="Related areas">
            <Placeholder>Find parent, child and neighbouring areas</Placeholder>
        </section>
        <section title="Get the data">
            <h2 class="ons-u-mt-xl">Get the data</h2>
            <p>Here, you can find information and links to the data.</p>
        </section>

    </div>

</SectionsWithNav>


<style>

section {
    margin-top: 40px;
}

.temp-container {
    margin-bottom: 40px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(128,128,128);
}


</style>