let isDarkMode=false;
let textoGuardado='';

Promise.all([
    insertarimagenSVG('Assets/imagen-default.svg','contenedorImagen'),
    insertarimagenSVG('Assets/logo-alura.svg','contenedorLogo'),
])
//Al parecer había un problema de asincronía, usando promises se soluciona 

function insertarimagenSVG(svgurl, targetId){
    //Esta funcion ayuda a hacer los 2 archivos SVG mas faciles de editar
        fetch(svgurl)
        .then(response=>{
            if(!response.ok){
                throw new Error('Hubo un problema con el response '+response.statusText);
            }
            return response.text();
        })
        .then(svgText=>{
            const parser=new DOMParser();
            const svgDoc= parser.parseFromString(svgText, 'image/svg+xml');
            const svgElemento=svgDoc.querySelector('svg');

            if(targetId==='contenedorLogo'){
                
                svgElemento.classList.add('logoAlura');
                svgElemento.id='logoAlura';
            }else if(targetId==='contenedorImagen'){
                
                svgElemento.classList.add('imagen');
                svgElemento.id='imagen';
            }

            document.getElementById(targetId).innerHTML = svgElemento.outerHTML;
            return Promise.resolve();
            
        })
        .catch(error=>{
            console.error('Hubo un problema con el fetch: ', error);
            return Promise.reject(error);
        });
}

function cambiarColorSvg(colorActual,colorNuevo){
    //permite cambiar el color de los dos archivos SVG
    const elementos=document.querySelectorAll(`path[fill="${colorActual}"], rect[fill="${colorActual}"], circle[fill="${colorActual}"], ellipse[fill="${colorActual}"], polygon[fill="${colorActual}"], polyline[fill="${colorActual}"], line[fill="${colorActual}"]`);
    const elementosStroke=document.querySelectorAll(`path[stroke="${colorActual}"], rect[stroke="${colorActual}"], circle[stroke="${colorActual}"], ellipse[stroke="${colorActual}"], polygon[stroke="${colorActual}"], polyline[stroke="${colorActual}"], line[stroke="${colorActual}"]`);
    elementos.forEach(elemento=>{
        elemento.setAttribute('fill',colorNuevo);
    });
    elementosStroke.forEach(elementoS=>{
        elementoS.setAttribute('stroke',colorNuevo);
    });
}

function activarDarkMode(){
    //cuando se encripta un texto pasa a dark-mode
    if (!isDarkMode){
        cambiarColorSvg('#0A3871','#d8dfe8');
        cambiarColorSvg('white','#343a40');
        cambiarColorSvg('black','white');
        document.body.classList.add('dark-mode');
        isDarkMode=true;
}
}

function desactivarDarkMode(){
    //cuando se desencripta un texto pasa a los colores usuales
    if(isDarkMode){
        cambiarColorSvg('#d8dfe8','#0A3871');
        cambiarColorSvg('white','black');
        cambiarColorSvg('#343a40','white');
        document.body.classList.remove('dark-mode');
        isDarkMode=false;
}
}

function encriptarTexto(texto){
    let textoEncriptado=texto;
    if (textoEncriptado==''){
        resetZonaEncriptado();
    }else{
        activarDarkMode();
        escondeZonaEncriptado();
        textoEncriptado = textoEncriptado.replace(/e/g,'enter');
        textoEncriptado = textoEncriptado.replace(/i/g,'imes');
        textoEncriptado = textoEncriptado.replace(/a/g,'ai');
        textoEncriptado = textoEncriptado.replace(/o/g,'ober');
        textoEncriptado = textoEncriptado.replace(/u/g,'ufat');
        return textoEncriptado}
}

function desencriptarTexto(texto){
    let textoDesencriptado=texto;
    if (textoDesencriptado==''){
        resetZonaEncriptado();
    }else{
        desactivarDarkMode();
        escondeZonaEncriptado();
        textoDesencriptado = textoDesencriptado.replace(/enter/g,'e');
        textoDesencriptado = textoDesencriptado.replace(/imes/g,'i');
        textoDesencriptado = textoDesencriptado.replace(/ai/g,'a');
        textoDesencriptado = textoDesencriptado.replace(/ober/g,'o');
        textoDesencriptado = textoDesencriptado.replace(/ufat/g,'u');
        return textoDesencriptado}
}

function resetZonaEncriptado(){
    document.getElementById('imagen').classList.remove('hidden');
    document.getElementById('textoH2').classList.remove('hidden');
    document.getElementById('textoEntrada').value='';
    document.getElementById('textoEntrada').placeholder='Ingrese el texto aqui';
    document.getElementById('botonCopiarTexto').classList.add('hidden');
}

function escondeZonaEncriptado(){
    document.getElementById('imagen').classList.add('hidden');
    document.getElementById('textoH2').classList.add('hidden');
    document.getElementById('textoEntrada').value='';
    document.getElementById('textoEntrada').placeholder='Ingrese el texto aqui';
    document.getElementById('botonCopiarTexto').classList.remove('hidden');
}

document.getElementById('textoEntrada').addEventListener('input',function(){
    //en vez de mostrar una advertencia esto hace que simplemente al introducir un input si el texto tiene caracteres especiales sean eliminados
    let texto=this.value;

    texto=texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    this.value=texto
})

document.getElementById('botonEncriptado').addEventListener('click',()=>{
    const textoEntrada=document.getElementById('textoEntrada').value;
    const textoEncriptado=encriptarTexto(textoEntrada);
    document.getElementById('textoSalida').textContent=textoEncriptado;
});

document.getElementById('botonDesencriptado').addEventListener('click',()=>{
    const textoEntrada=document.getElementById('textoEntrada').value;
    const textoDesencriptado=desencriptarTexto(textoEntrada);
    document.getElementById('textoSalida').textContent=textoDesencriptado;
});

document.getElementById('botonCopiarTexto').addEventListener('click',()=>{
    const textoCopiado=document.getElementById('textoSalida').textContent;
    navigator.clipboard.writeText(textoCopiado)
    .then(()=>{
        alert('El texto se ha copiado al portapapeles')
    });
});