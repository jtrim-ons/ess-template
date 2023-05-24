<script>
    import "../legacy.css";
    import "../app.css";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { setContext } from "svelte";
    import { domain } from "$lib/config";
    import PhaseBanner from "$lib/layout/PhaseBanner.svelte";
    import ONSFooter from "$lib/layout/ONSFooter.svelte";
    // import AnalyticsBanner from "$lib/layout/AnalyticsBanner.svelte";
    import ONSHeaderLite from "$lib/layout/ONSHeaderLite.svelte";

    export let data;
    setContext("areas", data.areas);

    // For localisation of menu etc
    let path = $page.url.pathname;
    let lang = $page.url.hostname.split(".")[0] == "cy" ? "cy" : "en";
    let baseurl = lang == "cy" ? "//cy.ons.gov.uk" : "//www.ons.gov.uk";

    // GOOGLE ANALYTICS
    // Settings for page analytics. Values must be shared with <AnalyticsBanner> component
    // const analyticsId = "GTM-MBCBVQS";
    // const analyticsProps = {
    //     contentTitle: "Area hub",
    //     releaseDate: "20230117",
    //     outputSeries: "areahub",
    //     contentType: "exploratory",
    // };
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
<PhaseBanner />
<ONSHeaderLite baseline />

<!-- <header style:background-color="#206095" style:color="white">
  <div class="wrapper">
    <h1 class="title">Explore Subnational Statistics</h1>
  </div>
</header> -->

<main id="main" tabindex="-1">
    <slot />
</main>

<ONSFooter />

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
