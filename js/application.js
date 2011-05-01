gist_list = []
register_gists = function (list) {
  gist_list = list.gists;
}

$(function() {
  $.each(gist_list, function(index, gist) {
    var element = $('<li/>');
    element.attr('data-repo', gist.repo);
    element.append($('<h2/>').html(gist.description));
    element.append($('<span/>').attr('style', 'display: block').html(gist.created_at));
    element.append($('<span/>').html('Comentários: '+gist.comments.length));
    
    var files = $('<div/>').attr('class', 'files');

    $.each(gist.files, function(file_index, filename) {
      var file = $('<div/>');
      file.attr('data-filename', filename);
      var file_link = $('<a/>').attr('href', 'https://gist.github.com/' + gist.repo + '#file_' + filename).html(filename);
      file.append(file_link);
      schedule_gist_script(gist.repo, filename);
      files.append(file);
    });
    
    element.append(files);
    $('.gists').append(element);
  });
  activate_write_grabber();
})

schedule_gist_script = function (repo, file) {
  var script   = document.createElement("script");
  script.type  = "text/javascript";
  script.src   = "https://gist.github.com/"+repo+".js?file="+encodeURIComponent(file);
  document.body.appendChild(script);
}

activate_write_grabber = function() {
  document.write = function(script_text) {
    var content = $(script_text);

    if(content.find('div').length > 0) {
      insert_gist(content);
    }
  } 
}

insert_gist = function(gist) {
  var repo_link = gist.find('a:contains(This Gist)');
  var repo = repo_link.attr('href').replace("https://gist.github.com/", "");
  var file_link = gist.find('a[href^="https://gist.github.com/'+repo+'#"]');
  var file_name = file_link.attr('href').replace('https://gist.github.com/'+repo+'#file_', "");
  
  if(file_name.match(/\.md$/)) {
    contents = extract_html_from(gist);
  }
  else {
    contents = gist;
  }
  
  $("li[data-repo="+repo+"] .files div[data-filename='"+file_name+"']").append(contents);
}

extract_html_from = function(gist) {
  var lines = gist.find(".line");
  var gist_text_string = "";
  $.each(lines, function(index, line){
    gist_text_string += $(line).text() + "\n";
  });

  var converter = new Showdown.converter();
  marked_down = converter.makeHtml(gist_text_string);

  var marked_div = $('<div/>');
  marked_div.attr('class', 'converted-markdown');
  marked_div.append(marked_down);
  return marked_div;
}
