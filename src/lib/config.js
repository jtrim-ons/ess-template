export const domain = "https://www.ons.gov.uk";
export const cdnUrl = "https://cdn.ons.gov.uk/maptiles/ap-geos/v1";

export const indicators = [
    {
        code: "density",
        label: "Population density",
        description: "The number of people resident in an area per square kilometre",
        years: [2001, 2020],
        unit: "people per sq. km",
    },
    {
        code: "age_median",
        label: "Median age",
        description: "The middle age of the population. Half of the population is older and half of the population is younger",
        years: [2001, 2020],
        unit: "years",
    },
    {
        code: "gva_job",
        label: "GVA per filled job",
        description: "Gross value added (GVA) is an economic productivity metric",
        years: [2002, 2020],
        unit: "£",
    },
    {
        code: "gdhi_person",
        label: "GDHI per head",
        description: "Gross disposable household income (GDHI) is the amount of money individuals have for spending or saving",
        years: [1997, 2020],
        unit: "£",
    },
    {
        code: "employment",
        label: "Employment rate for 16 to 64 year olds",
        description: "A measure of the proportion of working age people that are in employment",
        years: [2006, 2021],
        unit: "%",
    },
    {
        code: "life_exp_f",
        label: "Female life expectancy",
        description: "The average number of years that a newborn female could expect to live",
        years: [2003, 2018],
        unit: "years",
    },
];

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