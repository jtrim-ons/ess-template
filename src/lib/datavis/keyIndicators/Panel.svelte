<script>

import { getContext } from 'svelte';
import { base } from "$app/paths";
import RankOther from './rank/Other.svelte';
import ChangeOther from './change/Other.svelte'
import { thresholdObject, defaultThresholdArray, comparisonTextObject, changeTextObject } from '$lib/config';

export let indicator, latestData, initialData, selectedAreas;

let areas = getContext('areas');

let customisedIndicators = {
    //gdhi: [RankGDHI, ""],

}

let roundingFactor = Math.pow(10, indicator.roundingFactor);

let mainArea = latestData.find((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd);
let mainValue = Math.round(mainArea.value*roundingFactor)/roundingFactor;
let mainAreaName = areas.find((e) => e.areacd === mainArea.areacd).areanm;

let countryData = latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "country").data.areacd);
let ukData = latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "uk").data.areacd);
let parentData = latestData.filter((e) => e.areacd === selectedAreas.find((el) => el.role === "parent").data.areacd);

let comparisonData = countryData.length > 0 ? countryData[0] : ukData.length > 0 ? ukData[0] : parentData.length > 0 ? parentData[0] : undefined;
let comparisonValue = Math.round(comparisonData.value*roundingFactor)/roundingFactor;
let comparisonAreaName = areas.find((e) => e.areacd === comparisonData.areacd).areanm;
comparisonAreaName = comparisonAreaName === "United Kingdom" ? "UK" : comparisonAreaName;

let differenceValue = mainValue-comparisonValue;

let thresholdArray = indicator.code in thresholdObject ? thresholdObject[indicator.code] : defaultThresholdArray;

let similar = Math.abs(differenceValue)/comparisonValue < thresholdArray[0]/100;
let far = Math.abs(differenceValue)/comparisonValue > thresholdArray[1]/100;

let comparisonText =  similar ? comparisonTextObject["similar"] : mainValue > comparisonValue ? comparisonTextObject.high[indicator.highEqualsGood] : comparisonTextObject.low[indicator.highEqualsGood];

let mainValueInitial = initialData === undefined ? null : Math.round(initialData.find((e) => e.areacd === selectedAreas.find((el) => el.role === "main").data.areacd).value*roundingFactor)/roundingFactor;

let changeValue = (mainValue-mainValueInitial)
let changePercent = Math.abs(changeValue/mainValueInitial*100) < 1 ? (Math.round(changeValue/mainValueInitial*1000)/10) : Math.round(changeValue/mainValueInitial*100);
let noChange = Math.abs(changePercent) < thresholdArray[0];

let changeText = noChange ? changeTextObject["similar"] : mainValue > mainValueInitial ? changeTextObject.high[indicator.highEqualsGood] : changeTextObject.low[indicator.highEqualsGood];

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
            {differenceValue}
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

                <svelte:component this={indicator.code in customisedIndicators ? customisedIndicators[indicator.code][0] : ChangeOther}
                {mainAreaName}
                {comparisonAreaName}
                {mainValue}
                {mainValueInitial}
                {changeValue}
                {changePercent}
                {indicator}
                {prefix}
                {suffix}
                {subTextShort}
                length="short"
                />

                
            

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