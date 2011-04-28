gist_list = []
register_gists = function (list) {
  gist_list = list.gists;
}

$(function() {
  $.each(gist_list, function(index, gist) {
    var element = $('<li/>');
    element.append($('<h2/>').html(gist.description));
    element.append($('<span/>').attr('style', 'display: block').html(gist.created_at));
    element.append($('<span/>').html('Comentários: '+gist.comments.length));
    
    var files = $('<div/>').attr('class', 'files');

    $.each(gist.files, function(file_index, file) {
      files.append($('<a/>').attr('href', 'https://gist.github.com/' + gist.repo + '#' + file).html(file))
    });
    
    element.append(files);
    $('.gists').append(element);
  });
})
