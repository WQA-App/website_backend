const calculate_wqi = require("./controller/wqi_formula");

//Saving Excel file in database - Admin feature

function processAddData(obj) {
    for (let key in obj) {
        // // Convert necessary ion values to floats for SAR and Sodium Percentage calculations
        // const sodium = parseFloat(obj[key]['sodiumion']);
        // const calcium = parseFloat(obj[key]['calciumion']);
        // const magnesium = parseFloat(obj[key]['magnesiumion']);
        // const potassium = parseFloat(obj[key]['potassiumion']);

        // // SAR Calculation: Uses Sodium, Calcium, and Magnesium
        // obj[key]['sar'] = calculate_sar([sodium, calcium, magnesium]);

        // // Sodium Percentage Calculation: Uses Sodium, Calcium, Magnesium, and Potassium
        // obj[key]['Na_per'] = calculate_sodiumpercentage([sodium, calcium, magnesium, potassium]);

        // WQI Calculation: Pass all necessary parameters for WQI calculation
        const wqiParams = {
            ph: parseFloat(obj[key]['ph']) || null,
            electrical_conductivity: parseFloat(obj[key]['electrical_conductivity']) || null,
            CO3: parseFloat(obj[key]['CO3']) || null,
            HCO3: parseFloat(obj[key]['HCO3']) || null,
            SO4: parseFloat(obj[key]['SO4']) || null,
            NO3: parseFloat(obj[key]['NO3']) || null,
            PO4: parseFloat(obj[key]['PO4']) || null,
            TH: parseFloat(obj[key]['TH']) || null,
            Ca: parseFloat(obj[key]['Ca']) || null,
            Mg: parseFloat(obj[key]['Mg']) || null,
            Na: parseFloat(obj[key]['Na']) || null,
            K: parseFloat(obj[key]['K']) || null,
            F: parseFloat(obj[key]['F']) || null,
            TDS: parseFloat(obj[key]['TDS']) || null,
            SiO2: parseFloat(obj[key]['SiO2']) || null
        };
        
        obj[key]['water_quality_index'] = calculate_wqi(wqiParams);  // Calculate WQI

        // // Hazard Index Calculation: Uses Nitrate, Nitrite, Fluoride, Ammonium, and Phosphate
        // const nitrate = parseFloat(obj[key]['nitrate']);
        // const nitrite = parseFloat(obj[key]['nitrite']);
        // const fluoride = parseFloat(obj[key]['fluoride']);
        // const ammonium = parseFloat(obj[key]['ammonium']);
        // const phosphate = parseFloat(obj[key]['phosphate']);

        // obj[key]['hazard_index'] = calculate_hazard_index([nitrate, nitrite, fluoride, ammonium, phosphate]);
    }
    return obj;
}    

function formatDataForDatabaseAddExcel(obj) {
    return Object.keys(obj).map(key => ({
        well_id: obj[key]['well_id'] || null,
        s_no: obj[key]['s_no'] || null,
        state: obj[key]['state'] || null,
        district: obj[key]['district'] || null,
        block: obj[key]['block'] || null,
        village: obj[key]['village'] || null,
        latitude: obj[key]['latitude'],
        longitude: obj[key]['longitude'],
        year: obj[key]['year'] || null,
        ph: obj[key]['ph'] || null,
        electrical_conductivity: obj[key]['electrical_conductivity'] || null,
        CO3: obj[key]['CO3'] || null,
        HCO3: obj[key]['HCO3'] || null,
        SO4: obj[key]['SO4'] || null,
        NO3: obj[key]['NO3'] || null,
        PO4: obj[key]['PO4'] || null,
        TH: obj[key]['TH'] || null,
        Ca: obj[key]['Ca'] || null,
        Mg: obj[key]['Mg'] || null,
        Na: obj[key]['Na'] || null,
        K: obj[key]['K'] || null,
        F: obj[key]['F'] || null,
        TDS: obj[key]['TDS'] || null,
        SiO2: obj[key]['SiO2'] || null,
        water_quality_index: obj[key]['water_quality_index'] || null,
    }));
}


