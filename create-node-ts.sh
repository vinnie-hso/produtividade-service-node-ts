npm init -y

npm i -D typescript ts-node-dev

mkdir src

mkdir ./src/__mocks__

mkdir ./src/controllers

mkdir ./src/routes

mkdir ./src/services

mkdir ./src/ts

touch ./src/index.ts

touch ./src/__mocks__/index.ts

touch ./src/controllers/index.ts

touch ./src/routes/index.ts

touch ./src/services/index.ts

touch ./src/ts/index.ts

npx tsc --init

cat > welcome.js <<'endmsg'

console.log(`

    Olá Vinnie, vc ainda precisa realizar algumas configurações:

    [1] - Adicione em package.json:

    "start": "node ./build/index",
    "build": "rimraf ./build && tsc",
    "dev": "ts-node-dev ./src/index.ts",
    "test": "jest",

    ----------------------------------------------------------------------

    [2] - Adicione em tsconfig.ts:

    "include": [
        "src"
      ]

    ----------------------------------------------------------------------

    [3] - Descomente as linhas e adicione em tsconfig.ts:

    "outDir": "./build",
    ...
    "experimentalDecorators": true,
    ...
    "strictPropertyInitialization": false,
    ...
    "emitDecoratorMetadata": true,   

    ----------------------------------------------------------------------
`)
endmsg

node ./welcome.js

# extra

# npm i express
# npm i --save-dev @types/express
# npm i cors
# npm i --save-dev @types/cors
# npm i dotenv
# npm i typeorm
# npm i pg --save
# npm i reflect-metadata
# npm i --save-dev jest ts-jest @types/jest
# npx jest --init


# configurar BANCO DE DADOS
# criar SERVICE
# criar COTROLLER
# criar ROTA%   
