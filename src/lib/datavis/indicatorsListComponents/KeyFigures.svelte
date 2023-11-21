<script>

import { base } from "$app/paths";
import { getContext } from 'svelte';
import { roundNumber, addThousandsSeparator } from "$lib/utils";

export let width = 400, indicators, latestData, initialData, selectedAreas;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations").filter((e) => indicators.includes(e.id));

let indicatorLabelMaxStringLength = 0;
let indicatorLabelMaxWordLength = 0;

$: console.log(latestData)

let listData = [];

indicatorsCalculations.forEach((e) => {

    let indicatorMetadata = indicatorsMetadata.find((el) => el.code == e.code)

    e.medianValue = e.ltCount > 200 ? e.ltMedian : e.utCount > 140 ? e.utMedian : e.ukValue != 'NA' ? e.ukValue : e.gbValue != 'NA' ? e.gbValue : e.ewValue != 'NA' ? e.ewValue : e.engValue != 'NA' ? e.engValue : null;

    e.label = indicatorsMetadata.find((el) => el.code == e.code).label;

    let indicatorInitialData = initialData.filter((el) => e.id === el.id)
    let indicatorLatestData = latestData.filter((el) => e.id === el.id)

    let latestValue = indicatorLatestData.length > 0 ? indicatorLatestData[0].value : null;
    let initialValue = indicatorInitialData.length > 0 ? indicatorInitialData[0].value : null;

    let changePercentage = latestValue != null & initialValue != null ? 100*(latestValue - initialValue)/initialValue: null;
    let comparisonPercentage = latestValue != null ? 100*(latestValue - e.medianValue)/e.medianValue: null;

    let changeText = changePercentage != null ? (Math.abs(changePercentage) < indicatorMetadata.similarThreshold ? "Little change" : changePercentage > 0 ? (indicatorMetadata.polarity == 1 ? "Improving" : "Worsening") : (indicatorMetadata.polarity == 1 ? "Worsening" : "Improving")) : null;
    let comparisonText = comparisonPercentage != null ? (Math.abs(comparisonPercentage) < indicatorMetadata.similarThreshold ? "Similar to average" : comparisonPercentage > 0 ? (indicatorMetadata.polarity == 1 ? "Better than average" : "Worse than average") : (indicatorMetadata.polarity == 1 ? "Worse than average" : "Better than average")) : null;

    let prefix = indicatorMetadata.prefix === null ? "" : indicatorMetadata.prefix;
    let suffix = indicatorMetadata.suffix === null ? "" : indicatorMetadata.suffix;

    e.mainText = latestValue != null ? prefix+addThousandsSeparator(roundNumber(latestValue, indicatorMetadata.decimalPlaces))+suffix : "No data";
    e.secondaryValue = initialValue != null ? prefix+addThousandsSeparator(roundNumber(initialValue, indicatorMetadata.decimalPlaces))+suffix : "No data";

    e.latestValue = latestValue
    e.initialValue = initialValue

    e.changeText = changeText
    e.comparisonText = comparisonText

    e.prefix = prefix
    e.suffix = suffix
    e.subText = indicatorMetadata.subText;
    
    listData.push(e)
})

$: col1Width = 250;
$: col2Width = 140;
$: col3Width = (width-col1Width-col2Width)/2;
$: col4Width = (width-col1Width-col2Width)/2;

</script>
    
<div class="keyFiguresListContainer" bind:clientWidth={width}>

    {#each listData.filter((e) => e.mainText != "No data") as row, i}

        <div class="rowContainer" style="grid-template-columns: [line1] {col1Width}px [line2] {col2Width}px [line3] {col3Width}px [line4] {col4Width}px [end]; background-color: {i % 2 === 0 ? "#fafafa" : "#ffffff"}">

            <p class="col1">{row.label}</p>

            <div class="col2">
                <p class="mainValue">{@html row.mainText}</p>
                <p class="subText">{@html row.subText}</p>
            </div>

            <p class="col3 {(["Above average", "Below average"].includes(row.comparisonText) ? null : row.comparisonText === "Similar to average" ? "headlineLabelOkay" : row.comparisonText === "Worse than average" ? "headlineLabelBad" : "headlineLabelGood")}"
            >{row.comparisonText}</p>

            {#if row.initialValue != null}

                <p class="col4 {(["Increasing", "Falling"].includes(row.changeText) ? null : row.changeText === "Little change" ? "headlineLabelOkay" : row.changeText === "Worsening" ? "headlineLabelBad" : "headlineLabelGood")}">{row.changeText}</p>
            
            {/if}

        </div>

    {/each}

</div>


<img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

    
    

<!--     
<div class="gridContainer">

    {#each gridData as row, i}

        <div class="flexContainer">

            {#if true}


                <p class="col1">{row.indicator.label}</p>

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


</div> -->

<style>

.keyFiguresListContainer {
    border-radius: 0px 5px 5px 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

.rowContainer {
    margin: 0px 5px 0px 5px;
    display: grid;
    padding: 15px 0px 15px 0px;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
}

.mainValue {
    font-weight: bold;
    font-size: 26px;
    padding: 0px;
    margin: 0px;
}

.subText {
    font-weight: bold;
    font-size: 16px;
    padding: 0px;
    margin: 0px;
}


.gridContainer {
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
    margin-bottom: 20px;

}

.col1 {
    padding: 0px 20px 0px 5px;
    font-size: 16px;
    line-height: 20px;
    margin: auto 0px auto 0px;
}

.col2 {
    padding: 0px;
    margin: auto 20px auto 0px;
}

.col3 {
    max-width: 100px;
    margin: auto;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    display: block;
    border-radius: 8px;
    padding: 0px 1px 1px 1px;
    font-weight: bold;
}

.col4 {
    max-width: 100px;
    margin: auto;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    display: block;
    border-radius: 8px;
    padding: 0px 1px 1px 1px;
    font-weight: bold;
}


.headlineLabelGood {
    background-color: #e0ffe2;
    color: #5da65a;
    box-shadow: 0 0 5px 5px #e0ffe2;
}

.headlineLabelBad {
    color: #e0656b;
    background-color: #ffebec;
    box-shadow: 0 0 5px 5px #ffebec;
}

.headlineLabelOkay {
    background-color: #f5f5f5;
    color: grey;
    box-shadow: 0 0 5px 5px #f5f5f5;
}


p {
}


</style>