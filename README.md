## ENTIDADES

    USER:
    -ID
    -EMAIL
    -PASSWORD
    -CREATED_AT

    RECOMENDACIONES:
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

    ** POST /user -> Registro de usuario
    ** GET /user/:id  Informacion del usuario
    ** POST /login -> Login del usuario (devuelve un token jwt)
    ** POST / -> Permite crear una recomendacion ( necesita cabecera con token)
    ** GET / -> Lista de todas las recomendaciones
    ** GET /recomendation/:id -> Lista detallada de la recomendacion
    ** GET /bestrating -> Lista ordenada de las recomendaciones por votos
    ** GET /recomendation/:place -> Lista de recomendaciones por lugar
    ** GET /recomendation/:category -> Lista de recomendaciones por categoria
