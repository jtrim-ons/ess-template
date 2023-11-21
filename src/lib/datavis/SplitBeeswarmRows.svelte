<script>

import ChartOptionsTopics from "./ChartOptionsTopics.svelte";
import { base } from "$app/paths";
import Selections from "./SelectComparisonComponents/Selections.svelte";
import { getContext } from 'svelte';
import HorizontalBeeswarmNewTopics from "./HorizontalBeeswarmNewTopics.svelte";
import HorizontalBeeswarmNewTopics2 from "./HorizontalBeeswarmNewTopics2.svelte";

export let indicators, data, checkboxedRoles, areasForPlotting, clustersLookup, areasGeogInfo;

let indicator = indicators[0];

let chosenChart = 1;
let optionsArray = ["Health cluster", "Region", "Deprivation level"];

let col1Width = 200;

$: console.log(optionsArray[chosenChart-1])


let areas = getContext('areas');

$: siblingsData = data.filter((e) => e.codeId === indicator.id).filter((e) => areasForPlotting.includes(e.areacd) || (checkboxedRoles.custom === null ? ["K02000001", "E92000001", "N92000002", "S92000003", "W92000004"] : checkboxedRoles.custom.map((e) => e.areacd)).includes(e.areacd)).filter((e) => e.value !== null);

function calculateMedian(arr, property) {
    
    const values = arr.map(obj => obj[property]);
    values.sort((a, b) => a - b);
    const length = values.length;

    if (length % 2 === 0) {
        const mid1 = values[length / 2 - 1];
        const mid2 = values[length / 2];
        return (mid1 + mid2) / 2;
    } else {
        return values[Math.floor(length / 2)];
    }
}

$: medianValue = calculateMedian(siblingsData, "value")

$: maxDistanceFromMedian = Math.max(Math.abs(medianValue - Math.min(...siblingsData.map((e) => e.value))), Math.abs(medianValue - Math.max(...siblingsData.map((e) => e.value))));

$: calculatedDomain = [medianValue - maxDistanceFromMedian , medianValue + maxDistanceFromMedian];

$: siblingsDataCalcRange = siblingsData.map((e) => ({
    ...e,
    calcYValue: (e.value - medianValue)/maxDistanceFromMedian
}));

$: selectedAreasWithData = data.filter((e) => e.codeId === indicator.id).filter((e) => (checkboxedRoles.custom === null ? [] : checkboxedRoles.custom.map((e) => e.areacd)).includes(e.areacd)).filter((e) => e.value !== null).map((e) => ({
    ...e,
    calcYValue: (e.value - medianValue)/maxDistanceFromMedian,
})).sort((a, b) => a.calcYValue - b.calcYValue);

$: yDomain = [-1, 1];

$: groupings = [...new Set(areasGeogInfo.filter((e) => siblingsData.map((el) => el.areacd).includes(e.areacd)).map((e) => e[optionsArray[chosenChart-1] === "Health cluster" ? "health" : "imd"]))].filter((e) => e != null);

$: xDomainArray = [];

$: console.log(groupings)


</script>

<section title="Compare across areas">
    
    <h1>Compare across areas</h1>

    <div>

        <ChartOptionsTopics
        compareIntroText={true}
        bind:chosenChart={chosenChart}
        {optionsArray}
        ></ChartOptionsTopics>

        <div class="mainContainer">

            <h3>{indicator.label}</h3>

            {#if indicator.unit != null}
                <p>{indicator.unit}</p>
            {/if}

            

            <Selections
            altText="Select areas"
            selectedAreas={[]}
            areasWithData={[...new Set(areas.filter((e) => !["K02000001", "E92000001", "N92000002", "S92000003", "W92000004"].includes(e.areacd)).map((e) => e.areacd))]}
            bind:checkboxedRoles={checkboxedRoles}
            ></Selections>

            {#each groupings as group, i} 

                {#if optionsArray[chosenChart-1] === "Health cluster"}

                    <HorizontalBeeswarmNewTopics
                    name={clustersLookup.find((e) => ["health", "all"].includes(e.model) & e.id === group).alternativeDescription}
                    {yDomain}
                    {col1Width}
                    siblingsDataCalcRange={siblingsDataCalcRange.filter((e) => areasGeogInfo.find((el) => el.areacd === e.areacd).health === group)}
                    selectedAreasWithData={selectedAreasWithData.filter((e) => areasGeogInfo.find((el) => el.areacd === e.areacd).health === group)}
                    {indicator}
                    id={i}
                    {checkboxedRoles}
                    bind:xDomain={xDomainArray[i]}
                    xDom={xDomainArray.length > 2 ? xDomainArray[2] : [0, 1]}
                    ></HorizontalBeeswarmNewTopics>

                {:else}

                    <HorizontalBeeswarmNewTopics2
                    name={{1: "Most deprived", 2: "Some deprivation", 3: "Average", 4: "Low deprivation", 5: "Least deprived"}[group]}
                    {yDomain}
                    {col1Width}
                    siblingsDataCalcRange={siblingsDataCalcRange.filter((e) => areasGeogInfo.find((el) => el.areacd === e.areacd).imd === group)}
                    selectedAreasWithData={selectedAreasWithData.filter((e) => areasGeogInfo.find((el) => el.areacd === e.areacd).imd === group)}
                    {indicator}
                    id={i}
                    {checkboxedRoles}
                    bind:xDomain={xDomainArray[i]}
                    xDom={xDomainArray.length > 2 ? xDomainArray[2] : [0, 1]}
                    ></HorizontalBeeswarmNewTopics2>


                {/if}

            {/each}




        
        
        </div>

    </div>

    <img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

</section>


<style>

section {
    margin-top: 80px;
}

.mainContainer {
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

h3 {
    padding: 10px 0px 0px 10px;
    margin: 0px
}

p {
    padding: 5px 0px 0px 10px;
}




</style>