$(document).ready(function(){
  var cfg = {
    domain: 'http://ogg.elwinar.com:56789',
  };
  var state = {
  };
  if(localStorage.getItem("token")!=null){
    $("#connect_buttons").hide()
    $.ajax({
        type: "GET",
        headers: {"token": localStorage.getItem("token")},
        url: cfg.domain + "/game",
        success: function(data) {
          $(".page").hide();
          $("#gamelist").show();
          $('#table_header').children('tbody').children('tr').children('td').remove();
          for(var i=0;i<data.length;i++){
            $("#header_games").after("<tr><td>"+data[i].id+"</td><td name='gameName'>"+data[i].name+"</td><td>"+data[i].players+"</td><td>"+data[i].joined+"</td><td>"+data[i].created_at+"</td><td>"+data[i].started_at+"</td><td>"+data[i].finished_at+"</td><td><input class='btn btn-default' type='submit' id='"+data[i].id+"' value='Show' size='20' maxlength='60' /></td><td><button class='btn btn-default' type='button' name='"+data[i].id+"'>Join</button></td></tr>");
          }
        },
        error: function(data){
          $(".page").hide();
          $("#results").html("<div class='alert alert-danger'>Sorry something went wrong, please try again !<a href='The Resistance.html'>Refresh</a></div>");
          localStorage.removeItem("token");
          $("#results").show();
        },
        dataType: "json",
    });
  }else{
    $(".page:not(:first-of-type)").hide();
  }
  $(".return").on("click", function back(){
    $(".page").hide();
    $("#gamelist").show();
  });
  $("#create").on("click", function createGame(){
    state.name = $("#name").val();
    state.players = $("#players").val();
    $.ajax({
      type: "POST",
      headers: {"token": localStorage.getItem("token")},
      contentType:"application/json",
      data: JSON.stringify({
        'name': state.name,
        'players': parseInt(state.players),
      }),
      url: cfg.domain + "/game",
      success: function(data) {
        $(document).trigger("games", data);
      },
      error: function(data){
        $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
      },
      dataType: "json",
    });
  });
  $("#table_header").on("click","input", function(event){
    $.ajax({
      type: "GET",
      headers: {"token": localStorage.getItem("token")},
      url: cfg.domain + "/game/"+$(event.target).attr('name'),
      success: function(data) {
        $(".page").hide();
        $("#onGoingGame").show();
        $('#table_show').children('tbody').children('tr').children('td').remove();
        $("#game_info").after("<tr><td>"+data.id+"</td><td>"+data.name+"</td><td>"+data.players+"</td><td>"+data.joined+"</td><td>"+data.created_at+"</td><td>"+data.started_at+"</td><td>"+data.finished_at+"</td></tr>");
      },
      error: function(data){
        $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
      },
      dataType: "json",
    });
  });
  $("#table_header").on("click", "button", function(event){
    idGame = $(event.target).attr('name');
    $.ajax({
      type: "GET",
      headers: {"token": localStorage.getItem("token")},
      url: cfg.domain + "/game/"+$(event.target).attr('name'),
      success: function(data) {
        $.ajax({
        type: "POST",
        headers: {"token": localStorage.getItem("token")},
        contentType:"application/json",
        data: JSON.stringify({
          'name': data.name,
        }),
        url: cfg.domain + "/game/"+$(event.target).attr('name')+"/join",
        success: function(data) {
          $(".page").hide();
          $("#game").show();
          $('#rounds').children('p').remove();
          $('#message').remove();
          $("#rounds").after("<div id='message' class='alert alert-dismissible alert-success'>Congratulation you have joined the game !</div>");
            $.ajax({
              type: "GET",
              headers: {"token": localStorage.getItem("token")},
              url: cfg.domain + "/game/"+idGame+"/players",
              success: function(data) {
                $('#rounds').children('tbody').children('tr').children('td').remove();
                for(var i=0;i<data.length;i++){
                  $("#header_players").after("<tr><td>"+data[i].id+"</td><td>"+data[i].user_id+"</td><td>"+data[i].name+"</td><td>"+data[i].joined_at+"</td></tr>");
                }
              },
              error: function(data){
                $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
              },
              dataType: "json",
            });
        },
        error: function(data){
          $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
        },
        dataType: "json",
        });
      },
      error: function(data){
        $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
      },
      dataType: "json",
    });
  });
  $(document).on("games", function gamelist(event, data){
    $.ajax({
        type: "GET",
        headers: {"token": localStorage.getItem("token")},
        url: cfg.domain + "/game",
        success: function(data) {
          $("#gamelist").show();
          $('#table_header').children('tbody').children('tr').children('td').remove();
          for(var i=0;i<data.length;i++){
            $("#header_games").after("<tr><td>"+data[i].id+"</td><td name='gameName'>"+data[i].name+"</td><td>"+data[i].players+"</td><td>"+data[i].joined+"</td><td>"+data[i].created_at+"</td><td>"+data[i].started_at+"</td><td>"+data[i].finished_at+"</td><td><input type='submit' class='btn btn-default' name='"+data[i].id+"' value='Show' size='20' maxlength='60' /></td><td><button class='btn btn-default' type='button' name='"+data[i].id+"'>Join</button></td></tr>");
          }
        },
        error: function(data){
          $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
        },
        dataType: "json",
    });
  });
  $("#nav .button-navbar").on("click", function(event){
    var target = $(event.target).attr('data-target');
    $(".page").hide();
    $("#"+target).show();
    return false;
  });

  function authenticate(){
    $.ajax({
      type: "POST",
      headers: {"token": localStorage.getItem("token")},
      url: cfg.domain + "/authenticate",
      success: function(data){
        if(data.authenticated === true){
          return;
        }
        login();
      },
      dataType:"json",
    })
  };

  function login(){
    $.ajax({
      type: "POST",
      contentType:"application/json",
      data: JSON.stringify({
        'login': state.login,
        'password': state.password,
      }),
      url: cfg.domain + "/login",
      success: function(data) {
        $(document).trigger("loged-in", data);
        $(document).trigger("games", data);
        $("#connect_buttons").hide()
      },
      error: function(data){
        $("#results").html("<p style='background-color:red'>Sorry something went wrong, please try again !</p>");
      },
      dataType: "json",
    });
  };
  $("#submitConnection").on("click", function connect(){
    $("#connection").hide();
    state.login = $("#login").val();
    state.password = $("#password").val();
    login();
  });
  $("#submitRegister").on("click", function register(){
    $("#register").hide();
    state.login = $("#login").val();
    state.password = $("#password").val();
    login();
  });

  $(document).on("loged-in", function(event, data) {
    localStorage.setItem("token",data.token);
    if(typeof state.authenticateInterval == "undefined") {
      state.authenticateInterval = setInterval(authenticate, 5000);
    }
  });
});
