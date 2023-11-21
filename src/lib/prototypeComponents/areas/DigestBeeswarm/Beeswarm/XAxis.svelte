<script>

import { makeCurlyBrace, splitTextIntoRows } from '$lib/utils';
import { medianAbsoluteDeviationLimit } from '$lib/config';

export let width, scaleWidth, outerPadding;

let height = 150;

let tickInterval = 1;

let ticks = [];

for (let i = -medianAbsoluteDeviationLimit; i <= medianAbsoluteDeviationLimit; i++) { if (i % tickInterval == 0) {ticks.push(i)} }

//["Areas within this range", "are less than 1 median", "absolute deviation (MAD)", "from the median"]

</script>

<svg
{width}
height={height+70}
>

    <rect
    {width}
    {height}
    fill="black"
    opacity=0></rect>

    <g class="x-gridlines-group" transform={"translate("+(outerPadding.left+outerPadding.spaceBeyondXScale)+","+(outerPadding.top)+")"}>

        <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2
                    M0,4 l4,-4
                    M3,5 l2,-2" 
                style="stroke:#F66068; stroke-width:1" />
        </pattern>

        <rect
        transform={"translate("+(scaleWidth*(-1+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2))+",0)"}
        x=1.5
        width={scaleWidth*(-3+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2)-3}
        y={height-45}
        height=45
        fill="url(#diagonalHatch)"
        opacity=0.25
        ></rect>

        <path
        d={makeCurlyBrace(scaleWidth*(-1+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2), height-49, scaleWidth*(1+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2), height-49,  -15, 0.5)}
        stroke="#707071"
        stroke-width="1px"
        fill="none"
        ></path>

        {#each ["Areas within this", "range are less than ", "1 median absolute", "deviation (MAD)", "from the median"] as row, i}

            <text
            x={scaleWidth/2}
            text-anchor="middle"
            y={height-124+14*i}
            fill="#707071"
            font-size="14px"
            >{row}</text>

        {/each}

        {#each [-1,1] as bound}

            <line
            transform={"translate("+(scaleWidth*(bound+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2))+",0)"}
            y1={height-45}
            y2={height}
            stroke="#707071"
            stroke-dasharray="4 4"
            ></line>

        {/each}

        <line
        x1={-outerPadding.spaceBeyondXScale/2-0.5}
        x2={scaleWidth+outerPadding.spaceBeyondXScale/2+0.5}
        y1={height}
        y2={height}
        stroke="#707071"
        opacity=1
        stroke-width="1px"
        ></line>

        {#each ticks as d, i}

            {#if ![-1,0,1].includes(d)}

                <g class="tick" transform={"translate("+(scaleWidth*(d+medianAbsoluteDeviationLimit)/(medianAbsoluteDeviationLimit*2))+",0)"}>

                    <line
                    y1={d % 2 == 0 ? height-6 : height-3}
                    y2={height}
                    stroke="#707071"
                    opacity=1
                    stroke-width="1px"
                    ></line>

                    {#if d % 2 == 0}

                        <text
                        text-anchor="middle"
                        y={height-10}
                        fill="#707071"
                        font-size="14px"
                        >{d}</text>

                    {/if}

                </g>
            
            {/if}

        {/each}

        {#each ["<-5", "5<"] as d, i}

            <g class="tick" transform={"translate("+[-outerPadding.spaceBeyondXScale/2, scaleWidth+outerPadding.spaceBeyondXScale/2][i]+",0)"}>

                <line
                y1={height-6}
                y2={height}
                stroke="#707071"
                opacity=1
                stroke-width="1px"
                ></line>

                <text
                text-anchor="middle"
                y={height-24}
                fill="#707071"
                font-size="14px"
                >{["-5", "5"][i]+ " or"}</text>

                <text
                text-anchor="middle"
                y={height-10}
                fill="#707071"
                font-size="14px"
                >{["less", "more"][i]}</text>

            </g>

        {/each}

    </g>

    <g transform="translate(335, 0)">

        <rect
        x=-32
        width=82
        y=17
        height=73
        stroke="#003C57"
        fill="#003C57"
        rx="10px"
        ></rect>

        <g transform="scale(0.4)translate(-70,51)">

            <path d="M24.15 34q.65 0 1.075-.425.425-.425.425-1.075v-9.05q0-.6-.45-1.025Q24.75 22 24.15 22q-.65 0-1.075.425-.425.425-.425 1.075v9.05q0 .6.45 1.025.45.425 1.05.425ZM24 18.3q.7 0 1.175-.45.475-.45.475-1.15t-.475-1.2Q24.7 15 24 15q-.7 0-1.175.5-.475.5-.475 1.2t.475 1.15q.475.45 1.175.45ZM24 44q-4.25 0-7.9-1.525-3.65-1.525-6.35-4.225-2.7-2.7-4.225-6.35Q4 28.25 4 24q0-4.2 1.525-7.85Q7.05 12.5 9.75 9.8q2.7-2.7 6.35-4.25Q19.75 4 24 4q4.2 0 7.85 1.55Q35.5 7.1 38.2 9.8q2.7 2.7 4.25 6.35Q44 19.8 44 24q0 4.25-1.55 7.9-1.55 3.65-4.25 6.35-2.7 2.7-6.35 4.225Q28.2 44 24 44Zm0-20Zm0 17q7 0 12-5t5-12q0-7-5-12T24 7q-7 0-12 5T7 24q0 7 5 12t12 5Z" fill="white"></path>

        </g>

        {#each ["What is", "a median", "absolute", "deviation?"] as row, i}

            <text
            x={42}
            text-anchor="end"
            y={35+16*i}
            font-size="14px"
            fill="white"
            >{row}</text>

        {/each}

    </g>

    <g transform="translate(192, 230)">

        {#each ["Better", "Worse"] as word, i}

            <path
            transform={"translate("+0+","+(-40)+")"}
            d="M {-10*[-1,1][i]} 0 l{-50*[-1,1][i]} 0"
            stroke-width="1px"
            stroke="black"
            ></path>

            <path
            transform={"translate("+0+","+(-40)+")"}
            d="M {-68*[-1,1][i]} 0 l{6*[-1,1][i]} -6 l0 12 z"
            stroke="none"
            fill="black"
            ></path>

            <text
            transform={"translate("+0+","+(-40)+")"}
            x={-107*[-1,1][i]}
            y=-8
            text-anchor="middle"
            fill="black"
            font-size="14px">{word} than</text>

            <text
            transform={"translate("+0+","+(-40)+")"}
            x={-100*[-1,1][i]}
            y=6
            text-anchor="middle"
            fill="black"
            font-size="14px">median</text>


        {/each}

        

    </g>

</svg>


<style>

svg {
    overflow: visible;
}


</style>