<script>

import { select } from "d3-selection";

export let backgroundCirclesStep2, y, hoverIndex, radius, hoverChartIndex, index

function mouseoverEvent(event) { 
    
    hoverIndex = select(this).attr("hoverid");
    hoverChartIndex = index;
};

function mouseleaveEvent(event) { 
    
    hoverIndex = null;
    hoverChartIndex = null;
};


</script>


<g class="backgroundCirclesGroup">

    {#each backgroundCirclesStep2 as circle,i}

                    <g transform={"translate("+circle.x+","+y(circle.y)+")"}>

                        <circle
                        r={radius+2}
                        stroke="none"
                        fill="white"
                        opacity=1
                        ></circle>

                    </g>

    {/each}
</g>

<g class="backgroundCirclesGroup"
opacity={hoverIndex === null ? 1 : 0.3}>

    {#each backgroundCirclesStep2 as circle,i}

                    <g transform={"translate("+circle.x+","+y(circle.y)+")"}>

                        <circle
                        hoverid={circle.datum.areacd}
                        on:mouseover={mouseoverEvent}
                        on:mouseleave={mouseleaveEvent}
                        r={radius}
                        stroke="none"
                        fill="#cccccc"
                        opacity=0.5
                        ></circle>

                    </g>

    {/each}

</g>