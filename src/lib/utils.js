import { csvParse, autoType } from "d3-dsv";
import { feature } from "topojson-client";
import { getName, capitalise } from "@onsvisual/robo-utils";
import { cdnUrl, geoCodesLookup, geoNames } from "$lib/config";

export async function getData(url, fetch = window.fetch) {
  
  let res = await fetch(url);
  let str = await res.text();
  let data;

  data = csvParse(str, (d) => {

  for (const key in d) {
      if (d.hasOwnProperty(key)) {
        d[key] = String(d[key]);
      }
  }

  return d

  });
    
    /*let cols = data.columns.filter(c => {return data[0][c] && data[0][c].includes("|") });
    data.forEach((d, i) => {
      cols.forEach(col => {
        d[col] = d[col].split("|");
      });
    });*/

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

function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' 
          || type === '[object Array]';
  } catch (err) {
      return false;
  }
}

export function toProperCase(input) {
  return input.toLowerCase().replace(/(^|\s)\S/g, function (match) {
    return match.toUpperCase();
  });
}

export function findMedianObject(objects, key) {
  // Sort the array of objects by the "value" property
  objects.sort((a, b) => a[key] - b[key]);

  // Calculate the index of the median element
  const medianIndex = Math.floor(objects.length / 2);

  // Return the object at the median index
  return objects[medianIndex];
}

export function roundNumber(number, decimalPlaces) {

let roundingFactor = Math.pow(10, decimalPlaces);

return (Math.round(number*roundingFactor)/roundingFactor).toFixed(decimalPlaces);
}

export function addThousandsSeparator(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calculateMappingBreaks(values) {

  const minValue = values[0];
  const maxValue = values[values.length - 1];

  // Find specific percentiles
  const percentile20 = values[Math.floor(values.length * 0.2)];
  const percentile40 = values[Math.floor(values.length * 0.4)];
  const percentile60 = values[Math.floor(values.length * 0.6)];
  const percentile80 = values[Math.floor(values.length * 0.8)];

  return [minValue, percentile20, percentile40, percentile60, percentile80 ,maxValue];
}

export function calculateMedian(arr, property = null) {
    
  const values = arr.map(e => parseFloat(property == null ? e : e[property]));
  values.sort((a, b) => a - b);
  const length = values.length;

  if (length % 2 === 0) {
      const mid1 = values[length / 2 - 1];
      const mid2 = values[length / 2];
      return (mid1 + mid2) / 2;
  } else {
      return values[Math.floor(length / 2)];
  }
}

export function doRectanglesOverlap(x1, x2, y1, y2, x3, x4, y3, y4) {
  
    return x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
}

export function splitTextIntoRows(text, numRows) {
  const words = text.split(' ');
  const wordsPerRow = Math.ceil(words.length / numRows);
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    const start = i * wordsPerRow;
    const end = start + wordsPerRow;
    rows.push(words.slice(start, end).join(' '));
  }

  return rows;
}

export function makeCurlyBrace(x1,y1,x2,y2,w,q)
{
  //Calculate unit vector
  var dx = x1-x2;
  var dy = y1-y2;
  var len = Math.sqrt(dx*dx + dy*dy);
  dx = dx / len;
  dy = dy / len;

  //Calculate Control Points of path,
  var qx1 = x1 + q*w*dy;
  var qy1 = y1 - q*w*dx;
  var qx2 = (x1 - .25*len*dx) + (1-q)*w*dy;
  var qy2 = (y1 - .25*len*dy) - (1-q)*w*dx;
  var tx1 = (x1 -  .5*len*dx) + w*dy;
  var ty1 = (y1 -  .5*len*dy) - w*dx;
  var qx3 = x2 + q*w*dy;
  var qy3 = y2 - q*w*dx;
  var qx4 = (x1 - .75*len*dx) + (1-q)*w*dy;
  var qy4 = (y1 - .75*len*dy) - (1-q)*w*dx;

  return ( "M " +  x1 + " " +  y1 +
         " Q " + qx1 + " " + qy1 + " " + qx2 + " " + qy2 + 
          " T " + tx1 + " " + ty1 +
          " M " +  x2 + " " +  y2 +
          " Q " + qx3 + " " + qy3 + " " + qx4 + " " + qy4 + 
          " T " + tx1 + " " + ty1 );
}