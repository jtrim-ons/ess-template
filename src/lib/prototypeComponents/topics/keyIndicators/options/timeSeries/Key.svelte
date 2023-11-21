<script>

import { bivariateColourObj } from "$lib/config";

</script>

<svg width=650 height=190>

    <g transform="translate(10,25)">

        <rect
        x=0
        y=0
        width=60
        height=60
        fill="none"
        stroke="black"
        stroke-width="1px"
        opacity=0.25
        ></rect>

        <line
        y1=30
        y2=30
        x1=0
        x2=60
        stroke="black"
        stroke-width="1px"
        opacity=0.25
        ></line>

        <path
        transform="translate(60,30)"
        d="M6.5 0.5 l6.5 -6.5 M7 0 l6 6 M12 0 l28 0 l0 -5"
        stroke="black"
        stroke-width="1.5px"
        fill="none"
        ></path>

        <text
        transform="translate(60,30)"
        x=30
        y=-25
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >This line represents the median value</text>

        <text
        transform="translate(60,30)"
        x=30
        y=-10
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >during the most recent time period.</text>

        <path
        d="M0 30 L5 32 L10 27 L15 33 L20 33 L25 30 L30 30 L35 35 L40 40 L45 42 L50 48 L55 48 L60 50"
        stroke="black"
        fill="none"
        stroke-width="2px"
        ></path>

        <circle
        cy=50
        cx=60
        r=4.5
        stroke={"white"}
        stroke-width="1.5px"
        fill="black"
        ></circle>

        <path
        transform="translate(60,50)"
        d="M6.5 0.5 l6.5 -6.5 M7 0 l6 6 M12 0 l28 0 l0 15"
        stroke="black"
        stroke-width="1.5px"
        fill="none"
        ></path>

        <text
        transform="translate(60,30)"
        x=30
        y=45
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >A dot below the median line means</text>

        <text
        transform="translate(60,30)"
        x=30
        y=60
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >the area is worse than average.</text>

    </g>

    <g transform={"translate(485,15)"}>

        {#each ["worsening", "improving"] as row, i}

            {#each ["better than average", "worse than average"] as column, j}

                <rect
                transform={"translate("+(i==0 ? -1 : i==2 ? 1: 0)+","+(j==0 ? -1 : j==2 ? 1: 0)+")"}
                x={i*60}
                y={j*60}
                width=60
                height=60
                stroke="none"
                fill={bivariateColourObj[row][column]}
                opacity=0.5
                ></rect>


            {/each}

        {/each}

        <line
        x1=-20
        x2=-20
        y1=10
        y2=110
        stroke="black"
        stroke-width="2px"
        ></line>

        <path
        d="M-20 5 l5 5 l-10 0 z"
        stroke="none"
        fill="black"
        ></path>

        <path
        d="M-20 115 l5 -5 l-10 0 z"
        stroke="none"
        fill="black"
        ></path>

        <text
        x=-30
        y=10
        text-anchor="end"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >better than</text>

        <text
        x=-30
        y=24
        text-anchor="end"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >average</text>

        <text
        x=-30
        y=110
        text-anchor="end"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >worse than</text>

        <text
        x=-30
        y=124
        text-anchor="end"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >average</text>

        <g>

            <line
            y1=140
            y2=140
            x1=10
            x2=110
            stroke="black"
            stroke-width="2px"
            ></line>

            <path
            d="M5 140 l5 -5 l0 10 z"
            stroke="none"
            fill="black"
            ></path>

            <path
            d="M115 140 l-5 -5 l0 10 z"
            stroke="none"
            fill="black"
            ></path>

            <text
            x=-5
            y=160
            text-anchor="middle"
            font-size="14px"
            stroke-width="0.25px"
            stroke="black"
            fill="black"
            >worsening</text>

            <text
            x=110
            y=160
            text-anchor="middle"
            font-size="14px"
            stroke-width="0.25px"
            stroke="black"
            fill="black"
            >improving</text>

        </g>

    </g>






</svg>


<style>

svg {
    background-color: #F5F5F6;
    border-radius: 10px;
}





</style>

