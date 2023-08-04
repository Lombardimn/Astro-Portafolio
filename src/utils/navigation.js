const checkIsNavegationSupported = () => {
    return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
    //vamos a cargar la pagina de destino utilizando un fetch para obtener el HTML
    const response = await fetch(url);
    const text = await response.text();

    //quedarnos solo con el contenido del HTML dentro de la etiqueta body. Usamos un regex
    const [, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i) ?? [];
    return data
}

export const startViewTransition = () => {
    if (!checkIsNavegationSupported()) return

    window.navigation.addEventListener('navigate', (event) =>{
        const toUrl = new URL(event.destination.url);

        //es una pagina externa? si es asi, ignoramos.
        if (location.origin != toUrl.origin) return;

        //es una navegacion en el mismo dominio (origen)
        event.intercept({
            async handler() {
                const data = await fetchPage(toUrl.pathname);
                
                //utilizamos View Transition API
                document.startViewTransition(() =>{
                    
                    //indicamos como tiene que actualizar la vista
                    document.body.innerHTML = data
                })
            }
        })
    })
}