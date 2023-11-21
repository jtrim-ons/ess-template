<script>

import { bivariateColourObj } from "$lib/config";
import { roundNumber, addThousandsSeparator } from "$lib/utils";

export let calculations, indicatorMetadata, latestData, initialData, maxChange, maxValueFromMedian;

$: latestValue = latestData.length > 0 ? latestData[0].value : null;
$: initialValue = initialData.length > 0 ? initialData[0].value : null;

$: changeValue = latestValue != null & initialValue != null ? (latestValue - initialValue)/(indicatorMetadata.absoluteOrPercent == "A" ? 1 : initialValue/100): null;
$: comparisonValue = latestValue != null ? (latestValue - calculations.medianValue)/(indicatorMetadata.absoluteOrPercent == "A" ? 1 : calculations.medianValue/100): null;

$: changeText = changeValue != null ? (changeValue > 0 ? (indicatorMetadata.polarity == 1 ? "improving" : "worsening") : (indicatorMetadata.polarity == 1 ? "worsening" : "improving")) : null;
$: comparisonText = comparisonValue != null ? (comparisonValue > 0 ? (indicatorMetadata.polarity == 1 ? "better than average" : "worse than average") : (indicatorMetadata.polarity == 1 ? "worse than average" : "better than average")) : null;

$: rectColour = changeText == null & comparisonText == null ? "grey" : bivariateColourObj[changeText != null ? changeText : "similar"][comparisonText != null ? comparisonText : "similar"];

</script>

<div class="cell-container">

    {#if comparisonValue != null || changeValue != null}

        <svg>

            <rect
            x=0
            y=0
            width=60
            height=60
            fill="none"
            stroke="black"
            stroke-width="1px"
            opacity=0.25
            ></rect>

            <line
            x1=0
            x2=60
            y1=30
            y2=30
            stroke="black"
            stroke-width="1px"
            opacity=0.25
            ></line>

            {#if changeValue != null}

                <line
                x1=30
                x2=30
                y1=0
                y2=60
                stroke="black"
                stroke-width="1px"
                opacity=0.25
                ></line>

            {/if}

            {#if changeValue != null}

                <rect
                y={comparisonText === "worse than average" ? 30 : 0}
                x={changeText === "improving" ? 30 : 0}
                width={30}
                height=30
                stroke="#b0b0b0"
                fill={rectColour}
                fill-opacity=0.1
                stroke-width="1.5px"
                ></rect>

            {:else} 

                <line
                x1=30
                x2=30
                y1={comparisonText === "worse than average" ? 30 : 0}
                y2={comparisonText === "worse than average" ? 60 : 30}
                width={30}
                height=30
                stroke="#b0b0b0"
                stroke-width="5px"
                ></line>

            {/if}

            <circle
            cy={comparisonValue === null ? 30 : 30+(indicatorMetadata.polarity == 1 ? -1 : 1)*28*comparisonValue/maxValueFromMedian}
            cx={changeValue === null || latestValue == null ? 30 : 30+(indicatorMetadata.polarity == 1 ? 1 : -1)*28*changeValue/maxChange}
            r=8
            stroke="white"
            stroke-width="2px"
            fill="white"
            ></circle>

            <circle
            cy={comparisonValue === null ? 30 : 30+(indicatorMetadata.polarity == 1 ? -1 : 1)*28*comparisonValue/maxValueFromMedian}
            cx={changeValue === null || latestValue == null ? 30 : 30+(indicatorMetadata.polarity == 1 ? 1 : -1)*28*changeValue/maxChange}
            r=6
            stroke="black"
            stroke-width="1.5px"
            fill={rectColour}
            ></circle>


        </svg>

    {:else}

        <div class="cell-container no-data" style="background-color: grey; color: white">

            <p class="mainText" style="font-size: 14px">No data</p>

        </div>

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

svg {
    width: 60px;
    height: 60px;
    overflow: visible;
}

.no-data p {
    padding: 0px 5px 0px 5px;
    font-size: 14px;
    line-height: 16px;
    font-style: italic;
}

.cell-container p {
    margin: 0px;
}

.mainText {
    padding: 0px 1px 0px 1px;
    line-height: normal;
}




</style>