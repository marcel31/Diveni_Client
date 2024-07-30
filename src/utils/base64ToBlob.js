export function dataURItoBlob(dataURI) {
    // Convertir base64 a datos binarios sin procesar almacenados en una cadena
    var byteString = atob(dataURI.split(',')[1]);

    // Separar el componente mime
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // Comprobar la extensión de archivo basada en el tipo mime
    var extension = '';
    if (mimeString === 'image/jpeg') {
        extension = 'jpg';
    } else if (mimeString === 'image/png') {
        extension = 'png';
    } else if (mimeString === 'image/gif') {
        extension = 'gif';
    }
    // Puedes agregar más extensiones y tipos MIME según sea necesario

    // Escribir los bytes de la cadena en un ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // Escribir el ArrayBuffer en un blob, y listo
    var bb = new Blob([ab], { type: mimeString });

    // Asignar la extensión de archivo al Blob
    bb.extension = extension;

    console.log(bb);
    return bb;
}
