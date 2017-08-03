Send Request
1. jquery sending GET request:
https://stackoverflow.com/questions/1478295/what-does-async-false-do-in-jquery-ajax
Does it have something to do with preventing other events on the page from firing?
Yes.

Setting async to false in $.ajax means that the statement you are calling has to complete before the next statement in your function can be called. 
If you set async: true then that statement will begin it's execution and the next statement will be called regardless of whether the async statement has completed yet.
by default it's set to true

$.getJSON( "test.js", { name: "John", time: "2pm" } ) //will be query params in URL
  .done(function( json ) {
    console.log( "JSON Data: " + json.users[ 3 ].name ); //successful requst
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});

  
$.get('/dreams', function(dreams) { //if the server sends json string (array is also json), will convert it to object; if the server just sends string, will show string, a string.forEach will be undefined
  dreams.forEach(function(dream) {
    $('<li></li>').text(dream).appendTo('ul#dreams'); //useful appendTo
  });
});

// $.getJSON('/dreams', function(dreams) { //if the server sends json string (array is also json), will convert it to object; if the server just sends string, will not even be entered
//   dreams.forEach(function(dream) {
//     $('<li></li>').text(dream).appendTo('ul#dreams'); //useful appendTo
//   });
// });

 $.ajax(
 {url:"/dreams",
 success: function(result){ //if the server sends json string (array is also json), will convert it to object; if the server just sends string, will show string,
    console.log(result);
 }});

  
  
////$('#listButton').on("click", function(){
// $.getJSON( "/notes", function( json ) {
//   console.log( "JSON Data: " + json); //successful request
// }).fail(function(){
//   console.log("request failed");
// });

//exactly the same as above, only catching the failed scenario 
//(success function can be both in callback for getJSON or as called in the promise like done method for jquery deferred object, 
//jquery ajax related function returns a jxhr object)

// $.getJSON("/notes")
// .done(function(data) {
//   //console.log(data); //successful request for status 200. In express, calling response.send() without specify status automatically return 200
//   $("#notesShowRoom").empty();
//   data.allNotes.forEach((note) => {
//       $("#notesShowRoom").append(
//         "<div class='col-xs-4'>\
//             <div class='panel panel-primary'>\
//               <div class='panel-heading'>" + note.title + "</div>\
//               <div class='panel-body' style='word-break:break-all;height: 100px;overflow-y: scroll;'>" + note.body + "</div>\
//             </div>\
//         </div>"
//       );
//   });
// })
// .fail(function(){
//   console.log("request failed");  //for status not 200, like 404, 400, 500
// });
    
2. JQuery sending POST request
$('form').submit(function(event) { //or $('form').on("submit", function(event) //notice this form doesn't have to have name attribute 
  event.preventDefault(); //same effect as hijacking the form, not submitting the form which is form's default behavior
  var dream = $('input').val();
  $.post('/dreams?' + $.param({dream: dream}), {dream: dream}, function(data) {  //$.param({dream: dream}) will add query string to the url  // {dream: dream} will send form data // in this case, both query string and request body form data will have dream: asd
    $('<li></li>').text(dream).appendTo('ul#dreams');  //suppose I capture the retun in function parameter,  //if the return "data" is json string (array is also json), will convert it to object //if just plain text, then render text
    $('input').val('');
    $('input').focus(); //useful to set focus back
    console.log(typeof data); //if the return "data" is json string (array is also json), will convert it to object //if just plain string, then render string
    console.log(data.message); //if data is of string type, then this will be undefined
  });
});

$('#btn').click(function() { //notice for serialize to work, the form has to have name attribute for each field
  var form = $("#aForm").serialize();
  console.log(form); //dream=asd&year=22
  console.log(typeof form);  //string
   $.post('/dreams', form, function(data) { 
     console.log(data);   //will see data sent as form data, pretty much the same as above
   });
});
  
  
// $.post( "/notes", {title: $('#noteTitle').val(), body: $('#noteBody').val()}, function(data) { // the data object will be sent as in form data, on server side(expressJS), you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
  //    console.log("successfully added: ", data.note.title);
  // }).fail(function(){
  //   console.log("failed");
  // });
  //by default, jquery doesn't have a postJSON method to send json request body
  //you have to use 
  // $.ajax({
  //     type: 'POST',
  //     url: '/form/',
  //     data: '{"name":"jonas"}', // or JSON.stringify ({name: 'jonas'}),
  //     success: function(data) { alert('data: ' + data); },
  //     error: function() {},
  //     contentType: "application/json",  //for request header
  //     dataType: 'json' //for response header
  // });

  //or someone posted the jquery extension method .postJSON you can use
  //http://rohanradio.com/blog/2011/02/22/posting-json-with-jquery/
  // $.extend({
  //   postJSON: function(url, data, callback, callback2) {
  //     return jQuery.ajax({
  //       type: "POST",
  //       url: url,
  //       data: JSON.stringify(data),
  //       success: callback,
  //       error: callback2,
  //       dataType: "json",
  //       contentType: "application/json",
  //       processData: false
  //     });
  //   }
  // });


  // $.ajax({
  //     type: 'POST',
  //     url: '/notes',
  //     data: JSON.stringify({title: $('#noteTitle').val(), body: $('#noteBody').val()}), //has to be the stringified version
  //     success: function(data) {console.log("successfully added: ", data.note.title);},
  //     error: function(err) {console.log("failed", err);},  //can err.responseText is a string: "{"message":"Note title taken"}"
  //     contentType: "application/json" //without this, still will be sent as in form data. even if you have data: JSON.stringify
  //     the form data will be {"title":"FF","body":"FFFF"}:nil
  //     ruby is able to parse it still, but not node.js
  //     for node.js, either 1)pass data object and without contentType: "application/json"
  //     Then on express server side, you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
  //     or 2) pass stringified data object and with contentType: "application/json" and with only app.use(bodyParser.json()); but this might cause CORS issue
  // });

  //exactly same as before
  $.ajax({
      type: 'POST',
      url: '/notes',
      data: JSON.stringify({title: noteTitle, body: noteBody}),
      contentType: "application/json" //without this, still will be sent as in form data. Then on express server side, you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
                                      //the form data will be {"title":"FF","body":"FFFF"}:nil
      //ruby is able to parse it still, but not node.js
      //for node.js, either 1)pass data object and without contentType: "application/json"
      //Then on express server side, you need app.use(bodyParser.urlencoded({extended: true})); //to allow image or video, false will only take string
      //or 2) pass stringified data object and with contentType: "application/json" and with only app.use(bodyParser.json()); but this might cause CORS issue

  }).fail(function(err){
    console.log("failed adding the note", err); //err.responseText is a string: "{"message":"Note title taken"}"
  }).done(function(data){
    console.log("successfully added: ", data.note.title);
    listNodes();
  });
});

