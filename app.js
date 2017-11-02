let TOP_NEWS_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
let STORY_URL = "https://hacker-news.firebaseio.com/v0/item/";
let AUTHOR_URL = "https://hacker-news.firebaseio.com/v0/user/";
let sortedArray = [];

//Storing state of the program
let state = {
    randomTopNewsIndex: [],
    sortedStories: []
};

//Check for unique indices in the array
let checkAndGenerateApiIndex = () => {
    while (true) {
        let random = Math.floor((Math.random() * state.topNewsLength));
        let found = state.randomTopNewsIndex.find(function (indx) {
            return random === indx;
        });
        if (!found) {
            state.randomTopNewsIndex.push(random);       //Adds a randomly generated unique ID to pull from top news API
            return;
        }
    }
}

//Populating state.randomTopNewsIndex with random ids less than 500
let randomTopNewsIDGenerator = () => {
    for (let i = 0; i < 10; i++) {
        checkAndGenerateApiIndex();
    }
}



//API call to TOP_NEWS_URL, function returns 10 random top news ids
let getNewsDetails = () => {
    let top_ten_newsIds = [];
    let storiesArray = [];
    state.storiesArray = storiesArray;
    $.getJSON(TOP_NEWS_URL)                                                                         //API for top news
        .then((data) => {
            state.topNewsLength = data.length;                                              //get data array length of top news API
            randomTopNewsIDGenerator();                                                     //using data length from above to as upper limit in randomTopNewsIDGenerator()'s checkAndGenerateApiIndex()
            let number_of_news_remaining = state.randomTopNewsIndex.length;

            for (let i = 0; i < state.randomTopNewsIndex.length; i++) {
                top_ten_newsIds.push(data[i]);
                let timeStamp = new Date();

                $.getJSON(STORY_URL + top_ten_newsIds[i] + ".json")                                 //API for stories
                    .then((story) => {
                        storiesArray.push({
                            title: story.title,
                            author: story.by,
                            score: story.score,
                            story_url: story.url,
                            story_time: timeStamp.toDateString(story.time)                              //converting time to readable form
                        })

                        $.getJSON(AUTHOR_URL + story.by + ".json")                                  //API for author
                            .then((author) => {
                                if (author) {
                                    for (let i = 0; i < storiesArray.length; i++) {
                                        //'by' key of the Story API should be the same as 
                                        //the author's 'id' key from the Author API
                                        if (storiesArray[i].author === author.id) {
                                            storiesArray[i].karma = author.karma
                                        }
                                    }
                                    number_of_news_remaining -= 1;                      //finished processing a news item
                                    if (number_of_news_remaining === 0) {               //making sure that the promise is resolved before sorting
                                        console.log(sort());
                                    }
                                }
                            });
                    });
            }
        }
        )
}


getNewsDetails();


//Sort output by story score
let sort = () => {
    sortedArray = state.storiesArray;
    sortedArray.sort(function (a, b) {
        return b.score - a.score;
    });
    state.sortedArray = sortedArray;
    return sortedArray;
}

