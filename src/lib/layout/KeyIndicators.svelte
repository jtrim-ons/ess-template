<script>

import { selectedArea } from "$lib/selectedAreasStore.js";

export let data3, data4;

$: console.log(data3);

let population_data_main = data3.find((e) => e.indicator.code === "population" && e.role === "main");
let population_data_country = data3.find((e) => e.indicator.code === "population" && e.role === "country");


let population_density_data = data3.find((e) => e.indicator.code === "population_density" && e.role === "main");
let population_density_rank_data = data4.find((e) => e.indicator.code === "population_density" && e.role === "main");

let population_density_value = population_density_data[population_density_data.indicator.years[1]];
let population_density_rank = Math.round(population_density_rank_data["rank_localauthority_2020"]/337*100);

let densityText = population_density_rank > 90 ? $selectedArea.areanm + " is among the UK's 10% of local authorities with the highest population density." : population_density_rank < 20 ? $selectedArea.areanm + " is among the UK's 20% of local authorities with the lowest population density." : (100-population_density_rank)+"% of local authorities in the UK have a higher population density than "+$selectedArea.areanm+"."


let life_data_main = data3.find((e) => e.indicator.code === "female_life_expectancy" && e.role === "main");
let life_data_country = data3.find((e) => e.indicator.code === "female_life_expectancy" && e.role === "country");

let lifeTextRight = "On average, people in "+$selectedArea.areanm+" live "+((Math.round(Math.abs(life_data_main[2018] - life_data_country[2018])*10)/10).toFixed(1))+" years "+(life_data_main[2018] > life_data_country[2018] ? "longer" : "shorter")+" than the average across "+life_data_country.areanm+".";


let gdhi_data_main = data3.find((e) => e.indicator.code === "gdhi" && e.role === "main");
let gdhi_data_country = data3.find((e) => e.indicator.code === "gdhi" && e.role === "country");

let gdhi_right_text = $selectedArea.areanm + " is £" + (Math.abs(Math.round(gdhi_data_main[2020]-gdhi_data_country[2020]))).toLocaleString() +" per person "+(gdhi_data_main[2020] - gdhi_data_country[2020] > 0 ? "richer" : "poorer") + " than "+life_data_country.areanm+" overall."

let indicatorsArray = [
    {id: "population", textAbove: "Population:", textBelow: null, figure: Math.round(population_data_main[2020]).toLocaleString(), textRight: `This means that ${Math.round(population_data_main[2020]/population_data_country[2020]*10000)/100}% of all people in England live in ${$selectedArea.areanm}.`},
    {id: "population_density", textAbove: "Population density:", textBelow: "people per square kilometre", figure: Math.round(population_density_data[population_density_data.indicator.years[1]]).toLocaleString(), textRight: densityText},
    {id: "life_expectancy", textAbove: "Life expectancy:", figure: (Math.round(life_data_main[2018]*10)/10).toFixed(1), textRight: lifeTextRight, textBelow: "years"},
    {id: "gdhi", textAbove: "Disposable income per person:", figure: "£"+(Math.round(gdhi_data_main[2020]).toLocaleString()), textRight: gdhi_right_text},
]



</script>

<div class="keyIndicatorsContainer">

    {#each indicatorsArray as indicator}

    <div class="indicatorContainer">

    <div class="left">

    <h4>{indicator.textAbove}</h4>
    <h1>{indicator.figure}</h1>

    {#if indicator.textBelow} 

    <h5>{indicator.textBelow}</h5>

    {/if}



    </div>

    <div class="right">

    <p>{indicator.textRight}</p>
    
    
    </div>



    </div>


    {/each}




</div>

<style>

.keyIndicatorsContainer {
    margin-bottom: 100px;
}

.indicatorContainer {
    margin-top: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: solid black 1px;
    padding-bottom: 10px;
    align-content: space-between;
    
}

p {
    font-size: 18px;
    margin: 0px;
}

.left {
    margin-right: 35px;
    min-width: 40%;
}

.right {
}

h4 {
    margin-bottom: 0px;
    margin-top: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}

h1 {
    line-height: 54px;
    font-size: 50px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    padding-top: 10px;
}


</style>