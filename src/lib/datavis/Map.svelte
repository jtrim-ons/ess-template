<script>

    import ckmeans from "ckmeans";
    import { Map, MapSource, MapLayer, MapTooltip } from "@onsvisual/svelte-maps";
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { feature } from "topojson-client";
    
    export let geoType = "ltla";
    export let year = 2023;
    export let data = [];
    export let idKey = "areacd";
    export let valueKey = "value";
    export let colors = ["#ffffcc", "#41b6c4", "#2c7fb8", "#253494"];
    export let selected = null;
    export let hovered = null;
    export let clustersLookup;

    clustersLookup = clustersLookup.filter((e) => e.model === "health" || e.model === "all");

    $: console.log(clustersLookup);

    let colourObj = {1: "#2166AC", 2: "#ED7320", 3: "#746CB1", 4: "#B2182B", 99: "#2c7fb8", 999: "#41b6c4", 9999: "#A8BD3A"};

    let topojson;
    let geojson;
    let mapdata;
    let breaks;
    
    const bounds = {
            uk: [[ -9, 49 ], [ 2, 61 ]],
            ew: [[-6, 50], [2, 56]]
        };
    
    function getColor(value, breaks, colors) {
        /*for (let i = 1; i < breaks.length; i ++) {
            if (value < breaks[i]) return colors[i - 1];
        }
        return colors[colors.length - 1];*/
        
        return colourObj[value]
    }
    
    function makeColors(data, idKey, valueKey, colors) {
        let mapdata = data.map(d => ({id: d[idKey], value: d[valueKey]}));
        let values = mapdata.map(d => d.value).sort((a, b) => a - b);
        let breaks = [...ckmeans(values, 5), values[values.length - 1]];
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

    let secondSentenceArray = {
        1: " These areas are primarily located in the south of England.",
        2: "",
        3: " Bristol is the only local authority in this group outside of London.",
        4: " These are mostly low-income, urban areas in the north of England.",
        99: " ",
        999: " ",
        9999: " "
    }
    
    </script>
    
    <section title="Map">
        <h1>Compare geographically</h1>

    <div class="container">
    
    <div class="chartLegend">

        <div class="clustersDescriptionContainer">

        {#each [1, 2, 3, 4] as cluster, i}

            <div class="clusterContainer" style="margin-top: 10px">

            <svg
            width=20
            height=24
            >

                <g transform="translate(10,14)">

                    <circle
                    r={6}
                    fill={colourObj[cluster]}
                    stroke="white"
                    >
                    </circle>

                </g>

            </svg>

            <p style="color: {colourObj[cluster]}">
                {@html data.filter((e) => e.health === cluster).length+(cluster < 10 ? " local authorities belong to the <span style='font-weight: bold'>"+(clustersLookup.find((e) =>  e.id === cluster).alternativeDescription).toLowerCase()+"</span> cluster." : " local authorities are in "+clustersLookup.find((e) =>  e.id === cluster).alternativeDescription+".")+secondSentenceArray[cluster] }
            </p>

            </div>


        {/each}

        </div>
        
        
    </div> 
    
    <div class="mapContainer" style="opacity: 0.75">
    
    <Map
    location={{bounds: bounds.ew}}
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

    </div>

    <img style="padding-top: 10px" width="75%" src={`${base}/img/image1.png`} alt="download buttons">

    </section>
    
    <style>

    section {
        margin-top: 60px;
    }

    .container {
        display: flex;
        flex-direction: row;
        border-radius: 5px 5px 5px 5px;
        border-style: solid;
        border-width: 2px;
        border-color: grey;
    }

    .clustersDescriptionContainer {
        margin-bottom: 20px;
        margin-right: 20px;
        margin-left: 20px;
        margin-top: 20px;
        border-radius: 15px;
        border-style: solid;
        border-width: 0px;
        border-color: grey;
        background-color: #F5F5F6;

    }

    p {
        padding-right: 10px;
    }
    
    .mapContainer {

        height: 450px;
        width: 50%;
    }

    .chartLegend {

        height: 450px;
        width: 50%;

    }

    .clusterContainer {
        display: flex;
    padding-left: 10px;
    }

    .clusterContainer p {
        padding-left: 10px;
        margin: 0px;
        font-size: 16px;
        line-height: 18px;

    }
    
    svg {
        overflow: visible;
    }
    
    
    </style>