let TOP_NEWS_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
let STORY_URL = "https://hacker-news.firebaseio.com/v0/item/";
let AUTHOR_URL = "https://hacker-news.firebaseio.com/v0/user/";
var top_ten_newsIds = [];
var storiesArray = [];
//Storing state of the program
let state = {
    randomTopNewsIndex: []
};

//Check for unique indices in the array
let checkAndGenerateApiIndex = () => {
    while (true) {
        let random = Math.floor((Math.random() * 500));
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

randomTopNewsIDGenerator();

//API call to TOP_NEWS_URL, function retrns 10 random top news ids
function getNewsDetails() {
    $.getJSON(TOP_NEWS_URL).done((data) => {                                                        //API for top news
        for (let i = 0; i < state.randomTopNewsIndex.length; i++) {
            top_ten_newsIds.push(data[i]);
            let timeStamp = new Date();
            $.getJSON(STORY_URL + top_ten_newsIds[i] + ".json")                                     //API for stories to get story details
                .done((story) => {
                    storiesArray.push({
                        title: story.title,
                        author: story.by,
                        score: story.score,
                        story_url: story.url,
                        story_time: timeStamp.toDateString(story.time)                              //converting time to readable form
                    })
                    $.getJSON(AUTHOR_URL + story.by + ".json")                                      //API for author details to get karma score
                        .done((author) => {
                            for (let i = 0; i < storiesArray.length; i++) {
                                //'by' key of the Story API should be the same as 
                                //the author's 'id' key from the Author API
                                if (storiesArray[i].author === author.id) {                         
                                    storiesArray[i].karma = author.karma
                                }
                            }
                        })
                });
        }
    })
    state.storiesArray = storiesArray;
}
getNewsDetails();                                                                      
console.log(state.storiesArray);                                                    //logs in the console all data from the three API and 10 random indices of top news
