import { csvParse, autoType } from "d3-dsv";
import { feature } from "topojson-client";
import { getName, capitalise } from "@onsvisual/robo-utils";
import { cdnUrl, geoCodesLookup, geoNames } from "$lib/config";

export async function getData(url, fetch = window.fetch) {
  let res = await fetch(url);
  let str = await res.text();
  let data = csvParse(str, autoType);
  let cols = data.columns.filter(c => data[0][c] && data[0][c].includes("|"));
  data.forEach((d, i) => {
    cols.forEach(col => {
      d[col] = d[col].split("|");
    });
  });
  return data;
}

const getTypeLabel = (type) =>
        geoNames[type] ? geoNames[type].label : geoCodesLookup[type].label;

export async function getAreas(url, fetch = window.fetch) {
    let areas = await getData(url, fetch);
    areas.sort((a, b) => a.areanm.localeCompare(b.areanm));
    let lookup = {};
    areas.forEach((d) => (lookup[d.areacd] = d));
    areas.forEach((d) => {
        let type = d.areacd.slice(0, 3);
        // d.parentnm = lookup[d.parentcd] ? lookup[d.parentcd].areanm : null;
        d.group =
            type === "K04"
                ? ""
                : d.parent
                ? `${capitalise(getTypeLabel(type))} in ${
                        lookup[d.parent].areanm
                    }`
                : capitalise(getTypeLabel(type));
    });
    return areas;
}

export async function getArea(code, fetch = window.fetch) {
  try {
		let typeCode = code.slice(0, 3);
		let res = await fetch(`${cdnUrl}/${typeCode}/${code}.json`);
		let json = await res.json();

    json.properties.children = json.properties.children
      .map(c => c.hclnm ? {areacd: c.areacd, areanm: c.hclnm} : c.areanm ? c : {areacd: c.areacd, areanm: c.areacd})
      .sort((a, b) => a.areanm.localeCompare(b.areanm));

		if (geoNames[typeCode]) json.properties.typenm = geoNames[typeCode].label; 
		let childCodes = json.properties.children[0] ?
				Array.from(new Set(json.properties.children.map(d => d.areacd.slice(0, 3)))).sort((a, b) => a.localeCompare(b)) : null;
		json.properties.childTypes = childCodes ? Array.from(new Set(childCodes.map(c => geoCodesLookup[c]))) : [];
		if (typeCode === "E12") {
			json.properties.childTypes = json.properties.childTypes.filter(c => c.key !== "lad");
			if (code === "E12000007") {
				json.properties.childTypes = [
					{
						key: "lad",
						codes: ["E09"],
						label: "borough",
						plural: "boroughs"
					},
					...json.properties.childTypes
				];
			}
		} else if (typeCode === "W06") {
      json.properties.childTypes = json.properties.childTypes.filter(c => c.key !== "par");
      json.properties.childTypes = [
        ...json.properties.childTypes,
        {
          key: "par",
          codes: ["W04"],
          label: "community",
          plural: "communities"
        }
      ];
    }
    return {
      area: json.properties,
      type: geoCodesLookup[typeCode]
    };
	}
  catch {
    return {area: null, type: null};
  }
}

export function getParent(geocodes, parents) {
  for (const parent of parents) {
    let typecd = parent.areacd.slice(0, 3);
    if (geocodes.includes(typecd)) {
      parent.groupcd = geoCodesLookup[typecd].key;
      return parent;
    };
  }
  return null;
}

export function filterLinks(links, area) {
  let thislinks = [];
  let parentlinks = [];
  links.forEach(l => {
    let parent = getParent(l.geocodes, area.parents);
    if (l.geocodes.includes(area.typecd)) {
      thislinks.push({...l, area});
    } else if (parent) {
      parentlinks.push({...l, area: getParent(l.geocodes, area.parents)});
    }
  });
  return [...thislinks, ...parentlinks];
}

export function parseTemplate(template, area) {
  let output = template;
  let strs = template.match(new RegExp(/\{(.*?)\}/g));

  if (Array.isArray(strs)) {
    strs.forEach(s => {
      if (s.includes("name")) {
        let context = s.slice(1,-1).split(",")[1];
        output = output.replace(s, getName(area, context));
      } else {
        output = output.replace(s, area[s.slice(1,-1)]);
      }
    });
  }
  
  return output;
}

export function makePath(code) {
  if ([
    "K04", "E92", "W92",
    "E10", "E11", "E12",
    "E06", "E07", "E08", "E09", "W06",
    "E14", "W07"
  ].includes(code.slice(0, 3))) {
    return code + "/";
  } else {
    return "area/?code=" + code;
  }
}

export function filterChildren(area, type) {
  return area.children.filter(c => type.codes.includes(c.areacd.slice(0, 3)));
}

export function makeGeoJSON(topojson, layer) {
  let geojson = feature(topojson, layer);
  return geojson;
}

export function getColor(value, breaks, colors) {
  for (let i = 1; i < breaks.length; i ++) {
    if (value <= breaks[i]) {
      return colors[i - 1];
    }
  }
}

export function makeSum(values) {
  return values ? values.reduce((a, b) => a + b) : 0;
}