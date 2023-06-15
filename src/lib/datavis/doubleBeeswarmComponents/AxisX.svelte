<script>

export let xDomain, x, xAxisOffset = 0, tickInterval = 5, chartHeight, gridlines = false;

let ticks = [];

for (let i = Math.floor(xDomain[0]); i <= Math.ceil(xDomain[1]); i++) { if (i % tickInterval == 0) {ticks.push(i)} }
    
</script>
    
<g class="xAxis"
transform={"translate(0,"+(xAxisOffset+chartHeight)+")"}>

    <line
    y1=0
    y2=0
    x1={x(xDomain[0])}
    x2={x(xDomain[1])}
    stroke="black"
    ></line>

    {#each ticks as d, i}

        <g class="tick">

            <line
            y1=0
            y2=8
            x1={x(d)}
            x2={x(d)}
            stroke="black"
            ></line>

            <text
            text-anchor="middle"
            y={20}
            x={x(d)}
            stroke="none"
            fill="#333"
            font-size="14px"
            >{d}</text>

            {#if gridlines}

            <line
            y1=0
            y2={-chartHeight}
            x1={x(d)}
            x2={x(d)}
            stroke="black"
            opacity=0.1
            ></line>

            

            {/if}

        </g>

    {/each}

</g>
    