<script>

import { getContext } from 'svelte';
import { thresholdObject, defaultThresholdArray} from '$lib/config';
import { select } from 'd3-selection';
import BeeswarmRowsOption3 from './BeeswarmRowsOption3.svelte';
import SelectComparisonAreas from './SelectComparisonAreas.svelte';
import Key from './shared/Key.svelte';

export let indicators, latestData, initialData, selectedAreas, trimmedIndicators,primaryIndicators,secondaryIndicators,otherIndicators,siblingAreas, checkboxedRoles,selectedArea,parentArea;

let areas = getContext('areas');

$: areasWithData = [...new Set(latestData.map((e) => e.areacd))];

$: plottedAreas = [...selectedAreas.map((e) => e.role === "main" || checkboxedRoles[e.role] ? {role: e.role, areacd: e.data.areacd} : null).filter((e) => e != null),...(checkboxedRoles.custom === null || checkboxedRoles.custom === undefined ? [] : checkboxedRoles.custom.map((e,i) => {return {role: "custom"+(i+1), areacd: e.areacd}}))].filter((e) => areasWithData.includes(e.areacd));

let gridData = [];

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
        let comparison = similar ? "Close to average" : mainValue < comparisonValue ? (indicator.highEqualsGood === "F" ? "Better than average" : "Worse than average") : (indicator.highEqualsGood === "F" ? "Worse than average" : "Better than average");

        let noChange = mainValue === undefined || mainValueInitial === undefined ? true : Math.abs(mainValue - mainValueInitial)/mainValueInitial < thresholdArray[0]/100;
        let change = noChange ? "Little change" : mainValue < mainValueInitial ? (indicator.highEqualsGood === "F" ? "Improving" : "Worsening") : (indicator.highEqualsGood === "F" ? "Worsening" : "Improving")

        gridData.push({indicator: indicator, comparison: comparison, change: change});

    }
})

let selectedIndicatorsArray = [];

let colNames = ["Worse than average", "Close to average", "Better than average"];
let rowNames = ["Worsening", "Little change", "Improving"];

function mouseClickEvent(event) { 


    let indicator = select(this).text()

    if (selectedIndicatorsArray.includes(indicator)) {

        selectedIndicatorsArray = selectedIndicatorsArray.filter((e) => e != indicator);

    } else {

        selectedIndicatorsArray = [...selectedIndicatorsArray, indicator];
    }
}

</script>





<div class="gridContainer">

<SelectComparisonAreas
selectedAreas={selectedAreas.filter((e) => latestData.filter((el) => e.data.areacd === el.areacd).length > 0 & e.role !== "main")}
{areasWithData}
bind:checkboxedRoles={checkboxedRoles}
includeSiblings={false}
{selectedArea}
{parentArea}
></SelectComparisonAreas>

<Key
{plottedAreas}
></Key>

    {#each gridData as row, i}

        <div class="flexContainer">

            {#if !selectedIndicatorsArray.includes(row.indicator.label)}

                <div class=twisty>

                    <svg 
                    style="overflow: visible"
                    width=20
                    height=20>

                        <path
                        transform="translate(10,-5)"
                        d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
                        stroke="black"
                        fill="none"
                        stroke-width="2px"
                        ></path>

                    </svg>

                </div>

                <p class="col1" on:click={mouseClickEvent}>{row.indicator.label}</p>

                <div class={"headlineLabel "+(["Above average", "Below average"].includes(row.comparison) ? null : row.comparison === "Similar to average" ? "headlineLabelOkay" : row.comparison === "Worse than average" ? "headlineLabelBad" : "headlineLabelGood")}>

                    <p class="col2">{row.comparison}</p>

                </div>

                <div class={"headlineLabel "+(["Increasing", "Falling"].includes(row.change) ? null : row.change === "Little change" ? "headlineLabelOkay" : row.change === "Worsening" ? "headlineLabelBad" : "headlineLabelGood")}>

                <p class="col3">{row.change}</p>

                </div>


            {:else} 

                <BeeswarmRowsOption3
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
                selectedIndicatorsArray = {[row.indicator.label]}
                ></BeeswarmRowsOption3>




            {/if}



        </div>




    {/each}


</div>

<style>

.gridContainer {
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
    margin-bottom: 20px;

}

.flexContainer {
    padding-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    cursor: pointer;
}

.flexContainer:hover {
    background-color: #ffe7cf;
}

.col1 {
    width: 45%;
    padding-left: 3%;
    padding-right: 3%;
    font-size: 16px;
    font-weight: bold;
}

.col2 {
    font-size: 14px;
}

.col3 {
    font-size: 14px;
}

.headlineLabel {
    width: 35%;
    padding-left: 1%;
    padding-right: 1%;
}

.headlineLabel p {
    display: inline-flex; /* keep the background color wrapped tight */
    padding: 5px 8px 5px 8px;
    border-radius: 8px;
    font-weight: bold;

}

.headlineLabelGood p {
    background-color: #edffed;
    color: green;

}

.headlineLabelBad p {
    color: red;
    background-color: #ffe0e2;
}

.headlineLabelOkay p {
    background-color: #f5f5f5;
}



</style>