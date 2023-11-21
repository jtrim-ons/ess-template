<script>

import { colorsObject } from "$lib/config";

export let primaryCirclesStep2, hoverIndex, scaleHeight;

</script>

<g class="primaryCirclesGroup"
transform={"translate(0,"+scaleHeight/2+")"}
opacity={hoverIndex === null ? 1 : 0.2}>

    {#each primaryCirclesStep2 as circle,i}

                    <g transform={"translate("+circle.x+","+(circle.y)+")"}>

                        {#if ["parent", "country", "uk"].includes(circle.datum.role)}
                                        
                            <rect
                            pointer-events="none"
                            transform={["country", "uk"].includes(circle.datum.role) ? "rotate(45)" : null }
                            x={-6}
                            y={-6}
                            width={12}
                            height={12}
                            fill={colorsObject[circle.datum.role]}
                            stroke="white"
                            stroke-width="1px"
                            opacity=1
                            >
                            </rect>

                        {:else} 

                            <circle
                            pointer-events="none"
                            r=7
                            stroke="white"
                            stroke-width="1px"
                            fill={colorsObject[circle.datum.role]}
                            opacity=1
                            ></circle>


                        {/if}

                    </g>

    {/each}

</g>