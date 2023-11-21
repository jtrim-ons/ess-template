<script>

import Cell from "$lib/prototypeComponents/topics/keyIndicators/options/dotPlot/Cell.svelte";
import { getContext } from 'svelte';

export let chosenId1, indicatorsMetadata, initialData, latestData, j, row, indicatorsCalculations, maxChangeArray, maxValueFromMedianArray;

let areas = getContext("areas");

console.log(maxChangeArray)

</script>

<div class={"row cellRow"+j} style="background-color: {j % 2 === 0 ? "#fafafa" : "#ffffff"}">

    <div class="areasColumn" style={"width: 200px"}>

        <p>{areas.find((e) => e.areacd === row.areacd).areanm}</p>    
    
    
    </div>

    {#each indicatorsCalculations as calculations, i}

        <div class={"cell column"+i}>

            <Cell
            {calculations}
            indicatorMetadata={indicatorsMetadata.find((e) => e.code == calculations.code)}
            latestData={latestData.filter((e) => calculations.id == e.id & row.areacd == e.areacd)}
            initialData={"indicator-"+calculations.id in initialData ? initialData["indicator-"+calculations.id].filter((e) => e.areacd == row.areacd) : []}
            maxChange={maxChangeArray[i]}
            maxValueFromMedian={maxValueFromMedianArray[i]}
            ></Cell>

        </div>

    {/each}

</div>





<style>

.row {
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
    display: flex;
    flex-direction: row;
    margin: 0px;
    padding: 10px 0px 10px 0px;
}

.cell {
    width: 60px;
    margin: 0px 10px 0px 10px;
}

.areasColumn {
    display: flex;
    flex-direction: row;
    align-content: center;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.areasColumn p {
    padding: 0px 10px 0px 0px;
    margin: 0px;
    text-align: end;
}



</style>