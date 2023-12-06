<script>

export let backgroundCirclesStep2, y;

</script>

<g class="hoverCirclesGroup">

    {#each backgroundCirclesStep2 as circle,i}

        <g transform={"translate("+circle.x+","+y(circle.y)+")"}>

            <circle
            r=7
            stroke="white"
            stroke-width="2px"
            fill="#F39431"
            opacity=1
            pointer-events="none"
            ></circle>

        </g>

    {/each}

</g>