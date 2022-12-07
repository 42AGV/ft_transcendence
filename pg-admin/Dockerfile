FROM dpage/pgadmin4
USER pgadmin
RUN mkdir -p /var/lib/pgadmin/storage/admin_admin.com
COPY ./pgpass /var/lib/pgadmin/storage/admin_admin.com/
USER root
RUN chown pgadmin /var/lib/pgadmin/storage/admin_admin.com/pgpass
RUN chmod 0600 /var/lib/pgadmin/storage/admin_admin.com/pgpass
USER pgadmin
ENTRYPOINT ["/entrypoint.sh"]
