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
    $.getJSON(TOP_NEWS_URL).done((data) => {
        for (let i = 0; i < state.randomTopNewsIndex.length; i++) {
            top_ten_newsIds.push(data[i]);
            $.getJSON(STORY_URL + top_ten_newsIds[i] + ".json")
                .done((story) => {
                    storiesArray.push({
                        title: story.title,
                        author: story.by,
                        score: story.score,
                        story_url: story.url,
                        story_time: story.time,
                    })
                    $.getJSON(AUTHOR_URL + story.by + ".json")
                        .done((author) => {
                            for (let i = 0; i < storiesArray.length; i++) {
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
console.log(state);
getNewsDetails();