async function processAddExcelData(data) {
    const headerRow = data[0]; 
    const rows = data.slice(1); 
    let processedData = {};

    rows.forEach((row, index) => {
        if (row.length != 25) {
            // console.warn(`Row ${index + 1} is missing columns:`, row);
            return; 
        }

        const [
            well_id, s_no, state, district, block, village,latitude, longitude, year, ph, electrical_conductivity, CO3,
            HCO3, Cl, SO4, NO3, PO4, TH, Ca, Mg, Na, K, F, TDS, SiO2
        ] = row;
        
        // Check latitude and longitude values
        const latValue = parseFloat(latitude);
        const lonValue = parseFloat(longitude);
        if ((latValue && latValue > 200) || (lonValue && lonValue > 200)) {
            // Skip the whole row
            return;
        }


        let entry = {
            well_id: well_id ? String(well_id) : '',
            s_no: s_no ? String(s_no) : '',
            state: state ? String(state) : '',
            district: district ? String(district) : '',
            block: block ? String(block) : '',
            village: village ? String(village) : '',
            latitude: latitude ? String(latitude) : '',
            longitude: longitude ? String(longitude) : '',
            year: year ? String(year) : '',
            ph: ph ? String(ph) : undefined,
            electrical_conductivity: electrical_conductivity ? String(electrical_conductivity) : undefined,
            CO3: CO3 ? String(CO3) : undefined,
            HCO3: HCO3 ? String(HCO3) : undefined,
            Cl: Cl ? String(Cl) : undefined,
            SO4: SO4 ? String(SO4) : undefined,
            NO3: NO3 ? String(NO3) : undefined,
            PO4: PO4 ? String(PO4) : undefined,
            TH: TH ? String(TH) : undefined,
            Ca: Ca ? String(Ca) : undefined,
            Mg: Mg ? String(Mg) : undefined,
            Na: Na ? String(Na) : undefined,
            K: K ? String(K) : undefined,
            F: F ? String(F) : undefined,
            TDS: TDS ? String(TDS) : undefined,
            SiO2: SiO2 ? String(SiO2) : undefined,
        };

        // // Remove undefined values
        // for (let key in entry) {
        //     if (entry[key] === undefined) {
        //         delete entry[key];
        //     }
        // }

        // Remove undefined values and check for values starting with '<'
        for (let key in entry) {
            if (entry[key] === undefined || entry[key].startsWith('<')) {
                delete entry[key];
            }
        }

        // Skip entries that are empty after removing undefined values
        if (Object.keys(entry).length === 0) {
            return;
        }

        // Skip entries that are empty after removing undefined values
        if (Object.keys(entry).length === 0) {
            return;
        }
        console.log('hi');

        processedData[index] = entry;
    });
    return processedData;
}

async function handleAddExcelAnalyse(req, res) {
    let err = [];
    let obj = req.body;

    for (var key in obj) {
        if (Object.keys(obj[key]).length <= 6) {
            err.push({ msg: 'Number of parameters should be more than 3' });
        }
    }

    if (err.length > 0) {
        return res.render('input', { err });
    }

    obj = processAddData(obj);
    const formattedData = formatDataForDatabaseAddExcel(obj);

    try {
        // console.log(formattedData);
        // Check if the table exists and create it if it doesn't
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS water_quality_data_2019 (
                well_id VARCHAR(50) NOT NULL,
                s_no INT NOT NULL,
                state VARCHAR(100),
                district VARCHAR(100),
                block VARCHAR(100),
                village VARCHAR(100),
                latitude DECIMAL(15, 7),
                longitude DECIMAL(15, 7),
                year INT,
                ph DECIMAL(12, 6),
                electrical_conductivity DECIMAL(12, 6),
                CO3 DECIMAL(12, 6),
                HCO3 DECIMAL(12, 6),
                Cl DECIMAL(12, 6),
                SO4 DECIMAL(12, 6),
                NO3 DECIMAL(12, 6),
                PO4 DECIMAL(12, 6),
                TH DECIMAL(12, 6),
                Ca DECIMAL(12, 6),
                Mg DECIMAL(12, 6),
                Na DECIMAL(12, 6),
                K DECIMAL(12, 6),
                F DECIMAL(12, 6),
                TDS DECIMAL(12, 6),
                SiO2 DECIMAL(12, 6),
                water_quality_index DECIMAL(12,6)
            );
        `;

        // Execute the query to create the table
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                console.error('Error creating table:', err.message);
                return res.render('error', { error: 'Failed to create the table.' });
            }

            // Insert data after the table is created
            const query = `INSERT INTO water_quality_data_2019 SET ?`;

            formattedData.forEach((data, index) => {
                connection.query(query, data, (error, results) => {
                    if (error) {
                        console.error(`Error inserting data at index ${index}:`, error.message);
                        // return res.render('error', { error: `Failed to insert data at index ${index} into MySQL.` });
                        return res.status(500).json({ message: `Failed to insert data at index ${index} into MySQL.` });
                    }
                });
            });

            // res.render(view, { data: JSON.stringify(obj), userdata: JSON.stringify(userdata) });
            res.status(200).json({ message: 'Data saved successfully.' });
        });
    }catch (error) {
        // res.render('error', { error: 'Failed to process and insert data into MySQL.' });
        res.status(500).json({ message: 'Failed to process and insert data into MySQL.' });
    }
}

app.post('/add_excel', upload.single('file'), async (req, res) => {
    const excelBuffer = req.file.buffer;
    console.log("request reached");

    try {
        const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        const data = await processAddExcelData(sheet);
        // console.log('Processed Data:', data); // Debugging log

        req.body = data;
        return await handleAddExcelAnalyse(req, res);

        // console.log(data);
    } catch (error) {
        console.error('Failed to process the Excel file:', error);
        res.status(500).send('Server error processing the Excel file.');
    }
});