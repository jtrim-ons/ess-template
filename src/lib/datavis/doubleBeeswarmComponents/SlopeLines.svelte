<script>

import { colorsObject } from '$lib/config';

export let x, xDomain, lineDataArray, onHover;

</script>

{#each lineDataArray as lineData, i}

    <g class={"slopeGroup slopeGroup"+i}>

        <g class="slopeLineGroup">

            <line
            class="slopeLine"
            x1={lineData.x1+x(xDomain[0])}
            x2={lineData.x2+x(xDomain[1])}
            y1={lineData.y1}
            y2={lineData.y2}
            stroke={onHover ? "#F39431": colorsObject[lineData.role]}
            stroke-width="2px"
            zcode={lineData.zCode}
            ></line>

        </g>

        <g class="slopeLabelGroup">

            <g
            transform={"translate("+(x(xDomain[0])+(x(xDomain[1])-x(xDomain[0]))/2)+","+((lineData.y1+lineData.y2)/2+(i % 2 == 0 ? -5 : 14))+")"}>

                <g transform={"rotate("+60*Math.atan((lineData.y2-lineData.y1)/((x(xDomain[1])-lineData.x2)-(x(xDomain[0])+lineData.x1)))+")"}>

                    <text
                    y={0}
                    text-anchor="middle"
                    stroke="none"
                    fill={onHover ? "#F39431": colorsObject[lineData.role]}
                    font-size={"14px"}
                    zcode={null}
                    >{lineData.text}</text>

                </g>
            </g>
        </g>
    </g>

{/each}