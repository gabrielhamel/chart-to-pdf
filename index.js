const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');

// Execution
async function main() {
    // Launch the browser
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 400,
            height: 400
        }
    });

    // Select the first page
    const page = (await browser.pages())[0];

    // Get content of the template
    const rawTemplate = fs.readFileSync('template.hbs').toString();
    // Compile the template
    const template = Handlebars.compile(rawTemplate);

    // Render the template
    const html = template({
        example: '42'
    });

    // Open html in the page
    await page.setContent(html);

    // Random array of 10 numbers between 0 and 20
    const data = [...Array(10).keys()].map(i => Math.floor(Math.random() * 20));

    // Apply the chart
    await page.evaluate((data) => {
        new Chart(document.getElementById('chart-link').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: false
            }
        });
    }, data);

    // Convert into a pdf
    await page.pdf({
        path: 'result.pdf'
    });

    // Close the browser
    await browser.close();
};
main();
