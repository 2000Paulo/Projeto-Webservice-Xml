# Usar a imagem base do Nginx
FROM nginx:alpine

# Copiar os arquivos do projeto para a pasta padrão do Nginx
COPY . /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80
