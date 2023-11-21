<script>

import { getContext } from 'svelte';
import { AccurateBeeswarm } from 'accurate-beeswarm-plot';
import { scaleLinear } from 'd3-scale';
import { colorsObject } from '$lib/config';

export let width;

let filteredData = getContext("beeswarmKeyData");
let selectedAreas = [{"data": {"areacd": "E06000002", "areanm": "Middlesbrough"}, "role": "main"}];

let height = 140;

$: outerPadding = {top: 55, left: 40, right: 40, bottom: 65};

$: chartWidth = width - outerPadding.left - outerPadding.right;
$: chartHeight = height - outerPadding.top - outerPadding.bottom;


</script>

<svg
{width}
{height}
>

    <rect
    {width}
    {height}
    fill="black"
    opacity=0
    ></rect>

    <path
    d="M 0 0 l230 0 l0 21 a10,10 0 0,1 -10,10 l-220 0 z"
    fill="#003C57"
    stroke="#003C57"
    stroke-width="2px"
    ></path>

    <text
    x=9
    y=22
    font-size="18px"
    stroke="white"
    fill="white"
    stroke-width="0.5px"
    text-anchor="start"
    >How to read these charts</text>

</svg>




<style>

svg {
    overflow: visible;
}





</style>