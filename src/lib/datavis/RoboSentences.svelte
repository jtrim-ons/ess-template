<script>

import { selectedArea } from "$lib/selectedAreasStore.js";
import { base } from "$app/paths";

export let countOfNulls, areaType, mainAreaNameStyled, countryAreaNameStyled, block, data, countByGeoLevel, fullStop = ".", ukAreaNameStyle, parentAreaNameStyle;

console.log(data);

const calculateValue = (role, indicator, year) => {

    let areaValue = data[role].value[indicator+"_"+year];

    return areaValue
}

const calculateRankAndPercentile = (role, grouping, indicator, year) => {

    let countOfAreas = countByGeoLevel.find((e) => e.category === $selectedArea[grouping] & e.geoLevel === grouping).count;

    let countOfNullData = countOfNulls.find((e) => e.category === $selectedArea[grouping] & e.geoLevel === grouping & e.indicator === indicator);

    countOfNullData = countOfNullData !== undefined ? countOfNullData.count : 0;

    let areaRank = countOfAreas - countOfNullData - data[role].rank[indicator+"_"+grouping+"_"+year];

    let percentileValue = Math.round(areaRank/(countOfAreas - countOfNullData)*100);
    
    return {rank: areaRank, total: countOfAreas - countOfNullData, groupingName: "England", percentile: percentileValue}
}

let indicatorLink = `<a href = ${base}/indicators/${block.code}>${block.indicator.label.toLowerCase()}</a>`

if (block.sentence === 1) {

    let sentenceData = calculateRankAndPercentile("main", "countrycd", block.code, block.indicator.years[1])

    if (sentenceData.percentile < 60 & sentenceData.percentile > 40) {

        block.sentence = mainAreaNameStyled + " is close to the median of all "+areaType+ " in "+countryAreaNameStyled+" for "+indicatorLink+"."

    } else if (sentenceData.percentile < 40 & sentenceData.percentile > 20) {

        block.sentence = mainAreaNameStyled + " is in the top half of "+areaType+ " in "+countryAreaNameStyled+" for "+indicatorLink+fullStop

    } else if (sentenceData.percentile < 80 & sentenceData.percentile > 60)  {

        block.sentence = mainAreaNameStyled + " is in the bottom half of "+areaType+ " in "+countryAreaNameStyled+" for "+indicatorLink+fullStop

    } else {

        block.sentence = mainAreaNameStyled + " is in the "+(sentenceData.percentile < 50 ? "top" : "bottom")+" "+(sentenceData.percentile < 50 ? sentenceData.percentile : 100 - sentenceData.percentile)+"% of "+areaType+" in "+countryAreaNameStyled+" for "+indicatorLink+fullStop

    }

}

if (block.sentence === 2) {

    let sentenceData1 = calculateRankAndPercentile("main", "parentcd", block.code, block.indicator.years[1])

    let sentenceData2 = calculateRankAndPercentile("main", "countrycd", block.code, block.indicator.years[1])

    if (sentenceData2.percentile > 50 & sentenceData1.percentile > 50) {

        block.sentence = mainAreaNameStyled + " has the " + sentenceData1.rank + "th highest "+ indicatorLink + " of all local authorities in " + $selectedArea.parentnm + " and the "+sentenceData2.rank + "th highest in "+countryAreaNameStyled+fullStop

    } else if (sentenceData2.percentile < 50 & sentenceData1.percentile < 50) {

        block.sentence = mainAreaNameStyled + " has the " + (sentenceData1.total-sentenceData1.rank) + "th lowest "+ indicatorLink + " of all local authorities in " + $selectedArea.parentnm + " and the "+ (sentenceData2.total-sentenceData2.rank) + "th lowest in "+countryAreaNameStyled+fullStop

    } else if (sentenceData1.percentile < 50) {

        block.sentence = mainAreaNameStyled + " has the " + (sentenceData1.total-sentenceData1.rank) + "th lowest "+ indicatorLink + " of all local authorities in " + $selectedArea.parentnm + fullStop

    } else {

        block.sentence = mainAreaNameStyled + " has the " + sentenceData1.rank + "th highest "+ indicatorLink + " of all local authorities in " + $selectedArea.parentnm + fullStop
    }

}

