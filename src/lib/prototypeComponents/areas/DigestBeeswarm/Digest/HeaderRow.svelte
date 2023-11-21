<script>

export let col1Width, col2Width, col3Width, col4Width, baselineComparisonArea;

import { getContext } from 'svelte';

let selectedArea = getContext("selectedArea");

$: comparisonAreaName = baselineComparisonArea === "median" ? "median" : baselineComparisonArea.areanm === "United Kingdom" ? "UK" : baselineComparisonArea.areanm;


</script>

<div class="row-container" style={"grid-template-columns: [line1] "+col1Width+"px [line2] "+col2Width+"px [line3] "+col3Width+"px [line4] "+col4Width/2+"px [line5] "+col4Width/2+"px [end]"}>

    <p class="baseline-anchor right-border">Indicator</p>

    <p class="middle-anchor right-border narrow-column">Time period</p>

    <p class="middle-anchor right-border">Value</p>
        
    <p class="middle-anchor right-border">{selectedArea.areanm} compared to {comparisonAreaName}</p>

    <p class="middle-anchor">Change over time for {selectedArea.areanm}</p>

</div>





<style>


.row-container {
    margin: 40px 0px 0px 0px;
    display: grid;
    padding: 4px 0px 4px 0px;
    border-top-style: solid;
    border-top-color: #222;
    border-top-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #222;
    border-bottom-width: 1px;
}

.narrow-column {

}

.right-border {
    border-right-style: solid;
    border-right-color:  #222;
    border-right-width: 1px;
}

p {
    font-weight: bold;
    line-height: 18px;
    font-size: 16px;
    margin: auto 0px auto 0px;
    padding: 10px 5px 10px 5px;
    height: 100%;
    display: flex;
    align-items: center;
}

.baseline-anchor {
    margin: 0px 0px 0px 10px;
    text-align: left;
    justify-content: baseline;
}

.middle-anchor {
    justify-content: center;
    text-align: center;
}


</style>