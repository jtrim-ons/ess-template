<script>

import ckmeans from "ckmeans";
import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
import { onMount } from "svelte";
import { base } from "$app/paths";
import { feature } from "topojson-client";

import { calculateMappingBreaks } from "$lib/utils";

export let geoType = "ltla";
export let year = 2023;
export let data = [];
export let idKey = "areacd";
export let valueKey = "value";
export let colorsInit = ["#b2182b", "#d6604d", "#fddbc7", "#d1e5f0", "#4393c3", "#2166ac"];
export let selected = null;
export let hovered = null;
export let mapRange="uk";
export let colourObj;
export let useBreaks = true;
export let breaks;
export let polarity = 1;

let topojson;
let geojson;
let mapdata;

let colors = polarity == -1 ? colorsInit.slice().reverse() : colorsInit;

const bounds = {
        uk: [[ -9, 49 ], [ 2, 61 ]],
        ew: [[-6, 50], [2, 56]]
    };

function getColor(value, breaks, colors) {

    if (useBreaks) {
    
        for (let i = 1; i < breaks.length; i ++) {
            if (value < breaks[i]) return colors[i - 1];
        }
        return colors[colors.length - 1];

    } else {
    
        return colourObj[value]
    }
}

function makeColors(data, idKey, valueKey, colors) {
    let mapdata = data.map(d => ({id: d[idKey], value: d[valueKey]}));
    let values = mapdata.map(d => d.value).sort((a, b) => a - b);
    breaks = calculateMappingBreaks(values);

    mapdata.forEach(d => d.color = getColor(d.value, breaks, colors));

    return { mapdata, breaks };
}

function updateColors(data, idKey, valueKey, colors) {
    const dataBreaks = makeColors(data, idKey, valueKey, colors);
    breaks = dataBreaks.breaks;
    mapdata = dataBreaks.mapdata;
}

function updateGeojson(geoType, year) {
    if (topojson) {
        const newgeo = feature(topojson, geoType);
        newgeo.features = newgeo.features.filter(f => true);
        geojson = newgeo;
    }
}

$: updateColors(data, idKey, valueKey, colors);
$: updateGeojson(geoType, year);

onMount(async () => {
    topojson = await (await fetch(`${base}/data/topojson/topo.json`)).json();
    updateGeojson(geoType, year);
});


</script>

<div class="map-container">

<Map
location={{bounds: bounds[mapRange]}}
controls={true}
style="https://bothness.github.io/ons-basemaps/data/style-omt.json"
>
    {#if geojson}
    <MapSource
    id="geojson"
    type="geojson"
    data={geojson}
    promoteId="areacd"
    
    >
        {#if mapdata}
        <MapLayer
            id="fill"
            type="fill"
            data={mapdata}
            idKey="id"
            paint={{'fill-color': ['case',
                ['!=', ['feature-state', 'color'], null], ['feature-state', 'color'],
                'rgba(255, 255, 255, 0)'
            ]}}
            hover={true} on:hover {hovered}
            select={true} on:select {selected}>
        </MapLayer>
        <MapLayer
            id="line"
            type="line"
            paint={{'line-color': 'black'}}>
        </MapLayer>
        {/if}
    </MapSource>
    {/if}
</Map>

</div>

<style>

.map-container {

    height: 450px;
    width: 50%;
}


</style>