# Mercadopago
  Ejemplos de uso básicos.

## SDK Javascript API
### Mercadopago.setPublishableKey
  Configuración de mercadopago con clave pública.

### Mercadopago.getIdentificationTypes
  Obtiene los tipos de documentos de identidad para seleccionar.

### Mercadopago.getPaymentMethod
  Obtiene el método de pago, enviando el BIN (Bank Identification Number).
  Esto se puede hacer a medida que el usuario va ingresando el número de tarjeta de crédito.
  Cuando retorna ejecuta una callback en la que se debe setear el método de pago.

### Mercadopago.getInstallments
  Obtiene las distintas opciones de financiación de acuerdo al método de pago seteado, enviando el BIN y el monto $$$ a pagar, en caso de que el método de pago requiera seleccionar un issuer se debe enviar el id del issuer seleccionado. Por lo que este método se debe llamar cuando se setea el método de pago (callback de Mercadopago.getPaymentMethod).
  Cuando retorna ejecuta una callback en la que se debe setear las diferentes opciones para que el usuario las seleccione.

### Mercadopago.getIssuers
  Obtiene los bancos para seleccionar en caso de que la tarjeta del tipo de pago seteado lo requiera, enviando el id del método de pago seteado.
  Cuando retorna se ejecuta una callback en la que se debe setear los diferentes bancos para que el usuario seleccione. En caso de que corresponda seleccionar un issuer al hacerlo se debe solicitar nuevamente los Installments mediante issuer id.
