# poc-next-graphql-strapi

1. Subir o MySQL

```sh
sudo docker run -e MYSQL_ROOT_PASSWORD=Ro0t1! -d -p 3306:3306 --name=mysql8poc mysql:8 --default-authentication-plugin=mysql_native_password
```

- mysql8poc criado

User: root
Senha: Ro0t1!
Porta: 3306
Database: strapi

---

http://localhost:1337/api/header?populate=*,menu,menu.links

http://localhost:1337/api/page-cookie?populate=*

http://localhost:1337/api/page-rule?populate=*
