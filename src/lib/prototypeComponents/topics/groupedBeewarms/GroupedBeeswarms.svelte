<script>

import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";
import Dropdown from "$lib/prototypeComponents/general/selections/Dropdown.svelte";
import HorizontalBeeswarm from "$lib/prototypeComponents/general/beeswarm/HorizontalBeeswarm.svelte";
import HorizontalBeeswarmKey from "$lib/datavis/HorizontalBeeswarmKey.svelte";
import SelectAreas from "$lib/prototypeComponents/general/selections/SelectAreas.svelte";
import Checkbox from "$lib/prototypeComponents/general/selections/Checkbox.svelte";
import { scaleLinear } from 'd3-scale';
import { colorsObject, countries, regions } from "$lib/config";
import { medianAbsoluteDeviationLimit } from '$lib/config';

import { getContext } from 'svelte';

import { clusterToTopicLookup } from "$lib/config";
import { toProperCase, calculateMedian } from '$lib/utils.js'

export let latestData, indicatorsList, topicName, checkboxedRoles;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicators = getContext("indicators");

let clustersInfo = getContext("clustersInfo");
let clustersLookup = getContext("clustersLookup");

let periodsLookup = getContext("periodsLookup");

let areasGeogLevel = getContext("areasGeogLevel");
let areasForPlotting = areasGeogLevel.filter((e) => ["both", "lower"].includes(e.level)).map((e) => e.areacd);
let areasParentsLookup = getContext("areasParentsLookup");
let areasGeogInfo = getContext("areasGeogInfo");

let optionsArray1 = indicatorsList.map((e,i) => {return {index: i, id: e, label : indicatorsMetadata.find((elm) => elm.code == indicators.find((el) => el.id == e).code).label }});
let chosenId1 = optionsArray1[1].label;

$: selectedIndicatorId = indicators.find((e) => e.code == indicatorsMetadata.find((el) => el.label == chosenId1).code).id;
$: metadata = indicatorsMetadata.find((el) => el.code == indicators.find((e) => e.id === selectedIndicatorId).code);

$: combinedData =  latestData.filter((e) => e.id === selectedIndicatorId & areasForPlotting.includes(e.areacd));

let chosenId2 = 0;
let optionsArray2 = [...Object.keys(clusterToTopicLookup).filter((e) => clusterToTopicLookup[e] === topicName).map((e) => toProperCase(e)+" cluster"),...["Region", "Deprivation Level", "Urban/Rural"]];

$: groupedData = (optionsArray2[chosenId2].includes("cluster") ? combinedData.map((e) => ({...e, group: clustersInfo.find((el) => el.areacd === e.areacd)[optionsArray2[chosenId2].replace(" cluster", "").toLowerCase()]})) : optionsArray2[chosenId2] === "Region" ? combinedData.map((e) => ({...e, group: areasParentsLookup.find((el) => el.areacd === e.areacd).parentcd})) : optionsArray2[chosenId2] === "Deprivation Level" ? combinedData.map((e) => ({...e, group: areasGeogInfo.find((el) => e.areacd === el.areacd).imd})) : optionsArray2[chosenId2] === "Urban/Rural" ? combinedData.map((e) => ({...e, group: areasGeogInfo.find((el) => e.areacd === el.areacd).urban})) : []).filter((e) => e.group != "");

$: uniqueGroups = optionsArray2[chosenId2] === "Deprivation Level" ? [...new Set(groupedData.map((e) => e.group))].sort((a,b) => a - b) : [...new Set(groupedData.map((e) => e.group))];

$: groupsToNamesLookup = optionsArray2[chosenId2].includes("cluster") ? clustersLookup.filter((e) => [optionsArray2[chosenId2].replace(" cluster", "").toLowerCase(), "all"].includes(e.model)).map((e) => {return {id: e.id, name: e.alternativeDescription}}) : optionsArray2[chosenId2] === "Region" ? [...countries, ...regions].map((e) => {return {id: e.code, name: e.name}}) : optionsArray2[chosenId2] === "Deprivation Level" ? [{id: "5", name: "Least deprived"}, {id: "4", name: "Low deprivation"}, {id: "3", name: "Average"}, {id: "2", name: "Above average deprivation"}, {id: "1", name: "Most deprived"}] : optionsArray2[chosenId2] === "Urban/Rural" ? uniqueGroups.map((e) => {return {id: e, name: e}}) : [];

