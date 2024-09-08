export default function fetching(url){
    fetch(url)
    .then(data)
    .error(console.error("Hubo un error con la carga de datos"))

    if(!error){
        return data
    }
    return none
}