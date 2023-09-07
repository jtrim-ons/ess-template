
export function calculateSmallestDifference(arr) {
    if (arr.length < 2) {
      return 999; // or handle the case as per your requirements
    }
  
    let smallestDifference = Infinity;
  
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const difference = Math.abs(arr[i] - arr[j]);
        if (difference < smallestDifference) {
          smallestDifference = difference;
        }
      }
    }
  
    return smallestDifference;
  }