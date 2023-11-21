<script>

import { bivariateColourObj } from "$lib/config";

export let chosenId;

</script>

<svg width={chosenId == 2 ? 280 : chosenId == 1 ? 220: 190} height={chosenId == 2 ? 200 : chosenId == 1 ? 120 : 165}>

    <g transform={"translate("+(chosenId == 1 ? 60: 120) +",20)"}>

        {#each chosenId == 0 ? ["similar"] : ["worsening", "similar", "improving"] as row, i}

            {#each chosenId == 1 ? ["similar"] : ["better than average", "similar", "worse than average"] as column, j}

                <rect
                transform={"translate("+(i==0 ? -1 : i==2 ? 1: 0)+","+(j==0 ? -1 : j==2 ? 1: 0)+")"}
                x={i*40}
                y={j*40}
                width=40
                height=40
                stroke="none"
                fill={ chosenId === 0 ? {"worse than average" : "#e88676", "similar": "#c9c9c9", "better than average": "#74b57b"}[column] : chosenId === 1 ? {"worsening" : "#e88676", "similar": "#c9c9c9", "improving": "#74b57b"}[row] : bivariateColourObj[row][column]}
                opacity=1
                ></rect>


            {/each}

        {/each}

        {#if chosenId != 1}

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

        {/if}

        {#if chosenId != 0}

            <g transform={chosenId == 2 ? null : "translate(0, -80)"}>

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

        {/if}

    </g>





</svg>


<style>

svg {
    background-color: #F5F5F6;
    border-radius: 10px;
}





</style>

