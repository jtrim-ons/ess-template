<script>

import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
import { onMount } from "svelte";
import { base } from "$app/paths";
import { feature } from "topojson-client";

export let year = 2023, geotype = "ltla", data = null, dataKey = "key", idKey = "areacd";

let topojson;
let geojson;

let mapData;
let breaks;

const colors = ["white", "lightgrey", "grey", "darkgrey", "black"];

onMount(async () => {
		
    topojson = await (await fetch(`${base}/data/topojson/topo.json`)).json();

    geojson = feature(topojson, geotype)

    geojson.features = geojson.features.filter(((f) => !(f.properties.end && f.properties.end < year) &&
                !(f.properties.start && f.properties.start > year)))

});

function getColor(value, breaks) {
    
    for (let i = 1; i < breaks.length; i++) {

        if (value < breaks[i]) { return colors[i-1]}
    }
    return colors[colors.length-1]
}

function makeColors(data, valueKey) {

    let mapData = data.map(d => ({id: d[idKey], value: d[valueKey]}))
    let values = mapData.map(d => d.value).sort((a,b) => a - b);
    let breaks = [...ckmeans(values, 5), values[values.length-1]];
    mapData.forEach((d) => d.color = getcolor(d.values, breaks))

    return {mapData, breaks}
}

function updateColors(data, idKey, valueKey) {
    const dataBreaks = makeColors(data, idKey, valueKey)
    breaks = dataBreaks.breaks
    mapData = dataBreaks.mapData
}

</script>


<Map
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

            <MapLayer
            id="line"
            type="line"
            paint={{"line-color": "black"}}
            
            ></MapLayer>

            {#if mapData}

                <MapLayer
                id="fill"
                type="fill"
                data={mapData}
                paint={{"line-color": "black"}}
                idKey="id"
                paint={{"fill-color": ["XXX"]}}
                ></MapLayer>

            {/if}

        </MapSource>

    {/if}

</Map>