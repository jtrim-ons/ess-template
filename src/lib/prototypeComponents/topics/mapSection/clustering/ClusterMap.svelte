<script>

import { getContext } from 'svelte';
import Map from "$lib/prototypeComponents/general/mapping/Map.svelte";
import SelectAreas from '$lib/prototypeComponents/general/selections/SelectAreas.svelte';
import { clusterColourPalette } from '$lib/config';

export let clusterName;

$: console.log(clusterName)

let clustersInfo = getContext("clustersInfo");
$: clustersLookup = getContext("clustersLookup").filter((e) => e.model == clusterName);

let areasGeogLevel = getContext("areasGeogLevel").filter((e) => e.areacd[0] === "E");

let areasForPlotting = areasGeogLevel.filter((e) => ["both", "lower"].includes(e.level)).map((e) => e.areacd);
$: mapData  = clustersInfo.filter((el) => areasForPlotting.includes(el.areacd)).map((e) => {return {areacd: e.areacd, value: e[clusterName]}}).filter((e) => e.value != "" & e.value != null);

$: colourObj = clusterColourPalette[clustersLookup.length];

$: checkboxedRoles = {custom: null};

</script>

<div class="legend-and-map-container">

<div class="legend-container">

    <div class="select-areas-container">

        <!-- <SelectAreas
        areasWithData={areasForPlotting}
        bind:checkboxedRoles={checkboxedRoles}
        colors={Array.from({ length: 8 }, () => "#003C57")}
        ></SelectAreas> -->

    </div>

    <div class="cluster-info">

        <p style="margin-bottom: 10px;">On this map, areas with similar local data on {clusterName} have been grouped into clusters.</p>

        <p><a target="_blank" href="https://www.ons.gov.uk/peoplepopulationandcommunity/wellbeing/articles/clusteringlocalauthoritiesagainstsubnationalindicatorsengland/2023-02-24">Learn more about the Office for National Statistics' clustering analysis.</a></p>

    </div>

    <div class="clusters-desc-container">

        {#each [...new Set(mapData.map((e) => e.value))].sort((a,b) => a - b) as cluster, i}

        <div class="cluster-container" style="background-color: {i % 2 === 0 ? "#fafafa" : "#ffffff"}">

            <div class="cluster" style="border-left-style: solid; border-left-color: {colourObj[cluster]}; border-left-width: 5px;">

                <p>
                    {@html mapData.filter((e) => e.value === cluster).length + " areas belong to the <span style='font-weight: bold; color:"+colourObj[cluster]+"'>"+(clustersLookup.find((e) => e.id == cluster).alternativeDescription).toLowerCase()+"</span> cluster." }
                </p>

            </div>

        </div>

        {/each}




    </div>

</div>

<Map
data={mapData}
idKey="areacd"
valueKey="value"
mapRange="ew"
useBreaks={false}
{colourObj}
></Map>

</div>



<style>

.legend-and-map-container {
    display: flex;
    flex-direction: row;
}

.legend-container {
    width: 50%;
    padding: 0px 10px 0px 0px;
}

.cluster-info {
    margin: 10px 0px 0px 0px;
    padding: 5px 10px 15px 15px; 
    background-color:#F5F5F6;
    border-radius: 10px;
}

.cluster-info p {
    padding: 0px;
    margin: 0px;
    font-size: 16px;
    line-height: 20px;
}

.clusters-desc-container {
    padding: 0px 0px 10px 0px;
    margin: 10px 0px 0px 0px;
}

.cluster-container {
    margin: 0px;
    padding: 10px;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
}

.cluster {
    margin: 0px;
    padding: 0px;
}

.cluster p {
        padding: 0px 10px 0px 10px;
        margin: 0px;
        font-size: 16px;
        line-height: 18px;
        text-align: left;
}





</style>