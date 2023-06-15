<script>
import { base } from "$app/paths";
import { page } from "$app/stores";
import { getContext } from "svelte";
import { getName } from "@onsvisual/robo-utils";
import Titleblock from "$lib/layout/Titleblock.svelte";
import Headline from "$lib/layout/partial/Headline.svelte";
import Subhead from "$lib/layout/partial/Subhead.svelte";
import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
import AreaNav from "../AreaNav.svelte";
import Placeholder from "$lib/layout/Placeholder.svelte";
import { getData} from "$lib/utils";
import { selectedArea, comparisonAreasArray, findSelectedAreas } from "$lib/selectedAreasStore.js";
import LineChart from "$lib/datavis/LineChart.svelte";
import DoubleBeeswarmChart from "$lib/datavis/DoubleBeeswarmChart.svelte";
import SelectComparisonAreas from "$lib/layout/SelectComparisonAreas.svelte";
import KeyIndicators from "$lib/layout/KeyIndicators.svelte";

export let data;

let data2 = data.data2, additionalData = [];

$: visibleAreas = findSelectedAreas($selectedArea, $comparisonAreasArray, data.areas);

$: additionalAreas = visibleAreas.filter((k) => !data2.map((e) => e.areacd).includes(k.areacd));

$: importAdditionalData(additionalAreas, data.dataImportingInstructions);

function importAdditionalData(additionalAreas, dataImportingInstructions) {

    let promisesArray = [], codeArray = [], areanmArray = [], roleArray = [];

    additionalAreas.forEach((e) => {

        data.dataImportingInstructions.forEach((i) => {

        if (i.type === "data2") { 
            
            promisesArray.push(loadAdditionalData(i.code, e.areacd)) 
            codeArray.push(i.code)
            areanmArray.push(e.areanm)
            roleArray.push(e.role)
        }

        })
    })

    Promise.all(promisesArray).then((loadedData) => {

        loadedData.forEach((e,i) => {

            e.areanm = areanmArray[i];
            e.code = codeArray[i]
            e.role = roleArray[i]

        })

        additionalData = loadedData;
    })
}

async function loadAdditionalData(code, areacd) {

    let importedData = getData(`${base}/data/json/area/`+code+`/`+areacd+`.json`)
                            
    return importedData
}

$: sectionsArray = [...new Set(data.componentsArray.map((e) => e.section))];

$: console.log(sectionsArray)


</script>

{#if $selectedArea}
<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Find a local area", url: `${base}/areas`}, {label: $selectedArea.areanm}]}>
    <Headline>{$selectedArea.areanm}</Headline>
    <Subhead>Get localised data, insights and trends for {getName($selectedArea, "the")}</Subhead>
</Titleblock>
<AreaNav/>
<SectionsWithNav contentsLabel="Explore this area">
    <section title="Key indicators">
        <h1>Key indicators</h1>
        <KeyIndicators
        data3={data.data3}
        data4={data.data4}></KeyIndicators>
    </section>

    {#each sectionsArray as section, i}
    <section title={section}>
        <h1>{section}</h1>

        {#each data.componentsArray.filter((e) => e.section === section) as component, i}

        <SelectComparisonAreas
        areas={data.areas}
        ></SelectComparisonAreas>

        {#if component.type === "line"}
            <LineChart
            data={[...data2,...additionalData].filter((e) => e.code === component.code)}
            indicator={component.indicator}
            zeroBaseline={component.indicator.zeroBaseline}
            {visibleAreas}
            ></LineChart>
        {:else if component.type === "double-beeswarm"}
            <DoubleBeeswarmChart
            data={[...data2,...additionalData].filter((e) => e.code === component.code)}
            indicator={component.indicator}
            zeroBaseline={component.indicator.zeroBaseline}
            {visibleAreas}
            ></DoubleBeeswarmChart>

        
        {/if}

        {/each}

    </section>
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
{/if}

<style>

section {
    margin-top: 40px;
}

.mapContainer {
    height: 500px;
    width: 100%;
    display: block;
}

</style>