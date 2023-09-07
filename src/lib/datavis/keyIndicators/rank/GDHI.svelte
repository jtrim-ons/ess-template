<script>

export let mainAreaName, comparisonAreaName, mainValue, comparisonValue;

let additionalComparisonText = mainValue > comparisonValue ? "Disposable household income in "+mainAreaName+" is £"+Math.round(mainValue-comparisonValue).toLocaleString()+" higher than the "+comparisonAreaName+"-wide average." :
        "Disposable household income in "+mainAreaName+" is £"+Math.abs(Math.round(mainValue-comparisonValue)).toLocaleString()+" lower than the "+comparisonAreaName+"-wide average.";

</script>


<p class="additionalInfoText">{@html additionalComparisonText}</p>


<style>

.additionalInfoText {
    padding-left: 5px;
    font-size: 16px;
    line-height: 22px;
    margin-right: 20px;
}






</style>