// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML
    template = Handlebars.compile(templateSource),
    albumImagePlaceholder = $('#albumImagePlaceholder'),
    albumTitlePlaceholder = $('#albumTitlePlaceholder'),
    playingTrack = null;

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
}

var addAlbums = function(albums){
    _.each(albums, function(album){
        var url = album.images[0].url
        resultsPlaceholder.append('<img src="' + url + '"/>')
    });
};

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
}, false);