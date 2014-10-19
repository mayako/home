function countProperties(obj) {
  var prop;
  var propCount = 0;

  for (prop in obj) {
    propCount++;
  }
  return propCount;
}

function urlWkdx(nombre){
  var url = "http://es.pokemon.wikia.com/wiki/" + nombre + "?useskin=monobook";
  return url;
}

$(document).ready(function(){
  var c;
  var i;
  var j;
  $("#list-full").each(function(){
    // LLENAR LISTA (icon, nombre, tipos, numero)
    for( c = 0; c < countProperties(pkmn); c++){
      if(countProperties(pkmn[c].tipos) > 1){
        $(this).html(function(i,origText){
           $(this).html(
              origText +
              "<li>" +
              "<img class='icon' />" +
              "<b class='name'>" + pkmn[c].nombre + "</b>" +
              "<span class='icon-tipo'>" + 
                "<a class='" + pkmn[c].tipos[0].tipo + "'></a>" + 
                "<a class='" + pkmn[c].tipos[1].tipo + "'></a>" + 
              "</span>" +
              "<span class='orig'></span>" +
              "<b class='num'>" + pkmn[c].numero + "</b>" +
              "</li>");
        });
      }else{
        $(this).html(function(i,origText){
           $(this).html(
              origText +
              "<li>" +
              "<img class='icon' />" +
              "<b class='name'>" + pkmn[c].nombre + "</b>" +
              "<span class='icon-tipo'>" + 
              "<a class='" + pkmn[c].tipos[0].tipo + "'></a>" + 
              "</span>" +
              "<span class='orig'></span>" +
              "<b class='num'>" + pkmn[c].numero + "</b>" +
              "</li>");
        });
      }
    }

    // AGREGAR CLASIFICACIONES
    $("#list-full li").each(function(){
      var name    = $(this).children(".name").text();
      var urlIcon = "img/icon/" + name + "_icon.png";
      $(this).children(".icon").attr("src",urlIcon);

      for( c = 0; c < countProperties(pkmn); c++){
        if(name == pkmn[c].nombre){
            $(this).children(".orig").html(function(e, origText){
              $(this).html(origText + "<span><a>" + pkmn[c].generacion + "</a></span>, ");
            });
          for( i = 0; i < countProperties(pkmn[c].regiones); i++){
            $(this).children(".orig").html(function(e, origText){
              $(this).html(origText + "<span><a>" + pkmn[c].regiones[i].region + "</a></span>, ");
            });
          }
        } 
      }
    });

    //COLOCAR TIPOS
    $("a[class]").each(function(){
      var tipo      = $(this).attr("class");
      var colorTipo = color(tipo);
      $(this).css('backgroundColor',colorTipo);
    });
  });

  //BARRA SOMBREADA EN #list-full
  $("#list").scroll(function(){
    var scroll = $(this).scrollTop();
    if( scroll > 0){
      $(this).css("box-shadow","inset 0 2px 2px -1px rgba(0,0,0,.3)");
    }else{
      $(this).css("box-shadow","inset 0px 0px 0px transparent");
    }
  });

  //SELECCIONAR ITEM MENU
  $("nav ul li").click(function(){
    $("nav ul li").removeAttr("id");
    $(this).attr("id","active");
  });

  // AGREGAR CUADRITOS DE ELEMENTOS
  $("#elementos li").append("<span class='square'></span>");
  $("#elementos li").each(function(){
    var tipo     = $(this).attr("value");
    var colorNew = color(tipo);
    $(this).children(".square").css("backgroundColor", colorNew);
  });

  // SELECCIONAR ITEM #list-full
  $("#list-full li").click(function(event){
    
    var classItem = $(this).attr("class");

    if(event.ctrlKey){
      if(classItem == "selected"){
        $(this).removeAttr("class");
      }else{
        $(this).attr("class","selected");
      }
      $(".view").attr("class", "selected");
    }else{
      $("#list-full li").removeAttr("class");
      $(this).attr("class","view");
    }

    var itemsSelected = $(".selected").size();
    if(itemsSelected > 1){
      $("#compare").show();
    }else{
      $("#compare").hide();
      $(".selected").attr("class", "view");
    }
  });

  //COMPARE PKMNS
  $("#compare").click(function(event) {
    $("#list-full li").not(".selected").hide();
    $("#list-full li.selected").show();
    var itemsSelected = $(".selected").size();

    $("#count").text("1 - " + itemsSelected + " de " + numTotalPkmn);

    if(itemsSelected > 1 & itemsSelected < 4){
      var pkmnSelected = new Array();

      $(".selected").each(function(index, el) {
        pkmnSelected[index] = $(this).children('.name').text();
      }); 

      var url = "http://pikimal.com/pokemon/";

      if(itemsSelected == 2){
        url =  "http://pikimal.com/pokemon/vs/" + pkmnSelected[0] + "/" + pkmnSelected[1];
      }else if(itemsSelected == 3){
        url =  "http://pikimal.com/pokemon/vs/" + pkmnSelected[0] + "/" + pkmnSelected[1] + "/" + pkmnSelected[2];
      }


      $("#content-top h3").html("<a></a>");
      $("#content-top h3 a").text("Comparar");
      $("#content-top h3 a").attr({"href":url,"target":"_blank"});
    }else{
      $("#content-top h3").text("Comparar");
    }

  });

  // DROPDOWN MENU
  $("#dropdown-menu h1").click(function(event){
    event.stopPropagation();
    $("#dropdown-links").slideDown(400);
    $("#ddm_sector").show();
  });

  
   $("#ddm_sector").click(function(){
     $("#dropdown-links").slideUp(200);
     $("#ddm_sector").hide();
   });
  

  var numTotalPkmn = $("#list-full li").size();
  var listPkmnShow = 0;
  $("#count").text("1 - " + $("#list-full li").size() + " de " + numTotalPkmn);

  // CLICK #boton
  // MUESTRA LA LISTA COMPLETA
  $("#boton").click(function(){
    $("nav ul li").removeAttr("id"); //Remove active

    $("#list-full li").each(function(){
      $(this).show();
    });
    $("#count").text("1 - " + $("#list-full li").size() + " de " + numTotalPkmn);
    $("#content-top h3").text("Todos");
  });

  // SELECCIONAR FILTROS
  $("nav ul li").click(function(){
    var value   = $(this).attr("value");
    var id      = $(this).parent("ul").attr("id");
    var url     = urlWkdx($(this).attr("contextmenu"));

    var x = 0;
    var y = 0;
    var z = 0;
    listPkmnShow = 0;
    $("#list-full li").each(function(){
      if(id == "regiones" || id == "generaciones" ){
        //REGIONES O GENERACIONES
        var clasificacion = $(this).children(".orig").children("span").text().indexOf(value);

        if(clasificacion != -1){
          $(this).show();
          listPkmnShow++;
        }else{
           $(this).hide();
        }
      }else if( id == "elementos" ){
        //ELEMENTOS
        var clasificacion;
        // Concatena todas las clases de los elementos 'a'
        $(this).children('.icon-tipo').children('a').each(function(index, el) {
          clasificacion += $(this).attr('class');
        });

        if( clasificacion.indexOf(value) != -1 ){
          $(this).show();
          listPkmnShow++;
          
        }else{
          $(this).hide();

        }

      }//END IF
    });//END EACH

    $("#count").text("1 - " + listPkmnShow + " de " + numTotalPkmn);
    $("#content-top h3").html("<a></a>");
    $("#content-top h3 a").text($(this).data("title"));
    $("#content-top h3 a").attr({"href":url,"target":"_blank"});
  });

  function selectPkmn(nombre){
    $("aside").children("#content-mov").children("ul").html(""); // Limpia la lista
    var colorNew;
    for(c = 0; c < countProperties(pkmn); c++){
      if( nombre == pkmn[c].nombre ){
        $("#name").html("<a href='" + urlWkdx(pkmn[c].nombre) + "'>" + pkmn[c].nombre + "</a>");
        $("#img").html("<img src='pokemon/200px-" + pkmn[c].nombre + ".png' />");
        $("#hability").html("<a href='" + urlWkdx(pkmn[c].habilidad) + "'>" + pkmn[c].habilidad + "</a>");

        for( i = 0; i < countProperties(pkmn[c].movimientos); i++){
          $("#content-mov ul").html(function(a, origText){
            $(this).html(origText +
            "<li>" +
            "<a href='" + urlWkdx(pkmn[c].movimientos[i].tipo) + "' class='"+ pkmn[c].movimientos[i].tipo +"'></a>" +
            "<a href='" + urlWkdx(pkmn[c].movimientos[i].nombre) + "'>" + pkmn[c].movimientos[i].nombre + "</a>" +
            "</li>"
            );

          });
        }
        colorNew = color(pkmn[c].tipos[0].tipo);
      }
    }

    $("#name").css("backgroundColor",colorNew);
    $("#footer").css("backgroundColor",colorNew);
    //COLOCAR TIPOS
    $("aside a[class]").each(function(){
      var tipo      = $(this).attr("class");
      var colorTipo = color(tipo);
      $(this).css('backgroundColor',colorTipo);
    });


    $("#main").animate({'width': "69%"});
    $("aside").animate({'width':'350px'});
  }

  //SELECCIONAR POKEMON
  $("#list-full li").click(function(){
    var nombre = $(this).children(".name").text();
    selectPkmn(nombre);
  });

  $("#pk-ball").click(function(){
    $("aside").animate({'width':'0px'});
    $("#main").animate({'width': "78%"});
  });

  $("#search-box input").keyup(function(){
    $("nav ul li").removeAttr("id"); //Remove active
    listPkmnShow = 0;
    var name     = $("#search-box input").val().toUpperCase();

      $("#list-full li").each(function(){
        if ( $(this).children(".name").text().toUpperCase().indexOf(name) == -1 ){
          $(this).hide();
        }else{
          $(this).show();
          listPkmnShow++;
        }
      });
      $("#count").text("1 - " + listPkmnShow + " de " + numTotalPkmn);
      $("#content-top h3").text("Búsqueda");
  });

/*
  var urlParam = $.url().param("name");
  if(urlParam != null){
    selectPkmn(urlParam);

    $("#list-full li").each(function(){
      var nombre = $(this).children(".name").text();
      if(nombre == urlParam){
        $(this).attr("class","view");
      }
    });

  }

  $(document).keypress(function(e) {
    if(e.which == 13) {
        alert('You pressed enter!');
    }
  });
*/

});