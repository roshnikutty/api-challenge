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
let getNewsDetails = () => {
    let top_ten_newsIds = [];
    let storiesArray = [];
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
    setTimeout(function () {
        state.storiesArray = storiesArray;
    }, 1000);
}
getNewsDetails();


//Sort output by story score
let sort = () => {
    sortedArray = state.storiesArray;
    sortedArray.sort(function (a, b) {
        return b.score - a.score;
    });
    setTimeout(function () {
        state.sortedArray = sortedArray;
    }, 1000);
    return sortedArray;
}
                                
setTimeout(function () {
    console.log(sort());
}, 1000);

//-------------------  Page display  -------------------------
 /*
let displayData = () => {
    randomTopNewsIDGenerator();
    getNewsDetails();
    sort();
    var resultElement = "";
    if (state.sortedArray.length) {
        state.sortedArray.forEach(function (item) {
            resultElement = resultElement +
                `<p>Story Title: ${item.title} </p>
                <p>Story URL: ${item.story_url}</p>
                <p>Story timestamp to Date: ${item.story_time}</p>       
                <p>Story score: ${item.score}</p>
                <p>Author id: ${item.author}</p>
                <p>Author karma score: ${item.karma}</p>`;
        });
    }
    else {
        return "No results were found.";
    }
    $(".js-results").html(resultElement);
}


$(function(){
  displayData();
});

*/
