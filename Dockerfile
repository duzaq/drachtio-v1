# Use a imagem oficial do drachtio-server como base
FROM drachtio/drachtio-server:latest

# Crie um usuário não-root para executar o drachtio-server
RUN addgroup --gid 1000 drachtio && \
    adduser --uid 1000 --gid 1000 --disabled-password --gecos "" drachtio

# Copie o arquivo de configuração para o container
COPY config/drachtio.conf.xml /etc/drachtio.conf.xml

# Defina as permissões corretas para o arquivo de configuração
RUN chown drachtio:drachtio /etc/drachtio.conf.xml && \
    chmod 644 /etc/drachtio.conf.xml

# Mude para o usuário não-root
USER drachtio

# Comando para executar o drachtio-server
CMD ["/etc/drachtio.conf.xml"]
