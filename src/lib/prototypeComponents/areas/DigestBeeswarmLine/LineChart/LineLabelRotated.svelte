<script>

import { colorsObject, rowSvgOuterPadding } from "$lib/config";
import { addThousandsSeparator, roundNumber, doRectanglesOverlap } from "$lib/utils";

export let xPosition, metadata, mainLatestValue, mainPreviousValue, scaleWidth, chosenId3, scaleHeight, labelWidthArray;

$: labelText = ["pp", "abs"].includes(metadata.howToMeasureChange) ? (mainLatestValue-mainPreviousValue > 0 ? "+" : "")+(metadata.howToMeasureChange == "pp" ? "" : metadata.prefix)+addThousandsSeparator(roundNumber(mainLatestValue-mainPreviousValue, metadata.decimalPlaces))+(metadata.howToMeasureChange == "pp" ? " pp" : "") : (mainLatestValue-mainPreviousValue > 0 ? "+" : "")+roundNumber((mainLatestValue-mainPreviousValue)/mainPreviousValue, 1)+"%";

</script>



<g class="labels-group">

    {#if chosenId3 === 0}

        <g class="value-label-group"
        transform="translate({Math.min(scaleWidth+rowSvgOuterPadding.right.split+rowSvgOuterPadding.areaSpaceBeyondXScale.split-(labelWidthArray[0] == null ? 0 : labelWidthArray[0].width+6), Math.max(-rowSvgOuterPadding.left.split-rowSvgOuterPadding.areaSpaceBeyondXScale.split, xPosition-(labelWidthArray[0] == null ? 0 : (0 === 0 ? labelWidthArray[0].width+6 : 0))))},{scaleHeight+9})">

            <g transform="translate({xPosition > scaleWidth+rowSvgOuterPadding.right.split+rowSvgOuterPadding.areaSpaceBeyondXScale.split-(labelWidthArray.length > 0 ? labelWidthArray[0].width/2 : 0) ? 0: (labelWidthArray.length > 0 ? labelWidthArray[0].width/2 : 0) },0)">

                <rect
                labelid={0}
                transform="translate({0},{0})"
                x=0
                y=0
                width={labelWidthArray.length > 0 ? labelWidthArray[0].width + 6: 0}
                height={22}
                rx="3px"
                stroke={colorsObject.main}
                fill="white"
                stroke-width="1.5px"
                
                ></rect>

                <text bind:contentRect={labelWidthArray[0]}
                labelid={0}
                transform="translate({0},{0})"
                x={3}
                y={16}
                text-anchor="start"
                stroke-width="0.25px"
                stroke={colorsObject.main}
                fill={colorsObject.main}
                font-size={"16px"}
                >
                {labelText}</text>

            </g>

        </g>

    {/if}

</g>