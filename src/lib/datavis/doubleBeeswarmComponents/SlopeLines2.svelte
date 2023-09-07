<script>

import { colorsObject } from '$lib/config';

export let plotDataArray, x1, x2, hoverIndex, rolesObject, rolesArray, areas;

$: rolesSlopeData = new Array(rolesArray.length);

$: rolesArray.forEach((r, i) => {

    rolesSlopeData[i] =
        [r,
        plotDataArray[0].find((e) => rolesObject[e.datum.areacd] === r), 
        plotDataArray[1].find((e) => rolesObject[e.datum.areacd] === r), 
        ]
    
});




</script>

{#if hoverIndex !== null}

    <line
    x1={x1+plotDataArray[0][hoverIndex].y}
    x2={x2+plotDataArray[1][hoverIndex].y}
    y1={plotDataArray[0][hoverIndex].x}
    y2={plotDataArray[1][hoverIndex].x}
    stroke-width="3px"
    stroke={colorsObject["selected"]}
    ></line>

    <g transform={"translate("+(((x2+plotDataArray[1][hoverIndex].y)-(x1+plotDataArray[0][hoverIndex].y))/2+x1+plotDataArray[0][hoverIndex].y)+","+(Math.abs(plotDataArray[0][hoverIndex].x-plotDataArray[1][hoverIndex].x)/2+Math.min(plotDataArray[0][hoverIndex].x,plotDataArray[1][hoverIndex].x)-10)+")"}>

        <text
        transform={"rotate("+60*Math.atan((plotDataArray[1][hoverIndex].x-plotDataArray[0][hoverIndex].x)/((x2+plotDataArray[1][hoverIndex].y)-(x1+plotDataArray[0][hoverIndex].y)))+")"}
        text-anchor="middle"
        fill={colorsObject["selected"]}
        >{areas.find((e) => plotDataArray[0][hoverIndex].datum.areacd === e.areacd).areanm}</text>

    </g>

{/if}

{#if hoverIndex === null & Math.min(plotDataArray[0].length, plotDataArray[1].length) > 0} 

    {#each rolesSlopeData as areaData}

        {#if areaData[1] !== undefined & areaData[2] !== undefined}

        <line
        x1={x1+areaData[1].y}
        x2={x2+areaData[2].y}
        y1={areaData[1].x}
        y2={areaData[2].x}
        stroke-width="3px"
        stroke={colorsObject[areaData[0]]}
        ></line>

        {/if}

    {/each}

{/if}

<!-- 
{#if hoverIndex === null & Math.min(plotDataArray[0].length, plotDataArray[1].length) > 0} 

<line
x1={x1+mainPlotData[0].y}
x2={x2+mainPlotData[1].y}
y1={mainPlotData[0].x}
y2={mainPlotData[1].x}
stroke-width="3px"
stroke={colorsObject[rolesObject[mainPlotData[0].datum.areacd]]}
></line>

<text
text-anchor="middle"
x={(x2-x1)/2+x1}
y={(mainPlotData[1].x-mainPlotData[0].x)/mainPlotData[0].x}
>{""}</text>

<line
x1={x1+parentPlotData[0].y}
x2={x2+parentPlotData[1].y}
y1={parentPlotData[0].x}
y2={parentPlotData[1].x}
stroke-width="3px"
stroke={colorsObject[rolesObject[parentPlotData[0].datum.areacd]]}
></line>



{/if} -->