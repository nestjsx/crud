#!/bin/sh
psql -U root -d postgres -h 127.0.0.1 -c 'DROP DATABASE IF EXISTS nestjsx_crud_objection;'
psql -U root -d postgres -h 127.0.0.1 -c 'CREATE DATABASE nestjsx_crud_objection;'
psql -U root -d postgres -h 127.0.0.1 -c 'GRANT CONNECT ON DATABASE nestjsx_crud_objection TO root;'

