

var templateSource = document.getElementById('results-template').innerHTML
    template = Handlebars.compile(templateSource),
    albumImagePlaceholder = $('#albumImagePlaceholder'),
    albumTitlePlaceholder = $('#albumTitlePlaceholder'),
    playingTrack = null, 
    musicMatchkey = '353dfc8f058bb33ca0e6eb62e168e74c'

var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            callback(response);
        }
    });
};

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'track',
            limit: 2
        },
        success: function (response) {
            resetDom()
            addTrack(response.tracks.items[0])
        }
    });
};

var resetDom = function(){
    albumImagePlaceholder.empty()
    albumTitlePlaceholder.empty()
    if(playingTrack){
        playingTrack.pause()
    }
}

var addTrack = function(track){
    var url = track.album.images[0].url;
    var title = track.name
    albumTitlePlaceholder.append(title)
    albumImagePlaceholder.append('<img src="' + url + '"/>')

    playingTrack = new Audio(track.preview_url);
    playingTrack.play();

    rapgeniusClient.searchSong(title, "rap", rapGeniusCallback);
}

var rapGeniusCallback = function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      rapgeniusClient.searchLyricsAndExplanations(songs[0].link, "rap", lyricsSearchCb);
    }
  }
};

var lyricsSearchCb = function(err, lyricsAndExplanations){
    if(err){
      console.log("Error: " + err);
    }else{
      var lyrics = lyricsAndExplanations.lyrics;
      var explanations = lyricsAndExplanations.explanations;

      //Now we can embed the explanations within the verses
      lyrics.addExplanations(explanations);
      var firstVerses = lyrics.sections[0].verses[0];
      _.each(lyrics, function(lyric){
        _.each(sections, function(section){
            var content = section.content;
            var explanation = section.explanation;
            contentPlaceholder.append(content);
            explanationPlaceholder.append(explanation);
        })

      })
      console.log("\nVerses:\n %s \n\n *** This means ***\n%s", firstVerses.content, firstVerses.explanation);
    }
};




document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
}, false);