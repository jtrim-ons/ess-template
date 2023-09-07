<script>

import { getContext } from 'svelte';
import { base } from "$app/paths";
import RankOther from './rank/Other.svelte';
import RankGDHI from './rank/GDHI.svelte';

let areas = getContext('areas');

let customisedIndicators = {
    gdhi: [RankGDHI, ""],

}

export let indicator, latestData, initialData, selectedAreas;


let mainArea = latestData.find((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd);

let mainValue = mainArea.value;
let mainAreaName = areas.find((e) => e.areacd === mainArea.areacd).areanm;

let comparisonTextObject = {high: {T: "Better than average", I: "Above average", F: "Worse than average"}, low: {T: "Worse than average", I: "Below average", F: "Better than average"}, similar: "Similar to average"};
    
let changeTextObject = {high: {T: "Improving", I: "Increasing", F: "Worsening"}, low: {T: "Worsening", I: "Falling", F: "Improving"}, similar: "Little change"};

let countryData = latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "country").data.areacd);
let ukData = latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "uk").data.areacd);
let parentData = latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "parent").data.areacd);

let comparisonData = countryData.length > 0 ? countryData[0] : ukData.length > 0 ? ukData[0] : parentData[0];
let comparisonValue = comparisonData.value;

let thresholdObject = {
    population_density: [10, 50],
    female_life_expectancy: [1, 5],
    gdhi: [5, 20],
    no_qualifications_rate: [10, 20],
    life_satisfaction: [2, 10],
}

let thresholdArray = indicator.code in thresholdObject ? thresholdObject[indicator.code] : [1, 10];

let similar = Math.abs(mainValue - comparisonValue)/comparisonValue < thresholdArray[0]/100;
let far = Math.abs(mainValue - comparisonValue)/comparisonValue > thresholdArray[1]/100;

let comparisonAreaName = areas.find((e) => e.areacd === comparisonData.areacd).areanm;

let comparisonText =  similar ? comparisonTextObject["similar"] : mainValue > comparisonData.value ? comparisonTextObject.high[indicator.highEqualsGood] : comparisonTextObject.low[indicator.highEqualsGood];

let additionalComparisonText;
let additionalChangeText;

