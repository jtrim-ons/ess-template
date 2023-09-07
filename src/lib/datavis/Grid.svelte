<script>

import { getContext } from 'svelte';
import { thresholdObject, defaultThresholdArray} from '$lib/config';
import { select } from 'd3-selection';

export let indicators, latestData, initialData, selectedAreas, selectedIndicatorsArray;

let areas = getContext('areas');

let gridData = [[[], [], []], [[], [], []], [[], [], []]];

indicators.forEach((indicator) => {
    
    let roundingFactor = Math.pow(10, indicator.roundingFactor);

    let filteredLatestData = latestData.filter((e) => e.codeId === indicator.id)

    let mainAreaCode = selectedAreas.find((el) => el.role === "main").data.areacd

    let mainValue = filteredLatestData.filter((e) =>  e.areacd === mainAreaCode);
    mainValue = mainValue.length > 0 ? mainValue[0].value : undefined;

    if (mainValue != undefined) {

        let countryData = filteredLatestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "country").data.areacd);
        let ukData = filteredLatestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "uk").data.areacd);
        let parentData = filteredLatestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "parent").data.areacd);

        let comparisonData = countryData.length > 0 ? countryData[0] : ukData.length > 0 ? ukData[0] : parentData.length > 0 ? parentData[0] : undefined;
        let comparisonValue = comparisonData != undefined ? comparisonData.value: undefined;
        
        let filteredInitialData = indicator.code in initialData ? initialData[indicator.code] : [];

        let mainValueInitial = filteredInitialData.filter((e) => e.areacd === mainAreaCode);
        mainValueInitial = mainValueInitial.length > 0 ? mainValueInitial[0].value : undefined;

        let thresholdArray = indicator.code in thresholdObject ? thresholdObject[indicator.code] : defaultThresholdArray;
        
        let similar = mainValue === undefined || comparisonValue === undefined ? true : Math.abs(mainValue - comparisonValue)/comparisonValue < thresholdArray[0]/100;
        let comparison = similar ? 1 : mainValue < comparisonValue ? 0 : 2;

        let noChange = mainValue === undefined || mainValueInitial === undefined ? true : Math.abs(mainValue - mainValueInitial)/mainValueInitial < thresholdArray[0]/100;
        let change = noChange ? 1 : mainValue < mainValueInitial ? (indicator.highEqualsGood === "F" ? 2 : 0) : (indicator.highEqualsGood === "F" ? 0 : 2)

        gridData[change][[comparison]].push(indicator.label)

    }
})

let colNames = ["Worse than average", "Close to average", "Better than average"];
let rowNames = ["Worsening", "Little change", "Improving"];

function mouseClickEvent(event) { 

    let indicator = select(this).text();

    if (selectedIndicatorsArray.includes(indicator)) {

        selectedIndicatorsArray = selectedIndicatorsArray.filter((e) => e != indicator);

    } else {

        selectedIndicatorsArray = [...selectedIndicatorsArray, indicator];
    }
}

</script>





<div class="gridContainer">

    <table>
        <tr class="tableHeaders">
            <th id="col0"></th>
            
            {#each colNames as column, i} 

                <th id={"col"+(i+1)}>{column}</th>

            {/each}
        </tr>


        {#each gridData as row, i}

            <tr>
                <th id="col0">{rowNames[i]}</th>

                {#each row as cell, j}

                    <th id={"col"+(i+1)}>

                        {#each cell as indicator} 
                            <p on:click={mouseClickEvent}
                             class={selectedIndicatorsArray.includes(indicator) ? "selected" : "unselected"}>{indicator}</p>
                        {/each}

                    </th>

                {/each}
            </tr>
        {/each}

    </table>

    <p style="padding-top: 15px; padding-left: 120px">Click on an indicator to add it to the chart below.</p>




</div>

<style>

.gridContainer {
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
    margin-bottom: 20px;
}

.tableHeaders th {
    padding: 25px;
    border: none;
    font-weight: normal;
}

table, th, td {
    border: 1px solid;
    border-color: #f0f0f0;
    text-align: center;
    padding: 0px;
    border-radius: 10px;
    border-spacing: 0;
    border-collapse: separate;
    table-layout: fixed;
    width: 100%;
}

table {
    border: 0px;
}

#col0 {
    width: 120px;
    padding: 5px;
    border: none;
    font-weight: normal;
}


 p {
    font-size: 16px;
    font-weight: bold;
    padding: 2px 4px 2px 4px;
    display: inline-flex; /* keep the background color wrapped tight */
    margin: 4px 4px 4px 4px;
    border-radius: 8px;
    cursor: pointer;
 }

 .unselected {
    background-color: #f5f5f5;
    color: #3d3d3d;
 }

 .unselected:hover {
    background-color: #fff6ed;
    color: #F39431;
 }

 .selected {
    background-color: #fff6ed;
    color: #F39431;
 }


</style>