var fberry = new Fiscalberry();
var ws;

var popUp = new bootstrap.Toast(document.getElementById("liveToast"));

var selectedPrinter;
var selectedCommand;

const printers = document.getElementById("impresoras-list");
const commands = document.getElementById("comandos-list");
const comandosTextArea = document.getElementById("comandos-text-area");

const connectBtn = document.getElementById("conectar");
const send = document.getElementById("enviar-comando")

const hostInput = document.getElementById("host");
const portInput = document.getElementById("port");

hostInput.placeholder = window.location.hostname;
portInput.placeholder = window.location.port;
var host = hostInput.placeholder;
var port = 12000//portInput.placeholder;

hostInput.addEventListener("change", () => (host = hostInput.value));
portInput.addEventListener("change", () => (port = portInput.value));
printers.addEventListener('change', () => {
    selectedPrinter = printers.value
    drawCommand();
});
commands.addEventListener('change', () => {
    selectedCommand = commands.value;
    drawCommand();
});
connectBtn.addEventListener("click", () => {
    console.log(fberry.isConnected());
    if (fberry.isConnected()) {
        ws.close();
    } else {
        startWs();
    }
});

send.addEventListener('click', () => {
    fberry.send(comandosTextArea.value)
})

const log = (txt) => {
    //var $span = $("<span class='msg'>").text("[MSG] " + txt);
    // $("tetxarea#exampleFormControlTextarea1").text(txt)//.prepend("</br>").prepend($span);
    // textArea.value = txt;
    console.log(txt);
};

// log function
const logRta = (txt) => {
    // textArea.value = txt;
    console.log(txt);
};

// log function
const logErr = (txt) => {
    //var $span = $("<span class='error'>").text("[ERR] " + txt);
    // $("tetxarea#exampleFormControlTextarea1").text(txt);
    // textArea.value = txt;
    console.error(txt);
};

fberry.promise.done(function () {
    console.info("Conectado al Web Socket {promise DONE}");
});

fberry.promise.fail(function () {
    console.info("No hay conexión con el Web Socket {promise ERROR}");
});

fberry.on("open", (evt) => {
    connectBtn.className = "btn btn-outline-danger";
    connectBtn.textContent = "Desconectar";
    printers.removeAttribute('disabled', true)
    commands.removeAttribute('disabled', true)
    loadCommands()
    fberry.send('{ "getAvaliablePrinters":"" }');
});

fberry.on("close", (evt) => {
    connectBtn.className = "btn btn-outline-success";
    connectBtn.textContent = "Conectar";
    console.info("CLOSE");
    printers.setAttribute('disabled', true)
    commands.setAttribute('disabled', true)
    printers.replaceChildren();
    commands.replaceChildren();
});

fberry.on("fb:rta", function (ob, evt) {
    console.info("vino la respuesta %o", evt.data);

    if (evt.data.hasOwnProperty("action")) {
        logRta(evt.data["action"] + " : " + evt.data["rta"]);
    }

    if (Array.isArray(evt.data)) {
        for (var i = evt.data.length - 1; i >= 0; i--) {
            if (evt.data[i].hasOwnProperty("action")) {
                logRta(evt.data[i]["action"] + " : " + evt.data[i]["rta"]);
            }

            if (typeof evt.data[i] === "string") {
                logRta(evt.data[i]);
            }
        }
    }
    $('#mensaje-toast').html("Desconectado");
    $('#icon-toast').html("wifi_tethering_off");
    $('#cuerpo-toast').html("http://" + host + ":" + port);
    
    
    popUp.show();
});

fberry.on("fb:rta:getAvaliablePrinters", function (ob, evt) {
    console.log("Impresoras Disponibles: %o", evt.data);
    // textArea.value = evt.data;

    for (index in evt.data) {
        printer = evt.data[index];
        option = new Option(printer, printer, false, false)
        printers.appendChild(option);
    }
});

function startWs() {
    ws = fberry.connect(host, port);

    console.log(`Iniciando conexión con ${host}:${port}...`);
}

function loadCommands(){
    for (comando in comandos){
        options = new Option(comando,comando,false,false)// "<option value='" + comando + "'>" + comando + "</option>";
        commands.appendChild(options);
    }
    selectedCommand = commands.options[1].value
    console.log(selectedCommand)
};


function drawCommand(){
    if (selectedCommand===undefined) return
    let comandoString = JSON.stringify(comandos[selectedCommand]??null);
    let comandoJSON = JSON.parse(`{"${selectedCommand}": ${comandoString}}`)
    if (selectedPrinter !== undefined) {
        comandoJSON['printerName'] = selectedPrinter;
    }
    console.log(comandoJSON)
    comandosTextArea.value = JSON.stringify(comandoJSON,null, 4)
}


