# Usa a imagem oficial do Node.js como base
FROM node:14

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Inicia a aplicação
CMD [ "node", "app.js" ]
