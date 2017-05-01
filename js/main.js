init();


function init() {
    loadList();
}


function loadList() {
    var $data = $.get('js/pokemon2.json');
    var $list = $('#list-full');


    $data.done(function(list) {
        $.each(list, function(i, pokemon) {
            let
            $item  = $('<li>');
            $icon  = $('<img>').attr({class: "icon", src: getPokemonIcon(pokemon)}),
            $name  = $('<b>').attr({class: "name"}).text(pokemon.nombre),
            $tipos = $('<span>').attr({class: "icon-tipo"}),
            $orig  = $('<span>').attr({class: "orig"}),
            $num   = $('<b>').attr({class: "num"}).text(pokemon.numero);


            $.each(pokemon.tipos, function(i, v) {
                let $tipo = $('<a>').attr({class: v.tipo}).css('backgroundColor', getTipoColor(v.tipo));
                $tipos.append($tipo);
            });

            $orig.append("<span><a>" + pokemon.generacion + "</a></span>, ");
            $.each(pokemon.regiones, function(i, v) {
                $orig.append("<span><a>" + v.region + "</a></span>, ");
            })

            $item
                .append($icon)
                .append($name)
                .append($tipos)
                .append($orig)
                .append($num)
                .appendTo($list);

        })
    })
}

function getPokemonIcon(pokemon) {
    if (typeof pokemon == 'object') {
        pokemon = pokemon.nombre;
    }

    return "img/icon/" + pokemon + "_icon.png";
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