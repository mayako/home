$(document).ready(function(){
  loadList();

  var numTotalPkmn = $("#list-full li").size();
  var listPkmnShow = 0;
  $("#count").text("1 - " + $("#list-full li").size() + " de " + numTotalPkmn);

  //SELECCIONAR POKEMON
  $('#list-full li').click(function(event){
    var nombre = $(this).find('.name').text();
    selecPkmn(nombre);

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


});//END READY

function loadList(){
    //Llenado de elementos <li>
    var listLength = list.length;
    var htmlListItem = "";
    while(listLength--){
      htmlListItem += '<li></li>';
    }//END WHILE
    $('#list-full').html(htmlListItem);

    $.each(list, function(index, val) {
      var itemList = $('#list-full li:nth-child(' + (index + 1) + ')');
      // LLENAR LISTA (icon, nombre, tipos, numero)
      itemList.html(
          '<img class="icon" />' +
          '<b class="name">' + list[index].nombre + '</b>' +
          '<span class="icon-tipo"></span>' +
          '<span class="orig"></span>' +
          '<b class="num">' + list[index].numero + '</b>'
      );//END APPEND

      // AGREGAR TIPO(S)
      if(list[index].tipos.length > 1){
        itemList.find('.icon-tipo').append("<a class='" + list[index].tipos[0].tipo + "'></a>");
        itemList.find('.icon-tipo').append("<a class='" + list[index].tipos[1].tipo + "'></a>");
      }else{
        itemList.find('.icon-tipo').append("<a class='" + list[index].tipos[0].tipo + "'></a>");
      }
      // COLOREAR TIPO(S)
      itemList.find('.icon-tipo').find("a").each(function(){
        var tipo      = $(this).attr("class");
        var colorTipo = color(tipo);
        $(this).css('backgroundColor',colorTipo);
      });

      // AGREGAR ICON
      var urlIcon = "img/icon/" + list[index].nombre + "_icon.png";
      itemList.find(".icon").attr("src",urlIcon);

      // AGREGAR CLASIFICACIONES
      $.each(list[index].regiones, function(index_sub, val) {
        itemList.find('.orig').append("<span><a>" + list[index].regiones[index_sub].region + "</a></span>, ");
      });
    });//END EACH
}

function selecPkmn(nombre){
  $.each(list, function(index, val) {

    if(nombre == list[index].nombre){
      var colorNew = list[index].tipos[0].tipo;
      $('#name').css('backgroundColor',colorNew);
      $('#footer').css('backgroundColor',colorNew);

      $('#name').html('<a href="' + urlWkdx(list[index].nombre) + '">' + list[index].nombre + '</a>');
      $('#img').html('<img src="pokemon/200px-' + list[index].nombre + '.png" />');
      $('#hability').html('<a href="' + urlWkdx(list[index].habilidad) + '">' + list[index].habilidad + '</a>');

      var mov_list = $('#content-mov').find('ul');
      mov_list.html(''); // Limpia la lista
      $.each(list[index].movimientos, function(index_sub, val) {
        
        mov_list.append(
          '<li>' +
          '<a href="' + urlWkdx(list[index].movimientos[index_sub].tipo) + '" class="' + list[index].movimientos[index_sub].tipo +'"></a>' +
          '<a href="' + urlWkdx(list[index].movimientos[index_sub].nombre) + '">' + list[index].movimientos[index_sub].nombre + '</a>' +
          '</li>');
      })
    }
    return false;
  });

  //COLOCAR TIPOS
  $('aside a[class]').each(function(){
    var tipo      = $(this).attr('class');
    var colorTipo = color(tipo);
    $(this).css('backgroundColor',colorTipo);
  });

  $('#main').animate('width','69%');
  $('aside').animate('width','350px');
}

Object.prototype.length = function() {
  return Object.keys(this).length;
}; 

function urlWkdx(cadena){
  var url = 'http://es.pokemon.wikia.com/wiki/' + cadena + '?useskin=monobook';
  return url;
}