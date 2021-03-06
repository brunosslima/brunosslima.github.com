$(function(){
  username = "brunosslima";
  gists_url = "https://api.github.com/users/"+username+"/gists";
  $.getJSON(gists_url + "?callback=?", function(response, status_text){
    $.each(response.data, function(index, gist) {
      var element = $('<div/>');
      element.attr('class', 'gist-post');
      element.attr('data-repo', gist.id);
      element.append($('<h1/>').html(gist.description));
      element.append($('<span/>').attr('style', 'display: block').html(gist.created_at));
      element.append($('<span/>').html('Comentários: '+gist.comments));
      
      var files_div = $('<div/>').attr('class', 'files');
  
      $.each(gist.files, function(file_index, file_data) {
        var file_div = $('<div/>');
        file_div.attr('data-filename', file_data.filename);
        file_div.attr('class', 'file');
        var file_link = $('<a/>').attr('href', gist.html_url + '#file_' + encodeURIComponent(file_data.filename)).html(file_data.filename);
        file_div.append(file_link);
        schedule_gist_script(gist.id, file_data.filename);
        files_div.append(file_div);
      });
      
      element.append(files_div);
      $('.gists').append(element);
    });
    activate_write_grabber();
  });
});

schedule_gist_script = function (repo, file) {
  var script   = document.createElement("script");
  script.type  = "text/javascript";
  script.src   = "https://gist.github.com/"+repo+".js?file="+encodeURIComponent(file);
  document.body.appendChild(script);
};

activate_write_grabber = function() {
  document.write = function(script_text) {
    var content = $(script_text);
    if(content.find('div').length > 0) {
      insert_gist(content);
    }
  };
};

insert_gist = function(gist) {
  var repo_link = gist.find('a:contains(This Gist)');
  var repo = repo_link.attr('href').replace("https://gist.github.com/", "");
  var file_link = gist.find('a[href^="https://gist.github.com/'+repo+'#"]');
  var file_name = file_link.text();
  
  if(file_name.match(/\.md$/)) {
    contents = extract_html_from(gist);
  }
  else {
    contents = gist;
  }
  
  $("div[data-repo="+repo+"] .files div[data-filename='"+file_name+"']").append(contents);
};

extract_html_from = function(gist) {
  var lines = gist.find(".line");
  var gist_text_string = "";
  $.each(lines, function(index, line){
    gist_text_string += $(line).text() + "\n";
  });

  var converter = new Showdown.converter();
  marked_down = converter.makeHtml(gist_text_string);

  var marked_div = $('<div/>');
  marked_div.attr('class', 'wikistyle');
  marked_div.append(marked_down);
  return marked_div;
};
