<script>

import Row from "$lib/prototypeComponents/topics/keyIndicators/options/timeSeries/Row.svelte";
import HeadersRow from "$lib/prototypeComponents/topics/keyIndicators/options/timeSeries/HeadersRow.svelte";
import { getContext } from 'svelte';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

export let indicatorsList, latestData, initialData, otherData, selectedAreas, chosenId1, chosenId2, chosenId3, chosenId0;

let indicatorsMetadata = getContext("indicatorsMetadata");
let indicatorsCalculations = getContext("indicatorsCalculations").filter((e) => indicatorsList.includes(e.id));

$: combinedDataArray = new Array(indicatorsCalculations.length);
$: pathFunctionArray = new Array(indicatorsCalculations.length);
$: yScaleArray = new Array(indicatorsCalculations.length);
$: xScaleArray = new Array(indicatorsCalculations.length);

$: selectedAreasCodes = selectedAreas.map((e) => e.areacd);

$: {
    
    indicatorsCalculations.forEach((e,i) => {

        e.medianValue = e.ltCount > 200 ? e.ltMedian : e.utCount > 140 ? e.utMedian : e.ukValue != 'NA' ? e.ukValue : e.gbValue != 'NA' ? e.gbValue : e.ewValue != 'NA' ? e.ewValue : e.engValue != 'NA' ? e.engValue : null;

        let indicatorLatestData = latestData.filter((el) => el.id == e.id)
        let indicatorInitialData = "indicator-"+e.id in initialData ? initialData["indicator-"+e.id] : [];
        let indicatorOtherData = "indicator-"+e.id in otherData ? otherData["indicator-"+e.id] : [];

        let combinedData = [...indicatorInitialData,...indicatorOtherData,...indicatorLatestData]

        combinedDataArray[i] = combinedData

        let maxValueFromMedian = chosenId0 == 0 ? Math.max(...combinedData.map((el) => Math.abs(el.value - e.medianValue))) : Math.max(...combinedData.filter((elm) => selectedAreasCodes.includes(elm.areacd)).map((el) => Math.abs(el.value - e.medianValue)));

        e.label = indicatorsMetadata.find((el) => el.code == e.code).label;

        let xScale = scaleLinear().domain([e.minXDomain, e.maxXDomain]).range([0, 60]);
        let yScale = scaleLinear().domain([e.medianValue - maxValueFromMedian, parseFloat(e.medianValue) + parseFloat(maxValueFromMedian)]).range(indicatorsMetadata.find((el) => el.code == e.code).polarity == 1 ? [60, 0] : [0, 60]);

        yScaleArray[i] = yScale;
        xScaleArray[i] = xScale;
        pathFunctionArray[i] = line().x((d) => xScale(d.xDomainNumb)).y((d) => yScale(d.value));
    })

}

</script>

<div class="grid-container">

    <HeadersRow
    {indicatorsCalculations}
    {chosenId2}
    {chosenId3}
    ></HeadersRow>

    {#each selectedAreas as row, j}

        <Row
        {row}
        {j}
        {indicatorsCalculations}
        {indicatorsMetadata}
        {pathFunctionArray}
        {combinedDataArray}
        {yScaleArray}
        {xScaleArray}
        ></Row>

    {/each}

</div>

<style>


.grid-container {
    display: flex;
    flex-direction: column;
}


</style>