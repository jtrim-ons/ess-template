export const domain = "https://www.ons.gov.uk";
export const cdnUrl = "https://cdn.ons.gov.uk/maptiles/ap-geos/v1";

export const defaultAreaComponents = [
    {type: "line", code: "median_age", section: "Demographics"},
    {type: "double-beeswarm", code: "population_density", section: "Demographics"},
    {type: "line", code: "gdhi", section: "Economy"},
    {type: "line", code: "employment_rate", section: "Economy"},
    {type: "line", code: "female_life_expectancy", section: "Health"},
    {type: "map", code: "female_life_expectancy", section: "Health"},
    {type: "double-beeswarm", code: "no_qualifications_rate", section: "Education"},
];

export const colorsObject = {
    "main": "#003C57",
    "parent": "#746CB1",
    "country": "#F66068",
    "neighbour": "#BCBCBD",
    "similar": "#707071",
    "custom1": "#206095",
    "custom2": "#a8bd3a",
    "custom3": "#871a5b",
    "custom4": "#27a0cc"
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

export const areaComponents = {


};

export const defaultIndicatorComponents = [
    {type: "robo-text"}, {type: "line"}, {type: "double-beeswarm"}, {type: "map"}
];

export const indicators = [
    {
        code: "population",
        label: "Population",
        description: "Population of the area",
        years: [2001, 2020],
        unit: "Resident population",
        zeroBaseline: false,
        yTicks: 20000
    },

    {
        code: "population_density",
        label: "Population density",
        description: "The number of people resident in an area per square kilometre",
        years: [2001, 2020],
        unit: "People per square kilometre",
        zeroBaseline: true,
        yTicks: 1000
    },

    {
        code: "employment_rate",
        label: "Employment rate",
        description: "The number of people in paid work as a proportion of the population",
        years: [2012, 2022],
        unit: "Percentage of population in work",
        zeroBaseline: false,
        yTicks: 5

    },

    {
        code: "female_life_expectancy",
        label: "Life expectancy",
        description: "",
        years: [2003, 2018],
        unit: "Average life expectancy at birth",
        zeroBaseline: false,
        yTicks: 2

    },

    {
        code: "gdhi",
        label: "Gross disposable household income",
        description: "",
        years: [1997, 2020],
        unit: "Per capita disposable income",
        zeroBaseline: false,
        yTicks: 2000

    },

    {
        code: "gva_hour",
        label: "Gross value added per hour worked",
        description: "",
        years: [2004, 2020],
        unit: "GVA per hour",
        zeroBaseline: false,
        yTicks: 2000

    },

    {
        code: "median_age",
        label: "Median age of the population",
        description: "",
        years: [2001, 2020],
        unit: "Median age",
        zeroBaseline: false,
        yTicks: 5

    },

    {
        code: "internet_access",
        label: "Access to the internet",
        description: "",
        years: [2022],
        unit: "Percentage of the population with access to the internet",
        zeroBaseline: false,
        yTicks: 5

    },

    {
        code: "no_qualifications_rate",
        label: "No qualifications rate",
        description: "",
        years: [2012,2021],
        unit: "Percentage of the population aged 16-64 without qualifications",
        zeroBaseline: true,
        yTicks: 5
    },
    {
        code: "unemployment_rate",
        label: "Unemployment rate",
        description: "",
        years: [2012,2022],
        unit: "Percentage of workers unemployment while seeking work",
        zeroBaseline: true,
        yTicks: 2
    },





    
    /*{
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
    },*/
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