$(function(){
  $.getJSON('http://gist.github.com/api/v1/json/gists/formigarafa', function(data){
    alert(data.gists[0].repo);
  })
}
)