if (block.sentence === 3) {

    let sentenceData1 = calculateRankAndPercentile("main", "localauthority", block.code, block.indicator.years[0])

    let sentenceData2 = calculateRankAndPercentile("main", "localauthority", block.code, block.indicator.years[1])

    if (Math.abs(sentenceData1.percentile - sentenceData2.percentile) > 10) {

        block.sentence = "In "+ block.indicator.years[0] +", "+ mainAreaNameStyled + " was ranked " + sentenceData1.rank + "th for " + indicatorLink + " in the "+ukAreaNameStyle+". By "+ block.indicator.years[1] + ", its ranking had "+(sentenceData1.rank > sentenceData2.rank ? "improved" : "fallen")+" to "+sentenceData2.rank+ "th" + fullStop

    } else {

        block.sentence = mainAreaNameStyled + " ranks " + sentenceData2.rank + "th for " + indicatorLink + " among all local authorities in the "+ukAreaNameStyle+fullStop
    
    }
}

if (block.sentence === 4) {

    let sentenceData1 = calculateValue("main", block.code, block.indicator.years[1])

    let sentenceData2 = calculateValue("parent", block.code, block.indicator.years[1])

    let sentenceData3 = calculateValue("country", block.code, block.indicator.years[1])

    let suffix = "suffix" in block.indicator ? " percentage points " : "";
    let subText = "subText" in block.indicator ? " "+ block.indicator.subText : "";
    let prefix = "prefix" in block.indicator ? block.indicator.prefix : "";

    if (Math.round(Math.abs(sentenceData1 - sentenceData2)) === 0) {

    block.sentence = mainAreaNameStyled + " has a " + indicatorLink + " which is "+prefix+ Math.round(Math.abs(sentenceData1 - sentenceData3)) + suffix + subText+ " " +(sentenceData1 - sentenceData3 > 0 ? "higher" : "lower")+ " than the average across "+countryAreaNameStyled+fullStop

    } else {

    block.sentence = mainAreaNameStyled + " has a " + indicatorLink + " which is "+prefix+ Math.round(Math.abs(sentenceData1 - sentenceData2)) + suffix + subText+ " " +(sentenceData1 - sentenceData2 > 0 ? "higher" : "lower")+ " than the average across "+parentAreaNameStyle+fullStop

    }
}

if (block.sentence === 5) {

    let sentenceData1 = calculateValue("main", block.code, block.indicator.years[0])

    let sentenceData2 = calculateValue("main", block.code, block.indicator.years[1])

    let sentenceData3 = calculateValue("country", block.code, block.indicator.years[0])

    let sentenceData4 = calculateValue("country", block.code, block.indicator.years[1])

    block.sentence = "Between " + block.indicator.years[0] + " and " + block.indicator.years[1] +", " +indicatorLink + " " + (sentenceData2 > sentenceData1 ? "increased" : "descreased") + " by " + Math.abs(Math.round(100*(sentenceData2-sentenceData1)/sentenceData1)) + "% in " + mainAreaNameStyled + ", compared to a " + Math.abs(Math.round(100*(sentenceData4-sentenceData3)/sentenceData4)) + "% "+ (sentenceData4 > sentenceData3 ? "increase" : "descrease") + " across " + countryAreaNameStyled + fullStop

}


</script>


{#if fullStop === "."}

<p>{@html block.sentence }</p>

{:else} 

<h3>{@html block.sentence }</h3>

{/if}



<style>

p {
    font-size: 18px;
    margin: 0px;
    line-height: 28px;
}

</style>