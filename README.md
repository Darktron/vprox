# VerusProxy
**Experimental** stratum proxy for VerusCoin based mining pools. This is currently work in progress.  
  
Proxy requires miner to support extra nonce subscription (xnsub) or will result in mostly low difficulty rejects.  
If the pool connection is lost, a new extra nonce will be assigned by the pool and sent to miners (xnsub)  
  
## Setup
    sudo apt install nodejs npm git -y
    git clone https://github.com/Darktron/vprox.git
    cd vprox
    npm install

## Modify config.js

### Proxy Setup

    "stratumPort": 7777,
    
**NOTE**: stratum port can not be the same as pool port  
    
#### Proxy TLS/SSL Encryption
If needed, generate self sign certificate to use with proxy stratum port

    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj '/CN=localhost'  

#### Enable TLS/SSL config

    "stratumSSL": {
        "enabled": false,
        "key" : "key.pem",
        "cert" : "cert.pem"
    },

### Pool Connection

    "pool" : {
      "host" : "na.luckpool.net",
      "port" : 3958,
      "ssl"  :  false
    }

#### Miner Authorization
By default, authorization from miner will be used to create pool connections for each unique miner address.  
  
Optionally, you may force all miners to use the specified proxy wallet.

    "wallet": "WALLET_ADDRESS",
    "password": "x"

## Run
    node proxy.js
