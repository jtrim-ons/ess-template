<script>

import { colorsObject } from '$lib/config';
import { select } from "d3-selection";

export let circleData, plottedAreas, y, hoverIndex, lineData, r;

let seed = 1, randomness1 = 1, randomness2 = 0;

class AccurateBeeswarm {
  constructor(items, radiusFun, xFun) {
    this.items = items;
    this.radiusFun = radiusFun;
    this.xFun = xFun;
    this.tieBreakFn = this._sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
    this.maxR = Math.max(...items.map(d => radiusFun(d)));
    this.rng = this._sfc32(1, 2, 3, seed);
}

calculateYPositions() {
    let all = this.items
        .map((d, i) => ({
        datum: d,
        originalIndex: i,
        x: this.xFun(d),
        y: null,
        placed: false
        }))
        .sort((a, b) => a.x - b.x);
    all.forEach(function(d, i) {
        d.index = i;
    });
    let tieBreakFn = this.tieBreakFn;
    all.forEach(function(d) {
        d.tieBreaker = tieBreakFn(d.x);
    });
    let allSortedByPriority = [...all].sort((a, b) => {
        let key_a = this.radiusFun(a.datum) + a.tieBreaker * randomness1;
        let key_b = this.radiusFun(b.datum) + b.tieBreaker * randomness1;
        return key_b - key_a;
    });
    for (let item of allSortedByPriority) {
        item.placed = true;
        item.y = this._getBestYPosition(item, all);
    }
    all.sort((a, b) => a.originalIndex - b.originalIndex);
    return all.map(d => ({ datum: d.datum, x: d.x, y: d.y }));
}

// Random number generator (for reproducibility)
// https://stackoverflow.com/a/47593316
_sfc32(a, b, c, d) {
let rng = function() {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
};
for (let i = 0; i < 10; i++) {
    rng();
}
return rng;
}

_getBestYPosition(item, all) {
let forbiddenIntervals = [];
for (let step of [-1, 1]) {
    let xDist;
    let r = this.radiusFun(item.datum);
    for (
    let i = item.index + step;
    i >= 0 &&
    i < all.length &&
    (xDist = Math.abs(item.x - all[i].x)) < r + this.maxR;
    i += step
    ) {
    let other = all[i];
    if (!other.placed) continue;
    let sumOfRadii = r + this.radiusFun(other.datum);
    if (xDist >= r + this.radiusFun(other.datum)) continue;
    let yDist = Math.sqrt(sumOfRadii * sumOfRadii - xDist * xDist);
    let forbiddenInterval = [other.y - yDist, other.y + yDist];
    forbiddenIntervals.push(forbiddenInterval);
    }
}
if (forbiddenIntervals.length == 0) {
    return this.radiusFun(item.datum) * (this.rng() - .5) * randomness2;
}
let candidatePositions = forbiddenIntervals.flat();
candidatePositions.push(0);
candidatePositions.sort((a, b) => {
    let abs_a = Math.abs(a);
    let abs_b = Math.abs(b);
    if (abs_a < abs_b) return -1;
    if (abs_a > abs_b) return 1;
    return a - b;
});
// find first candidate position that is not in any of the
// forbidden intervals
for (let i = 0; i < candidatePositions.length; i++) {
    let position = candidatePositions[i];
    if (
    forbiddenIntervals.every(
        interval => position <= interval[0] || position >= interval[1]
    )
    ) {
    return position;
    }
    }
    }
}

$: plotData = new AccurateBeeswarm(
    plottedAreas, 
    d => "radius" in d ? d.radius*1.1 : 5,
    d => y(circleData.find((e) => e.areacd === d.areacd).value)
    ).calculateYPositions();

let primaryRolesArray = ["main", "parent", "country", "uk", "custom1", "custom2", "custom3", "custom4"];

$: lineData = hoverIndex === null ? plotData.filter((e) => primaryRolesArray.includes(e.datum.role)) : [plotData[hoverIndex]];

function mouseoverEvent(event) { hoverIndex = parseFloat(select(this).attr("hoverid")) }

function mouseleaveEvent(event) { hoverIndex = null }

</script>

{#if plotData.length > 0}

    <g class="overlayCirclesContainer"> 

        {#each plotData as circle, i}
        
            <g transform={"translate("+circle.y+","+circle.x+")"}>

                <circle
                on:mouseover={mouseoverEvent}
                on:mouseleave={mouseleaveEvent}
                on:focus={mouseoverEvent}
                hoverid={i}
                {r}
                stroke="none"
                fill="white"
                ></circle>
            
            </g>

        {/each}
    </g>

    <g class="visibleCirclesContainer"> 

        {#each plotData as circle, i}

                <g transform={"translate("+circle.y+","+circle.x+")"}>

                    {#if ["parent", "country", "uk"].includes(circle.datum.role)}
                                            
                        <rect
                        pointer-events="none"
                        transform={["country", "uk"].includes(circle.datum.role) ? "rotate(45)" : null }
                        x={hoverIndex === i ? -0.75*circle.datum.radius-3 : -0.75*circle.datum.radius}
                        y={hoverIndex === i ? -0.75*circle.datum.radius-3 : -0.75*circle.datum.radius}
                        width={hoverIndex === i ? circle.datum.radius*1.5+6 : circle.datum.radius*1.5}
                        height={hoverIndex === i ? circle.datum.radius*1.5+6 : circle.datum.radius*1.5}
                        fill={hoverIndex === i ? "#F39431": colorsObject[circle.datum.role]}
                        stroke="white"
                        opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.2}
                        >
                        </rect>

                    {:else} 

                        <circle
                        pointer-events="none"
                        {r}
                        fill={hoverIndex === i ? "#F39431" : colorsObject[circle.datum.role]}
                        stroke="white"
                        opacity={hoverIndex === i || hoverIndex === null ? 1 : 0.2}
                        >
                        </circle>

                    {/if}

                </g>

        {/each}

    </g>
{/if}