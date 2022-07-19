# PEDRO ACUÑA CIUDAD Y DANIEL SOSA

## Como Iniciar Backend

    Scrip para iniciar la base de datos: "npm initdb"
    Scrip para iniciar el servidor: "npm run dev"

## ENTIDADES

    USER:
    -ID
    -EMAIL
    -PASSWORD
    -CREATED_AT

    RECOMMENDATIONS:
    - ID
    - USER
    -TITULO
    -CATEGORIA
    -LUGAR
    -ENTRADILLA
    -TEXTO
    -FOTO
    -VOTOS

## ENDPOINTS

    #USER:

    ** POST /user -> Registro de usuario
    ** GET /user/:id  Informacion del usuario
    ** POST /login -> Login del usuario (devuelve un token jwt)

    #RECOMMENDATIONS


    ** POST / -> Permite crear una recomendacion ( necesita cabecera con token)
    ** GET /recommendations?category&place&votes -> Lista de todas las recomendaciones con filtro por lugar y categoria, y posibilidad de ordernar por cantidad de votos
    ** GET /recomendations/:id -> Lista detallada de la recomendación
    ** DELETE /recomendations/:id -> Borrar una recomendación (necesita cabecera con token)
    ** POST /recommendations/votes/:id -> Votar una recomendación (necesita cabecera con token)
