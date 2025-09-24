# Etapa de build (compilação Angular)
FROM node:16.20.2 AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json primeiro (para cache de dependências)
COPY package*.json ./

# Garantir que estamos no npm 8 (compatível com Node 16)
RUN npm install -g npm@8

# Instalar dependências (usando lockfile)
# Se ainda der erro de resolução, adicione --legacy-peer-deps no final
RUN npm ci --force

# Copiar código do projeto
COPY . .

# Build do Angular (pode ajustar --configuration=production se precisar)
RUN npm run build 

# Etapa final (servidor nginx para servir os arquivos estáticos)
FROM nginx:alpine

# Remover config default do nginx e copiar a sua se necessário
RUN rm -rf /usr/share/nginx/html/*

# Copiar os artefatos do build Angular para a pasta do nginx
COPY --from=build /app/dist/ /usr/share/nginx/html

# Expor porta padrão
EXPOSE 80

# Comando padrão do nginx
CMD ["nginx", "-g", "daemon off;"]
