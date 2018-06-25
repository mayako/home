
$(document).ready(function() {
    init();

    // Compare Pokemon
    $("#compare").click(function() {
        $("#list-full li:not(.selected)").hide();
        $("#list-full li.selected").show();
        $("#content-top h3").text("Comparar");
        countRefresh();
    });

    // Search box
    $('#search-box input').keyup(function(e){
        var only = /^[1-9A-Za-z]+$/;

        if (   e.keyCode == 8 // delete key
            || e.keyCode == 46 // supr key
            || String.fromCharCode(e.keyCode).match(only)) {

            $('nav ul li#active').removeAttr('id'); // Remove active
            var name = $('#search-box input').val().toUpperCase();

            $('#list-full li').each(function(){
                if ($(this).find('.name').text().toUpperCase().indexOf(name) == -1){
                    $(this).hide();
                }else{
                    $(this).show();
                }
            });

            countRefresh();
            $('#content-top h3').text('Búsqueda');
        }
    });

    // Select Filter
    $('nav ul li').click(function(e) {
        let value  = $(this).text().toLowerCase(),
            title  = $(this).data('title'),
            url    = $(this).data('url'),
            $link  = linkToWikidex(url, title).attr({target: "_blank"});

        $('#list-full li').each(function(index, el) {
            if($(this).html().toLowerCase().indexOf(value) !== -1){
                $(this).show();
            }else{
                $(this).hide();
            }
        });

        //Elimina el id de cualquier elemento actualmente seleccionado
        $("nav ul li#active").removeAttr("id");
        $(this).attr("id","active");

        countRefresh();
        $("#content-top h3").empty().append($link);
    });

    // Show complete list
    $("#boton").click(function(){
        $("nav ul li#active").removeAttr("id");
        $("#list-full li").show();

        countRefresh();
        $("#content-top h3").text("Todos");
    });

    // Dropdown Menu
    $("#dropdown-menu h1").click(function(e){
        e.stopPropagation();
        $("#dropdown-links").slideDown(400);
        $("#ddm_sector").show();
    });

    $("#ddm_sector").click(function(){
        $("#dropdown-links").slideUp(200);
        $("#ddm_sector").hide();
    });

    // Close aside
    $("#pk-ball").click(function(){
        // $("aside").animate({'width':'0px'});
        // $("#main").animate({'width': "78%"});
        $("aside").hide();
    });

    NProgress.done();
})

function init() {
    loadList();

    // Agregar cuadritos de elementos
    $("#elementos li").each(function(i, item) {
        let tipo = $(this).text().toLowerCase();
        let $square = $('<span>').addClass('square').css("backgroundColor", getTipoColor(tipo));
        $(this).append($square);
    });
}

function loadList() {
    var $list = $('#list-full');

    $.get('js/pokemon.json')
        .done(function(list) {
            $.each(list, function(i, pokemon) {
                let
                $item  = $('<li>').data("pokemon", pokemon);
                $icon  = getPokemonIcon(pokemon).attr({class: "icon"}),
                $name  = $('<b>').attr({class: "name"}).text(pokemon.nombre),
                $tipos = $('<span>').attr({class: "icon-tipo"}),
                $orig  = $('<span>').attr({class: "orig"}),
                $num   = $('<b>').attr({class: "num"}).text(pokemon.numero);


                $.each(pokemon.tipos, function(i, v) {
                    let $tipo = $('<a>').attr({class: v.tipo}).css('backgroundColor', getTipoColor(v.tipo));
                    $tipos.append($tipo);
                });

                $orig.append("<span>" + pokemon.generacion + "</span>, ");
                $.each(pokemon.regiones, function(i, region) {
                    $orig.append("<span>" + region.nombre + "</span>, ");
                });

                $item.append([$icon, $name, $tipos, $orig, $num]);
                $list.append($item);
            });
        })
        .done(clickListItem)
        .fail(function(jqXHR, status) {
            $("#list").html("<h4>Oops! Error al cargar la lista.</h4><br><code>"+status+"</code>");
        })
        .always(countRefresh);
}

function getPokemonIcon(pokemon) {
    if (typeof pokemon == 'object') {
        pokemon = pokemon.nombre;
    }

    return $('<img>').attr({src: "img/icon/"+pokemon+"_icon.png"});
}

function getPokemonImage(pokemon) {
    if (typeof pokemon == 'object') {
        pokemon = pokemon.nombre;
    }

    return $('<img>').attr({src: "pokemon/200px-"+pokemon+".png"});
}

function getTipoColor(tipo){
    var tipos = {
        acero: "#A8A8C0",
        agua: "#3898F8",
        bicho: "#A8B820",
        dragon: "#7860E0",
        electrico: "#F8C030",
        fantasma: "#6060B0",
        fuego: "#F05030",
        hada: "#E69CE6",
        hielo: "#58C8E0",
        lucha: "#A05038",
        normal: "#A8A090",
        planta: "#78C850",
        psiquico: "#F870A0",
        roca: "#B8A058",
        siniestro: "#705848",
        tierra: "#D0B058",
        veneno: "#B058A0",
        volador: "#98A8F0"
    };
    return tipos[tipo];
}

function linkToWikidex(search, content = search) {
    return $('<a>', {href: 'http://es.pokemon.wikia.com/wiki/' + search + '?useskin=monobook'}).text(content);
}

function countRefresh(){
  let total    = $("#list-full li").length || 0;
  let shown    = $("#list-full li:visible").length || 0;
  let selected = $("#list-full li[class]").length || 0;

  $("#count").text(selected + ' - ' + shown + ' de ' + total);
}

function selectPokemon(pokemon) {
    let color = getTipoColor(pokemon.tipos[0].tipo);

    $('#name')
        .css('backgroundColor',color)
        .empty()
        .append(linkToWikidex(pokemon.nombre));

    $('#img')
        .empty()
        .append(getPokemonImage(pokemon.nombre));

    $('#hability')
        .empty()
        .append(linkToWikidex(pokemon.habilidad));

    let $movList = $('#content-mov').find('ul').empty();
    $.each(pokemon.movimientos, function(i, movimiento) {
        $('<li>')
            .append(
                linkToWikidex(movimiento.tipo)
                    .html('')
                    .addClass(movimiento.tipo)
                    .css('backgroundColor', getTipoColor(movimiento.tipo))
            ).append(linkToWikidex(movimiento.nombre))
            .appendTo($movList);
    });

    $('#footer').css('backgroundColor',color);
    // $('#main').animate({'width':'69%'});
    // $('aside').animate({'width':'350px'});
    $('aside').show();
}

function clickListItem() {
    $('#list-full li').click(function(e){
        NProgress.start();

        let pokemon = $(this).data('pokemon');
        selectPokemon(pokemon);

        if (e.ctrlKey) {
            //Si tiene la clase lo elimina, si no, lo coloca
            $(this).toggleClass("selected");

            //Si hay otro item ya seleccionado, le coloca la clase selected
            $(".view").addClass("selected");

            if($(".selected").length > 1){
              $("#compare").show();
            }
        } else {
            $("#compare:visible").hide();

            // Elimina a todos su class 'selected' o 'view'
            $("#list-full li[class]").removeClass();
            $(this).addClass("view");
        }

        countRefresh();

        NProgress.done();
    });
}
