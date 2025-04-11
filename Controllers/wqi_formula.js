// /* 
//    vs => standard values
//    vi => ideal values 
// */

const vs = {
    ph: 9.06,
    turbidity: 5,
    temperature: 25,
    electrical_conductivity: 1500,
    hardness: 500,
    alkalinity: 120,
    total_disolved_solids: 500,
    dissolved_oxygen: 8,
    biological_oxygen_demand: 4,
    chemical_oxygen_demand: 25,
    ammonium: 0.2,
    chloride: 250,
    carbonate: 200,
    bicarbonate: 8.3,
    sulfate: 250,
    nitrate: 5,
    nitrite: 1,
    phosphate: 0.65,
    fluoride: 1
};

const vi = {
    ph: 7,
    turbidity: 0,
    temperature: 0,
    electrical_conductivity: 0,
    hardness: 0,
    alkalinity: 0,
    total_disolved_solids: 0,
    dissolved_oxygen: 14.6,
    biological_oxygen_demand: 0,
    chemical_oxygen_demand: 0,
    ammonium: 0,
    chloride: 0,
    carbonate: 0,
    bicarbonate: 0,
    sulfate: 0,
    nitrate: 0,
    nitrite: 0,
    phosphate: 0,
    fluoride: 0,
};

function calculate_wqi(va) {
    // wi => unit weight
    // qi => quality rating
    let wi = {};  // unit weights
    let qi = {};  // quality index
    let sum_wi = 0;  // sum of unit weights
    let pro_sum_qi_wi = 0;  // product of sum(qi * wi)
    let k = 0;  // constant for calculating weights

    // Step 1: Calculate k for weighting factor wi
    console.log(va);
    for (let param in va) {
        
        if (vs[param] !== undefined) {
            console.log("One");
            k += 1 / vs[param];
        }
    }
    k = 1 / k;  // Calculate the constant k

    // Step 2: Calculate wi (unit weights)
    for (let param in va) {
        if (vs[param] !== undefined) {
            console.log("Two");
            wi[param] = (k / vs[param]).toFixed(6);  // Assign and round to 6 decimals
        }
    }

    // Step 3: Calculate qi (quality index)
    for (let param in va) {
        if (vs[param] !== undefined && vi[param] !== undefined) {
            qi[param] = (((va[param] - vi[param]) / (vs[param] - vi[param])) * 100).toFixed(6);
        }
    }

    // Step 4: Calculate final WQI
    for (let param in va) {
        if (wi[param] !== undefined && qi[param] !== undefined) {
            sum_wi += parseFloat(wi[param]);
            pro_sum_qi_wi += (qi[param] * wi[param]);
        }
    }

    // Return the final WQI value
    return (pro_sum_qi_wi / sum_wi).toFixed(2);
}

module.exports = calculate_wqi;
