<script>

import { scaleLinear } from 'd3-scale';
import SelectComparisonAreas from "./SelectComparisonAreas.svelte";
import AxisY from './shared/AxisY.svelte';
import AxisX from './shared/AxisX.svelte';
import { onMount } from 'svelte';
import { indicators } from "$lib/config.js";
import ViolinPlot from './dotPlotComponents/ViolinPlot.svelte';
import Key from './shared/Key.svelte';

export let component, data, distributionData, visibleAreas, countByGeoLevel, countOfNulls, areas, width = 360;

let filteredData = [], mounted = false;

$: rolesArray = [...new Set(visibleAreas.map((e) => e.role))]

let countOfLocalAuthorities = countByGeoLevel.find((e) => e.geoLevel === "localauthority" & e.category === "Y").count

$: customAreas = visibleAreas.filter((e) => e.role.slice(0,6) === "custom")

component.code.forEach((i) => {

    let indicator = indicators.find((e) => e.code == i);

    let nullValues = countOfNulls.filter((f) => f.geoLevel === "localauthority" & f.category === "Y" & f.indicator === i & f.year === indicator.years[1])

    let mainPercentile = Math.ceil(100*data.main.rank[i+"_localauthority_"+indicator.years[1]]/countOfLocalAuthorities - (nullValues.length > 0 ? nullValues[0].count : 0));

    let dataObject =  {
        indicator: indicator,

        mainName: data.main.value.areanm,
        mainPercentile: mainPercentile,
        mainRaw: data.main.value[i+"_"+indicator.years[1]],  

        parentName: data.parent.value.areanm,
        parentRaw: data.parent.value[i+"_"+indicator.years[1]],

        countryName: data.country.value.areanm,
        countryRaw: data.country.value[i+"_"+indicator.years[1]],

        ukName: "United Kingdom", 
        ukRaw: data.uk.value[i+"_"+indicator.years[1]],
    };

    filteredData.push(dataObject)
})



let chartHeight = 80;

$: outerPadding = {top: 10, left: 70, right: 20, bottom: 40};

$: chartWidth = width - outerPadding.left - outerPadding.right;

$: xDomain = [0, 100];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, chartWidth]);

$: yDomain = [0, 100];

$: y = scaleLinear()
	.domain(yDomain)
	.range([chartHeight, 0]);

$: hoverIndex = null;

onMount(() => { mounted = true; }) 

$: expand = false;

function updateExpand() {

    expand = true;

}

$: chartPicker = 1;

</script>

{#if mounted}

<div class={"multiScatter"}>

    <div class="chart-title">
    
        <h3>Hartlepool</h3>
       
    </div>

<SelectComparisonAreas
{areas}
areasWithData={["parent", "country", "uk"]}
></SelectComparisonAreas>


<Key
rolesArray={rolesArray.filter((e) => !["neighbour", "similar"].includes(e))}
radius=5
line={false}
{visibleAreas}
></Key>

{#each filteredData as row, i}

{#if i < 5 || expand}

<div class="rowContainer" bind:clientWidth={width}>

<p>{row.indicator.label}</p>

<svg width={width-200}
height={chartHeight}>

    <ViolinPlot
    width={width-200}
    height={chartHeight}
    {row}
    distributionData={distributionData[row.indicator.code]}
    {rolesArray}
    ></ViolinPlot>

</svg>

</div>

{/if}


{/each}

{#if !expand}

<p on:click={updateExpand}>Show all health-related indicators</p>

{/if}


</div>

{/if}


<style>

p {
    text-align: right;
    font-size: 16px;
    width: 180px;
    padding-right: 20px;
    padding-left: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    margin: 0px;
}

.rowContainer {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
}

svg {
    overflow: visible;
}


</style>