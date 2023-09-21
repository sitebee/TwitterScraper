const puppeteer = require('puppeteer');
const fs = require('fs');

function cleanText(text) {
    return text.replace(/[^\w\s@#.,!?]/g, '');
}

function getFormattedDate() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`;
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.3');

    const profiles = [
// ... Start profiles and tweets URLs here
'https://nitter.net/search?f=tweets&q=%40walmart',
'https://nitter.net/search?f=tweets&q=%40wellsfargo',
        // ... Add other URLs here
    ];

    let allTweets = [];
    for (const url of profiles) {
        const response = await page.goto(url);
        const statusCode = response.status();
        console.log(`HTTP Status Code for ${url}: ${statusCode}`);

        if (statusCode !== 200) {
            console.error(`Failed to access ${url}. Skipping...`);
            await new Promise(resolve => setTimeout(resolve, 25000)); // Wait for 25 seconds before the next profile
            continue;
        }

        const tweets = await page.$$eval('.timeline-item', nodes => {
            return nodes.map(node => {
                let content = (node.querySelector('.tweet-content')?.innerText || '').replace(/\n/g, ' ').replace(/,/g, ';');
                const time = node.querySelector('.tweet-date a')?.innerText || '';
                const link = node.querySelector('.tweet-link')?.href || '';
                return { content, time, link };
            });
        });

        // Clean the tweets content after retrieving them
        for (let tweet of tweets) {
            tweet.content = cleanText(tweet.content);
        }

        allTweets = allTweets.concat(tweets.map(tweet => ({ url, ...tweet })));

        console.log(`Scraped ${tweets.length} tweets from ${url}`);
        await new Promise(resolve => setTimeout(resolve, 25000)); // Wait for 25 seconds before the next profile
    }

    await browser.close();

    allTweets.forEach(tweet => {
        console.log(`Scraping tweet from ${tweet.url}: ${tweet.content.substring(0, 50)}...`);
    });

    const csvContent = allTweets.map(tweet => `${tweet.url},${tweet.content},${tweet.time},${tweet.link}`).join('\n');
    const outputFilename = `tweets_${getFormattedDate()}.csv`;
    fs.writeFileSync(outputFilename, `URL,Content,Time,Link\n${csvContent}`);

    console.log(`Scraped a total of ${allTweets.length} tweets.`);
    console.log(`Tweets saved to ${outputFilename}`);
})();
