const puppeteer = require('puppeteer');
const csvWriter = require('csv-writer').createObjectCsvWriter;

async function scrapeLinkedIn(companyName) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to LinkedIn
        await page.goto('https://www.linkedin.com', { waitUntil: 'networkidle2' });

        // Log in to LinkedIn - Change these credentials
        // Your LinkedIn password
        await page.goto('https://www.linkedin.com', { waitUntil: 'networkidle2' });

        // Log in to LinkedIn - Change these credentials
        await page.type('#session_key', ''); // Your LinkedIn email
        await page.type('#session_password', ''); // Your LinkedIn password
        const signInButton = await page.waitForSelector('.sign-in-form__submit-btn--full-width');
        await signInButton.click();
        // Wait for login and redirect
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Search for the company
        await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${companyName}`, { waitUntil: 'networkidle2' });
        // Click on the first company
        await page.waitForSelector('.reusable-search__result-container');
        await page.click('.reusable-search__result-container');

        // Extract company name, industry, and location
        const companyDetails = await page.evaluate(() => {
            const name = document.querySelector('.org-top-card-module__name').innerText.trim();
            name = name ? name.innerText : null;
            const industry = document.querySelector('.org-top-card-module__dot-separated-list').innerText.trim();
            industry = industry ? industry.innerText : null;
            const location = document.querySelector('.org-top-card-module__location').innerText.trim();
            location = location ? location.innerText : null;
            return { name, industry, location };
        });

        // Extract number of followers
        const followers = await page.evaluate(() => {
            const followersText = document.querySelector('.org-top-card-module__followers-count').innerText.trim();
            const followersCount = followersText.match(/\d+/)[0];
            return followersCount;
        });

        // Extract number of connections working here
        const connectionsWorkingHere = await page.evaluate(() => {
            const connectionsText = document.querySelector('.org-top-card-module__connections-count').innerText.trim();
            const connectionsCount = connectionsText.match(/\d+/)[0];
            return connectionsCount;
        });

        return {...companyDetails, followers, connectionsWorkingHere };
    } catch (error) {
        console.error(`Error while scraping LinkedIn for ${companyName}:`, error);
        return { error: `Error while scraping LinkedIn for ${companyName}` };
    } finally {
        await browser.close();
    }
}

async function main() {
    const companies = [
        "ADPRO SOFTECH PVT LTD",
        "ADRENALIN ESYSTEMS LIMITED",
        "ADV DETAILING AND DESIGN APPLICATIONS INDIA PRIVATE LIMITED",
        "ADVA OPTICAL NETWORKING INDIA PRIVATE LIMITED",
        "ADVAITA INDIA CONSULTING PRIVATE LIMITED",
        "ADVAIYA SOLUTIONS (P) LTD.",
        "ADVANCED BUSINESS & HEALTHCARE SOLUTIONS INDIA PRIVATE LIMITED",
        "ADVANCED INVESTMENT MECHANICS INDIA PRIVATE LIMITED",
        "ADVANTEST INDIA PRIVATE LIMITED",
        "ADVANTMED INDIA LLP",
        "ADVANZ PHARMA SERVICES (INDIA) PRIVATE LIMITED",
        "ADVARRA INDIA PRIVATE LIMITED",
        "ADVISOR360 SOFTWARE PRIVATE LIMITED",
        "AECO TECHNOSTRUCT PRIVATE LIMITED",
        "AECOM INDIA GLOBAL SERVICES PRIVATE LIMITED",
        "AECOR DIGITAL INTERNATIONAL PRIVATE LIMITED",
        "AEGIS CUSTOMER SUPPORT SERVICES PVT LTD",
        "AEL DATASERVICES LLP",
        "AEON COMMUNICATION PRIVATE LIMITED",
        "AEREN IP SERVICES PVT. LTD.",
        "AEREN IT SOLUTIONS PVT. LTD.",
        "AEREON INDIA PRIVATE LIMITED.",
        "AEROSPIKE INDIA PRIVATE LIMITED",
        "AEXONIC TECHNOLOGIES PRIVATE LIMITED",
        "AFFINITY ANSWERS PRIVATE LIMITED",
        "AFFINITY GLOBAL ADVERTISING PVT. LTD.",
        "AFOUR TECHNOLOGIES PVT. LTD.",
        "AGASTHA SOFTWARE PVT. LTD.",
        "AGATHSYA TECHNOLOGIES PRIVATE LIMITED",
        "AGCO TRADING (INDIA) PRIVATE LIMITED",
        "AGGRANDIZE VENTURE PRIVATE LIMITED",
        "AGILE ICO PVT LTD",
        "AGILE LINK TECHNOLOGIES",
        "AGILENT TECHNOLOGIES INTERNATIONAL PVT.LTD.",
        "AGILIANCE INDIA PVT LTD",
        "AGILITY E SERVICES PRIVATE LIMITED",
        "AGILON HEALTH INDIA PRIVATE LIMITED",
        "AGNEXT TECHNOLOGIES PRIVATE LTD",
        "AGNISYS TECHNOLOGY (P) LTD.",
        "AGNITIO SYSTEMS",
        "AGNITY COMMUNICATIONS PVT. LTD.",
        "AGNITY INDIA TECHNOLOGIES PVT LTD",
        "AGNITY TECHNOLOGIES PRIVATE LIMITED",
        "AGREETA SOLUTIONS PRIVATE LIMITED",
        "AGS HEALTH PVT. LTD",
        "AGT ELECTRONICS LTD",
        "AGTECHPRO PRIVATE LIMITED",
        "AHANA RAY TECHNOLOGIES INDIA PRIVATE LIMITED",
        "AI COGITO INDIA PRIVATE LIMITED",
        "AI SQUARE GLOBAL SOLUTIONS LLP",
        "AIDASTECH INDIA PRIVATE LIMITED",
        "AIE FIBER RESOURCE AND TRADING (INDIA) PRIVATE LIMITED",
        "AIGENEDGE PRIVATE LIMITED",
        "AIGILX HEALTH TECHNOLOGIES PVT LTD",
        "AIMBEYOND INFOTECH PRIVATE LIMITED",
        "AIML SQUARE PRIVATE LIMITED",
        "AIMTRONICS SEMICONDUCTOR INDIA PVT LTD",
        "AINS INDIA PVT LTD",
        "AINSURTECH PVT LTD",
        "AIOPSGROUP COMMERCE INDIA PRIVATE LIMITED",
        "AIRAMATRIX PRIVATE LIMITED",
        "AIRAVANA SYSTEMS PRIVATE LIMITED",
        "AIRBUS GROUP INDIA PVT. LTD.",
        "AIRCHECK INDIA PVT. LTD.",
        "AIRDATA TECHNOLOGIES PRIVATE LIMITED",
        "AIREI INDIA PRIVATE LTD",
        "AIRMEET NETWORKS PRIVATE LIMITED",
        "AIRO DIGITAL LABS INDIA PRIVATE LIMITED",
        "AIRO GLOBAL SOFTWARE PRIVATE LIMITED",
        "AIROHA TECHNOLOGY INDIA PRIVATE LIMITED",
        "AIRTEL INTERNATIONAL LLP",
        "AITHENT TECHNOLOGIES PVT. LTD.",
        "AJIRA AI SOFTWARE INDIA PVT LTD",
        "AJOSYS TECHNOLOGY SOLUTIONS PVT LTD",
        "AJRITH TECH PRIVATE LIMITED",
        "AJS SOFTWARE TECHNOLOGIES PRIVATE LIMITED",
        "AJUBA COMMERCE PVT. LTD.",
        "AK AEROTEK SOFTWARE CENTRE PVT. LTD.",
        "AK SURYA POWER MAGIC PVT LTD",
        "AKEO SOFTWARE SOLUTIONS PRIVATE LIMITED",
        "AKIKO SHERMAN INFOTECH PRIVATE LIMITED",
        "AKOTS INDIA PVT. LTD.",
        "AKRIDATA INDIA PRIVATE LIMITED",
        "AKSA LEGACIES PRIVATE LIMITED",
        "AKSHAY RAJENDRA SHANBHAG",
        "AKSHAY VANIJYA & FINANCE LTD",
        "ALAMY IMAGES INDIA (P) LTD",
        "ALAN SOLUTIONS",
        "ALATION INDIA PRIVATE LIMITED",
        "ALCAX SOLUTIONS",
        "ALCODEX TECHNOLOGIES PVT. LTD.",
        "ALE INDIA PVT LTD.",
        "ALEKHA IT PRIVATE LIMITED",
        "ALEPT CONSULTING PRIVATE LIMITED",
        "ALERTOPS INDIA PRIVATE LIMITED",
        "ALETHEA COMMUNICATIONS TECHNOLOGIES PVT LTD",
        "ALFA KPO PVT. LTD.",
        "ALFANAR ENGINEERING SERVICES INDIA PVT LTD",
        "ALGONICS SYSTEMS PRIVATE LIMITED",
        "ALGONOMY SOFTWARE PRIVATE LIMITED",
        "ALGORHYTHM TECH PVT LTD"
    ];


    const data = [];

    for (const company of companies) {
        console.log(`Scraping ${company}`);
        const result = await scrapeLinkedIn(company);
        data.push(result);
    }

    // Write data to CSV
    const csvWriterInstance = csvWriter({
        path: 'company_data.csv',
        header: [
            { id: 'name', title: 'Company Name' },
            { id: 'industry', title: 'Industry' },
            { id: 'location', title: 'Location' },
            { id: 'followers', title: 'Followers' },
            { id: 'connectionsWorkingHere', title: 'Connections Working Here' }
        ]
    });

    await csvWriterInstance.writeRecords(data);
    console.log('CSV file created successfully.');
}

main();