3. JQuery sending delete request:
$('#deleteAllButton').on("click", function(){
  $.ajax({
      type: 'DELETE',
      url: '/notes'
  }).fail(function(){
    console.log("failed deleting all"); 
  }).done(function(data){
    console.log(data.message);
    listNodes();
  });
});


 //http://stackoverflow.com/questions/21292761/jquery-click-an-element-inside-its-clickable-container-how-to-override
  //here we need to do this because remove the note click is inside show the note click
  //$('.seq').click(function(ev) {
  // ev.stopPropagation();
  //});
  $(document).on("click", ".removeIcon", function(event){  //dynamicly generated elements need this rebinding way
    event.stopPropagation();
    var title = $(this).parent().text();
    $.ajax({
        type: 'DELETE',
        url: '/notes?noteTitle=' + title //will automatically convert space to %20
      //in url,https://file-based-notes-node.glitch.me/notes?noteTitle=?%20a%20? is possible, no need to replace ?
    //request.query.noteTitle will still decode the URL encoding
    //notice here you can only append ?noteTitle=title directly after url
    //POST and DELETE will send data object as form data by default, In order to append query string, you have to do it in URL directly
    //only GET will send data object as query string in URL 
    }).done(function(data){
      console.log(data.message);
      listNodes();
    });
  });
  
  $(document).on("click", ".panel", function(){  //dynamicly generated elements need this rebinding way
    var noteTitle = $(this).find(">:first-child").text();
    noteTitle = replaceQuestionMark(noteTitle);//if the string has spaces, no problem, will automatically replace with %20
    $.getJSON("/notes/" + noteTitle, function(data){ //will not automatically replace ?, that's why we need to do manually as above
      //server side. request.params will automatically decode the URL encoding 
      //suppose the database data has ending space, here the .text() will not return ending space, hence will show cannot find this note, 
      //using trim() in above before saving to db solved ths problem 
      //ACTUALLY there is no need to use trim() in application.js for the button click action (keyup action still need it) because I used trim() on the model layer. using trim() only for the file-based app 
      //Actually the above statement is wrong, although model layer trim() will make sure the database data wil be always trim, but without application.js trim(), user can type spaces and still pass the validation
      //we don't want that, so we still use trim() in application.js
      //no need to do that in angular client. ng-model will trim automatically for you
      showAlertBox(data.note.title, data.note.body);
    }).fail(function(){
      console.log("failed getting the note");
    });
  });
});
  
4.Angular sending HTTP GET Request
// $http.get('/notes').success(function(data){
//   panelList.panels = data.allNotes;
// });  
// same functionaly as above, only the return data object is one more layer than the above, so you need to do data.data in .then and only data in .succcess
$http.get('/notes').then(function(data){
  panelList.panels = data.data.allNotes;
});  
//another way
$http({method: "GET", url: "/notes/" + replaceQuestionMark(noteTitle)})  //to fix title has ? issue in /notes/:noteTItle, as in jquery
.success(function(data) {
  showAlertBox(data.note.title, data.note.body);
});

5 Angular sending HTTP POST Request
//$http.post('/notes', {title: this.note.title, body: this.note.body}) 
//or
$http.post('/notes', this.note) 
.success(function(data) { //in success condition, add it in memory too, no need to call get just to refresh the list
 //console.log(data);  reuturn {message: "asdasd", note: {note obj}}

6. Angular sending HTTP DELETE Request
$http({method: "DELETE", url: "/notes?noteTitle=" + noteTitle}) // ? is alowed here in query string
          .success(function(data) {  //in success condition, delete it from memory too, no need to call get just to refresh the list