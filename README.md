# Challenge hacker-news 
## using Topstories, Story info, Author info APIs
========================================
### Solution

To see a working Javascript solution:
 https://roshnikutty.github.io/api-challenge/


1. Function randomTopNewsIDGenerator() generates random indices to point to the array returned by Top stories API.  I am dynamically getting the value of data length from the GET request to Top News API. This is used to generate random and unique indices used to generate the random indices that reference top news API output. This function uses checkAndGenerateApiIndex() to check no duplicate random indices are generated.

2. getNewsDetails() sends out a series of asynchronous calls to the 3 APIs for the top stories with indices from step 1.
For each top 10 story id, an async getJSON call is sent to the story id to getdetails of the story. Each object has a unique 'by' key which is the same as the 'id' author key in the last getJSON to the Author information API. 

3. In each of these cases, I have stored the result in the master state object of arrays.