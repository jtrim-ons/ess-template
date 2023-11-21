<script>

import { bivariateColourObj } from "$lib/config";

</script>

<svg width=420 height=200>

    <g transform={"translate(120,20)"}>

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

        <circle
        cy=30
        cx=90
        r=8
        stroke="white"
        stroke-width="2px"
        fill="white"
        ></circle>

        <circle
        cy=30
        cx=90
        r=6
        stroke="black"
        stroke-width="1.5px"
        fill={bivariateColourObj["improving"]["better than average"]}
        ></circle>

        <path
        transform="translate(90,30)"
        d="M19 -6 l-6.5 +6.5 l6 6 z"
        stroke="none"
        fill="black"
        ></path>

        <path
        transform="translate(90,30)"
        d="M20 0 l25 0 l0 10"
        stroke="black"
        stroke-width="1.5px"
        fill="none"
        ></path>

        <text
        transform="translate(90,30)"
        x=40
        y=23
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >A dot in this quadrant</text>

        <text
        transform="translate(90,30)"
        x=40
        y=38
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >means the area is above</text>

        <text
        transform="translate(90,30)"
        x=40
        y=53
        text-anchor="start"
        font-size="14px"
        stroke-width="0.25px"
        stroke="black"
        fill="black"
        >average and improving.</text>
        

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

