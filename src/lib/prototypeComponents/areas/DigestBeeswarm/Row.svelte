<script>

import DigestRow from '$lib/prototypeComponents/areas/DigestBeeswarm/Digest/DigestRow.svelte';
import BeeswarmRow from '$lib/prototypeComponents/areas/DigestBeeswarm/Beeswarm/BeeswarmRow.svelte';
import InfoButton from '$lib/prototypeComponents/general/info/InfoButton.svelte';

import { getContext } from 'svelte';
import { scaleLinear } from 'd3-scale';
import { calculateMedian, addThousandsSeparator, roundNumber } from '$lib/utils';
import { medianAbsoluteDeviationLimit } from '$lib/config';

export let chosenId2, chosenIdGeneralised, indicator, metadata, calculations, latestData, initialData, otherData, col1Width, col2Width, col3Width, col4Width, rowNumb, topicNumb, baselineComparisonArea, visibleAreas, svgHeight, svgOuterPadding, scaleHeight, scaleWidth, yDomainGlobal, y;

let selectedArea = getContext("selectedArea");

let periodsLookup = getContext("periodsLookup");

let areasWithSameGeog = getContext("areasWithSameGeog");

$: previousPeriod = periodsLookup.find((e) => parseFloat(e.xDomainNumb) == (chosenId2 === "earliest available year" ? calculations.minXDomain : parseFloat(calculations.maxXDomain) - {"previous year": 1, "5 years earlier": 5, "10 years earlier": 10}[chosenId2]));

$: previousData = previousPeriod == null ? [] : chosenId2 === "earliest available year" ? initialData : [...initialData,...otherData].filter((e) => parseFloat(e.xDomainNumb) == previousPeriod.xDomainNumb);

let mainLatestData = latestData.find((e) => e.areacd === selectedArea.areacd);
let mainLatestValue = mainLatestData == null ? null : mainLatestData.value;

$: mainPreviousData = previousData.find((e) => e.areacd === selectedArea.areacd);
$: mainPreviousValue = mainPreviousData == null ? null : mainPreviousData.value;

$: backgroundLatestData = latestData.filter((e) => areasWithSameGeog.includes(e.areacd));
$: medianValue = calculateMedian(backgroundLatestData, "value");

$: deviations = backgroundLatestData.map(((e) => Math.abs(e.value - medianValue)));
$: medianAbsoluteDeviation = calculateMedian(deviations);

$: comparisonLatestData = latestData.find((e) => e.areacd === baselineComparisonArea.areacd);
$: comparisonLatestValue = baselineComparisonArea === "median" ? medianValue : comparisonLatestData == null ? null : comparisonLatestData.value;

///////
$: xDomain = [-metadata.polarity*medianAbsoluteDeviationLimit, metadata.polarity*medianAbsoluteDeviationLimit];

$: x = scaleLinear()
    .domain(xDomain)
    .range([0, scaleWidth]);

let hoverIndex = null;
let hoverChartIndex = null;


</script>

<div class="row-container" style={"grid-template-columns: [line1] "+col1Width+"px [line2] "+col2Width+"px "+(chosenIdGeneralised === 'digest' ? "[line3] "+col3Width+"px [line4] "+col4Width/2+"px [line5] "+col4Width/2+"px [end]" : "[line3] "+(col3Width+col4Width)+"px [end]")+"; background-color: "+(rowNumb % 2 === 0 ? "#fafafa" : "#ffffff")}>

    <div class="col1">
        <p><a href="https://www.ons.gov.uk/">{indicator.label}</a><InfoButton></InfoButton></p>
    </div>

    <p class="col2">{periodsLookup.find((e) => e.xDomainNumb === calculations.maxXDomain).label}</p>

    {#if chosenIdGeneralised === 'digest'}

        <div class=col3>
            <div>

                <h3>{mainLatestValue == null ? "-" : metadata.prefix+addThousandsSeparator(roundNumber(mainLatestValue, metadata.decimalPlaces))+metadata.suffix}</h3>
                <p>{metadata.subText}</p>

            </div>
        </div>

        <DigestRow 
        {baselineComparisonArea}
        {mainLatestValue}
        {mainPreviousValue}
        {comparisonLatestValue}
        {medianAbsoluteDeviation}
        {previousPeriod}  
        {metadata}   
        earliestPeriod={periodsLookup.find((e) => e.xDomainNumb === calculations.minXDomain)}   
        ></DigestRow>

    {:else}

        <BeeswarmRow
        firstRow={topicNumb === 0 & rowNumb === 0}
        width={col3Width+col4Width}
        {scaleWidth}
        height={svgHeight}
        {scaleHeight}
        outerPadding={svgOuterPadding}
        {latestData}
        {backgroundLatestData}
        bind:hoverIndex={hoverIndex}
        bind:hoverChartIndex={hoverChartIndex}
        {medianValue}
        {medianAbsoluteDeviation}
        {visibleAreas}
        bind:yDomainGlobal={yDomainGlobal}
        {y}
        {x}
        {metadata}
        ></BeeswarmRow>

    {/if}

</div>






<style>

p {
    font-size: 16px;
}

.row-container {
    margin: 0px;
    display: grid;
    padding: 25px 0px 25px 0px;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
}

.col1 {
    margin: auto 0px auto 0px;
    padding: 0px 10px 0px 10px;
    height: 100%;
    border-right-style: solid;
    border-right-color: #cbd5e1;
    border-right-width: 1px;
    display: flex;
    justify-content: baseline;
    align-items: center;
}

.col1 p {
    margin: auto 0px;
    padding: 0px;
}

.col2 {
    margin: auto 0px auto 0px;
    padding: 0px 4px 0px 4px;
    text-align: center;
    font-size: 16px;
    height: 100%;
    border-right-style: solid;
    border-right-color: #cbd5e1;
    border-right-width: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.col3 {
    margin: auto 0px auto 0px;
    padding: 4px 10px 0px 10px;
    height: 100%;
    border-right-style: solid;
    border-right-color: #cbd5e1;
    border-right-width: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.col3 h3 {
    padding: 0px;
    margin: 0px;
    line-height: 18px;
    font-size: 18px;
    text-align: center;

}

.col3 p {
    font-size: 14px;
    font-weight: bold;
    padding: 0px;
    margin: 0px;
    text-align: center;
}







</style>