#Twitter Scraper using Puppeteer and Nitter

This script provides an automated way to scrape tweets from specified Twitter profiles using the Puppeteer library and the Nitter platform (a free and open-source alternative Twitter front-end focused on privacy).
Features:

    Clean Data Extraction: The script fetches tweets in a sanitized format, ensuring that the extracted content is clean and free from any unwanted characters.
    Custom User-Agent: Sets a specific user-agent string for the browser session to mimic a specific browser version.
    Error Handling: If there's an error accessing a particular profile, the script skips it and proceeds with the next, ensuring uninterrupted execution.
    Timed Delays: After scraping each profile, the script waits for 25 seconds before moving to the next, reducing the risk of getting rate-limited.
    CSV Export: All extracted tweets are saved in a CSV format with a timestamped filename.

#Usage:

    Add the desired Twitter profile or search URLs to the profiles array in the script.
    Run the script.
    Once executed, the scraped tweets will be saved as a CSV file in the current directory.

#Columns in the Output CSV:

    URL: The Nitter URL from which the tweet was scraped.
    Content: The content of the scraped tweet.
    Time: Time when the tweet was posted.
    Link: Direct link to the tweet on Nitter.

#Prerequisites:

    Node.js
    Puppeteer library: npm install puppeteer
    An active internet connection

Note: Always ensure you have permission to scrape data from websites and respect the terms of service, robots.txt, and any other legal or ethical guidelines when using this or any other scraping tool.
