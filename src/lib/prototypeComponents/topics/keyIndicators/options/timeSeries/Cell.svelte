<script>

import { bivariateColourObj } from "$lib/config";
import { roundNumber, addThousandsSeparator } from "$lib/utils";

export let calculations, indicatorMetadata, pathFunction, combinedData, yScale, xScale;

$: latestValue = combinedData.length > 0 ? combinedData[combinedData.length-1].value : null;
$: initialValue = combinedData.length > 1 ? combinedData[0].value : null;

$: changeValue = latestValue != null & initialValue != null ? (latestValue - initialValue)/(indicatorMetadata.absoluteOrPercent == "A" ? 1 : initialValue/100): null;
$: comparisonValue = latestValue != null ? (latestValue - calculations.medianValue)/(indicatorMetadata.absoluteOrPercent == "A" ? 1 : calculations.medianValue/100): null;

$: changeText = changeValue != null ? (changeValue > 0 ? (indicatorMetadata.polarity == 1 ? "improving" : "worsening") : (indicatorMetadata.polarity == 1 ? "worsening" : "improving")) : null;
$: comparisonText = comparisonValue != null ? (comparisonValue > 0 ? (indicatorMetadata.polarity == 1 ? "better than average" : "worse than average") : (indicatorMetadata.polarity == 1 ? "worse than average" : "better than average")) : null;

$: rectColour = changeText == null & comparisonText == null ? "grey" : bivariateColourObj[changeText != null ? changeText : "similar"][comparisonText != null ? comparisonText : "similar"];

</script>


<div class="cell-container">

    {#if combinedData.length > 0}

        <svg>

            <rect
            width=60
            height=60
            stroke="none"
            fill={rectColour}
            opacity=0></rect>

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
            y1=30
            y2=30
            x1=0
            x2=60
            stroke="black"
            stroke-width="1px"
            opacity=0.25
            ></line>

            {#if combinedData.length > 1}

                <path
                d={pathFunction(combinedData)}
                stroke={rectColour}
                fill="none"
                stroke-width="2px"
                ></path>

            {/if}


            <circle
            cy={yScale(combinedData[combinedData.length-1].value)}
            cx={combinedData.length > 1 ? xScale(combinedData[combinedData.length-1].xDomainNumb): 30}
            r=4.5
            stroke={"white"}
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

<!-- 
<div class="cell-container">

    <svg width=60 height=60 style="overflow: visible">

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
        opacity=0.25
        ></line>

        {#if minPeriod != maxPeriod}

            <path
            d={pathFunction(data)}
            fill="none"
            stroke={rectColour}
            stroke-width="2px"
            ></path>

        {/if}

        {#if data.length > 1}

            <circle
            cx=0
            cy={y(data[0].value)}
            r=3
            fill="white"
            stroke-width="2px"
            stroke={rectColour}
            ></circle>

            <circle
            cx=60
            cy={y(data[data.length-1].value)}
            r=3
            fill="white"
            stroke-width="2px"
            stroke={rectColour}
            ></circle>

        {:else if data.length === 1} 

            <circle
            cx=30
            cy={y(data[0].value)}
            r=3
            fill="white"
            stroke-width="2px"
            stroke={rectColour}
            ></circle>

        {/if}

    </svg>
</div> -->


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