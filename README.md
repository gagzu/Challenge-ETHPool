# Challenge-ETHPool

## Reto

1) Configurar un proyecto y crear un smart contract

#### Resumen

ETHPool brinda un servicio donde las personas pueden depositar ETH y recibirán recompensas semanales. Los usuarios deben poder sacar sus depósitos junto con su porción de recompensas en cualquier momento. El equipo de ETHPool deposita manualmente nuevas recompensas en el grupo cada semana mediante una función del contrato.

#### Requisitos

- Solo el equipo puede depositar recompensas.
- Las recompensas depositadas van al grupo de usuarios, no a usuarios individuales.
- Los usuarios deberían poder retirar sus depósitos junto con su parte de las recompensas teniendo en cuenta el momento en que depositaron.

**Ejemplo:**

Digamos que tenemos el usuario **A** y **B** y el equipo **T**.

**A** deposita 100 y **B** deposita 300 para un total de 400 en la piscina. Ahora **A** tiene el 25% del pool y **B** tiene el 75%. Cuando **T** deposita 200 recompensas, **A** debería poder retirar 150 y **B** 450.

> ¿Qué pasa si sucede lo siguiente? A deposita, luego T deposita, luego B deposita, luego A retira y finalmente B retira. A debe recibir su depósito + todas las recompensas. B solo debe recibir su depósito porque las recompensas se enviaron al grupo antes de que participaran.

## Meta
Diseñe y codifique un contrato para ETHPool, tome todas las suposiciones que necesita para avanzar.

Puede utilizar las herramientas de desarrollo que prefiera: Hardhat, Truffle, Brownie, Solidity, Vyper.

**Recursos útiles:**
- Documentos de solidez: [https://docs.soliditylang.org/en/v0.8.4](https://docs.soliditylang.org/en/v0.8.4)

- Recurso educativo: [https://github.com/austintgriffith/scaffold-eth](https://github.com/austintgriffith/scaffold-eth)

- Inicio del proyecto: [https://github.com/abarmat/solidity-starter](https://github.com/abarmat/solidity-starter)

2) Escribir pruebas para el contrato:
    Asegúrese de que todo su código se pruebe correctamente
<br/>
3) Implementa tu contrato:
    Implemente el contrato en cualquier testnet de Ethereum de su preferencia. Mantenga un registro de la dirección desplegada.

## Bono:

- Verificar el contrato en Etherscan

4) Interactuar con el contrato. Cree un script (o una tarea Hardhat) para consultar la cantidad total de ETH retenida en el contrato.

Puede usar cualquier biblioteca que prefiera: Ethers.js, Web3.js, Web3.py, eth-brownie
