export const domain = "https://www.ons.gov.uk";
export const cdnUrl = "https://cdn.ons.gov.uk/maptiles/ap-geos/v1";

export let thresholdObject = {
    population_density: [10, 50],
    female_life_expectancy: [1, 5],
    gdhi: [5, 20],
    no_qualifications_rate: [10, 20],
    life_satisfaction: [2, 10],
}

export let defaultThresholdArray = [1, 10];

export let comparisonTextObject = {high: {T: "Better than average", I: "Above average", F: "Worse than average"}, low: {T: "Worse than average", I: "Below average", F: "Better than average"}, similar: "Similar to average"};
    
export let changeTextObject = {high: {T: "Improving", I: "Increasing", F: "Worsening"}, low: {T: "Worsening", I: "Falling", F: "Improving"}, similar: "Little change"};


export const colorsObject = {
    "main": "#003C57",
    "parent": "#746CB1",
    "country": "#F66068",
    "uk": "#00A3A6",
    "neighbour": "#BCBCBD",
    "cluster": "#707071",
    "custom1": "#206095",
    "custom2": "#a8bd3a",
    "custom3": "#871a5b",
    "custom4": "#27a0cc",
    "selected": "#F39431"
}

export const rolesHierarchyObject = {
    "main": 1,
    "parent": 6,
    "country": 7,
    "neighbour": 9,
    "similar": 8,
    "custom1": 5,
    "custom2": 4,
    "custom3": 3,
    "custom4": 2

}

export const rolesHierarchyObject2 = {
    "main": 1,
    "parent": 2,
    "country": 3,
    "neighbour": 4,
    "similar": 5,
    "custom1": 6,
    "custom2": 7,
    "custom3": 8,
    "custom4": 9
}

export const geoNames = {
    W04: { label: "community", plural: "communities" },
    E06: { label: "unitary authority", plural: "unitary authorities" },
    W06: { label: "unitary authority", plural: "unitary authorities" },
    E07: {
        label: "non-metropolitan district",
        plural: "non-metropolitan districts",
    },
    E08: { label: "metropolitan district", plural: "metropolitan districts" },
    E09: { label: "borough", plural: "boroughs" },
    E10: { label: "county", plural: "counties" },
    E11: { label: "metropolitan county", plural: "metropolital counties" },
};

export const geoTypes = [
    {
        key: "ew",
        codes: ["K04"],
        source: {
            type: "geojson",
            promoteId: "areacd",
        },
    },
    {
        key: "ctry",
        codes: ["E92", "N92", "S92", "W92"],
        pcio: "country",
        label: "country",
        plural: "countries",
        source: {
            type: "geojson",
            promoteId: "areacd",
        },
    },
    {
        key: "rgn",
        codes: ["E12"],
        pcio: "region",
        label: "region",
        plural: "regions",
        source: {
            type: "geojson",
            promoteId: "areacd",
        },
    },
    {
        key: "cty",
        codes: ["E10", "E06", "W06", "E09", "N09", "S12"],
        pcio: "admin_county",
        label: "county/unitary authority",
        plural: "counties/unitary authorities",
        source: {
            type: "vector",
            url: "https://cdn.ons.gov.uk/maptiles/administrative/2021/cty/v1/boundaries/{z}/{x}/{y}.pbf",
            promoteId: "areacd",
            minzoom: 4,
        },
    },
    {
        key: "lad",
        codes: ["E06", "E07", "E08", "E09", "W06", "N09", "S12"],
        pcio: "admin_district",
        label: "district",
        plural: "districts",
        source: {
            type: "vector",
            url: "https://cdn.ons.gov.uk/maptiles/administrative/2021/authorities-ew/v2/boundaries/{z}/{x}/{y}.pbf",
            promoteId: "areacd",
            minzoom: 4,
        },
    }
];

export const geoCodesLookup = (() => {
    let lookup = {};
    geoTypes.forEach((g) => g.codes.forEach((k) => (lookup[k] = g)));
    return lookup;
})();

export const geoTypesLookup = (() => {
    let lookup = {};
    geoTypes.forEach((g) => (lookup[g.key] = g));
    return lookup;
})();

export const countries = [
    {name: "England", code: "E92000001"},
    {name: "Northern Ireland", code: "N92000002"},
    {name: "Scotland", code: "S92000003"},
    {name: "Wales", code: "W92000004"},
]

export const regions = [
    {name: "North East", code: "E12000001"},
    {name: "North West", code: "E12000002"},
    {name: "Yorkshire and The Humber", code: "E12000003"},
    {name: "East Midlands", code: "E12000004"},
    {name: "West Midlands", code: "E12000005"},
    {name: "East of England", code: "E12000006"},
    {name: "London", code: "E12000007"},
    {name: "South East", code: "E12000008"},
    {name: "South West", code: "E12000009"},
];

export const geoReverseLookup = (() => {
    let lookup = {};
    [...countries, ...regions].forEach(d => lookup[d.name] = d.code);
    return lookup;
})();