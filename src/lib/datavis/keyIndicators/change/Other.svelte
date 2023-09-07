<script>

export let mainAreaName, comparisonAreaName, changeValue, changePercent, mainValue, mainValueInitial, indicator, prefix, suffix, subTextShort, length;

let text;

if (length === "short") {

    if (indicator.changeSentence === "percent") {

        text = changeValue === 0 ? "No change from " : (Math.abs(changePercent) + "% " + (changeValue > 0 ? "increase" : "descrease") + " from ") + indicator.defaultInitialYear + " to " + indicator.latestYear +".";

    } else if (indicator.changeSentence === "absolute") {

        text = (changeValue === 0 ? "No change from" : ((changeValue > 0 ? "Rose by " : "Fell by ") + prefix+Math.abs(changeValue.toFixed(indicator.roundingFactor))+suffix+subTextShort)+ " from ") + indicator.defaultInitialYear + " to " + indicator.latestYear +".";

    } else if (indicator.changeSentence === "both") {

        text = changeValue === 0 ? "No change between " + indicator.defaultInitialYear + " and " + indicator.latestYear +"." : (changeValue > 0 ? "Rose from " : "Fell from ") + prefix+mainValueInitial+suffix+subTextShort+ " in " + indicator.defaultInitialYear + " to " + prefix+mainValue+suffix+subTextShort + " in " + indicator.latestYear + "."; 

    }


    //text = (differenceValue == 0 ? "Equal" : differenceValue > 0 ? (far ? "Far above" : "Above") : (far ? "Far below" : "Below")) + " " +comparisonAreaName+"-wide average" + (differenceValue == 0 ? "." : " ("+prefix+Math.abs(comparisonValue).toLocaleString()+suffix+subTextShort+").") ; 

} else if (length === "medium") {

    text = differenceValue == 0 ? indicator.label +" in "+mainAreaName+" is equal to the "+comparisonAreaName+"-wide average." : indicator.label +" in "+mainAreaName+" is "+prefix+Math.abs(differenceValue).toLocaleString()+suffix+" "+subTextShort+(differenceValue ? " higher" : " lower")+" than the "+comparisonAreaName+"-wide average.";

}

</script>


<p class="additionalInfoText">{@html text}</p>


<style>

.additionalInfoText {
    padding-left: 5px;
    font-size: 16px;
    line-height: 22px;
    margin-right: 20px;
}






</style>