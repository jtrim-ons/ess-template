<script>

import BackgroundCircles from "$lib/prototypeComponents/general/beeswarm/BackgroundCircles.svelte";
import HoverCircles from "$lib/prototypeComponents/general/beeswarm/HoverCircles.svelte";
import PrimaryCircles from "$lib/prototypeComponents/general/beeswarm/PrimaryCircles.svelte";
import XGridlines from "$lib/prototypeComponents/areas/DigestBeeswarm/Beeswarm/XGridlines.svelte";
import MedianLine from "$lib/prototypeComponents/areas/DigestBeeswarm/Beeswarm/MedianLine.svelte";
import CircleLabels from "$lib/prototypeComponents/general/beeswarm/CircleLabels.svelte";
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';


export let firstRow, width, scaleWidth, height, scaleHeight, outerPadding, latestData, backgroundLatestData, hoverIndex, hoverChartIndex, medianValue, medianAbsoluteDeviation, visibleAreas, x, yDomainGlobal, y, metadata;

let visibleAreasCodes = visibleAreas.map((e) => e.areacd)

$: backgroundCirclesStep1 = backgroundLatestData.filter((e) => !visibleAreasCodes.includes(e.areacd)).map((e) => ({
    ...e,
    zScore: (e.value - medianValue)/medianAbsoluteDeviation
}));

$: backgroundCirclesStep2 = new AccurateBeeswarm(backgroundCirclesStep1, 4, (d) => (x(d.zScore) > scaleWidth ? scaleWidth + outerPadding.spaceBeyondXScale/2 : x(d.zScore) < 0 ? -outerPadding.spaceBeyondXScale/2 : x(d.zScore))).calculateYPositions();

$: yDomainGlobal[0] = backgroundCirclesStep2 != undefined ? Math.min(...backgroundCirclesStep2 .map(d => d.y), yDomainGlobal[0]) : yDomainGlobal[0];
$: yDomainGlobal[1] = backgroundCirclesStep2 != undefined ? Math.max(...backgroundCirclesStep2 .map(d => d.y), yDomainGlobal[1]) : yDomainGlobal[1];

$: primaryCirclesStep1 = latestData.filter((e) => visibleAreasCodes.includes(e.areacd)).map((e) => ({
    ...e,
    role: "main",
    zScore: (e.value - medianValue)/medianAbsoluteDeviation
}));

$: primaryCirclesStep2 = new AccurateBeeswarm(primaryCirclesStep1, 8.5, (d) => (x(d.zScore) > scaleWidth ? scaleWidth + outerPadding.spaceBeyondXScale/2 : x(d.zScore) < 0 ? -outerPadding.spaceBeyondXScale/2 : x(d.zScore))).calculateYPositions();


</script>

<svg class={"beeswarm-row-svg-"+metadata.code}
{width}
height={height+(firstRow ? 30 : 0)}
>

    <g class="chart-container"
    transform={"translate("+(outerPadding.left+outerPadding.spaceBeyondXScale)+","+(outerPadding.top+(firstRow ? 30 : 0))+")"}>

        <rect
        x={-outerPadding.spaceBeyondXScale/2}
        width={0.4*scaleWidth+outerPadding.spaceBeyondXScale/2}
        height={height-outerPadding.top-outerPadding.bottom}
        fill="black"
        opacity=0
        ></rect>

        <rect
        x={scaleWidth*0.6}
        width={0.4*scaleWidth+outerPadding.spaceBeyondXScale/2}
        height={height-outerPadding.top-outerPadding.bottom}
        fill="black"
        opacity=0
        ></rect>

        <XGridlines
        {scaleHeight}
        {scaleWidth}
        ></XGridlines>

        <MedianLine
        {medianValue}
        {metadata}
        {scaleWidth}
        {scaleHeight}
        {hoverIndex}
        {firstRow}
        background={true}
        ></MedianLine>

        <BackgroundCircles
        {backgroundCirclesStep2}
        {y}
        bind:hoverIndex={hoverIndex}
        radius={5}
        ></BackgroundCircles>

        <MedianLine
        {medianValue}
        {metadata}
        {scaleWidth}
        {scaleHeight}
        {hoverIndex}
        {firstRow}
        background={false}
        ></MedianLine>

        <PrimaryCircles
        {primaryCirclesStep2}
        {hoverIndex}
        {scaleHeight}
        ></PrimaryCircles>

        <HoverCircles
        backgroundCirclesStep2={backgroundCirclesStep2.filter((e,i) => e.datum.areacd === hoverIndex)}
        {x}
        {y}
        {hoverIndex}
        ></HoverCircles>

    </g>





</svg>




<style>

svg {
    overflow: visible;
}









</style>