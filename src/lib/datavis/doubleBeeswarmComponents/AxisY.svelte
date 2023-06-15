<script>

export let yDomain, y, yAxisOffset = 0, tickInterval = 1000, column = 0;

let ticks = [];

$: {

ticks = [];

for (let i = Math.ceil(yDomain[0]); i <= Math.floor(yDomain[1]); i++) { if (i % tickInterval == 0) {ticks.push(i)} }

}

$: console.log(yDomain)
    
</script>
    
<g class="yAxis"
transform={"translate("+(-yAxisOffset)+",0)"}>

    <line
    x1=0
    x2=0
    y1={y(yDomain[1])}
    y2={y(yDomain[0])}
    stroke="black"
    ></line>

    {#if column == 0}

        {#each ticks as d, i}

            <g class="tick">

                <line
                x1=0
                x2=-8
                y1={y(d)}
                y2={y(d)}
                stroke="black"
                ></line>

                <text
                text-anchor="end"
                x={-10}
                y={y(d)+5}
                stroke="none"
                fill="#333"
                font-size="14px"
                >{d.toLocaleString()}</text>

            </g>

        {/each}

    {/if}

</g>
    