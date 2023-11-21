<script>

import HorizontalBeeswarmSVG from "$lib/prototypeComponents/general/beeswarm/HorizontalBeeswarmSVGTemp.svelte";

import { medianAbsoluteDeviationLimit } from '$lib/config';
import { calculateMedian } from '$lib/utils.js'
import { scaleLinear } from 'd3-scale';

export let data, name, medianValue, metadata, index, checkboxedRoles, col1Width, outerPadding, chartWidth, chartHeight, spaceForAreasBeyondScale, xDomainGlobal, x, height, width, hoverIndex, hoverChartIndex, areasSameGeog, selectedAreas;

let rowHeight = 100;


/*index={i}
data={latestData.filter((e) => e.id === indicator)}
name={indicatorsMetadata.find((elm) => elm.code == indicators.find((el) => el.id == indicator).code).label}
bind:checkboxedRoles={checkboxedRoles}
metadata={indicatorsMetadata.find((e) => e.code === indicators.find((el) => el.id == indicator).code)}
{col1Width}
{outerPadding}
{chartWidth}
{chartHeight}
{spaceForAreasBeyondScale}
{x}
{height}
bind:xDomainGlobal={xDomainGlobal}
bind:hoverIndex={hoverIndex}*/

//deviations, media

$: backgroundData = data.filter((e) => areasSameGeog.includes(e.areacd));

$: medianValue = calculateMedian(backgroundData, "value");
$: maxDistanceFromMedian = Math.max(Math.abs(medianValue - Math.min(...backgroundData.map((e) => e.value))), Math.abs(medianValue - Math.max(...backgroundData.map((e) => e.value))));

$: deviations = backgroundData.map(((e) => Math.abs(e.value - medianValue)));
$: medianAbsoluteDeviation = calculateMedian(deviations);

$: yDomain = [-metadata.polarity*medianAbsoluteDeviationLimit, metadata.polarity*medianAbsoluteDeviationLimit];

$: console.log(yDomain);

$: y = scaleLinear()
    .domain(yDomain)
    .range([0, chartWidth]);

</script>

<div class="row" bind:clientHeight={rowHeight} style="background-color: {index % 2 === 0 ? "#fafafa" : "#ffffff"}">

    <p class="col1" style="width: {col1Width}">{name}</p>

    <HorizontalBeeswarmSVG
    width={width-col1Width}
    {index}
    {outerPadding}
    {backgroundData}
    {data}
    {medianValue}
    {medianAbsoluteDeviation}
    {metadata}
    {y}
    {x}
    {height}
    bind:xDomainGlobal={xDomainGlobal}
    {checkboxedRoles}
    bind:hoverIndex={hoverIndex}
    bind:hoverChartIndex={hoverChartIndex}
    {chartHeight}
    {chartWidth}
    {areasSameGeog}
    {spaceForAreasBeyondScale}
    showGroupMedianLine={false}
    {selectedAreas}
    {rowHeight}
    ></HorizontalBeeswarmSVG>


</div>

<style>

.row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
    
}


.col1 {
    padding: 20px 0px 20px 5px;
    font-size: 16px;
    line-height: 20px;
    margin: auto 0px auto 0px;
}





</style>
