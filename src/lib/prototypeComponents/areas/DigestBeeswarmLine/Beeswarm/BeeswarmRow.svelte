<script>

import BackgroundCircles from "$lib/prototypeComponents/general/beeswarm/BackgroundCircles.svelte";
import PrimaryCircles from "$lib/prototypeComponents/general/beeswarm/PrimaryCircles.svelte";

import { getContext } from "svelte";

import { rowSvgOuterPadding, rowSvgHeight, encodingColourPalette } from "$lib/config";

export let indicator;
export let rowNumb, topicNumb;
export let metadata, calculations;
export let col2Width;
export let chosenId3;
export let visibleAreas;
export let baselineComparisonArea;
export let scaleHeight, scaleWidth;
export let x, xDomain, yDomainGlobal, y;
export let hoverIndex, hoverChartIndex;
export let chosenId11;
export let chosenId6;

let selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");
let selectedArea = getContext("selectedArea");

let medianValue = calculations.calcs[calculations.maxXDomain].median;
let medianAbsoluteDeviation = calculations.calcs[calculations.maxXDomain].mad;

let mainLatestValue = calculations.calcs[calculations.maxXDomain].main;
$: comparisonLatestValue = calculations.calcs[calculations.maxXDomain][(baselineComparisonArea.areacd === "median" ? baselineComparisonArea : selectedAndRelatedAreas.find((el) => baselineComparisonArea.areacd === el.areacd)).role];

$: madFromComparisonValue = mainLatestValue == null | comparisonLatestValue == null | medianAbsoluteDeviation == null ? null : (mainLatestValue - comparisonLatestValue)/medianAbsoluteDeviation;

$: useColour = chosenId11.includes(1);

$: belowMinusOneColour = metadata.polarity == 0 ? null : metadata.polarity == -1 ? "better" : "worse";
$: withinOneColour = metadata.polarity == 0 ? null : "similar";
$: aboveOneColour = metadata.polarity == 0 ? null : metadata.polarity == 1 ? "better" : "worse";

$: similarThreshold = chosenId11.includes(3) ? 2 : 1;

$: colour = !useColour | madFromComparisonValue == null | metadata.polarity == 0 ? null : madFromComparisonValue < -similarThreshold ? encodingColourPalette[belowMinusOneColour] : madFromComparisonValue <= similarThreshold ? encodingColourPalette[withinOneColour] : encodingColourPalette[aboveOneColour];

$: baselineComparisonName = baselineComparisonArea.areacd === "median" ? "median" : baselineComparisonArea.areanm;

$: betterWorse = chosenId11.includes(2);

$: belowMinusOneText = metadata.polarity == 0 | !betterWorse ? "Lower than" : metadata.polarity == -1 ? "Better than" : "Worse than";
$: withinOneText = "Similar to";
$: aboveOneText = metadata.polarity == 0 | !betterWorse ? "Higher than" : metadata.polarity == 1 ? "Better than" : "Worse than";

$: text = (mainLatestValue == null ? "No "+selectedArea.areanm+" data" : comparisonLatestValue == null ? "No "+baselineComparisonName+" data" : (madFromComparisonValue < -similarThreshold ? belowMinusOneText : madFromComparisonValue <= similarThreshold ? withinOneText : aboveOneText)+" "+baselineComparisonName)+" in "+calculations.maxXDomain;

</script>

<div class="area-comparison-cell-container" style={chosenId6.includes(0) | chosenId3 != 0 | colour == null ? null : "background-color:"+colour+"; box-shadow: 0 0 4px 3px "+colour+";"}>

    {#if chosenId11.includes(0) & chosenId3 === 0}

    <p class="from-comparison-description">{chosenId6.includes(0) ? (Math.random() < 0.5 & madFromComparisonValue != null ? "Statistically significant difference" : "") : text}</p>

    {/if}

    {#if chosenId3 === 0}

    <svg class="beeswarm-row-svg beeswarm-row-svg-{topicNumb*100+rowNumb}"
    viewBox="0 0 {col2Width} {rowSvgHeight[chosenId3 === 0 ? "split" : "full"]}"
    width="100%"
    height={rowSvgHeight[chosenId3 === 0 ? "split" : "full"]}>

        <g class="chart-container"
        transform="translate({rowSvgOuterPadding.left[chosenId3 === 0 ? "split" : "full"]+rowSvgOuterPadding.areaSpaceBeyondXScale[chosenId3 === 0 ? "split" : "full"]},{rowSvgOuterPadding.top[chosenId3 === 0 ? "split" : "full"]})">

            <g opacity={chosenId6.includes(0) ? 0 : 1}>

                <BackgroundCircles
                {chosenId3}
                {visibleAreas} backgroundLatestData={indicator.latestDataSameGeogLevel}
                {scaleWidth}
                {x} {y} bind:yDomainGlobal={yDomainGlobal}
                {medianValue} {medianAbsoluteDeviation}
                chartIndex={topicNumb*100+rowNumb} bind:hoverIndex={hoverIndex} bind:hoverChartIndex={hoverChartIndex}
                ></BackgroundCircles>

            </g>

            <PrimaryCircles
            {mainLatestValue}
            {comparisonLatestValue}
            {baselineComparisonArea}
            {baselineComparisonName}
            {metadata}

            {chosenId3}
            {visibleAreas} data={indicator.latestData}
            {scaleWidth}
            {y} {x}
            {medianValue} {medianAbsoluteDeviation}
            {hoverIndex}
            {chosenId6}
            ></PrimaryCircles>

        </g>

    </svg>

    {/if}

</div>





<style>

.area-comparison-cell-container {
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
}

svg {
    overflow: visible;
}

p {
    text-align: center;
    padding: 5px;
    margin: 0px;
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    text-wrap: balance;
}

</style>