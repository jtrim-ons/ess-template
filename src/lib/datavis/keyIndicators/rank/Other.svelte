<script>

export let mainAreaName, comparisonAreaName, differenceValue, comparisonValue, indicator, prefix, suffix, subTextShort, far, length;

let roundingFactor = Math.pow(10, indicator.roundingFactor);

let text;

if (length === "short") {

    text = (differenceValue == 0 ? "Equal" : differenceValue > 0 ? (far ? "Far above" : "Above") : (far ? "Far below" : "Below")) + " " +comparisonAreaName+"-wide average" + (differenceValue == 0 ? "." : " ("+prefix+Math.abs(comparisonValue).toLocaleString()+suffix+subTextShort+").") ; 

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