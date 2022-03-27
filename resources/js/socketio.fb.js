function ConectarSio(host, port, username, password){

    const sio = io(`http://${host}:${port}`, {extraHeaders:{"X_UUID": username, "X_PWD": password}});

    sio.on("connect", () =>{
        connected = true;
        $("#conectar").html("Desconectar").prop('class', 'btn btn-outline-danger')
        console.log("<< Connectado a: " + `http://${host}:${port}`);
        $('#mensaje-toast').html("Conectado");
        $('#icon-toast').html("wifi_tethering");        
        $('#cuerpo-toast').html("http://" + host + ":" + port);
        popUp.show();
    });
    
    sio.on("disconnect", () =>{
        connected = false;
        $("#conectar").html("Conectar").prop('class', 'btn btn-outline-success')
        console.warn("Disconnected")
        // sio.disconnect();
        $('#mensaje-toast').html("Desconectado");
        $('#icon-toast').html("wifi_tethering_off");
        $('#cuerpo-toast').html("http://" + host + ":" + port);
        
        
        popUp.show();
    });
    
    sio.on("connect_error", (msg) =>{
        console.error("Connection Error: ", msg);
    });
    
    sio.on('command', command => {
        
        console.log(JSON.parse(command));
    });

    sio.on('clients', clients => {
        console.log(clients);
        //clients = JSON.parse(clients)
        console.table(clients)
        clients.forEach(element => {
            console.log(element)
            
        });
    });

    sio.on('request', data =>{
        console.log("vino algo");
        console.table(data);
    });

    sio.on('update', clients => {
      console.table(clients);
      $('#mensaje-toast').html("Nuevo Cliente Conectado");
      $('#cuerpo-toast').html(clients);
      $('#icon-toast').html("wifi_tethering");
      popUp.show();

    });

    return sio
}