<script>

import { curveStepBefore } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { colorsObject  } from '$lib/config';

export let row, distributionData, width, height, rolesArray;

$: xDomain = [0, Math.max(...distributionData.map((d) => d.midpoint))];

$: x = scaleLinear()
	.domain(xDomain)
	.range([0, width]);

$: yDomain = [0, Math.max(...distributionData.map((d) => d.count))];

$: y = scaleLinear()
	.domain(yDomain)
	.range([0,height/2]);

$: pathFunction = line()
    .x((d) => { return x(d.midpoint); })
    .y((d) => { return y(d.count); });


$: pathFunctionInv = line()
    .x((d) => { return x(d.midpoint); })
    .y((d) => { return -y(d.count); });

</script>


<g class="plot-group"
transform={"translate("+0+","+height/2+")"}>

	<path
	d={pathFunction(distributionData)}
	stroke="none"
	fill="#e0dede"
	opacity=1
	></path>

	<path
	d={pathFunctionInv(distributionData)}
	stroke="none"
	fill="#e0dede"
	opacity=1
	></path>

	{#if row.parentRaw !== undefined & rolesArray.includes("parent")}

	<g transform={"translate("+x(row.parentRaw)+",0)"}>

		<rect
		x=-5
		y=-5
		stroke="white"
		fill={colorsObject["parent"]}
		stroke-width="1px"
		width=10
		height=10
		></rect>
	
	</g>

	{/if}

	{#if row.countryRaw !== undefined & rolesArray.includes("country")}

	<g transform={"translate("+x(row.countryRaw)+",0)"}>

		<rect
		transform="rotate(45)"
		x=-5
		y=-5
		stroke="white"
		fill={colorsObject["country"]}
		stroke-width="1px"
		width=10
		height=10
		></rect>
	
	</g>

	{/if}

	{#if row.ukRaw !== undefined & rolesArray.includes("uk")}

	<g transform={"translate("+x(row.ukRaw)+",0)"}>

		<rect
		transform="rotate(45)"
		x=-5
		y=-5
		stroke="white"
		fill={colorsObject["uk"]}
		stroke-width="1px"
		width=10
		height=10
		></rect>
	
	</g>

	{/if}

	<circle
	transform={"translate("+x(row.mainRaw)+",0)"}
	r=6
	stroke="white"
	fill={colorsObject["main"]}
	stroke-width="1px"
	></circle>

</g>