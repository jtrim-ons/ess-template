<script>

import { getContext } from 'svelte';
import { calculateMedian, addThousandsSeparator, roundNumber } from '$lib/utils';

export let earliestPeriod, baselineComparisonArea, mainLatestValue, mainPreviousValue, comparisonLatestValue, medianAbsoluteDeviation, previousPeriod, metadata;

let selectedArea = getContext("selectedArea");

$: differenceFromComparison = mainLatestValue == null | comparisonLatestValue == null ? null : metadata.polarity*(mainLatestValue - comparisonLatestValue)/medianAbsoluteDeviation;

$: differenceFromPrevious = mainLatestValue == null | mainPreviousValue == null ? null : metadata.polarity*(mainLatestValue - mainPreviousValue)/medianAbsoluteDeviation;

$: changeCalculation = mainLatestValue == null | mainPreviousValue == null ? null : (mainLatestValue - mainPreviousValue)/(metadata.howToMeasureChange == "percent" ? mainPreviousValue : 1);

$: comparisonAreaName = baselineComparisonArea === "median" ? "median" : baselineComparisonArea.areanm === "United Kingdom" ? "UK" : baselineComparisonArea.areanm;

$: comparisonText = mainLatestValue == null ? "No data" : comparisonLatestValue == null ? "No data for "+comparisonAreaName : (differenceFromComparison < -1 ? "Worse than "+comparisonAreaName : differenceFromComparison < 1 ? "Similar to "+comparisonAreaName : "Better than "+comparisonAreaName)+" ("+metadata.prefix+addThousandsSeparator(roundNumber(comparisonLatestValue, metadata.decimalPlaces))+metadata.suffix+")";

$: comparisonBackgroundColor = differenceFromComparison == null ? null : differenceFromComparison < -5 ? "RGBA(197,27,125,0.5)" : differenceFromComparison < -3 ? "RGBA(233,163,201,0.5)" : differenceFromComparison < -1 ? "RGBA(253,224,239,0.5)" : differenceFromComparison < 1 ? "#F7F7F7" : differenceFromComparison < 3 ? "RGBA(230,245,208,1)" : differenceFromComparison < 5 ? "RGBA(161,215,106,0.5)" : "RGBA(77,146,33,0.5)";

$: changeBackgroundColor = differenceFromPrevious == null ? null : differenceFromPrevious < -5 ? "RGBA(197,27,125,0.5)" : differenceFromPrevious < -3 ? "RGBA(233,163,201,0.5)" : differenceFromPrevious < -1 ? "RGBA(253,224,239,0.5)" : differenceFromPrevious < 1 ? "#F7F7F7" : differenceFromPrevious < 3 ? "RGBA(230,245,208,1)" : differenceFromPrevious < 5 ? "RGBA(161,215,106,0.5)" : "RGBA(77,146,33,0.5)";

$: changeText = mainLatestValue == null | previousPeriod == null ? "No data" : mainPreviousValue == null ? (previousPeriod.xDomainNumb < earliestPeriod.xDomainNumb ? "No data before "+earliestPeriod.label : "No data") : (differenceFromPrevious < -1 ? "Worsened": differenceFromPrevious < 1 ? "Little change" : "Improved")+" since "+previousPeriod.label;


</script>


<div class="col4a">
    <p style={comparisonBackgroundColor == null ? null : "background-color: "+comparisonBackgroundColor+";box-shadow: 0 0 4px 3px "+comparisonBackgroundColor+";"}>{comparisonText}</p>
</div>

<div class="col4b">
    <p style={changeBackgroundColor == null ? null : "background-color: "+changeBackgroundColor+";box-shadow: 0 0 4px 3px "+changeBackgroundColor+";"}>{changeText}</p>
</div>


<style>


.col4a {
    margin: auto 0px;
    padding: 0px;
    border-right-style: solid;
    border-right-color: #cbd5e1;
    border-right-width: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.col4b {
    margin: auto 0px;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}


p {
    margin: 0px 20px 0px 20px;
    padding: 0px;
    font-size: 16px;
    line-height: 18px;
    text-align: center;
}



</style>