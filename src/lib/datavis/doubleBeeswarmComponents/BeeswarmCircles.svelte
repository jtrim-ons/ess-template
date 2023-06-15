<script>

import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
import { onMount } from "svelte";
import { select } from "d3-selection";
import { colorsObject } from '$lib/config';

export let xDomain, x, y, data, selected, circleRadius = 6, whiteOutline = true, labelsOnHover = true, lineDataArray, nameLookup, roleLookup, onHover;

data.forEach(function(e,i) {

    e.translateX = e.x
    e.x = 0
    e.r = circleRadius
})

$: nodes1 = data.filter((e,i) => e.translateX == xDomain[0]).map((d) => ({ ...d }));
$: nodes2 = data.filter((e,i) => e.translateX == xDomain[1]).map((d) => ({ ...d }));

let simulation1, simulation2;

function simulation1Update() {
    simulation1.tick();
    nodes1 = [...nodes1]; //refresh the nodes array to render/trigger simulation
}

function simulation2Update() {
    simulation2.tick();
    nodes2 = [...nodes2]; //refresh the nodes array to render/trigger simulation
}

onMount(() => {

    simulation1 = forceSimulation(nodes1)
        .force('x', forceX().x(d => d.x).strength(0.05))
        .force('y', forceY().y(d => y(d.y)).strength(0.5))
        .force("collide", forceCollide(circleRadius*1.1))
        .on("tick", simulation1Update)
        .alphaTarget(0.01);

    simulation2 = forceSimulation(nodes2)
        .force('x', forceX().x(d => d.x).strength(0.05))
        .force('y', forceY().y(d => y(d.y)).strength(0.5))
        .force("collide", forceCollide(circleRadius*1.1))
        .on("tick", simulation2Update)
        .alphaTarget(0.01);

    setTimeout(() => updateLineData(selected), 1000)
    
});

function updateLineData(zCodeArray) {

    lineDataArray = [];

    zCodeArray.forEach((zCode) => {

        lineDataArray.push({
        x1: parseFloat(select(componentContainer).selectAll(".visiblePointsGroup0").selectAll("*").filter(function(d,i) {return select(this).attr("zcode") == zCode }).attr("cx")),
        x2: parseFloat(select(componentContainer).selectAll(".visiblePointsGroup1").selectAll("*").filter(function(d,i) {return select(this).attr("zcode") == zCode }).attr("cx")),
        y1: parseFloat(select(componentContainer).selectAll(".visiblePointsGroup0").selectAll("*").filter(function(d,i) {return select(this).attr("zcode") == zCode }).attr("cy")), 
        y2: parseFloat(select(componentContainer).selectAll(".visiblePointsGroup1").selectAll("*").filter(function(d,i) {return select(this).attr("zcode") == zCode }).attr("cy")), 
        text: nameLookup[zCode],
        role: roleLookup[zCode],
        zCode: zCode
        })
    })
}

function updateCircles(zCode, overBoolean) {

    select(componentContainer)
        .selectAll(".visiblePointsGroup")
        .selectAll("*")
        .attr("opacity", function(d,i) {return zCode.includes(select(this).attr("zcode"))  || !overBoolean ? 1 : 0.3 })
        .attr("r", function(d,i) {return zCode.includes(select(this).attr("zcode")) && overBoolean ? 1.5*circleRadius : circleRadius})
        .style("fill", function(d,i) {return zCode.includes(select(this).attr("zcode")) && overBoolean ? "orange" : null })
}

function handleMouseOver(e) {

    onHover = true

    const zCode = [select(this).attr("zcode")];

    updateCircles(zCode, true)
    updateLineData(zCode)
}

function handleMouseOut(e) {

    onHover = false;

    updateCircles(selected, false)
    updateLineData(selected)
}

let componentContainer;

</script>

<g class="points" bind:this={componentContainer}>

    {#if whiteOutline} 

        {#each [nodes1, nodes2] as nodes, i}

            <g class={"bgPointsGroup"+i}
            transform={"translate("+x(xDomain[i])+",0)"}>

                {#each nodes as point, j}

                    <circle
                    on:mouseover={labelsOnHover ? handleMouseOver: null} on:focus={null} on:mouseleave={labelsOnHover ? handleMouseOut: null}
                    class="node"
                    r={point.r*2}
                    fill={"white"}
                    cx={point.x}
                    cy={point.y}
                    zcode={point.z}
                    ></circle>

                {/each}
            </g>
        {/each}
    {/if}

    {#each [nodes1, nodes2] as nodes, i}

        <g class={"visiblePointsGroup visiblePointsGroup"+i}
        transform={"translate("+x(xDomain[i])+",0)"}>

            {#each nodes as point, j}

                <circle
                class="node"
                r={point.r}
                fill={colorsObject[point.role]}
                cx={point.x}
                cy={point.y}
                zcode={point.z}
                pointer-events="none"
                ></circle>
                
            {/each}
        </g>
    {/each}

</g>