$: medianValue = calculateMedian(groupedData, "value");
$: maxDistanceFromMedian = Math.max(Math.abs(medianValue - Math.min(...groupedData.map((e) => e.value))), Math.abs(medianValue - Math.max(...groupedData.map((e) => e.value))));

$: deviations = groupedData.map(((e) => Math.abs(e.value - medianValue)));
$: medianAbsoluteDeviation = calculateMedian(deviations);

let width = 1000;
let height = 70;
let col1Width = 200;
let outerPadding = {top: 15, left: 0, right: 0, bottom: 3};
let spaceForAreasBeyondScale = 30;

$: chartWidth = width - outerPadding.left - outerPadding.right - col1Width - spaceForAreasBeyondScale*2;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;

$: yDomain = [-metadata.polarity*medianAbsoluteDeviationLimit, metadata.polarity*medianAbsoluteDeviationLimit];

$: y = scaleLinear()
    .domain(yDomain)
    .range([0, chartWidth]);

let xDomainGlobal = [-1, 1];

$: {
    chosenId1;
    chosenId2;
    xDomainGlobal = [-1, 1]
}

$: x = scaleLinear()
    .domain(xDomainGlobal)
    .range([0, chartHeight]);

let hoverIndex = null;

let chosenId3 = [];

</script>


<Radio
asButtons={true}
name="selectGroupings"
optionsArray={optionsArray2}
bind:chosenId={chosenId2}
></Radio>

<div class="visualisation-container" bind:clientWidth={width}>

    <div class="title-container">

        <div class="dropdown-container">

            <Dropdown
            name={"select-indicator-dropdown"}
            bind:chosenId={chosenId1}
            optionsArray={optionsArray1.map((e) => e.label)}
            ></Dropdown>

        </div>

        <p>in {combinedData.length > 0 ? periodsLookup.find((e) => e.xDomainNumb === combinedData[0].xDomainNumb).label: ""}</p>

    </div>

    <HorizontalBeeswarmKey
    ></HorizontalBeeswarmKey>

    <div class="checkbox-container">

        <Checkbox
        optionsArray={["Show median values for each group of areas"]}
        name="chosenComparison"
        bind:chosenId={chosenId3}
        marginBottom="0px"
        fontSize="16px"
        ></Checkbox>

    </div>

    <div style="margin-top: 20px; margin-bottom: 30px">

        <SelectAreas
        areasWithData={areasForPlotting.filter((e) => groupedData.map((el) => el.areacd).includes(e))}
        bind:checkboxedRoles={checkboxedRoles}
        colors={[colorsObject["custom1"], colorsObject["custom2"], colorsObject["custom3"], colorsObject["custom4"]]}
        placeholderText="Select areas to be shown on plots"
        ></SelectAreas>


    </div>

    <div class="svgs-container">

        {#each uniqueGroups as group, i}

            <HorizontalBeeswarm
            index={i}
            data={groupedData.filter((e) => e.group == group)}
            name={groupsToNamesLookup.find((e) => e.id == group).name}
            {checkboxedRoles}
            {medianValue}
            {metadata}
            {deviations}
            {medianAbsoluteDeviation}
            {col1Width}
            {outerPadding}
            {chartWidth}
            {chartHeight}
            {spaceForAreasBeyondScale}
            {y}
            {x}
            {height}
            {width}
            bind:xDomainGlobal={xDomainGlobal}
            bind:hoverIndex={hoverIndex}
            {chosenId3}
            ></HorizontalBeeswarm>

        {/each}

    </div>

</div>



<style>

.visualisation-container {
    margin: 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

.title-container {
    display: flex;
    flex-wrap: wrap;
}

.dropdown-container {
    margin: 2px 0px 2px 0px;
    padding: 0px;
}

.title-container p {
    margin: 0px;
    padding: 0px 5px 0px 10px;
    line-height: 40px;
}

.checkbox-container {
    background-color:#F5F5F6;
    border-radius: 10px;
    margin: 0px 20px 20px 20px;
    padding: 5px 10px 5px 0px;
}





</style>