let mainValueInitial = initialData === undefined ? null : initialData.find((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd).value;

let changeText = similar ? changeTextObject["similar"] : mainValue > mainValueInitial ? changeTextObject.high[indicator.highEqualsGood] : changeTextObject.low[indicator.highEqualsGood];

if (indicator.code === "population_density") {

    additionalComparisonText = 
        mainValue > comparisonData.value ? mainAreaName+" has a population density "+Math.round(mainValue-comparisonData.value).toLocaleString()+"/km<sup>2</sup> higher than the "+comparisonAreaName+"-wide average." :
        mainAreaName+" has a population density "+Math.round(comparisonData.value-mainValue).toLocaleString()+"/km<sup>2</sup> lower than the "+comparisonAreaName+"-wide average ("+Math.round(comparisonData.value)+"/km<sup>2</sup>)." 

    additionalChangeText = 
        mainValue > mainValueInitial ? "Population density rose by " +Math.round(mainValue-mainValueInitial).toLocaleString()+"/km<sup>2</sup> in "+mainAreaName+" between "+indicator.defaultInitialYear+" and "+indicator.latestYear+"." :
        "Population density fell by " +Math.round(mainValueInitial-mainValue).toLocaleString()+"/km<sup>2</sup> in "+mainAreaName+" between "+indicator.defaultInitialYear+" and "+indicator.latestYear+"." 

} else if (indicator.code === "female_life_expectancy") {

    additionalComparisonText = 
        mainValue > comparisonData.value ? "Female life expectancy in "+mainAreaName+" is "+(Math.round(mainValue-comparisonData.value)).toFixed(1)+" years higher than the "+comparisonAreaName+"-wide average." :
        "Female life expectancy in "+mainAreaName+" is "+(Math.round(comparisonData.value-mainValue)).toFixed(1)+" years lower than the "+comparisonAreaName+"-wide average." 

    additionalChangeText = 
        mainValue > mainValueInitial ? "Female life expectancy rose by " +(Math.round(mainValue-mainValueInitial)).toFixed(1)+" years in "+mainAreaName+" between "+indicator.defaultInitialYear+" and "+indicator.latestYear+"." :
        "Female life expectancy fell by " +(Math.round(mainValue-mainValueInitial)).toFixed(1)+" years in "+mainAreaName+" between "+indicator.defaultInitialYear+" and "+indicator.latestYear+"." 

} else if (indicator.code === "gdhi") {

    additionalChangeText = 
        mainValue > mainValueInitial ? "From "+indicator.defaultInitialYear+" to "+indicator.latestYear+" disposable household income in "+mainAreaName+ " increased by £"+Math.round(mainValue-mainValueInitial).toLocaleString()+"." :
        "From "+indicator.defaultInitialYear+" to "+indicator.latestYear+" disposable household income in "+mainAreaName+ " fell by £"+Math.round(mainValueInitial-mainValue).toLocaleString()+"."

} else if (indicator.code === "no_qualifications_rate") {

    additionalComparisonText = 
        mainValue > comparisonData.value ? "The share of adults without qualifications in " +mainAreaName + " is "+ (Math.round(mainValue-comparisonData.value)).toFixed(1)+" percentage points higher than the "+comparisonAreaName+"-wide average." :
        "The share of adults without qualifications in " +mainAreaName + " is "+ (Math.round(comparisonData.value-mainValue)).toFixed(1)+" percentage points lower than the "+comparisonAreaName+"-wide average."
        
    additionalChangeText = 
        mainValue > mainValueInitial ? "From "+indicator.defaultInitialYear+" to "+indicator.latestYear+" the no qualifications rate in "+mainAreaName+ " increased by "+(Math.round(mainValue-mainValueInitial)).toFixed(1)+" percentage points." :
        "From "+indicator.defaultInitialYear+" to "+indicator.latestYear+" the no qualifications rate in "+mainAreaName+ " fell by "+(Math.round(mainValueInitial-mainValue)).toFixed(1)+" percentage points." 

} else {

    additionalComparisonText = 
        Math.abs(mainValue-comparisonData.value) < 0.25 ? "People in " +mainAreaName + " rated their life satisfaction similarly to the "+comparisonAreaName+"-wide average ("+comparisonData.value.toFixed(1)+" out of 10)." :
        mainValue > comparisonData.value ? "People in " +mainAreaName + " rated their life satisfaction higher than the "+comparisonAreaName+"-wide average ("+comparisonData.value.toFixed(1)+" out of 10)." :
        "People in " +mainAreaName + " rated their life satisfaction lower than the "+comparisonAreaName+"-wide average ("+comparisonData.value.toFixed(1)+" out of 10)."


}



let prefix = indicator.prefix === null ? "" : indicator.prefix === "pounds" ? "£" : indicator.prefix;
let suffix = indicator.suffix === null ? "" : indicator.suffix;
let subText = indicator.subText === null ? "" : indicator.subText;
let subTextShort = indicator.subTextShort === null ? "" : indicator.subTextShort;

</script>

<div class="panelContainer">

    <h3><a href="{base}/indicators/{indicator.code}">{indicator.label}</a></h3>

    <div class="flexH">

        <div class="flexV column1">

            <h4>{prefix+parseFloat(mainValue.toFixed(mainValue > 100 ? 0 : 1)).toLocaleString()+suffix}</h4>

            {#if subText != ""}  <p class="subText">{subText}</p> {/if}

        </div>

        <div class="flexV column2">

            <div class={"headlineLabel "+(["Above average", "Below average"].includes(comparisonText) ? null : comparisonText === "Similar to average" ? "headlineLabelOkay" : comparisonText === "Worse than average" ? "headlineLabelBad" : "headlineLabelGood")}>
                <p>{comparisonText}</p>
            </div>

            <svelte:component this={indicator.code in customisedIndicators ? customisedIndicators[indicator.code][0] : RankOther}
            {mainAreaName}
            {comparisonAreaName}
            {mainValue}
            {comparisonValue}
            {indicator}
            {prefix}
            {suffix}
            {subTextShort}
            {far}
            length="short"
            />

        </div>

        {#if initialData != undefined}

            <div class="flexV column3">

                <div class={"headlineLabel "+(["Increasing", "Falling"].includes(changeText) ? null : changeText === "Little change" ? "headlineLabelOkay" : changeText === "Worsening" ? "headlineLabelBad" : "headlineLabelGood")}>
                    <p>{changeText}</p>
                </div>
                
                <p class="additionalInfoText">{@html additionalChangeText}</p>

            </div>

        {/if}

       

    </div>
</div>


<style>

.panelContainer {
    width: 100%;
    margin-bottom: 20px;
    border-bottom: solid black 1px;
}

h3 {
    margin-bottom: 0px;
    margin-top: 0px;
    padding-top: 0px;
    padding-bottom: 10px;
}

.flexH {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    margin-bottom: 20px;

}

.flexV {
    display: flex;
    flex-direction: column;
}

.column1 {
    margin-right: 40px;
    min-width: 30%;
}

.column2 {
    margin-right: 20px;
    width: 30%;
}

.column3 {
    width: 30%;
}

.headlineLabel {
    margin-top: 10px;
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

h4 {
    line-height: 54px;
    font-size: 50px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    padding-top: 10px;
}

h5 {
    font-size: 18px;
}

.subText {
    max-width: 180px;
    font-weight: bold;
}

p {
    margin-bottom: 0px;
}
    
.additionalInfoText {
    padding-left: 5px;
    font-size: 16px;
    line-height: 22px;
    margin-right: 20px;
}

    
</style>