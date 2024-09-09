#!/bin/sh

python manage.py makemigrations
python manage.py migrate --run-syncdb --no-input
python manage.py collectstatic --no-input

gunicorn --config gunicorn_config.py.ini backend.wsgi:application