const comandos = JSON.parse(`{
    "printRemito": {
        "encabezado": {
            "tipo_cbte": "T",
            "imprimir_fecha_remito": 1,
            "tipo_responsable": "CONSUMIDOR_FINAL",
            "tipo_doc": "SIN_CALIFICADOR",
            "domicilio_cliente": "Avenida Siempreviva 742",
            "nombre_cliente": "Cliente Ejemplo"
        },
        "items": [
            {
                "importe": 950,
                "ds": "ARROZ C/ CALAMARES",
                "qty": 1
            },
            {
                "importe": 100,
                "ds": "Cubiertos",
                "qty": "2"
            }
        ],
        "pagos": [
            {
                "ds": "Efectivo",
                "importe": 460
            },
            {
                "ds": "Tarjeta Visa Debito",
                "importe": 460
            }
        ],
        "addAdditional": {
            "description": "20%",
            "amount": 230,
            "iva": "21.00",
            "negative": true
        },
        "setTrailer": [
            " ",
            "Mozo: Mozo Omar",
            "Mesa: Mesa 35",
            " "
        ]
    },
    
    
    
    
    "printComanda": {
        "comanda": {
            "id": "191",
            "created": "2021-10-22 01:57:24",
            "platos": [
                {
                    "nombre": "Porcion Bife de Chorizo",
                    "cant": 1
                },
                {
                    "nombre": "Espresso",
                    "cant": 1
                }
            ]
        },
        "setTrailer": [
            "",
            "Mozo: Mozo Roberto",
            "Mesa: 151",
            ""
        ]
    },
    
    
    
    
    "printFacturaElectronica": {
        "encabezado": {
            "nombre_comercio": "Nombre de Fantasía",
            "razon_social": "Empresa SRL",
            "cuit_empresa": "30998887771",
            "ingresos_brutos": false,
            "domicilio_comercial": "Avenida Siempreviva 742",
            "tipo_responsable": "IVA Responsable Inscripto",
            "inicio_actividades": "01/12/2020",
            "tipo_comprobante": "Factura B",
            "tipo_comprobante_codigo": "006",
            "numero_comprobante": "0005-00056017",
            "fecha_comprobante": "08/10/2021",
            "domicilio_cliente": "",
            "cae": "1234567890",
            "cae_vto": "18/10/2021",
            "fecha_facturacion": "08/10/2021",
            "importe_total": "121",
            "importe_neto": "100",
            "importe_iva": "21",
            "moneda": "PES",
            "ctz": 1,
            "tipoDocRec": 99,
            "tipoCodAut": "E"
        },
        "items": [
            {
                "ds": "ARROZ C/ CALAMARES",
                "qty": "1",
                "importe": 950,
                "alic_iva": "21.00"
            },
            {
                "ds": "Cubiertos",
                "qty": "2",
                "importe": "100",
                "alic_iva": "21.00"
            }
        ],
        "addAdditional": {
            "description": "20%",
            "descuento_porcentaje": "20.0000",
            "amount": 230,
            "iva": "21.00",
            "negative": true
        },
        "setTrailer": [
            " ",
            "Mozo: Mozo Omar",
            "Mesa: Mesa",
            " "
        ]
    },
    
    
    
    
    "printArqueo": {
        "encabezado": {
            "nombreComercio": "Nombre Comercio",
            "nombreCaja": "Caja Ventas",
            "aliasUsuario": "Cajero 4",
            "ArqueoDateTime": "2022-03-01 06:26:20",
            "fechaDesde": "28-02-2022 16:26",
            "fechaHasta": "01-03-2022 06:26",
            "importeInicial": "3245.00",
            "importeFinal": "2677.00",
            "diferencia": "-10.00",
            "observacion": ""
        },
        "ingresosPorVentas": {
            "detalle": [
                {
                    "tipoPago": "Efectivo",
                    "importe": 120140.21,
                    "cant": 76
                },
                {
                    "tipoPago": "MP",
                    "importe": 853.84,
                    "cant": 3
                },
                {
                    "tipoPago": "QR",
                    "importe": 279.92,
                    "cant": 2
                },
                {
                    "tipoPago": "Tarjeta Amex",
                    "importe": 2904.82,
                    "cant": 7
                },
                {
                    "tipoPago": "Tarjeta Maestro",
                    "importe": 4063.11,
                    "cant": 10
                },
                {
                    "tipoPago": "Tarjeta Master Card",
                    "importe": 13957.5,
                    "cant": 17
                },
                {
                    "tipoPago": "Tarjeta Visa",
                    "importe": 15240.4,
                    "cant": 9
                },
                {
                    "tipoPago": "Tarjeta Visa Debito",
                    "importe": 8879.75,
                    "cant": 10
                }
            ],
            "otros": "18776.00"
        },
        "egresosPorPagos": {
            "detalle": [],
            "otros": "234.00"
        },
        "retiros": [
            {
                "fechaTraspaso": "2022-03-01 06:26:15",
                "observacion": "",
                "monto": 66600
            },
            {
                "fechaTraspaso": "2022-03-01 06:26:10",
                "observacion": "",
                "monto": 3332
            }
        ],
        "ingresos": [
            {
                "fechaTraspaso": "2022-03-01 06:26:20",
                "observacion": "",
                "monto": 45900
            },
            {
                "fechaTraspaso": "2022-03-01 06:26:03",
                "observacion": "",
                "monto": 23454
            }
        ]
    }
}`);

startWs();
