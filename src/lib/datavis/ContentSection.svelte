<script>

import BeeswarmRows from "./BeeswarmRows.svelte";
import BeeswarmRowsOption2 from "./BeeswarmRowsOption2.svelte";
import MainChart from "./MainChart.svelte";
import Grid from "./Grid.svelte"
import Grid2 from "./Grid2.svelte"

export let sectionName, sectionIndicators, indicators, selectedAreas, latestData, otherData, initialData, checkboxedRoles, siblingAreas;

sectionName = sectionName[0].toUpperCase()+sectionName.substring(1);
latestData = latestData.filter((e)=> sectionIndicators.map((el => el.id)).includes(e.codeId));

const trimmedIndicators=indicators.filter((e) => sectionIndicators.map((el) => el.id).includes(e.id));

const primaryIndicators=trimmedIndicators.filter((e) => sectionIndicators.filter((el) => el.priority ==="p").map((el) => el.id).includes(e.id));
const secondaryIndicators=trimmedIndicators.filter((e) => sectionIndicators.filter((el) => el.priority ==="s").map((el) => el.id).includes(e.id));
const otherIndicators=trimmedIndicators.filter((e)=> ![...primaryIndicators.map((el) => el.id),...secondaryIndicators.map((el) => el.id)].includes(e.id))

let selectedArea = selectedAreas.find((e) => e.role === "main").data.areanm;
let parentArea = selectedAreas.find((e) => e.role === "parent").data.areanm;

let sectionObject = {
    Demographics: "[Dummy text] " + selectedArea + " is a rural area in "+ parentArea + ". It is a popular retirement destination.",
    Economy: "[Dummy text] " + selectedArea + " has above average employment. Its primary industry is retail.",
    Health: "[Dummy text] " + selectedArea + " is an ageing area with above average level of deprivation.",
    Connectivity: "[Dummy text] " + selectedArea + " is a rural area in "+ parentArea+ ".",
    Skills: "[Dummy text] " + selectedArea + " has an above average level of deprivation.",
    Education: "[Dummy text] " + selectedArea + " has a low student population. The area has an above average number of people who do not hold qualifications.",
    Wellbeing: "[Dummy text] " + selectedArea + " has an above average level of deprivation and above average employment.",
}

$: selectedIndicatorsArray = [];

$: console.log(selectedIndicatorsArray);

</script>

<section title={sectionName}>
    <h1>{sectionName}</h1>

    <p>{@html (sectionName in sectionObject ? sectionObject[sectionName] : "")}</p>

    <Grid
    indicators={[...primaryIndicators,...secondaryIndicators,...otherIndicators]}
    {latestData}
    {initialData}
    {selectedAreas}
    bind:selectedIndicatorsArray={selectedIndicatorsArray}
    ></Grid>

    <BeeswarmRowsOption2
    {trimmedIndicators}
    {latestData}
    {primaryIndicators}
    {secondaryIndicators}
    {otherIndicators}
    {selectedAreas}
    {siblingAreas}
    bind:checkboxedRoles={checkboxedRoles}
    {selectedArea}
    {parentArea}
    {selectedIndicatorsArray}
    ></BeeswarmRowsOption2>

    <Grid2
    indicators={[...primaryIndicators,...secondaryIndicators,...otherIndicators]}
    {latestData}
    {initialData}
    {selectedAreas}
    {trimmedIndicators}
    {primaryIndicators}
    {secondaryIndicators}
    {otherIndicators}
    {siblingAreas}
    bind:checkboxedRoles={checkboxedRoles}
    {selectedArea}
    {parentArea}
    ></Grid2>



    <BeeswarmRows
    {trimmedIndicators}
    {latestData}
    {primaryIndicators}
    {secondaryIndicators}
    {otherIndicators}
    {selectedAreas}
    {siblingAreas}
    bind:checkboxedRoles={checkboxedRoles}
    {selectedArea}
    {parentArea}
    ></BeeswarmRows>

    {#each primaryIndicators as indicator}

        <MainChart
        {indicator}
        latestData={latestData.filter((e) => e.codeId === indicator.id)}
        otherData={indicator.code in otherData ? otherData[indicator.code] : []}
        initialData={indicator.code in initialData ? initialData[indicator.code] : []}
        {selectedAreas}
        bind:checkboxedRoles={checkboxedRoles}
        {siblingAreas}
        {selectedArea}
        {parentArea}
        ></MainChart>

    {/each}

   


</section>

<style>

section {
    margin-top: 100px;
}

</style>