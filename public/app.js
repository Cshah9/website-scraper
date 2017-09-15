
$.getJSON("/articles", function(data) {
  console.log("$.getJSON /articles START...");
  for (var i = 0; i < data.length; i++) {
    // $("#articles").append("<p data-id='" + data[i]._id + "'> <h3>"+(i+1)+"</h3>" + data[i].title + "<br />" + data[i].link + "</p>");
    //'<p data-id="' + data[i]._id + '">' + 
    $("tbody").append(' <tr><th scope="row">' + (i+1) + '</th><td><a href="' + data[i].link + '">' + 
      data[i].title + '</a></td><td><button data-id="' + data[i]._id+ '" ' + 'id="' + i + '" class="add">add</button></td>' +
      '<td> <input type="text" id="title'+i+'"/></td>' +
      '<td> <input type="text" id="note'+i+'"/></td>' +
      '<td>  <input type="text" id="user'+i+'"/></td></tr>' );
    //
    // console.log(i, "tbody");
    //  $("tbody").append('<tr><th>' + data[i]._id + '</th></tr>' );
    if (data[i].note) {
      // $(titleId).val(data.note.title);
      // $(noteId).val(data.note.body);
      console.log(data[i].note);
      document.getElementById("title"+i).value = data[i].note.title; 
      document.getElementById("note"+i).value = data[i].note.body; 
      document.getElementById("user"+i).value = data[i].note.user; 
    }
  }
  console.log("$.getJSON /articles ...END");
});

$(document).on("click", "button", function() {
  console.log("button on click START...");
  console.log("article button "+ $(this).attr("id") );
  // alert("article button "+ $(this).attr("id") );

  var thisId = $(this).attr("data-id");
  // var buttonId = $(this).attr("id");;
  // var titleId = $(this).attr("title"+buttonId);
  // var noteId = $(this).attr("note"+buttonId);
  // var userId = $(this).attr("user"+buttonId);

  var buttonId = $(this).attr("id");;
  var titleId = "title"+buttonId;
  var noteId = "note"+buttonId;
  var userId = "user"+buttonId;
  console.log("thisId", thisId, "buttonId", buttonId,"titleId",titleId, "noteId",noteId , "userId", userId)


  var titleVal = document.getElementById("title"+buttonId).value;
  var noteVal = document.getElementById("note"+buttonId).value;
  var userVal = document.getElementById("user"+buttonId).value;
  console.log("titleVal", titleVal, "noteVal", noteVal, "userVal", userVal);
  console.log("POST button");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // title: $(this).attr("title"+buttonId).val(),
      // body: $(this).attr("note"+buttonId).val()

      
      title: titleVal,
      body: noteVal,
      user: userVal

    }
  })
  .done(function(data) {
    console.log(data);
  });
 
  
});

