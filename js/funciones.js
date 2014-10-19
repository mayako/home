var numTotalPkmn = 0;
var listPkmnShow = 0;
var numPkmnSelec = 0;

/*
list.sort(function(a,b){
  return (a['nombre'] > b['nombre']) ? (a['nombre'] > b['nombre']) ? 1 : 0 : -1;
});
*/
/*
list.sort(function(a,b){
  return (a['numero'] < b['numero']) ? (a['numero'] < b['numero']) ? 1 : 0 : -1;
});
*/

$(document).ready(function(){
  init();

  //SELECCIONAR POKEMON
  $('#list-full li').click(function(event){
    var name = $(this).children('.name').text();
    selecPkmn(name);

    var classItem = $(this).attr("class");
    if(event.ctrlKey){
      //Si tiene el attr lo elimina, si no, lo coloca
      if(classItem == "selected"){
        $(this).removeAttr("class");
      }else{
        $(this).attr("class","selected");
      }
      //Si hay otro item ya seleccionado, le coloca el attr selected
      $(".view").attr("class", "selected");
    }else{
      //Elimina a todos su class 'selected' o 'view'
      $("#list-full li").removeAttr("class");
      $(this).attr("class","view");
    }//END IF ELSE

    var itemsSelected = $(".selected").size();
    if(itemsSelected > 1){
      $("#compare").show();
    }else{
      $("#compare").hide();
      $(".selected").attr("class", "view");
    }//END IF ELSE
    countRefresh();
  });// END CLICK

  //COMPARE POKEMONS
  $("#compare").click(function(event) {
    $("#list-full li").not(".selected").hide();
    $("#list-full li.selected").show();
    var itemsSelected = $(".selected").size();

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

    countRefresh();
  });

  //BOX SEARCH
  $('#search-box input').keyup(function(){
    $('nav ul li').removeAttr('id'); //Remove active
    var name = $('#search-box input').val().toUpperCase();

    $('#list-full li').each(function(){
      if ( $(this).children('.name').text().toUpperCase().indexOf(name) == -1 ){
        $(this).hide();
      }else{
        $(this).show();
      }
    });
    countRefresh();
    $('#content-top h3').text('Búsqueda');
  });

  //SELECCIONAR FILTRO
  $('nav ul li').click(function(event) {
    var value   = $(this).text().toLowerCase();
    var title = $(this).data('title');
    var url     = $(this).data('url');
    url = urlWkdx(url);

    $('#list-full li').each(function(index, el) {
      var htmlItem = $(this).html().toLowerCase();

      if(htmlItem.indexOf(value) != -1){
        $(this).show();
      }else{
        $(this).hide();
      }
    });//END EACH
    //Elimina el id de cualquier elemento actualmente seleccionado
    $("nav ul li").removeAttr("id");
    $(this).attr("id","active");

    countRefresh();
    $("#content-top h3").html("<a></a>");
    $("#content-top h3 a").text(title);
    $("#content-top h3 a").attr({"href":url,"target":"_blank"});
  });//END CLICK

  // MUESTRA LA LISTA COMPLETA
  $("#boton").click(function(){
    $("nav ul li").removeAttr("id"); //Remove active
    $("#list-full li").show();
    countRefresh();
    $("#content-top h3").text("Todos");
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

   $("#pk-ball").click(function(){
    $("aside").animate({'width':'0px'});
    $("#main").animate({'width': "78%"});
  });
});//END READY

function init(){
  loadList();
  countRefresh();

  // AGREGAR CUADRITOS DE ELEMENTOS
  $("#elementos li").append("<span class='square'></span>");
  $("#elementos li").each(function(){
    var tipo     = $(this).text().toLowerCase();
    var colorNew = color(tipo);
    $(this).children(".square").css("backgroundColor", colorNew);
  });
}

function loadList(){
  //Llenado de elementos <li>
  var listLength = list.length;
  var htmlListItem = '';
  while(listLength--){
    htmlListItem += '<li>' + listLength +'</li>';
  }//END WHILE
  $('#list-full').html(htmlListItem);

  // LLENAR LISTA (icon, nombre, tipos, numero)
  $.each(list, function(index, val) {
    var itemList = $('#list-full li:nth-child(' + (index + 1) + ')');

    itemList.html(
        '<img class="icon" />' +
        '<b class="name">' + list[index].nombre + '</b>' +
        '<span class="icon-tipo"></span>' +
        '<span class="orig"></span>' +
        '<b class="num">' + list[index].numero + '</b>'
    );//END HTML

    // AGREGAR ICON
    var urlIcon = "img/icon/" + list[index].nombre + "_icon.png";
    itemList.find(".icon").attr("src",urlIcon);

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
    });//END EACH

    // AGREGAR CLASIFICACIONES
    itemList.find('.orig').append("<span><a>" + list[index].generacion + "</a></span>, ");
    $.each(list[index].regiones, function(index_sub, val) {
      itemList.find('.orig').append("<span><a>" + list[index].regiones[index_sub].region + "</a></span>, ");
    });
  }); //END EACH
}

function countRefresh(){
  numTotalPkmn = $("#list-full li").size();
  listPkmnShow = $("#list-full li:visible").size();
  numPkmnSelec = $("#list-full li[class]").size();
  $("#count").text(numPkmnSelec + ' - ' + listPkmnShow + ' de ' + numTotalPkmn);
}

function urlWkdx(cadena){
  var url = 'http://es.pokemon.wikia.com/wiki/' + cadena + '?useskin=monobook';
  return url;
}

function selecPkmn(name){
  console.log(name);

  $.each(list, function(index, val) {

    if(name == list[index].nombre){

      var colorNew = color(list[index].tipos[0].tipo);
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
    return;
  });

  //COLOCAR TIPOS
  $('aside a[class]').each(function(){
    var tipo      = $(this).attr('class');
    var colorTipo = color(tipo);
    $(this).css('backgroundColor',colorTipo);
  });

  $('#main').animate({'width':'69%'});
  $('aside').animate({'width':'350px'});
}
