<script>

import BackgroundCircles from "$lib/prototypeComponents/general/beeswarm/BackgroundCircles.svelte";
import HoverCircles from "$lib/prototypeComponents/general/beeswarm/HoverCircles.svelte";
import PrimaryCircles from "$lib/prototypeComponents/general/beeswarm/PrimaryCircles.svelte";
import CircleLabels from "$lib/prototypeComponents/general/beeswarm/CircleLabels.svelte";
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { calculateMedian, addThousandsSeparator, roundNumber, doRectanglesOverlap } from "$lib/utils";

export let index, width, outerPadding, data, medianValue, medianAbsoluteDeviation, metadata, y, xDomainGlobal, x, height, checkboxedRoles, hoverIndex, chartHeight, chartWidth, spaceForAreasBeyondScale, selectedAreas = [], rowHeight, backgroundData, hoverChartIndex;

$: backgroundCirclesStep1 = backgroundData.map((e) => ({
    ...e,
    calcYValue: (e.value - medianValue)/medianAbsoluteDeviation
}));

$: backgroundCirclesStep2 = new AccurateBeeswarm(backgroundCirclesStep1, 4, (d) => (y(d.calcYValue) > chartWidth ? chartWidth + spaceForAreasBeyondScale/2 : y(d.calcYValue) < 0 ? -spaceForAreasBeyondScale/2 : y(d.calcYValue))).calculateYPositions();

$: xDomainGlobal[0] = backgroundCirclesStep2 != undefined ? Math.min(...backgroundCirclesStep2 .map(d => d.y), xDomainGlobal[0]) : xDomainGlobal[0];
$: xDomainGlobal[1] = backgroundCirclesStep2 != undefined ? Math.max(...backgroundCirclesStep2 .map(d => d.y), xDomainGlobal[1]) : xDomainGlobal[1];

$: visibleAreas = data.filter((e) => (checkboxedRoles.custom != null ? checkboxedRoles.custom : []).map((el) => el.areacd).includes(e.areacd) || (selectedAreas.filter((e) => checkboxedRoles[e.role]).map((elm) => elm.data.areacd).includes(e.areacd) ));

$: primaryCirclesStep1 = visibleAreas.map((e) => ({
    ...e,
    role: selectedAreas.filter((el) => el.data.areacd === e.areacd).length > 0 ? selectedAreas.find((el) => el.data.areacd === e.areacd).role : "custom",
    calcYValue: (e.value - medianValue)/medianAbsoluteDeviation
}));



$: primaryCirclesStep2 = new AccurateBeeswarm(primaryCirclesStep1, 8.5, (d) => (y(d.calcYValue) > chartWidth ? chartWidth + spaceForAreasBeyondScale/2 : y(d.calcYValue) < 0 ? -spaceForAreasBeyondScale/2 : y(d.calcYValue))).calculateYPositions();

$: groupMedianValue = calculateMedian(data, "value");

$: prefix = metadata.prefix === null ? "" : metadata.prefix;
$: suffix = metadata.suffix === null ? "" : metadata.suffix;

let labelWidth1, labelWidth2;

</script>


<svg class={"beeswarm-row-svg-"+index}
{height}
{width}
>

    <g class="chart-container" transform={"translate("+(outerPadding.left+spaceForAreasBeyondScale)+","+outerPadding.top+")"}>

        <line 
        opacity={hoverIndex == null ? 1 : 0}
        class="medianLine"
        x1={chartWidth/2}
        x2={chartWidth/2}
        y1={-outerPadding.top}
        y2={-outerPadding.top-20+rowHeight}
        stroke="#F66068"
        stroke-width="2.5px"
        pointer-events="none"
        ></line>

        <rect
        transform={"translate("+chartWidth/2+",-15)"}
        opacity={hoverIndex == null ? 1 : 0}
        x={-parseFloat(labelWidth1 === undefined ? 100 : labelWidth1.width)/2 - 3}
        width={parseFloat(labelWidth1 === undefined ? 100 : labelWidth1.width) + 6}
        y=-14
        height=18
        class="medianLine"
        stroke="#F66068"
        stroke-width="1.5px"
        fill="white"
        rx="5px"
        ></rect>

        <text
        bind:contentRect={labelWidth1}
        transform={"translate("+chartWidth/2+",-15)"}
        opacity={hoverIndex == null ? 1 : 0}
        class="medianLine"
        fill="#F66068"
        stroke-width="0px"
        pointer-events="none"
        text-anchor="middle"
        font-size="14px"
        >{prefix+addThousandsSeparator(roundNumber(medianValue, metadata.decimalPlaces))+suffix}</text>

        <BackgroundCircles
        {backgroundCirclesStep2}
        {x}
        {y}
        bind:hoverIndex={hoverIndex}
        radius=4
        bind:hoverChartIndex={hoverChartIndex}
        {index}
        ></BackgroundCircles>

        <PrimaryCircles
        {primaryCirclesStep2}
        {hoverIndex}
        {checkboxedRoles}
        {chartHeight}
        ></PrimaryCircles>

        <HoverCircles
        backgroundCirclesStep2={backgroundCirclesStep2.filter((e,i) => e.datum.areacd === hoverIndex)}
        {x}
        {y}
        {hoverIndex}
        ></HoverCircles>

        <CircleLabels
        {index}
        {primaryCirclesStep2}
        backgroundCirclesStep2={backgroundCirclesStep2.filter((e,i) => e.datum.areacd === hoverIndex)}
        {hoverIndex}
        {checkboxedRoles}
        {metadata}
        {x}
        {hoverChartIndex}
        ></CircleLabels>

    </g>

   



</svg>



<style>


svg {
    overflow: visible;
    margin: 10px 20px 10px 0px;
}




</style>