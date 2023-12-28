<script>

import "@onsvisual/svelte-components/css/main.css";
import "../app.css";
import { page } from "$app/stores";
import { base } from "$app/paths";
import { setContext } from "svelte";
import { domain } from "$lib/config";
import { PhaseBanner, Header, Footer } from "@onsvisual/svelte-components";

export let data;

setContext("page", page);
setContext("areas", data.areas);

setContext("areasParentsLookup", data.areasParentsLookup);
setContext("areasGeogLevel", data.areasGeogLevel);
setContext("areasGeogInfo", data.areasGeogInfo);

let indicators = data.indicators.map((e) => ({ 
    ...e, 
    label: data.indicatorsMetadata.find((el) => e.code == el.code).label,
    data: data.combinedData.filter((el) => el.id === e.id)
}));
setContext("indicators", indicators)
setContext("indicatorsCalculations", data.indicatorsCalculations)
data.indicatorsMetadata.forEach((e) => {

    e.prefix = e.prefix == null ? "" : e.prefix.replace("GBPSign", "£")
    e.suffix = e.suffix== null ? "" : e.suffix

});
setContext("indicatorsMetadata", data.indicatorsMetadata)

setContext("periodsLookup", data.periodsLookup);

setContext("clustersInfo", data.clustersInfo);
setContext("clustersLookup", data.clustersLookup);

setContext("beeswarmKeyData", data.beeswarmKeyData);

let topics = [...new Set(indicators.map((e) => e.topic))].map((e) => ({

    name: e,
    indicatorsList: indicators.filter((el) => el.topic === e).map((el) => el.id),
    subTopicsList: [...new Set(indicators.filter((el) => el.topic === e).map((el) => el.subTopic))]
})).sort((a,b) => a.name - b.name); 

setContext("topics", topics);

// For localisation of menu etc
let path = $page.url.pathname;
let lang = $page.url.hostname.split(".")[0] == "cy" ? "cy" : "en";
let baseurl = lang == "cy" ? "//cy.ons.gov.uk" : "//www.ons.gov.uk";

</script>

<svelte:head>
    <title>Explore subnational statistics - ONS</title>
    <meta property="og:title" content="Explore subnational statistics - ONS" />
    <meta property="og:type" content="website" />
    <link rel="icon" href="{domain}{base}/favicon.ico" />
    <link rel="canonical" href="{domain}{base}{$page.url.pathname}" />
    <meta property="og:url" content="{domain}{base}{$page.url.pathname}" />
    <meta
        name="description"
        content="Get data about people and the communities they live in, includes population, economy and health."
    />
    <meta
        property="og:description"
        content="Get data about people and the communities they live in, includes population, economy and health."
    />
</svelte:head>

<!-- <AnalyticsBanner {analyticsId} {analyticsProps}/> -->
<PhaseBanner phase="prototype" />
<Header />

<!-- <header style:background-color="#206095" style:color="white">
  <div class="wrapper">
    <h1 class="title">Explore Subnational Statistics</h1>
  </div>
</header> -->

<main id="main" tabindex="-1">
    <slot />
</main>

<Footer />

<style>
    h1 {
        font-size: 32px;
        line-height: 42px;
        font-weight: bold;
        margin: 26px 0;
        padding: 0;
    }

    /* .subhead {
    font-size: 18px;
    line-height: 28px;
    margin: 0 0 28px 0;
    padding: 0;
  } */
  
    p.footer-text {
        font-size: 1.1em;
        margin: 0;
        padding: 40px 0 5px 0;
    }
    p.footer-text + p.footer-text {
        padding-top: 10px;
    }
</style>
