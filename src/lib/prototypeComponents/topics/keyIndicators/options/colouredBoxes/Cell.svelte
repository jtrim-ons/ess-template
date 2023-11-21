<script>

import { bivariateColourObj } from "$lib/config";
import { roundNumber, addThousandsSeparator } from "$lib/utils";

export let calculations, indicatorMetadata, latestData, initialData, labelsArray, comparisonsId, rowNumb;

$: latestValue = latestData.length > 0 ? latestData[0].value : null;
$: initialValue = initialData.length > 0 ? initialData[0].value : null;

$: changePercentage = latestValue != null & initialValue != null ? 100*(latestValue - initialValue)/initialValue: null;
$: comparisonPercentage = latestValue != null ? 100*(latestValue - calculations.medianValue)/calculations.medianValue: null;

$: changeText = changePercentage != null ? (Math.abs(changePercentage) < indicatorMetadata.similarThreshold ? "similar" : changePercentage > 0 ? (indicatorMetadata.polarity == 1 ? "improving" : "worsening") : (indicatorMetadata.polarity == 1 ? "worsening" : "improving")) : null;
$: comparisonText = comparisonPercentage != null ? (Math.abs(comparisonPercentage) < indicatorMetadata.similarThreshold ? "similar" : comparisonPercentage > 0 ? (indicatorMetadata.polarity == 1 ? "better than average" : "worse than average") : (indicatorMetadata.polarity == 1 ? "worse than average" : "better than average")) : null;

//$: rectColour = changeText == null & comparisonText == null ? "grey" : bivariateColourObj[changeText != null & [1,2].includes(comparisonsId) ? changeText : "similar"][comparisonText != null & [0,2].includes(comparisonsId) ? comparisonText : "similar"];

$: rectColour = changeText == null & comparisonText == null ? "grey" : comparisonsId === 0 ? {"worse than average" : "#e88676", "similar": "#c9c9c9", "better than average": "#74b57b"}[comparisonText] : comparisonsId === 1 ? changeText === null ? "grey" :  {"worsening" : "#e88676", "similar": "#c9c9c9", "improving": "#74b57b"}[changeText] : bivariateColourObj[changeText != null & [1,2].includes(comparisonsId) ? changeText : "similar"][comparisonText != null & [0,2].includes(comparisonsId) ? comparisonText : "similar"]; 

let prefix = indicatorMetadata.prefix === null ? "" : indicatorMetadata.prefix;
let suffix = indicatorMetadata.suffix === null ? "" : indicatorMetadata.suffix;

$: mainText = latestValue != null ? prefix+addThousandsSeparator(roundNumber(latestValue, indicatorMetadata.decimalPlaces))+suffix : "No data";
$: secondaryValue = initialValue != null ? prefix+addThousandsSeparator(roundNumber(initialValue, indicatorMetadata.decimalPlaces))+suffix : "No data";
$: secondaryText = initialValue != null ? (rowNumb === 0 ? "("+secondaryValue+" in "+calculations.minXDomain+")" : "("+secondaryValue+")") : "No data";

</script>


<div class="cell-container {latestValue == null ? "no-data" : ""}" style="background-color: {rectColour}; color: {mainText != "No data" & (changeText != null | comparisonsId != 1) ? "black" : "white"};">

    {#if labelsArray.includes(0)}

        <p class="mainText" style="font-size: {mainText.length <= 5 ? "18px" : mainText.length <= 6 ? "16px": mainText.length <= 7 ? "14px" : "12px"}">{mainText}</p>

    {/if}

    {#if initialValue != null & latestValue != null & labelsArray.includes(1) & labelsArray.includes(0)}

        <p class="secondaryText" style="font-size: {secondaryValue.length <= 5 ? "12px" : "10px"}; line-height: {secondaryValue.length <= 5 ? "13px" : "11px"}">{secondaryText}</p>

    {/if}

</div>


<style>

.cell-container {
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.cell-container p {
    margin: 0px;
}

.mainText {
    padding: 0px 1px 0px 1px;
    line-height: normal;
}

.secondaryText {
    padding: 0px 1px 0px 1px;
    line-height: normal;
}



.no-data p {
    padding: 0px 5px 0px 5px;
    font-size: 14px;
    line-height: 16px;
    font-style: italic;
}






</style>