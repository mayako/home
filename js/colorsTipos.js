function color(tipo){
  var tipos=[
    "acero",
    "agua",
    "bicho",
    "dragon",
    "electrico",
    "fantasma",
    "fuego",
    "hada",
    "hielo",
    "lucha",
    "normal",
    "planta",
    "psiquico",
    "roca",
    "siniestro",
    "tierra",
    "veneno",
    "volador"
  ];
  var colores=[
    "#A8A8C0",
    "#3898F8",
    "#A8B820",
    "#7860E0",
    "#F8C030",
    "#6060B0",
    "#F05030",
    "#E69CE6",
    "#58C8E0",
    "#A05038",
    "#A8A090",
    "#78C850",
    "#F870A0",
    "#B8A058",
    "#705848",
    "#D0B058",
    "#B058A0",
    "#98A8F0",
  ];
  var contador;

  for(contador=0;contador<(tipos.length);contador++){
    if(tipo == tipos[contador]){
      return colores[contador];
      break;
    }
  }
}